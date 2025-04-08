use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Redirect},
    Json,
};
use serde::{Deserialize, Serialize};

use crate::{db::DbPool, shortener};

// Index route
pub async fn index() ->  impl IntoResponse {
    return (
        StatusCode::OK,
        "Server is healthy!".to_string(),
    )
        .into_response();
}

#[derive(Deserialize)]
pub struct CreateUrlRequest {
    url: String,
}

#[derive(Serialize)]
pub struct CreateUrlResponse {
    short_url: String,
    original_url: String,
}

// Create a short URL
#[axum::debug_handler]
pub async fn create_short_url(
    State(db): State<DbPool>,
    Json(payload): Json<CreateUrlRequest>,
) -> impl IntoResponse {
    // Validate URL
    if !shortener::is_valid_url(&payload.url) {
        return (
            StatusCode::BAD_REQUEST,
            "Invalid URL format. URL must start with http:// or https://".to_string(),
        )
            .into_response();
    }

    // Generate a short ID (e.g 4 characters)
    let short_id = shortener::generate_short_id(4);

    // Save to database
    match crate::db::save_url(&db, &short_id, &payload.url).await {
        Ok(_) => {
            let base_url = std::env::var("BASE_URL").unwrap_or_else(|_| "http://localhost:3000".to_string());
            let short_url = format!("{}/{}", base_url, short_id);

            // Return JSON response
            let response = CreateUrlResponse {
                short_url,
                original_url: payload.url,
            };

            let json = serde_json::to_string(&response).unwrap();

            (StatusCode::OK, [(axum::http::header::CONTENT_TYPE, "application/json")], json).into_response()
        }
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Failed to create shortened URL").into_response(),
    }
}

// Redirect to the original URL
#[axum::debug_handler]
pub async fn redirect_to_url(
    State(db): State<DbPool>,
    Path(short_id): Path<String>,
) -> impl IntoResponse {
    match crate::db::get_original_url(&db, &short_id).await {
        Ok(Some(original_url)) => Redirect::to(&original_url).into_response(),
        Ok(None) => (StatusCode::NOT_FOUND, "Short URL not found").into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Error retrieving the URL",
        )
            .into_response(),
    }
}