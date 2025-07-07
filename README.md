# Splitwise Clone

A Rust-based expense splitting application built with Actix-web and PostgreSQL.

## Project Structure

```
splitwise-rust/
├── backend/
│   ├── src/
│   │   ├── main.rs              # Application entry point
│   │   ├── lib.rs               # Library exports
│   │   ├── config.rs            # Configuration management
│   │   ├── routes/              # API route definitions
│   │   │   ├── mod.rs
│   │   │   ├── auth.rs          # Authentication routes
│   │   │   ├── groups.rs        # Group management routes
│   │   │   ├── expenses.rs      # Expense management routes
│   │   │   ├── users.rs         # User management routes
│   │   ├── handlers/            # Request handlers
│   │   │   ├── auth_handler.rs
│   │   │   ├── expense_handler.rs
│   │   │   ├── group_handler.rs
│   │   │   ├── user_handler.rs
│   │   ├── models/              # Data models
│   │   │   ├── mod.rs
│   │   │   ├── user.rs
│   │   │   ├── group.rs
│   │   │   ├── expense.rs
│   │   │   ├── split.rs
│   │   ├── db/                  # Database layer
│   │   │   ├── mod.rs
│   │   │   ├── connection.rs    # Database connection
│   │   │   ├── schema.rs        # Schema definitions
│   │   │   ├── migrations/      # Database migrations
│   │   ├── utils/               # Utility functions
│   │   │   ├── auth.rs          # Authentication utilities
│   │   │   ├── error.rs         # Error handling
│   │   │   ├── helpers.rs       # Helper functions
│   ├── Cargo.toml
├── frontend/ (optional)
│   ├── yew-app/ (Rust WASM frontend using Yew)
│   ├── react-app/ (if using React + TypeScript instead)
├── README.md
```

## Features

- **User Authentication**: JWT-based authentication with password hashing
- **Group Management**: Create, join, and manage expense groups
- **Expense Tracking**: Add, edit, and delete expenses
- **Split Calculations**: Support for equal, percentage, and fixed amount splits
- **Balance Tracking**: Track who owes what to whom
- **Settlement**: Mark expenses as settled

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users

### Groups
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/{id}` - Get group details
- `PUT /api/groups/{id}` - Update group
- `DELETE /api/groups/{id}` - Delete group
- `POST /api/groups/{id}/members` - Add member to group
- `DELETE /api/groups/{id}/members/{user_id}` - Remove member from group

### Expenses
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - Get expenses (with filters)
- `GET /api/expenses/{id}` - Get expense details
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `POST /api/expenses/{id}/settle` - Mark expense as settled

## Setup

### Prerequisites

- Rust (latest stable version)
- PostgreSQL
- Cargo

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd splitwise-rust/backend
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/splitwise
JWT_SECRET=your-secret-key-here
PORT=8080
HOST=127.0.0.1
```

3. Set up the database:
```bash
# Create database
createdb splitwise

# Run migrations
cargo sqlx migrate run
```

4. Run the application:
```bash
cargo run
```

The server will start at `http://127.0.0.1:8080`

## Development

### Running Tests
```bash
cargo test
```

### Database Migrations
```bash
# Create a new migration
cargo sqlx migrate add migration_name

# Run migrations
cargo sqlx migrate run

# Revert last migration
cargo sqlx migrate revert
```

### Code Formatting
```bash
cargo fmt
```

### Linting
```bash
cargo clippy
```

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `name` (VARCHAR)
- `password_hash` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Groups
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `created_by` (UUID, Foreign Key to users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Group Members
- `id` (UUID, Primary Key)
- `group_id` (UUID, Foreign Key to groups)
- `user_id` (UUID, Foreign Key to users)
- `role` (VARCHAR) - "admin" or "member"
- `joined_at` (TIMESTAMP)

### Expenses
- `id` (UUID, Primary Key)
- `group_id` (UUID, Foreign Key to groups)
- `description` (TEXT)
- `amount` (DECIMAL)
- `paid_by` (UUID, Foreign Key to users)
- `split_type` (VARCHAR) - "equal", "percentage", "fixed"
- `created_by` (UUID, Foreign Key to users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Splits
- `id` (UUID, Primary Key)
- `expense_id` (UUID, Foreign Key to expenses)
- `user_id` (UUID, Foreign Key to users)
- `amount` (DECIMAL)
- `is_settled` (BOOLEAN)
- `settled_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License. 