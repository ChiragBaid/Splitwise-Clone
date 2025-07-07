use uuid::Uuid;
use chrono::{DateTime, Utc};
use regex::Regex;

pub fn generate_uuid() -> Uuid {
    Uuid::new_v4()
}

pub fn now() -> DateTime<Utc> {
    Utc::now()
}

pub fn validate_email(email: &str) -> bool {
    let email_regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
    email_regex.is_match(email)
}

pub fn validate_password(password: &str) -> bool {
    // Password must be at least 8 characters long
    password.len() >= 8
}

pub fn format_currency(amount: f64) -> String {
    format!("${:.2}", amount)
}

pub fn calculate_equal_split(total_amount: f64, num_people: usize) -> f64 {
    (total_amount / num_people as f64 * 100.0).round() / 100.0
}

pub fn calculate_percentage_split(total_amount: f64, percentage: f64) -> f64 {
    (total_amount * percentage / 100.0 * 100.0).round() / 100.0
} 