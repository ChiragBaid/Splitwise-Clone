const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

async function checkApiHealth() {
  try {
    // Try a health endpoint if available
    const health = await axios.get(`${API_BASE_URL}/health`).catch(() => null);
    if (health && health.status === 200) {
      console.log('✅ Backend /api/health endpoint: OK');
    } else {
      console.log('ℹ️  /api/health endpoint not found or not OK');
    }
  } catch (err) {
    console.error('❌ Error checking /api/health:', err.message);
  }
}

async function checkUsersEndpoint() {
  try {
    const res = await axios.get(`${API_BASE_URL}/users`).catch(() => null);
    if (res && res.status === 200) {
      console.log('✅ /api/users endpoint: OK');
    } else {
      console.log('❌ /api/users endpoint not responding as expected');
    }
  } catch (err) {
    console.error('❌ Error checking /api/users:', err.message);
  }
}

async function checkDbViaBackend() {
  try {
    // This assumes /api/users or /api/groups will fail if DB is down
    const res = await axios.get(`${API_BASE_URL}/groups`).catch(() => null);
    if (res && res.status === 200) {
      console.log('✅ Database connection (via /api/groups): OK');
    } else {
      console.log('❌ Database connection (via /api/groups) failed or endpoint not OK');
    }
  } catch (err) {
    console.error('❌ Error checking DB via /api/groups:', err.message);
  }
}

async function main() {
  console.log('--- Splitwise Backend Health Check ---');
  await checkApiHealth();
  await checkUsersEndpoint();
  await checkDbViaBackend();
  console.log('--------------------------------------');
}

main(); 