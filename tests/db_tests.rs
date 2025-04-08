use locci_url::db;
use std::{sync::Arc, usize};
use std::env;
use dotenvy::dotenv;

#[tokio::test]
async fn test_db_connection() {
    dotenv().ok();
    
    // Set a test database URL if not already set
    if env::var("DATABASE_URL").is_err() {
        unsafe {
            env::set_var("DATABASE_URL", "file:///tests.db");
        }
    }
    
    let db_pool = db::init_db_pool().await.expect("Failed to connect to database");
    
    // If we get here, the connection was successful
    assert!(db_pool.connect().is_ok());
}

#[tokio::test]
async fn test_db_init_tables() {
    dotenv().ok();
    
    if env::var("DATABASE_URL").is_err() {
        unsafe {
            env::set_var("DATABASE_URL", "file:///tests.db");
        }    
    }
    
    let db_pool = db::init_db_pool().await.expect("Failed to connect to database");
    let result = db::init_tables(&db_pool).await;
    
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_save_and_get_url() {
    dotenv().ok();
    
    if env::var("DATABASE_URL").is_err() {
        unsafe {
            env::set_var("DATABASE_URL", "file:///tests.db");
        }
    }
    
    let db_pool = db::init_db_pool().await.expect("Failed to connect to database");
    db::init_tables(&db_pool).await.expect("Failed to initialize tables");
    
    // Save a URL
    let short_id = "test123";
    let original_url = "https://example.com";
    
    let save_result = db::save_url(&db_pool, short_id, original_url).await;
    assert!(save_result.is_ok());
    
    // Retrieve the URL
    let get_result = db::get_original_url(&db_pool, short_id).await;
    assert!(get_result.is_ok());
    
    let retrieved_url = get_result.unwrap();
    assert_eq!(retrieved_url, Some(original_url.to_string()));
}

#[tokio::test]
async fn test_get_nonexistent_url() {
    dotenv().ok();
    
    if env::var("DATABASE_URL").is_err() {
        unsafe {
            env::set_var("DATABASE_URL", "file:///tests.db");
        }   
    }
    
    let db_pool = db::init_db_pool().await.expect("Failed to connect to database");
    db::init_tables(&db_pool).await.expect("Failed to initialize tables");
    
    // Try to retrieve a URL that doesn't exist
    let get_result = db::get_original_url(&db_pool, "nonexistent").await;
    assert!(get_result.is_ok());
    
    let retrieved_url = get_result.unwrap();
    assert_eq!(retrieved_url, None);
}
