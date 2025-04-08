use libsql::{Builder, Database, Error};
use std::{env, sync::Arc};

pub type DbPool = Arc<Database>;

// Initialize database connection pool
pub async fn init_db_pool() -> Result<DbPool, Error> {
    let url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let auth_token = env::var("DATABASE_AUTH_TOKEN").expect("DATABASE_AUTH_TOKEN must be set");

    let db = Builder::new_remote(url.to_string(), auth_token)
        .build()
        .await?;

    Ok(Arc::new(db))
}

// Initialize the database tables
pub async fn init_tables(db: &DbPool) -> Result<(), Error> {
    let conn = db.connect()?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            short_id TEXT NOT NULL UNIQUE,
            original_url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        (),
    )
    .await?;

    Ok(())
}

// Save a new shortened URL
pub async fn save_url(db: &DbPool, short_id: &str, original_url: &str) -> Result<(), Error> {
    let conn = db.connect()?;

    conn.execute(
        "INSERT INTO urls (short_id, original_url) VALUES (?, ?)",
        libsql::params![short_id, original_url],
    )
    .await?;

    Ok(())
}

// Get the original URL from a short ID
pub async fn get_original_url(db: &DbPool, short_id: &str) -> Result<Option<String>, Error> {
    let conn = db.connect()?;

    let mut stmt = conn.prepare("SELECT original_url FROM urls WHERE short_id = ?").await?;
    let mut rows = stmt.query(libsql::params![short_id]).await?;

    if let Some(row) = rows.next().await? {
        let original_url: String = row.get(0)?;
        Ok(Some(original_url))
    } else {
        Ok(None)
    }
}