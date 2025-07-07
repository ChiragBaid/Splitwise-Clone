use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;
use sqlx::PgPool;
use crate::models::user::{User, NewUser};
use crate::utils::auth::{hash_password, verify_password, create_jwt};

#[derive(Debug, Deserialize)]
pub struct AuthRequest {
    pub email: String,
    pub password: String,
    pub name: Option<String>, // Only for registration
}

#[derive(Debug, serde::Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

pub async fn register(
    pool: web::Data<PgPool>,
    req: web::Json<AuthRequest>,
) -> impl Responder {
    let name = match &req.name {
        Some(name) => name.clone(),
        None => return HttpResponse::BadRequest().json("Name is required for registration"),
    };

    let hashed_password = match hash_password(&req.password) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().json("Failed to hash password"),
    };

    let new_user = NewUser {
        email: req.email.clone(),
        password_hash: hashed_password,
        name,
    };

    let user = match User::create(&pool, &new_user).await {
        Ok(user) => user,
        Err(_) => return HttpResponse::Conflict().json("User with this email already exists"),
    };

    let token = match create_jwt(user.id) {
        Ok(t) => t,
        Err(_) => return HttpResponse::InternalServerError().json("Failed to create token"),
    };

    HttpResponse::Ok().json(AuthResponse { token, user })
}

pub async fn login(
    pool: web::Data<PgPool>,
    req: web::Json<AuthRequest>,
) -> impl Responder {
    let user = match User::find_by_email(&pool, &req.email).await {
        Ok(Some(user)) => user,
        Ok(None) => return HttpResponse::Unauthorized().json("Invalid credentials"),
        Err(_) => return HttpResponse::InternalServerError().json("Database error"),
    };

    match verify_password(&req.password, &user.password_hash) {
        Ok(true) => (),
        _ => return HttpResponse::Unauthorized().json("Invalid credentials"),
    };

    let token = match create_jwt(user.id) {
        Ok(t) => t,
        Err(_) => return HttpResponse::InternalServerError().json("Failed to create token"),
    };

    HttpResponse::Ok().json(AuthResponse { token, user })
}

pub async fn logout() -> impl Responder {
    // On the client-side, the token should be discarded.
    // Server-side blocklisting can be implemented here if needed.
    HttpResponse::Ok().json("Logout successful")
} 