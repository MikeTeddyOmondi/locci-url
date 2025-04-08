use locci_url::{api, db, shortener};
use axum::{
    body::Body,
    http::{Request, StatusCode},
    Router,
    routing::{get, post},
};
use serde_json::json;
use tower::ServiceExt;
use dotenvy::dotenv;
use std::env;
use axum::body::to_bytes;

#[tokio::test]
async fn test_end_to_end_flow() {
    dotenv().ok();
    
    if env::var("DATABASE_URL").is_err() {
        unsafe {
            env::set_var("DATABASE_URL", "file:///tests.db");
        }
    }
    
    // Set base URL for testing
    unsafe { env::set_var("BASE_URL", "http://localhost:3000") };
    
    let db_pool = db::init_db_pool().await.expect("Failed to connect to database");
    db::init_tables(&db_pool).await.expect("Failed to initialize tables");
    
    let app = Router::new()
        .route("/", get(api::index))
        .route("/shorten", post(api::create_short_url))
        .route("/:short_id", get(api::redirect_to_url))
        .with_state(db_pool);
    
    // Step 1: Create a short URL
    let body = "url=https%3A%2F%2Fexample.com%2Ftesting";
    
    let response = app
        .clone()
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
    
    // Extract the short ID from the response
    let body_bytes = to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body_bytes.to_vec()).unwrap();
    let json_response: serde_json::Value = serde_json::from_str(&body_str).unwrap();
    
    let short_url = json_response["short_url"].as_str().unwrap();
    let short_id = short_url.split('/').last().unwrap();
    
    // Step 2: Use the short URL to redirect
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
    
    // Check the location header points to the original URL
    let location = response.headers().get("Location").unwrap();
    assert_eq!(location, "https://example.com/testing");
}