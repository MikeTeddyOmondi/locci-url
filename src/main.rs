mod api;
mod db;
mod shortener;

use axum::{
    Router,
    routing::{get, post},
};

async fn initialize() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize database connection
    let db_pool = db::init_db_pool()
        .await
        .expect("Failed to connect to database");

    // Initialize the tables if they don't exist
    db::init_tables(&db_pool)
        .await
        .expect("Failed to initialize database tables");
    
    Ok(())
}

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenvy::dotenv().ok();

    // Initialize database connection
    let db_pool = db::init_db_pool()
        .await
        .expect("Failed to connect to database");

    if let Err(e) = initialize().await {
        eprintln!("Error during initialization: {}", e);
        std::process::exit(1);
    }
    
    // Build our application with routes
    let app = Router::new()
        .route("/health", get(api::index))
        .route("/shorten", post(api::create_short_url))
        .route("/{short_id}", get(api::redirect_to_url))
        .with_state(db_pool);

    // Run the server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server listening on :3000");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
