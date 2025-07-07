use actix_web::web;
use crate::handlers::user_handler::{get_current_user, get_user_profile};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/users")
            .route("/me", web::get().to(get_current_user))
            .route("/{user_id}/profile", web::get().to(get_user_profile))
    );
} 