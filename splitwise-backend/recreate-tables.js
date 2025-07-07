const { Client } = require('pg');

// Database configuration matching the backend
const dbConfig = {
  host: 'localhost',
  port: 9357,
  database: 'splitwisedb',
  user: 'splitwise',
  password: 'splitwise123',
};

async function recreateTables() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');
    
    console.log('\n🗑️  Dropping existing tables...');
    
    // Drop tables in reverse dependency order
    const dropQueries = [
      'DROP TABLE IF EXISTS splits CASCADE;',
      'DROP TABLE IF EXISTS expenses CASCADE;',
      'DROP TABLE IF EXISTS group_members CASCADE;',
      'DROP TABLE IF EXISTS groups CASCADE;',
      'DROP TABLE IF EXISTS users CASCADE;',
    ];
    
    for (const query of dropQueries) {
      await client.query(query);
    }
    console.log('✅ Existing tables dropped');
    
    console.log('\n🏗️  Creating new schema...');
    
    // Create schema based on the backend requirements
    const createSchemaSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create users table
      CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create groups table
      CREATE TABLE groups (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_by UUID NOT NULL REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create group_members table
      CREATE TABLE group_members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) NOT NULL DEFAULT 'member',
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(group_id, user_id)
      );

      -- Create expenses table
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

      -- Create splits table
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
    `;
    
    await client.query(createSchemaSQL);
    console.log('✅ Tables created successfully');
    
    console.log('\n📊 Creating indexes...');
    
    // Create indexes for better performance
    const indexQueries = [
      'CREATE INDEX idx_users_email ON users(email);',
      'CREATE INDEX idx_groups_created_by ON groups(created_by);',
      'CREATE INDEX idx_group_members_group_id ON group_members(group_id);',
      'CREATE INDEX idx_group_members_user_id ON group_members(user_id);',
      'CREATE INDEX idx_expenses_group_id ON expenses(group_id);',
      'CREATE INDEX idx_expenses_paid_by ON expenses(paid_by);',
      'CREATE INDEX idx_splits_expense_id ON splits(expense_id);',
      'CREATE INDEX idx_splits_user_id ON splits(user_id);',
    ];
    
    for (const query of indexQueries) {
      await client.query(query);
    }
    console.log('✅ Indexes created successfully');
    
    console.log('\n🔍 Verifying schema...');
    
    // Verify tables were created
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const result = await client.query(tablesQuery);
    const tables = result.rows.map(row => row.table_name);
    
    console.log('📋 Created tables:');
    tables.forEach(table => {
      console.log(`   - ${table}`);
    });
    
    // Verify required tables exist
    const requiredTables = ['users', 'groups', 'group_members', 'expenses', 'splits'];
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables created successfully!');
    } else {
      console.log('❌ Missing tables:', missingTables);
    }
    
    console.log('\n🎉 Database schema recreation complete!');
    console.log('The database is now ready for the Splitwise backend.');
    
  } catch (error) {
    console.error('❌ Error recreating tables:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('=== Splitwise Database Schema Recreation ===\n');
  
  try {
    await recreateTables();
  } catch (error) {
    console.error('❌ Schema recreation failed:', error.message);
    process.exit(1);
  }
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n👋 Schema recreation interrupted');
  process.exit(0);
});

main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
}); 