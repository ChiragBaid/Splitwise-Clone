use actix_web::{web, HttpResponse, HttpRequest};
use serde::Deserialize;
use sqlx::PgPool;
use crate::models::user::{User, UserResponse};
use crate::utils::auth::{verify_jwt, extract_token_from_header};
use crate::utils::error::AppError;

#[derive(Debug, Deserialize)]
pub struct UpdateProfileRequest {
    pub name: Option<String>,
    pub email: Option<String>,
}

pub async fn get_current_user(
    req: HttpRequest,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppError> {
    let user_id = extract_user_id_from_request(&req)?;
    let user = sqlx::query_as::<_, User>(
        r#"SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE id = $1"#,
    )
    .bind(user_id)
    .fetch_one(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json(UserResponse::from(user)))
}

pub async fn get_user_profile(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<uuid::Uuid>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?; // Auth check
    let user_id = path.into_inner();
    let user = sqlx::query_as::<_, User>(
        r#"SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE id = $1"#,
    )
    .bind(user_id)
    .fetch_one(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json(UserResponse::from(user)))
}

pub async fn get_users(
    req: HttpRequest,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?; // Auth check
    let users = sqlx::query_as::<_, User>(
        r#"SELECT id, name, email, password_hash, created_at, updated_at FROM users"#,
    )
    .fetch_all(pool.get_ref())
    .await?;
    let responses: Vec<UserResponse> = users.into_iter().map(UserResponse::from).collect();
    Ok(HttpResponse::Ok().json(responses))
}

fn extract_user_id_from_request(req: &HttpRequest) -> Result<uuid::Uuid, AppError> {
    let auth_header = req.headers().get("Authorization").and_then(|v| v.to_str().ok());
    let token = auth_header.and_then(|h| extract_token_from_header(h));
    let claims = token
        .ok_or_else(|| AppError::unauthorized("Missing token"))
        .and_then(|t| verify_jwt(&t).map_err(AppError::from))?;
    uuid::Uuid::parse_str(&claims.sub).map_err(|_| AppError::unauthorized("Invalid user id in token"))
} 