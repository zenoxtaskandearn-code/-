const axios = require("axios");
const FormData = require("form-data");

const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

// Test credentials
const TEST_USER = {
  name: "Test User",
  email: `testuser_${Date.now()}@test.com`,
  phone: `987654321${Math.floor(Math.random() * 10)}`,
  profession: "Student",
  password: "Test@12345",
};

const ADMIN_CREDS = {
  email: process.env.ADMIN_EMAIL || "admin@zenox.com",
  password: process.env.ADMIN_PASSWORD || "Admin@12345",
};

// Store tokens and IDs across tests
const state = {
  userAccessToken: null,
  adminAccessToken: null,
  userId: null,
  taskId: null,
  completionId: null,
  withdrawalId: null,
};

let passed = 0;
let failed = 0;

function log(step, message, color = "\x1b[36m") {
  console.log(`\n${color}[${step}]\x1b[0m ${message}`);
}

function success(message) {
  console.log(`\x1b[32m✅ PASS:\x1b[0m ${message}`);
  passed++;
}

function fail(message, error) {
  console.log(`\x1b[31m❌ FAIL:\x1b[0m ${message}`);
  if (error) {
    console.log(
      `\x1b[31m   Error:\x1b[0m ${error.response?.data?.message || error.message}`
    );
  }
  failed++;
}

async function testRegister() {
  log("1", "Register new user");
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, TEST_USER);
    state.userAccessToken = res.data.data.accessToken;
    state.userId = res.data.data.user.id;
    success(
      `User registered: ${res.data.data.user.name} (${res.data.data.user.email})`
    );
  } catch (error) {
    fail("User registration", error);
  }
}

async function testLoginUser() {
  log("2", "Login as user");
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    state.userAccessToken = res.data.data.accessToken;
    success(`User logged in: ${res.data.data.user.email}`);
  } catch (error) {
    fail("User login", error);
  }
}

async function testLoginAdmin() {
  log("3", "Login as admin");
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, ADMIN_CREDS);
    state.adminAccessToken = res.data.data.accessToken;
    success(`Admin logged in: ${res.data.data.user.email}`);
  } catch (error) {
    fail("Admin login", error);
  }
}

async function testAdminCreateTask() {
  log("4", "Admin creates a task");
  try {
    const res = await axios.post(
      `${BASE_URL}/admin/tasks`,
      {
        title: "Test Task - YouTube Subscribe",
        category: "YouTube",
        description: "Subscribe to our YouTube channel and like the latest video.",
        rewardAmount: 15.0,
        imageUrl: "https://via.placeholder.com/150",
        taskUrl: "https://youtube.com/@testchannel",
        isActive: true,
      },
      {
        headers: { Authorization: `Bearer ${state.adminAccessToken}` },
      }
    );
    state.taskId = res.data.data.task.id;
    success(`Task created: "${res.data.data.task.title}" (Reward: ₹${res.data.data.task.reward_amount})`);
  } catch (error) {
    fail("Create task", error);
  }
}

async function testUserStartTask() {
  log("5", "User starts the task");
  try {
    const res = await axios.post(
      `${BASE_URL}/user/tasks/${state.taskId}/start`,
      {},
      {
        headers: { Authorization: `Bearer ${state.userAccessToken}` },
      }
    );
    success(`Task started. Redirect URL: ${res.data.data.redirectUrl}`);
  } catch (error) {
    fail("Start task", error);
  }
}

async function testUserCompleteTask() {
  log("6", "User completes task with screenshot");
  console.log("\x1b[33m   ⏳ Waiting 60 seconds (minimum time requirement)...\x1b[0m");
  await new Promise((resolve) => setTimeout(resolve, 61000));

  try {
    // Create a minimal PNG file (1x1 pixel transparent PNG)
    // PNG signature + IHDR + IDAT + IEND chunks
    const pngBuffer = Buffer.from(
      "89504e470d0a1a0a0000000d4948445200000001000000010100000000376ef9240000000c4944415408d763f80f00000101000518d84e0000000049454e44ae426082",
      "hex"
    );

    const form = new FormData();
    form.append("screenshot", pngBuffer, {
      filename: "test-screenshot.png",
      contentType: "image/png",
    });

    const res = await axios.post(
      `${BASE_URL}/user/tasks/${state.taskId}/complete`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${state.userAccessToken}`,
        },
      }
    );
    success(`Task completion submitted: ${res.data.message}`);
  } catch (error) {
    fail("Complete task", error);
  }
}

async function testAdminListCompletions() {
  log("7", "Admin lists pending completions");
  try {
    const res = await axios.get(`${BASE_URL}/admin/completions?status=PENDING`, {
      headers: { Authorization: `Bearer ${state.adminAccessToken}` },
    });
    const completions = res.data.data.completions;
    console.log(`   Found ${completions.length} pending completion(s)`);
    if (completions.length > 0) {
      state.completionId = completions[0].id;
      success(`Completion ID: ${completions[0].id} (Task: ${completions[0].title})`);
    } else {
      fail("No pending completions found");
    }
  } catch (error) {
    fail("List completions", error);
  }
}

async function testAdminApproveCompletion() {
  log("8", "Admin approves task completion");
  try {
    const res = await axios.patch(
      `${BASE_URL}/admin/completions/${state.completionId}`,
      { reviewStatus: "APPROVED", adminNote: "Looks good!" },
      {
        headers: { Authorization: `Bearer ${state.adminAccessToken}` },
      }
    );
    success(`Completion approved: ${res.data.message}`);
  } catch (error) {
    fail("Approve completion", error);
  }
}

async function testUserWalletBalance() {
  log("9", "User checks wallet balance (should have reward)");
  try {
    const res = await axios.get(`${BASE_URL}/user/wallet`, {
      headers: { Authorization: `Bearer ${state.userAccessToken}` },
    });
    const wallet = res.data.data.wallet;
    const balance = Number(wallet.balance);
    success(
      `Wallet Balance: ₹${balance} | Total Earned: ₹${wallet.total_earned} | Total Withdrawn: ₹${wallet.total_withdrawn}`
    );
    return balance;
  } catch (error) {
    fail("Wallet balance check", error);
    return 0;
  }
}

async function testUserWithdrawal() {
  log("10", "User creates withdrawal request");
  try {
    const res = await axios.post(
      `${BASE_URL}/user/withdrawals`,
      { amount: 10, upiId: "test@upi" },
      {
        headers: { Authorization: `Bearer ${state.userAccessToken}` },
      }
    );
    state.withdrawalId = res.data.data.id;
    success(
      `Withdrawal requested: ₹${res.data.data.amount} to ${res.data.data.upi_id}`
    );
  } catch (error) {
    fail("Withdrawal request", error);
  }
}

async function testAdminListWithdrawals() {
  log("11", "Admin lists pending withdrawals");
  try {
    const res = await axios.get(`${BASE_URL}/admin/withdrawals?status=PENDING`, {
      headers: { Authorization: `Bearer ${state.adminAccessToken}` },
    });
    const withdrawals = res.data.data.withdrawals;
    console.log(`   Found ${withdrawals.length} pending withdrawal(s)`);
    if (withdrawals.length > 0) {
      state.withdrawalId = withdrawals[0].id;
      success(
        `Withdrawal ID: ${withdrawals[0].id} (₹${withdrawals[0].amount} to ${withdrawals[0].upi_id})`
      );
    } else {
      fail("No pending withdrawals found");
    }
  } catch (error) {
    fail("List withdrawals", error);
  }
}

async function testAdminApproveWithdrawal() {
  log("12", "Admin approves withdrawal");
  try {
    const res = await axios.patch(
      `${BASE_URL}/admin/withdrawals/${state.withdrawalId}`,
      { status: "APPROVED", adminNote: "Payment processed" },
      {
        headers: { Authorization: `Bearer ${state.adminAccessToken}` },
      }
    );
    success(`Withdrawal status updated: ${res.data.data.status}`);
  } catch (error) {
    fail("Approve withdrawal", error);
  }
}

async function testUserDashboard() {
  log("13", "User checks dashboard");
  try {
    const res = await axios.get(`${BASE_URL}/user/dashboard`, {
      headers: { Authorization: `Bearer ${state.userAccessToken}` },
    });
    const stats = res.data.data.stats;
    success(
      `Dashboard stats: Balance ₹${stats.walletBalance}, Earned ₹${stats.totalEarned}, Completed ${stats.totalTasksCompleted} tasks`
    );
  } catch (error) {
    fail("Dashboard check", error);
  }
}

async function testAdminDashboard() {
  log("14", "Admin checks dashboard");
  try {
    const res = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${state.adminAccessToken}` },
    });
    const stats = res.data.data.stats;
    success(
      `Admin stats: Due ₹${stats.totalDuePayments}, Pending ${stats.totalPendingRequests}, Users ${stats.totalUsers}`
    );
  } catch (error) {
    fail("Admin dashboard check", error);
  }
}

async function runTests() {
  console.log("\x1b[1;33m");
  console.log("╔══════════════════════════════════════════╗");
  console.log("║     ZENOX API - COMPREHENSIVE TEST       ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("\x1b[0m");
  console.log(`Base URL: ${BASE_URL}\n`);

  // Auth flow
  await testRegister();
  await testLoginUser();
  await testLoginAdmin();

  // Admin creates task
  await testAdminCreateTask();

  // User task flow
  await testUserStartTask();
  await testUserCompleteTask(); // This will wait 60 seconds

  // Admin review flow
  await testAdminListCompletions();
  await testAdminApproveCompletion();

  // Wallet & withdrawal flow
  await testUserWalletBalance();
  await testUserWithdrawal();

  // Admin withdrawal review
  await testAdminListWithdrawals();
  await testAdminApproveWithdrawal();

  // Dashboard checks
  await testUserDashboard();
  await testAdminDashboard();

  // Summary
  console.log("\n\x1b[1;33m");
  console.log("╔══════════════════════════════════════════╗");
  console.log("║              TEST SUMMARY                ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("\x1b[0m");
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  console.log(`Total:  ${passed + failed}`);

  if (failed === 0) {
    console.log("\n\x1b[32m🎉 ALL TESTS PASSED!\x1b[0m\n");
  } else {
    console.log("\n\x1b[31m⚠️  SOME TESTS FAILED\x1b[0m\n");
  }
}

runTests().catch((error) => {
  console.error("\x1b[31mFatal error:\x1b[0m", error.message);
  process.exit(1);
});
