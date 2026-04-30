const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BASE = process.env.BACKEND_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: BASE, timeout: 10000, validateStatus: () => true });

let results = [];
let userToken = '';
let adminToken = '';
let userId = '';
let taskId = '';
let withdrawalId = '';
let completionId = '';
let testEmail = `test_${Date.now()}@zenox.test`;
let uniqueName = `Test User ${Date.now()}`;
const tmpImagePath = path.join(__dirname, 'test-screenshot.png');

// Minimal valid PNG (1x1 pixel)
const PNG_BUFFER = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
  0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82,
]);

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: 'PASS' });
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err.message });
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function log(msg, color = '') {
  const colors = { green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', blue: '\x1b[34m', reset: '\x1b[0m' };
  process.stdout.write(`${colors[color] || ''}${msg}${colors.reset}`);
}

async function run() {
  // Write test image
  fs.writeFileSync(tmpImagePath, PNG_BUFFER);

  log('\n🧪 Running Zenox API Tests...\n\n', 'blue');

  // ========== AUTH ==========
  log('📦 AUTH\n', 'blue');

  await test('POST /auth/register', async () => {
    const res = await api.post('/auth/register', {
      name: uniqueName,
      email: testEmail,
      phone: `9${Math.floor(Math.random() * 1000000000)}`,
      profession: 'Student',
      password: 'Test@12345',
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.success, 'Expected success=true');
    userId = res.data.data.user.id;
  });

  await test('POST /auth/login', async () => {
    const res = await api.post('/auth/login', { email: testEmail, password: 'Test@12345' });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    userToken = res.data.data.accessToken;
    assert(userToken, 'Missing access token');
  });

  await test('GET /auth/me', async () => {
    const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.data.user.email === testEmail, 'Email mismatch');
  });

  await test('POST /auth/login (wrong password)', async () => {
    const res = await api.post('/auth/login', { email: testEmail, password: 'WrongPassword' });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('POST /auth/logout', async () => {
    const res = await api.post('/auth/logout');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  // ========== ADMIN ==========
  log('\n📦 ADMIN\n', 'blue');

  await test('POST /auth/login (admin)', async () => {
    const res = await api.post('/auth/login', { email: 'admin@zenox.com', password: 'Admin@12345' });
    assert(res.status === 200, `Admin login failed: ${res.status}: ${JSON.stringify(res.data)}`);
    adminToken = res.data.data.accessToken;
  });

  await test('POST /admin/tasks (create)', async () => {
    const res = await api.post('/admin/tasks', {
      title: 'API Test Task',
      category: 'YouTube',
      description: 'Test task created by API test.',
      rewardAmount: 50,
      imageUrl: 'https://via.placeholder.com/600x400',
      taskUrl: 'https://example.com',
      isActive: true,
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    taskId = res.data.data.task.id;
  });

  await test('GET /admin/tasks', async () => {
    const res = await api.get('/admin/tasks', { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data.data.tasks), 'Expected tasks array');
  });

  await test('GET /admin/users', async () => {
    const res = await api.get('/admin/users', { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data.data.users), 'Expected users array');
  });

  await test('GET /admin/dashboard', async () => {
    const res = await api.get('/admin/dashboard', { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.data.stats, 'Missing stats');
  });

  await test('GET /admin/withdrawals', async () => {
    const res = await api.get('/admin/withdrawals', { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('GET /admin/completions', async () => {
    const res = await api.get('/admin/completions', { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  // ========== USER ==========
  log('\n📦 USER\n', 'blue');

  await test('GET /user/dashboard', async () => {
    const res = await api.get('/user/dashboard', { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.data.stats, 'Missing stats');
  });

  await test('GET /user/tasks', async () => {
    const res = await api.get('/user/tasks', { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data.data.tasks), 'Expected tasks array');
  });

  await test('GET /user/tasks/:id', async () => {
    const res = await api.get(`/user/tasks/${taskId}`, { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.data.task.id === taskId, 'Task ID mismatch');
  });

  await test('POST /user/tasks/:id/start', async () => {
    const res = await api.post(`/user/tasks/${taskId}/start`, {}, { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.data.redirectUrl, 'Missing redirectUrl');
  });

  // Wait 1.5s so the 1-minute check... actually let me check - the backend requires 1 minute wait.
  // For testing, I'll just check the error is the right one.
  await test('POST /user/tasks/:id/complete (too soon)', async () => {
    const form = new FormData();
    form.append('screenshot', fs.createReadStream(tmpImagePath));
    const res = await api.post(`/user/tasks/${taskId}/complete`, form, {
      headers: { Authorization: `Bearer ${userToken}`, ...form.getHeaders() },
    });
    // Expected: 400 (wait at least 1 minute)
    assert(res.status === 400, `Expected 400 (wait time), got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.message.includes('wait'), `Wrong error: ${res.data.message}`);
  });

  await test('POST /user/withdrawals (JSON, no proof)', async () => {
    const res = await api.post('/user/withdrawals', {
      upiId: 'test@okaxis',
      amount: 10,
    }, { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    if (res.data.data?.id) withdrawalId = res.data.data.id;
  });

  await test('GET /user/history', async () => {
    const res = await api.get('/user/history', { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('GET /user/wallet', async () => {
    const res = await api.get('/user/wallet', { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.data.wallet, 'Missing wallet');
  });

  await test('GET /user/settings', async () => {
    const res = await api.get('/user/settings', { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('PATCH /user/settings', async () => {
    const res = await api.patch('/user/settings', {
      notifyEmail: false,
      notifyPush: true,
      profilePublic: false,
    }, { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('PATCH /user/profile', async () => {
    const res = await api.patch('/user/profile', { name: 'Updated Name' }, { headers: { Authorization: `Bearer ${userToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.data.user.name === 'Updated Name', 'Name not updated');
  });

  // ========== ADMIN REVIEW ==========
  log('\n📦 ADMIN REVIEW\n', 'blue');

  if (withdrawalId) {
    await test('PATCH /admin/withdrawals/:id (APPROVE)', async () => {
      const res = await api.patch(`/admin/withdrawals/${withdrawalId}`, {
        status: 'APPROVED',
        adminNote: 'Approved by test',
      }, { headers: { Authorization: `Bearer ${adminToken}` } });
      assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    });
  } else {
    log('  ⚠️  No withdrawal to approve, skipping\n', 'yellow');
  }

  await test('GET /admin/completions (find pending)', async () => {
    const res = await api.get('/admin/completions', { headers: { Authorization: `Bearer ${adminToken}` } });
    const pending = res.data.data.completions.find(c => c.review_status === 'PENDING');
    if (pending) completionId = pending.id;
  });

  if (completionId) {
    await test('PATCH /admin/completions/:id (APPROVE)', async () => {
      const res = await api.patch(`/admin/completions/${completionId}`, {
        reviewStatus: 'APPROVED',
        adminNote: 'Approved by test',
      }, { headers: { Authorization: `Bearer ${adminToken}` } });
      assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    });
  } else {
    log('  ⚠️  No pending completion to approve, skipping\n', 'yellow');
  }

  // ========== ADMIN TASK MANAGEMENT ==========
  log('\n📦 ADMIN TASK CRUD\n', 'blue');

  await test('PATCH /admin/tasks/:id (update)', async () => {
    const res = await api.patch(`/admin/tasks/${taskId}`, { title: 'Updated Test' }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
  });

  await test('DELETE /admin/tasks/:id', async () => {
    const res = await api.delete(`/admin/tasks/${taskId}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('PATCH /admin/users/:id/status (block)', async () => {
    const res = await api.patch(`/admin/users/${userId}/status`, { status: 'BLOCKED' }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
  });

  await test('PATCH /admin/users/:id/status (activate)', async () => {
    const res = await api.patch(`/admin/users/${userId}/status`, { status: 'ACTIVE' }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
  });

  // ========== UNAUTHORIZED TESTS ==========
  log('\n📦 AUTH GUARDS\n', 'blue');

  await test('GET /user/dashboard (no token)', async () => {
    const res = await api.get('/user/dashboard');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('GET /admin/dashboard (no token)', async () => {
    const res = await api.get('/admin/dashboard');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  // ========== HEALTH ==========
  await test('GET /health', async () => {
    const res = await api.get('/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  // ========== CLEANUP ==========
  fs.unlinkSync(tmpImagePath);

  // ========== RESULTS ==========
  log('\n' + '='.repeat(60) + '\n', 'blue');
  log('📊 TEST RESULTS\n', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  let passed = 0, failed = 0;
  results.forEach(r => {
    if (r.status === 'PASS') { passed++; log(`✅ PASS  ${r.name}\n`, 'green'); }
    else { failed++; log(`❌ FAIL  ${r.name}\n`, 'red'); if (r.error) log(`       └─ ${r.error}\n`, 'red'); }
  });

  log('\n' + '='.repeat(60) + '\n', 'blue');
  log(`✅ Passed: ${passed}/${results.length}  |  ❌ Failed: ${failed}/${results.length}\n`, passed === results.length ? 'green' : 'red');
  log('='.repeat(60) + '\n', 'blue');

  if (failed > 0) process.exit(1);
}

run().catch(err => { console.error('Runner error:', err.message); process.exit(1); });
