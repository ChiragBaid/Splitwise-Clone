use actix_web::{web, HttpRequest, HttpResponse};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;
use crate::utils::auth::{verify_jwt, extract_token_from_header};
use crate::utils::error::AppError;
use chrono::Utc;

#[derive(Debug, Deserialize)]
pub struct CreateGroupRequest {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateGroupRequest {
    pub name: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct AddMemberRequest {
    pub user_id: Uuid,
}

fn extract_user_id_from_request(req: &HttpRequest) -> Result<Uuid, AppError> {
    let auth_header = req.headers().get("Authorization").and_then(|v| v.to_str().ok());
    let token = auth_header.and_then(|h| extract_token_from_header(h));
    let claims = token
        .ok_or_else(|| AppError::unauthorized("Missing token"))
        .and_then(|t| verify_jwt(&t).map_err(AppError::from))?;
    Uuid::parse_str(&claims.sub).map_err(|_| AppError::unauthorized("Invalid user id in token"))
}

pub async fn create_group(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    body: web::Json<CreateGroupRequest>,
) -> Result<HttpResponse, AppError> {
    let user_id = extract_user_id_from_request(&req)?;
    let group = sqlx::query(
        r#"INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING id, name, description, created_by, created_at, updated_at"#,
    )
    .bind(&body.name)
    .bind(&body.description)
    .bind(user_id)
    .fetch_one(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json(group))
}

pub async fn get_groups(
    req: HttpRequest,
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, AppError> {
    let user_id = extract_user_id_from_request(&req)?;
    let groups = sqlx::query(
        r#"SELECT * FROM groups WHERE created_by = $1"#,
    )
    .bind(user_id)
    .fetch_all(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json(groups))
}

pub async fn get_group_by_id(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let group_id = path.into_inner();
    let group = sqlx::query(
        r#"SELECT * FROM groups WHERE id = $1"#,
    )
    .bind(group_id)
    .fetch_one(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json(group))
}

pub async fn update_group(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    body: web::Json<UpdateGroupRequest>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let group_id = path.into_inner();
    let group = sqlx::query(
        r#"UPDATE groups SET name = COALESCE($1, name), description = COALESCE($2, description), updated_at = $3 WHERE id = $4 RETURNING *"#,
    )
    .bind(&body.name)
    .bind(&body.description)
    .bind(Utc::now())
    .bind(group_id)
    .fetch_one(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json(group))
}

pub async fn delete_group(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let group_id = path.into_inner();
    let _ = sqlx::query(
        r#"DELETE FROM groups WHERE id = $1"#,
    )
    .bind(group_id)
    .execute(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json("Group deleted"))
}

pub async fn add_group_member(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    body: web::Json<AddMemberRequest>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let group_id = path.into_inner();
    let member = sqlx::query(
        r#"INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *"#,
    )
    .bind(group_id)
    .bind(body.user_id)
    .fetch_one(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json(member))
}

pub async fn remove_group_member(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<(Uuid, Uuid)>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let (group_id, user_id) = path.into_inner();
    let _ = sqlx::query(
        r#"DELETE FROM group_members WHERE group_id = $1 AND user_id = $2"#,
    )
    .bind(group_id)
    .bind(user_id)
    .execute(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json("Member removed"))
}

// ... existing code ... 