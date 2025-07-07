use sqlx::postgres::{PgPool, PgPoolOptions};
use crate::config::Config;

pub async fn establish_connection(config: &Config) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
}

pub async fn run_migrations(pool: &PgPool) -> Result<(), sqlx::migrate::MigrateError> {
    sqlx::migrate!("src/db/migrations")
        .run(pool)
        .await
} 