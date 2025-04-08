use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use locci_url::{api, db};
use std::env;
use tower::ServiceExt;
use axum::routing::{get, post};
use axum::{body, Router};
use dotenvy::dotenv;

// Helper function to build test app
async fn build_test_app() -> Router {
    dotenv().ok();
    
    if env::var("DATABASE_URL").is_err() {
        unsafe { env::set_var("DATABASE_URL", "file:///tests.db") };
    }
    
    // Set base URL for testing
    unsafe { env::set_var("BASE_URL", "http://localhost:3000") };
    
    let db_pool = db::init_db_pool().await.expect("Failed to connect to database");
    db::init_tables(&db_pool).await.expect("Failed to initialize tables");
    
    Router::new()
        .route("/", get(api::index))
        .route("/shorten", post(api::create_short_url))
        .route("/:short_id", get(api::redirect_to_url))
        .with_state(db_pool)
}

#[tokio::test]
async fn test_index_route() {
    let app = build_test_app().await;
    
    let response = app
        .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::OK);
    
    let body = body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body.to_vec()).unwrap();
    
    // Check that the body contains some expected HTML
    assert!(body_str.contains("<title>URL Shortener</title>"));
    assert!(body_str.contains("<form"));
}

#[tokio::test]
async fn test_create_short_url() {
    let app = build_test_app().await;
    
    // Create a form submission
    let body = "url=https%3A%2F%2Fexample.com";
    
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/shorten")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .body(Body::from(body))
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::OK);
    
    // Check response contains expected JSON elements
    let body = body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body.to_vec()).unwrap();
    
    assert!(body_str.contains("short_url"));
    assert!(body_str.contains("original_url"));
    assert!(body_str.contains("https://example.com"));
}

#[tokio::test]
async fn test_invalid_url() {
    let app = build_test_app().await;
    
    // Submit an invalid URL (missing http:// or https://)
    let body = "url=example.com";
    
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/shorten")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .body(Body::from(body))
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn test_redirect_route() {
    let app = build_test_app().await;
    
    // First create a short URL
    let db_pool = db::init_db_pool().await.expect("Failed to connect to database");
    let short_id = "testredirect";
    let original_url = "https://example.org";
    
    db::save_url(&db_pool, short_id, original_url)
        .await
        .expect("Failed to save URL");
    
    // Then test the redirect
    let response = app
        .oneshot(
            Request::builder()
                .uri(format!("/{}", short_id))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::SEE_OTHER);
    
    // Check if Location header is set correctly
    let location = response.headers().get("Location").unwrap();
    assert_eq!(location, original_url);
}

#[tokio::test]
async fn test_nonexistent_redirect() {
    let app = build_test_app().await;
    
    let response = app
        .oneshot(
            Request::builder()
                .uri("/nonexistent")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}
