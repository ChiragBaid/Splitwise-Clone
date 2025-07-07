use actix_web::web;
use crate::handlers::group_handler::{
    create_group, get_groups, get_group_by_id, update_group, delete_group, add_group_member, remove_group_member,
};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/groups")
            .route("", web::post().to(create_group))
            .route("", web::get().to(get_groups))
            .route("/{group_id}", web::get().to(get_group_by_id))
            .route("/{group_id}", web::put().to(update_group))
            .route("/{group_id}", web::delete().to(delete_group))
            .route("/{group_id}/members", web::post().to(add_group_member))
            .route(
                "/{group_id}/members/{user_id}",
                web::delete().to(remove_group_member),
            ),
    );
} 