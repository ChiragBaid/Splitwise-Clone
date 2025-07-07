use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Split {
    pub id: Uuid,
    pub expense_id: Uuid,
    pub user_id: Uuid,
    pub amount: f64,
    pub is_settled: bool,
    pub settled_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SplitResponse {
    pub id: Uuid,
    pub expense_id: Uuid,
    pub user_id: Uuid,
    pub amount: f64,
    pub is_settled: bool,
    pub settled_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

impl From<Split> for SplitResponse {
    fn from(split: Split) -> Self {
        SplitResponse {
            id: split.id,
            expense_id: split.expense_id,
            user_id: split.user_id,
            amount: split.amount,
            is_settled: split.is_settled,
            settled_at: split.settled_at,
            created_at: split.created_at,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserBalance {
    pub user_id: Uuid,
    pub total_paid: f64,
    pub total_owed: f64,
    pub balance: f64, // positive = they owe money, negative = they are owed money
} 