use actix_web::{HttpResponse, ResponseError};
use serde::Serialize;
use std::fmt;

#[derive(Debug, Serialize)]
pub struct AppError {
    pub message: String,
    pub error_type: String,
}

impl AppError {
    pub fn new(message: &str, error_type: &str) -> Self {
        AppError {
            message: message.to_string(),
            error_type: error_type.to_string(),
        }
    }

    pub fn not_found(message: &str) -> Self {
        Self::new(message, "NOT_FOUND")
    }

    pub fn unauthorized(message: &str) -> Self {
        Self::new(message, "UNAUTHORIZED")
    }

    pub fn bad_request(message: &str) -> Self {
        Self::new(message, "BAD_REQUEST")
    }

    pub fn internal_error(message: &str) -> Self {
        Self::new(message, "INTERNAL_ERROR")
    }
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        match self.error_type.as_str() {
            "NOT_FOUND" => HttpResponse::NotFound().json(self),
            "UNAUTHORIZED" => HttpResponse::Unauthorized().json(self),
            "BAD_REQUEST" => HttpResponse::BadRequest().json(self),
            "INTERNAL_ERROR" => HttpResponse::InternalServerError().json(self),
            _ => HttpResponse::InternalServerError().json(self),
        }
    }
}

impl From<sqlx::Error> for AppError {
    fn from(error: sqlx::Error) -> Self {
        match error {
            sqlx::Error::RowNotFound => AppError::not_found("Resource not found"),
            _ => AppError::internal_error("Database error occurred"),
        }
    }
}

impl From<jsonwebtoken::errors::Error> for AppError {
    fn from(_: jsonwebtoken::errors::Error) -> Self {
        AppError::unauthorized("Invalid token")
    }
}

impl From<argon2::Error> for AppError {
    fn from(_: argon2::Error) -> Self {
        AppError::internal_error("Password hashing error")
    }
} 