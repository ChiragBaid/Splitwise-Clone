use actix_web::{web, HttpRequest, HttpResponse};
use serde::Deserialize;
use sqlx::{PgPool, Row};
use uuid::Uuid;
use crate::utils::auth::{verify_jwt, extract_token_from_header};
use crate::utils::error::AppError;
use chrono::Utc;
use crate::models::expense::Expense;
use crate::models::split::Split;

#[derive(Debug, Deserialize)]
pub struct CreateExpenseRequest {
    pub group_id: Uuid,
    pub description: String,
    pub amount: f64,
    pub paid_by: Uuid,
    pub split_type: String,
    pub splits: Vec<SplitRequest>,
}

#[derive(Debug, Deserialize)]
pub struct SplitRequest {
    pub user_id: Uuid,
    pub amount: f64,
}

#[derive(Debug, Deserialize)]
pub struct UpdateExpenseRequest {
    pub description: Option<String>,
    pub amount: Option<f64>,
    pub splits: Option<Vec<SplitRequest>>,
}

fn extract_user_id_from_request(req: &HttpRequest) -> Result<Uuid, AppError> {
    let auth_header = req.headers().get("Authorization").and_then(|v| v.to_str().ok());
    let token = auth_header.and_then(|h| extract_token_from_header(h));
    let claims = token
        .ok_or_else(|| AppError::unauthorized("Missing token"))
        .and_then(|t| verify_jwt(&t).map_err(AppError::from))?;
    Uuid::parse_str(&claims.sub).map_err(|_| AppError::unauthorized("Invalid user id in token"))
}

pub async fn create_expense(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    body: web::Json<CreateExpenseRequest>,
) -> Result<HttpResponse, AppError> {
    let user_id = extract_user_id_from_request(&req)?;
    let row = sqlx::query(
        r#"INSERT INTO expenses (group_id, description, amount, paid_by, split_type, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, group_id, description, amount, paid_by, split_type, created_by, created_at, updated_at"#,
    )
    .bind(&body.group_id)
    .bind(&body.description)
    .bind(&body.amount)
    .bind(&body.paid_by)
    .bind(&body.split_type)
    .bind(&user_id)
    .fetch_one(pool.get_ref())
    .await?;
    let expense = Expense {
        id: row.try_get("id")?,
        group_id: row.try_get("group_id")?,
        description: row.try_get("description")?,
        amount: row.try_get("amount")?,
        paid_by: row.try_get("paid_by")?,
        split_type: row.try_get("split_type")?,
        created_by: row.try_get("created_by")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    };
    // Insert splits
    for split in &body.splits {
        let _ = sqlx::query(
            r#"INSERT INTO splits (expense_id, user_id, amount) VALUES ($1, $2, $3)"#,
        )
        .bind(&expense.id)
        .bind(&split.user_id)
        .bind(&split.amount)
        .execute(pool.get_ref())
        .await?;
    }
    Ok(HttpResponse::Ok().json(expense))
}

pub async fn get_expenses(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> Result<HttpResponse, AppError> {
    let user_id = extract_user_id_from_request(&req)?;
    let group_id = query.get("group_id").and_then(|s| Uuid::parse_str(s).ok());
    let rows = if let Some(gid) = group_id {
        sqlx::query(
            r#"SELECT * FROM expenses WHERE group_id = $1"#,
        )
        .bind(&gid)
        .fetch_all(pool.get_ref())
        .await?
    } else {
        sqlx::query(
            r#"SELECT * FROM expenses WHERE created_by = $1"#,
        )
        .bind(&user_id)
        .fetch_all(pool.get_ref())
        .await?
    };
    let expenses: Vec<Expense> = rows.into_iter().map(|row| Expense {
        id: row.try_get("id").unwrap(),
        group_id: row.try_get("group_id").unwrap(),
        description: row.try_get("description").unwrap(),
        amount: row.try_get("amount").unwrap(),
        paid_by: row.try_get("paid_by").unwrap(),
        split_type: row.try_get("split_type").unwrap(),
        created_by: row.try_get("created_by").unwrap(),
        created_at: row.try_get("created_at").unwrap(),
        updated_at: row.try_get("updated_at").unwrap(),
    }).collect();
    Ok(HttpResponse::Ok().json(expenses))
}

pub async fn get_expense_by_id(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let expense_id = path.into_inner();
    let row = sqlx::query(
        r#"SELECT * FROM expenses WHERE id = $1"#,
    )
    .bind(&expense_id)
    .fetch_one(pool.get_ref())
    .await?;
    let expense = Expense {
        id: row.try_get("id")?,
        group_id: row.try_get("group_id")?,
        description: row.try_get("description")?,
        amount: row.try_get("amount")?,
        paid_by: row.try_get("paid_by")?,
        split_type: row.try_get("split_type")?,
        created_by: row.try_get("created_by")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    };
    Ok(HttpResponse::Ok().json(expense))
}

pub async fn update_expense(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    body: web::Json<UpdateExpenseRequest>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let expense_id = path.into_inner();
    let row = sqlx::query(
        r#"UPDATE expenses SET description = COALESCE($1, description), amount = COALESCE($2, amount), updated_at = $3 WHERE id = $4 RETURNING *"#,
    )
    .bind(&body.description)
    .bind(&body.amount)
    .bind(&Utc::now())
    .bind(&expense_id)
    .fetch_one(pool.get_ref())
    .await?;
    let expense = Expense {
        id: row.try_get("id")?,
        group_id: row.try_get("group_id")?,
        description: row.try_get("description")?,
        amount: row.try_get("amount")?,
        paid_by: row.try_get("paid_by")?,
        split_type: row.try_get("split_type")?,
        created_by: row.try_get("created_by")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    };
    Ok(HttpResponse::Ok().json(expense))
}

pub async fn delete_expense(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let expense_id = path.into_inner();
    let _ = sqlx::query(
        r#"DELETE FROM expenses WHERE id = $1"#,
    )
    .bind(&expense_id)
    .execute(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json("Expense deleted"))
}

pub async fn get_splits_for_expense(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let _ = extract_user_id_from_request(&req)?;
    let expense_id = path.into_inner();
    let rows = sqlx::query(
        r#"SELECT * FROM splits WHERE expense_id = $1"#,
    )
    .bind(&expense_id)
    .fetch_all(pool.get_ref())
    .await?;
let splits: Vec<Split> = rows.into_iter().map(|row| Split {
    id: row.try_get("id").unwrap(),
    expense_id: row.try_get("expense_id").unwrap(),
    user_id: row.try_get("user_id").unwrap(),
    amount: row.try_get("amount").unwrap(),
    is_settled: row.try_get("is_settled").unwrap(),
    settled_at: row.try_get("settled_at").ok(),
    created_at: row.try_get("created_at").unwrap(),
    updated_at: row.try_get("updated_at").unwrap(),
    }).collect();
    Ok(HttpResponse::Ok().json(splits))
}

pub async fn settle_expense(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, AppError> {
    let user_id = extract_user_id_from_request(&req)?;
    let expense_id = path.into_inner();
    let _ = sqlx::query(
        r#"UPDATE splits SET is_settled = TRUE, settled_at = $1 WHERE expense_id = $2 AND user_id = $3"#,
    )
    .bind(&Utc::now())
    .bind(&expense_id)
    .bind(&user_id)
    .execute(pool.get_ref())
    .await?;
    Ok(HttpResponse::Ok().json("Expense settled"))
}