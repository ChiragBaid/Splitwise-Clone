pub mod auth;
pub mod groups;
pub mod expenses;
pub mod users;

use actix_web::web;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .configure(auth::configure)
            .configure(users::configure)
            .configure(groups::configure)
            .configure(expenses::configure)
    );
} 