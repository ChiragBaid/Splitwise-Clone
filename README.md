# Splitwise Clone

A full-stack expense splitting application built with **Rust (Actix-web + PostgreSQL)** backend and **React Native (Expo)** frontend. This project replicates the core functionality of Splitwise, allowing users to track shared expenses, split bills, and manage group finances.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with password hashing
- **Group Management**: Create, join, and manage expense groups with member roles
- **Expense Tracking**: Add, edit, and delete expenses with detailed descriptions
- **Smart Splitting**: Support for equal, percentage, and fixed amount splits
- **Balance Tracking**: Real-time tracking of who owes what to whom
- **Settlement System**: Mark expenses as settled and track payment status
- **Friend Management**: Add and manage friends for direct expense sharing

### Technical Features
- **Cross-Platform**: React Native app works on iOS, Android, and Web
- **Real-time Updates**: Live balance and expense updates
- **Secure API**: RESTful API with JWT authentication
- **Database Migrations**: Automated schema management with SQLx
- **Error Handling**: Comprehensive error handling and validation
- **Responsive Design**: Modern UI with React Native Paper components

## 📱 Screenshots

*[Screenshots would be added here showing the mobile app interface]*

## 🏗️ Project Architecture

```
Splitwise Clone/
├── splitwise-backend/          # Rust Backend API
│   ├── src/
│   │   ├── main.rs            # Application entry point
│   │   ├── lib.rs             # Library exports
│   │   ├── config.rs          # Configuration management
│   │   ├── routes/            # API route definitions
│   │   │   ├── auth.rs        # Authentication routes
│   │   │   ├── groups.rs      # Group management routes
│   │   │   ├── expenses.rs    # Expense management routes
│   │   │   ├── users.rs       # User management routes
│   │   ├── handlers/          # Request handlers
│   │   │   ├── auth_handler.rs
│   │   │   ├── expense_handler.rs
│   │   │   ├── group_handler.rs
│   │   │   ├── user_handler.rs
│   │   ├── models/            # Data models
│   │   │   ├── user.rs        # User model
│   │   │   ├── group.rs       # Group model
│   │   │   ├── expense.rs     # Expense model
│   │   │   ├── split.rs       # Split model
│   │   ├── db/                # Database layer
│   │   │   ├── connection.rs  # Database connection
│   │   │   ├── schema.rs      # Schema definitions
│   │   │   ├── migrations/    # Database migrations
│   │   ├── utils/             # Utility functions
│   │   │   ├── auth.rs        # Authentication utilities
│   │   │   ├── error.rs       # Error handling
│   │   │   ├── helpers.rs     # Helper functions
│   ├── Cargo.toml             # Rust dependencies
│   ├── DATABASE_SCHEMA.md     # Database documentation
│   └── setup scripts/         # Database setup utilities
├── splitwise-frontend/        # React Native Frontend
│   ├── screens/               # App screens
│   │   ├── LoginScreen.js     # User login
│   │   ├── SignupScreen.js    # User registration
│   │   ├── DashboardScreen.js # Main dashboard
│   │   ├── GroupScreen.js     # Group management
│   │   ├── AddExpenseScreen.js # Add expenses
│   │   ├── FriendScreen.js    # Friend management
│   │   └── SettleUpScreen.js  # Settlement tracking
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Common UI components
│   │   ├── expenses/          # Expense-related components
│   │   ├── friends/           # Friend-related components
│   │   └── groups/            # Group-related components
│   ├── services/              # API services
│   │   ├── api.js             # Base API configuration
│   │   ├── authService.js     # Authentication service
│   │   ├── expenseService.js  # Expense management
│   │   ├── groupService.js    # Group management
│   │   └── userService.js     # User management
│   ├── context/               # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── navigation/            # Navigation configuration
│   ├── utils/                 # Utility functions
│   ├── package.json           # Node.js dependencies
│   └── App.js                 # Main app component
├── start-both.bat             # Windows startup script
├── start-both.ps1             # PowerShell startup script
└── README.md                  # This file
```

## 🛠️ Technology Stack

### Backend
- **Language**: Rust
- **Framework**: Actix-web 4.x
- **Database**: PostgreSQL with SQLx
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Serde for serialization/deserialization
- **Logging**: Tracing and env_logger
- **Configuration**: dotenvy for environment management

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6.x
- **UI Components**: React Native Paper + React Native Elements
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Storage**: Expo SecureStore
- **Icons**: React Native Vector Icons + Expo Vector Icons

### Database
- **Engine**: PostgreSQL
- **ORM**: SQLx with async/await support
- **Migrations**: Automated migration system
- **Connection Pooling**: Built-in connection management

## 📋 Prerequisites

### Backend Requirements
- **Rust** (latest stable version) - [Install Rust](https://rustup.rs/)
- **PostgreSQL** (12 or higher) - [Install PostgreSQL](https://www.postgresql.org/download/)
- **Cargo** (comes with Rust)

### Frontend Requirements
- **Node.js** (18 or higher) - [Install Node.js](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - `npm install -g @expo/cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Splitwise Clone"
```

### 2. Backend Setup

#### Database Setup
```bash
cd splitwise-backend

# Create database user and database
node create-db-user.js

# Run database setup
node setup-database.js

# Verify database connection
node db-check.js
```

#### Environment Configuration
Create a `.env` file in `splitwise-backend/`:
```env
DATABASE_URL=postgresql://splitwise:Ch@140903@localhost:9357/splitwisedb
JWT_SECRET=your-super-secret-jwt-key-here
PORT=8080
HOST=127.0.0.1
RUST_LOG=info
```

#### Run Backend
```bash
# Install dependencies and run
cargo run

# Or build and run
cargo build --release
./target/release/splitwise-backend
```

The backend API will be available at `http://127.0.0.1:8080`

### 3. Frontend Setup

```bash
cd splitwise-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

This will open the Expo development tools. You can:
- Press `a` to open Android emulator
- Press `i` to open iOS simulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your phone

### 4. Quick Start Scripts

#### Windows
```bash
# Start both backend and frontend
start-both.bat

# Or using PowerShell
.\start-both.ps1
```

#### Manual Start
```bash
# Terminal 1 - Backend
cd splitwise-backend
cargo run

# Terminal 2 - Frontend
cd splitwise-frontend
npm start
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/profile` | Get current user profile |
| `PUT` | `/api/users/profile` | Update user profile |
| `GET` | `/api/users` | Get all users (for friend search) |

### Group Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/groups` | Create a new group |
| `GET` | `/api/groups` | Get user's groups |
| `GET` | `/api/groups/{id}` | Get group details |
| `PUT` | `/api/groups/{id}` | Update group |
| `DELETE` | `/api/groups/{id}` | Delete group |
| `POST` | `/api/groups/{id}/members` | Add member to group |
| `DELETE` | `/api/groups/{id}/members/{user_id}` | Remove member from group |

### Expense Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/expenses` | Create a new expense |
| `GET` | `/api/expenses` | Get expenses (with filters) |
| `GET` | `/api/expenses/{id}` | Get expense details |
| `PUT` | `/api/expenses/{id}` | Update expense |
| `DELETE` | `/api/expenses/{id}` | Delete expense |
| `POST` | `/api/expenses/{id}/settle` | Mark expense as settled |

### Request/Response Examples

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123"
  }'
```

#### Create Group
```bash
curl -X POST http://localhost:8080/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Apartment Rent",
    "description": "Monthly rent and utilities"
  }'
```

#### Add Expense
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "group_id": "group-uuid-here",
    "description": "Grocery shopping",
    "amount": 150.00,
    "paid_by": "user-uuid-here",
    "split_type": "equal"
  }'
```

## 🗄️ Database Schema

### Core Tables

#### Users
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

#### Groups
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

#### Group Members
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

#### Expenses
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

#### Splits
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

## 🧪 Development

### Backend Development

#### Running Tests
```bash
cd splitwise-backend
cargo test
```

#### Database Migrations
```bash
# Create a new migration
cargo sqlx migrate add migration_name

# Run migrations
cargo sqlx migrate run

# Revert last migration
cargo sqlx migrate revert
```

#### Code Quality
```bash
# Format code
cargo fmt

# Lint code
cargo clippy

# Check for security vulnerabilities
cargo audit
```

### Frontend Development

#### Development Commands
```bash
cd splitwise-frontend

# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Build for production
expo build:android
expo build:ios
```

#### Code Quality
```bash
# Install ESLint (if not already configured)
npm install --save-dev eslint @babel/core

# Run linting
npx eslint .
```

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | `8080` |
| `HOST` | Server host | `127.0.0.1` |
| `RUST_LOG` | Logging level | `info` |

### Frontend Configuration

The frontend uses environment variables for API configuration. Create a `.env` file in `splitwise-frontend/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_APP_NAME=Splitwise Clone
```

## 🚀 Deployment

### Backend Deployment

#### Docker Deployment
```dockerfile
FROM rust:1.70 as builder
WORKDIR /usr/src/app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/src/app/target/release/splitwise-backend /usr/local/bin/
CMD ["splitwise-backend"]
```

#### Manual Deployment
```bash
# Build for production
cargo build --release

# Set environment variables
export DATABASE_URL="your-production-db-url"
export JWT_SECRET="your-production-secret"

# Run the application
./target/release/splitwise-backend
```

### Frontend Deployment

#### Expo Build
```bash
# Build for app stores
expo build:android
expo build:ios

# Build for web
expo build:web
```

#### Web Deployment
```bash
# Build for web
expo build:web

# Deploy to any static hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow Rust coding conventions for backend code
- Use React Native best practices for frontend code
- Write tests for new functionality
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**Database Connection Failed**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify connection string
node db-check.js
```

**Migration Errors**
```bash
# Reset database
node recreate-tables.js

# Run migrations again
cargo sqlx migrate run
```

#### Frontend Issues

**Expo Build Fails**
```bash
# Clear cache
expo r -c

# Reset Metro bundler
npx react-native start --reset-cache
```

**API Connection Issues**
- Verify backend is running on correct port
- Check CORS configuration
- Ensure API URL is correct in environment variables

### Debug Mode

#### Backend Debug
```bash
# Enable debug logging
export RUST_LOG=debug
cargo run
```

#### Frontend Debug
```bash
# Enable React Native debugger
# Install React Native Debugger and run:
react-native-debugger
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Splitwise](https://splitwise.com/)
- Built with [Actix-web](https://actix.rs/) and [React Native](https://reactnative.dev/)
- Icons from [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Happy expense splitting! 💰** 
