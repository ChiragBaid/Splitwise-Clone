pub mod config;
pub mod routes;
pub mod handlers;
pub mod models;
pub mod db;
pub mod utils;

pub use config::Config;
pub use db::connection::establish_connection; 