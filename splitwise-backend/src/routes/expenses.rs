use actix_web::web;
use crate::handlers::expense_handler::{
    create_expense, get_expenses, get_expense_by_id, update_expense, delete_expense, get_splits_for_expense,
};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/expenses")
            .route("", web::post().to(create_expense))
            .route("", web::get().to(get_expenses))
            .route("/{expense_id}", web::get().to(get_expense_by_id))
            .route("/{expense_id}", web::put().to(update_expense))
            .route("/{expense_id}", web::delete().to(delete_expense))
            .route("/{expense_id}/splits", web::get().to(get_splits_for_expense))
    );
} 