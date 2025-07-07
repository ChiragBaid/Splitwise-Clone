use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use crate::models::split::{Split, SplitResponse};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Expense {
    pub id: Uuid,
    pub group_id: Uuid,
    pub description: String,
    pub amount: f64,
    pub paid_by: Uuid,
    pub split_type: String, // "equal", "percentage", "fixed"
    pub created_by: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExpenseWithSplits {
    pub expense: Expense,
    pub splits: Vec<Split>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExpenseResponse {
    pub id: Uuid,
    pub group_id: Uuid,
    pub description: String,
    pub amount: f64,
    pub paid_by: Uuid,
    pub split_type: String,
    pub created_by: Uuid,
    pub created_at: DateTime<Utc>,
    pub splits: Vec<SplitResponse>,
}

impl From<Expense> for ExpenseResponse {
    fn from(expense: Expense) -> Self {
        ExpenseResponse {
            id: expense.id,
            group_id: expense.group_id,
            description: expense.description,
            amount: expense.amount,
            paid_by: expense.paid_by,
            split_type: expense.split_type,
            created_by: expense.created_by,
            created_at: expense.created_at,
            splits: Vec::new(), // Will be populated when fetching from database
        }
    }
} 