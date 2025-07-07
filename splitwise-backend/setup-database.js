const { Client } = require('pg');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Database configuration - updated for port 9357 and database splitwisedb
const dbConfig = {
  host: 'localhost',
  port: 9357,
  database: 'splitwisedb',
  user: 'splitwise',
  password: 'splitwise123',
};

async function checkPostgreSQLInstallation() {
  console.log('🔍 Checking PostgreSQL installation...\n');
  
  try {
    // Check if psql is available
    const psqlVersion = execSync('psql --version', { encoding: 'utf8' });
    console.log('✅ PostgreSQL client found:', psqlVersion.trim());
    
    // Check if PostgreSQL service is running
    try {
      const serviceStatus = execSync('pg_ctl status -D /usr/local/var/postgres', { encoding: 'utf8' });
      console.log('✅ PostgreSQL service status:', serviceStatus.trim());
    } catch (error) {
      console.log('⚠️  PostgreSQL service not running or not found');
    }
    
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL not found in PATH');
    return false;
  }
}

function provideInstallationInstructions() {
  console.log('\n📋 PostgreSQL Installation Instructions:\n');
  
  console.log('=== Option 1: Docker (Recommended) ===');
  console.log('1. Install Docker Desktop from https://www.docker.com/products/docker-desktop');
  console.log('2. Run the following command:');
  console.log('   docker run --name splitwise-postgres -e POSTGRES_DB=splitwisedb -e POSTGRES_USER=splitwise -e POSTGRES_PASSWORD=splitwise123 -p 9357:5432 -d postgres:15');
  console.log('3. To start the container later: docker start splitwise-postgres');
  console.log('4. To stop the container: docker stop splitwise-postgres');
  
  console.log('\n=== Option 2: Windows Installation ===');
  console.log('1. Download PostgreSQL from https://www.postgresql.org/download/windows/');
  console.log('2. Run the installer and follow the setup wizard');
  console.log('3. Set password for postgres user');
  console.log('4. Add PostgreSQL bin directory to PATH');
  console.log('5. Create database and user:');
  console.log('   - Open pgAdmin or psql');
  console.log('   - CREATE DATABASE splitwisedb;');
  console.log('   - CREATE USER splitwise WITH PASSWORD \'splitwise123\';');
  console.log('   - GRANT ALL PRIVILEGES ON DATABASE splitwisedb TO splitwise;');
  
  console.log('\n=== Option 3: macOS with Homebrew ===');
  console.log('1. Install Homebrew if not already installed');
  console.log('2. Run: brew install postgresql@15');
  console.log('3. Start PostgreSQL: brew services start postgresql@15');
  console.log('4. Create database and user (same as Windows)');
  
  console.log('\n=== Option 4: Linux (Ubuntu/Debian) ===');
  console.log('1. sudo apt update');
  console.log('2. sudo apt install postgresql postgresql-contrib');
  console.log('3. sudo systemctl start postgresql');
  console.log('4. sudo systemctl enable postgresql');
  console.log('5. Create database and user (same as Windows)');
}

async function setupDatabaseWithDocker() {
  console.log('\n🐳 Setting up PostgreSQL with Docker...\n');
  
  try {
    // Check if Docker is available
    execSync('docker --version', { encoding: 'utf8' });
    console.log('✅ Docker found');
    
    // Check if container already exists
    try {
      const containerExists = execSync('docker ps -a --filter "name=splitwise-postgres" --format "{{.Names}}"', { encoding: 'utf8' });
      if (containerExists.trim() === 'splitwise-postgres') {
        console.log('📦 Container already exists, starting it...');
        execSync('docker start splitwise-postgres', { encoding: 'utf8' });
        console.log('✅ Container started');
      } else {
        console.log('📦 Creating new PostgreSQL container...');
        execSync('docker run --name splitwise-postgres -e POSTGRES_DB=splitwisedb -e POSTGRES_USER=splitwise -e POSTGRES_PASSWORD=splitwise123 -p 9357:5432 -d postgres:15', { encoding: 'utf8' });
        console.log('✅ Container created and started');
        console.log('⏳ Waiting for PostgreSQL to be ready...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      return true;
    } catch (error) {
      console.error('❌ Docker setup failed:', error.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Docker not found. Please install Docker Desktop first.');
    return false;
  }
}

async function createDatabaseSchema() {
  console.log('\n🏗️  Creating database schema...\n');
  
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Read and execute migration file
    const migrationPath = path.join(__dirname, 'src', 'db', 'migrations', '20240101000001_initial_schema.sql');
    
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      await client.query(migrationSQL);
      console.log('✅ Database schema created successfully');
    } else {
      console.log('⚠️  Migration file not found, creating schema from schema.rs definitions...');
      
      // Create schema based on the schema.rs definitions
      const schemaSQL = `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create groups table
        CREATE TABLE IF NOT EXISTS groups (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_by UUID NOT NULL REFERENCES users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create group_members table
        CREATE TABLE IF NOT EXISTS group_members (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            role VARCHAR(50) NOT NULL DEFAULT 'member',
            joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(group_id, user_id)
        );

        -- Create expenses table
        CREATE TABLE IF NOT EXISTS expenses (
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

        -- Create splits table
        CREATE TABLE IF NOT EXISTS splits (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id),
            amount DECIMAL(10,2) NOT NULL,
            is_settled BOOLEAN DEFAULT FALSE,
            settled_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by);
        CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
        CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
        CREATE INDEX IF NOT EXISTS idx_expenses_group_id ON expenses(group_id);
        CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
        CREATE INDEX IF NOT EXISTS idx_splits_expense_id ON splits(expense_id);
        CREATE INDEX IF NOT EXISTS idx_splits_user_id ON splits(user_id);
      `;
      
      await client.query(schemaSQL);
      console.log('✅ Database schema created successfully');
    }
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('=== Splitwise Database Setup ===\n');
  
  const pgInstalled = await checkPostgreSQLInstallation();
  
  if (!pgInstalled) {
    provideInstallationInstructions();
    return;
  }
  
  // Try to connect to database
  const client = new Client(dbConfig);
  try {
    await client.connect();
    console.log('✅ Database connection successful!');
    await client.end();
    
    // Create schema
    await createDatabaseSchema();
    
    console.log('\n🎉 Database setup complete!');
    console.log('You can now run the health check: node db-check.js');
    
  } catch (error) {
    console.log('\n❌ Database connection failed');
    console.log('Attempting to set up with Docker...\n');
    
    const dockerSuccess = await setupDatabaseWithDocker();
    if (dockerSuccess) {
      console.log('\n⏳ Waiting for database to be ready...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        await client.connect();
        console.log('✅ Database connection successful after Docker setup!');
        await client.end();
        
        await createDatabaseSchema();
        console.log('\n🎉 Database setup complete!');
        
      } catch (finalError) {
        console.error('❌ Final connection attempt failed:', finalError.message);
        console.log('\n💡 Please check:');
        console.log('   - Docker is running');
        console.log('   - Port 5432 is not blocked');
        console.log('   - Firewall settings');
      }
    } else {
      console.log('\n💡 Please follow the installation instructions above');
    }
  }
}

main().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
}); 