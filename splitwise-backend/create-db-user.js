const { Client } = require('pg');

// Connect to PostgreSQL with your credentials
const adminConfig = {
  host: 'localhost',
  port: 9357,
  database: 'splitwisedb', // Your database name
  user: 'postgres',        // Default admin user
  password: 'Ch@140903',   // Your PostgreSQL password
};

async function createDatabaseAndUser() {
  console.log('🔧 Setting up database user for Splitwise...\n');
  
  const client = new Client(adminConfig);
  
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL as admin');
    
    // Create the user (database already exists)
    try {
      await client.query("CREATE USER splitwise WITH PASSWORD 'splitwise123'");
      console.log('✅ User "splitwise" created');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️  User "splitwise" already exists');
      } else {
        throw error;
      }
    }
    
    // Grant privileges
    await client.query('GRANT ALL PRIVILEGES ON DATABASE splitwisedb TO splitwise');
    console.log('✅ Privileges granted to user "splitwise"');
    
    // Grant schema privileges
    await client.query('GRANT ALL ON SCHEMA public TO splitwise');
    await client.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO splitwise');
    await client.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO splitwise');
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO splitwise');
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO splitwise');
    
    console.log('✅ Schema privileges granted');
    await client.end();
    
    console.log('\n🎉 Database setup complete!');
    console.log('You can now run: node db-check.js');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.code === '28P01') {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('   - Username and password are correct');
      console.log('   - Database name is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused. Please check:');
      console.log('   - PostgreSQL is running on port 9357');
      console.log('   - The port number is correct');
    }
  }
}

createDatabaseAndUser().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
}); 