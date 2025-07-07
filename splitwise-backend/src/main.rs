use actix_web::{web, App, HttpServer, middleware};
use splitwise_backend::{Config, establish_connection, routes::configure_routes};
// use tracing::info;
// use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load .env file
    dotenvy::dotenv().expect(".env file not found");

    // Load configuration
    let config = Config::from_env().expect("Failed to load configuration");
    
    // Establish database connection
    let pool = establish_connection(&config)
        .await
        .expect("Failed to establish database connection");
    
    // Run migrations
    splitwise_backend::db::connection::run_migrations(&pool)
        .await
        .expect("Failed to run database migrations");
    
    println!("Starting server at {}:{}", config.host, config.port);
    
    // Start HTTP server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(middleware::Logger::default())
            .configure(configure_routes)
    })
    .bind((config.host, config.port))?
    .run()
    .await
}
