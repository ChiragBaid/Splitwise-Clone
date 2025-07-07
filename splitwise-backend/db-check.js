const { Client } = require('pg');

// Database configuration - updated for port 9357 and database splitwisedb
const dbConfig = {
  host: 'localhost',
  port: 9357,
  database: 'splitwisedb',
  user: 'splitwise',
  password: 'splitwise123',
};

async function checkDatabaseConnection() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔍 Testing PostgreSQL connection...');
    await client.connect();
    console.log('✅ Database connection: SUCCESS');
    
    // Check if we can query the database
    const result = await client.query('SELECT version()');
    console.log('✅ Database query test: SUCCESS');
    console.log(`📊 PostgreSQL version: ${result.rows[0].version.split(' ')[1]}`);
    
    // Check if required tables exist
    await checkTables(client);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Make sure PostgreSQL is running');
      console.log('   - Check if the port 5432 is correct');
      console.log('   - Verify the host address');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed:');
      console.log('   - Check username and password');
      console.log('   - Verify database user exists');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('   - Create the database: CREATE DATABASE splitwise_db;');
      console.log('   - Or check the database name in config');
    }
  } finally {
    await client.end();
  }
}

async function checkTables(client) {
  try {
    console.log('\n🔍 Checking for required tables...');
    
    // Query to get all tables in the database
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const result = await client.query(tablesQuery);
    const tables = result.rows.map(row => row.table_name);
    
    console.log(`📋 Found ${tables.length} tables in database:`);
    tables.forEach(table => {
      console.log(`   - ${table}`);
    });
    
    // Check for specific required tables
    const requiredTables = ['users', 'groups', 'expenses', 'splits'];
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables found!');
    } else {
      console.log('⚠️  Missing required tables:');
      missingTables.forEach(table => {
        console.log(`   - ${table}`);
      });
      console.log('\n💡 Run database migrations to create missing tables');
    }
    
    // Check table row counts
    console.log('\n📊 Table row counts:');
    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`   - ${table}: ${countResult.rows[0].count} rows`);
      } catch (error) {
        console.log(`   - ${table}: Error counting rows (${error.message})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  }
}

async function testDatabaseOperations() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('\n🧪 Testing basic database operations...');
    
    // First check if users table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('ℹ️  Users table does not exist yet - skipping operations test');
      console.log('💡 Run database migrations first: cargo run');
      return;
    }
    
    // Test INSERT
    const insertResult = await client.query(`
      INSERT INTO users (email, name, password_hash) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (email) DO NOTHING 
      RETURNING id
    `, ['test@example.com', 'Test User', 'hashed_password']);
    
    if (insertResult.rows.length > 0) {
      console.log('✅ INSERT operation: SUCCESS');
      
      // Test SELECT
      const selectResult = await client.query('SELECT * FROM users WHERE email = $1', ['test@example.com']);
      console.log('✅ SELECT operation: SUCCESS');
      
      // Test UPDATE
      await client.query('UPDATE users SET name = $1 WHERE email = $2', ['Updated User', 'test@example.com']);
      console.log('✅ UPDATE operation: SUCCESS');
      
      // Test DELETE
      await client.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
      console.log('✅ DELETE operation: SUCCESS');
    } else {
      console.log('ℹ️  INSERT operation: Skipped (user already exists)');
    }
    
  } catch (error) {
    console.error('❌ Database operations test failed:', error.message);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('=== PostgreSQL Database Health Check ===\n');
  
  await checkDatabaseConnection();
  await testDatabaseOperations();
  
  console.log('\n=== Health Check Complete ===');
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n👋 Health check interrupted');
  process.exit(0);
});

main().catch(error => {
  console.error('❌ Health check failed:', error);
  process.exit(1);
}); 