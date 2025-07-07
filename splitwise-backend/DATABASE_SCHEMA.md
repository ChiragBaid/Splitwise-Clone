# Splitwise Database Schema Documentation

## Overview
The database schema for the Splitwise backend has been correctly built and is fully compatible with the Rust backend application. The schema uses PostgreSQL with UUID primary keys and proper foreign key relationships.

## Database Configuration
- **Host**: localhost
- **Port**: 9357
- **Database**: splitwisedb
- **User**: splitwise
- **Password**: Ch@140903
- **Connection URL**: `postgresql://splitwise:Ch@140903@localhost:9357/splitwisedb`

## Schema Structure

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `users_pkey` (Primary Key)
- `users_email_key` (Unique constraint on email)
- `idx_users_email` (Performance index on email)

### 2. Groups Table
```sql
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `groups_pkey` (Primary Key)
- `idx_groups_created_by` (Performance index on created_by)

**Foreign Keys:**
- `created_by` → `users(id)`

### 3. Group Members Table
```sql
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);
```

**Indexes:**
- `group_members_pkey` (Primary Key)
- `group_members_group_id_user_id_key` (Unique constraint)
- `idx_group_members_group_id` (Performance index)
- `idx_group_members_user_id` (Performance index)

**Foreign Keys:**
- `group_id` → `groups(id)` (CASCADE DELETE)
- `user_id` → `users(id)` (CASCADE DELETE)

### 4. Expenses Table
```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_by UUID NOT NULL REFERENCES users(id),
    split_type VARCHAR(50) NOT NULL DEFAULT 'equal',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `expenses_pkey` (Primary Key)
- `idx_expenses_group_id` (Performance index)
- `idx_expenses_paid_by` (Performance index)

**Foreign Keys:**
- `group_id` → `groups(id)` (CASCADE DELETE)
- `paid_by` → `users(id)`
- `created_by` → `users(id)`

### 5. Splits Table
```sql
CREATE TABLE splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    is_settled BOOLEAN DEFAULT FALSE,
    settled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `splits_pkey` (Primary Key)
- `idx_splits_expense_id` (Performance index)
- `idx_splits_user_id` (Performance index)

**Foreign Keys:**
- `expense_id` → `expenses(id)` (CASCADE DELETE)
- `user_id` → `users(id)`

## Backend Compatibility

### Model Mappings
The database schema perfectly matches the Rust backend models:

1. **User Model** (`src/models/user.rs`)
   - All fields match the `users` table structure
   - UUID primary key support
   - Proper timestamp handling

2. **Group Model** (`src/models/group.rs`)
   - All fields match the `groups` table structure
   - Foreign key relationship with users
   - GroupMember model for many-to-many relationships

3. **Expense Model** (`src/models/expense.rs`)
   - All fields match the `expenses` table structure
   - Foreign key relationships with groups and users
   - Support for different split types

4. **Split Model** (`src/models/split.rs`)
   - All fields match the `splits` table structure
   - Foreign key relationships with expenses and users
   - Settlement tracking functionality

### SQLx Migration Support
The schema is managed through SQLx migrations:
- Migration file: `src/db/migrations/20240101000001_initial_schema.sql`
- Migration tracking table: `_sqlx_migrations`
- Automatic schema validation on startup

## Verification Status

✅ **Database Connection**: Working
✅ **All Tables Exist**: 5 required tables present
✅ **Schema Structure**: Matches backend models exactly
✅ **Foreign Keys**: All relationships properly established
✅ **Indexes**: Performance indexes created
✅ **Data Types**: UUID, TEXT, DECIMAL, TIMESTAMP all correct
✅ **Constraints**: Unique constraints and NOT NULL properly set
✅ **Backend Compilation**: No schema-related errors

## Setup Scripts

### Available Scripts:
1. **`setup-database.js`** - Initial database setup with Docker support
2. **`db-check.js`** - Health check and connection testing
3. **`recreate-tables.js`** - Drop and recreate all tables
4. **`verify-schema.js`** - Detailed schema verification

### Usage:
```bash
# Check database health
node db-check.js

# Verify schema structure
node verify-schema.js

# Recreate tables (if needed)
node recreate-tables.js
```

## Conclusion

The database schema is **correctly built** and fully compatible with the Splitwise backend. All tables, relationships, indexes, and data types match the backend requirements exactly. The schema supports all the core Splitwise functionality:

- User management and authentication
- Group creation and membership
- Expense tracking and splitting
- Settlement tracking
- Performance optimization through proper indexing

The backend can be started with confidence using:
```bash
cargo run
```

The database is ready for production use with the current schema design. 