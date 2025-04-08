use locci_url::db;

#[tokio::main]
async fn main() {
    // Load environment variables
    dotenvy::dotenv().ok();
    
    println!("Initializing database connection...");
    let db_pool = match db::init_db_pool().await {
        Ok(pool) => {
            println!("Database connection successful!");
            pool
        },
        Err(e) => {
            eprintln!("Failed to connect to database: {}", e);
            std::process::exit(1);
        }
    };

    println!("Initializing tables...");
    if let Err(e) = db::init_tables(&db_pool).await {
        eprintln!("Failed to initialize tables: {}", e);
        std::process::exit(1);
    }
    println!("Tables initialized successfully!");
}