const http = require("http");
const app = require("../app");
const env = require("../config/env");
const { pool } = require("../db/pool");

const tinyPngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9m6vM9kAAAAASUVORK5CYII=";

const ensure = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const makeRequest = async (baseUrl, method, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: options.headers,
    body: options.body,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (_error) {
    data = { raw: text };
  }

  return {
    status: response.status,
    data,
    headers: response.headers,
  };
};

const run = async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const stamp = Date.now();

  const user = {
    name: "Integration User",
    email: `user${stamp}@zenox.test`,
    phone: `9${String(stamp).slice(-9)}`,
    profession: "Tester",
    password: "User@Test123",
  };

  const adminLogin = {
    email: env.adminSeed.email,
    password: env.adminSeed.password,
  };

  const report = [];

  try {
    const health = await makeRequest(baseUrl, "GET", "/api/health");
    ensure(health.status === 200, "Health check failed");
    report.push("GET /api/health OK");

    const unauthorizedDashboard = await makeRequest(
      baseUrl,
      "GET",
      "/api/user/dashboard"
    );
    ensure(unauthorizedDashboard.status === 401, "Unauthorized guard failed");
    report.push("GET /api/user/dashboard unauthorized guard OK");

    const invalidRegister = await makeRequest(baseUrl, "POST", "/api/auth/register", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bademail" }),
    });
    ensure(invalidRegister.status === 400, "Register validation should fail");
    report.push("POST /api/auth/register validation guard OK");

    const register = await makeRequest(baseUrl, "POST", "/api/auth/register", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    ensure(register.status === 201, "User registration failed");
    const userToken = register.data?.data?.accessToken;
    ensure(userToken, "Missing user access token after register");
    const userCookie = register.headers.get("set-cookie") || "";
    ensure(userCookie.includes("refreshToken="), "Missing user refresh cookie");
    report.push("POST /api/auth/register OK");

    const duplicateRegister = await makeRequest(baseUrl, "POST", "/api/auth/register", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    ensure(duplicateRegister.status === 409, "Duplicate registration should fail");
    report.push("POST /api/auth/register duplicate guard OK");

    const login = await makeRequest(baseUrl, "POST", "/api/auth/login", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    ensure(login.status === 200, "User login failed");
    const userLoginToken = login.data?.data?.accessToken;
    ensure(userLoginToken, "Missing user access token after login");
    const userLoginCookie = login.headers.get("set-cookie") || "";
    ensure(userLoginCookie.includes("refreshToken="), "Missing login refresh cookie");
    report.push("POST /api/auth/login (user) OK");

    const me = await makeRequest(baseUrl, "GET", "/api/auth/me", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(me.status === 200, "GET /auth/me failed");
    report.push("GET /api/auth/me OK");

    const refresh = await makeRequest(baseUrl, "POST", "/api/auth/refresh", {
      headers: {
        "Content-Type": "application/json",
        Cookie: userLoginCookie,
      },
      body: JSON.stringify({}),
    });
    ensure(refresh.status === 200, "Refresh token failed");
    report.push("POST /api/auth/refresh OK");

    const userDashboard = await makeRequest(baseUrl, "GET", "/api/user/dashboard", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(userDashboard.status === 200, "User dashboard failed");
    report.push("GET /api/user/dashboard OK");

    const invalidTaskId = await makeRequest(baseUrl, "GET", "/api/user/tasks/not-a-uuid", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(invalidTaskId.status === 400, "Task UUID validation should fail");
    report.push("GET /api/user/tasks/:taskId validation guard OK");

    const adminAuth = await makeRequest(baseUrl, "POST", "/api/auth/login", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminLogin),
    });
    ensure(adminAuth.status === 200, "Admin login failed");
    const adminToken = adminAuth.data?.data?.accessToken;
    ensure(adminToken, "Missing admin token");
    report.push("POST /api/auth/login (admin) OK");

    const forbiddenAdminAccess = await makeRequest(baseUrl, "GET", "/api/admin/tasks", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(forbiddenAdminAccess.status === 403, "Role guard for admin route failed");
    report.push("GET /api/admin/tasks role guard OK");

    const createTask = await makeRequest(baseUrl, "POST", "/api/admin/tasks", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: `Install Demo App ${stamp}`,
        category: "APK",
        description: "Download the app, register account, and complete onboarding.",
        rewardAmount: 25,
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        taskUrl: "https://example.com/task/start",
        isActive: true,
      }),
    });
    ensure(createTask.status === 201, "Admin create task failed");
    const taskId = createTask.data?.data?.task?.id;
    ensure(taskId, "Task ID missing");
    report.push("POST /api/admin/tasks OK");

    const userTasks = await makeRequest(baseUrl, "GET", "/api/user/tasks", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(userTasks.status === 200, "User task list failed");
    report.push("GET /api/user/tasks OK");

    const userTaskDetail = await makeRequest(
      baseUrl,
      "GET",
      `/api/user/tasks/${taskId}`,
      {
        headers: { Authorization: `Bearer ${userLoginToken}` },
      }
    );
    ensure(userTaskDetail.status === 200, "User task detail failed");
    report.push("GET /api/user/tasks/:taskId OK");

    const startTask = await makeRequest(
      baseUrl,
      "POST",
      `/api/user/tasks/${taskId}/start`,
      {
        headers: { Authorization: `Bearer ${userLoginToken}` },
      }
    );
    ensure(startTask.status === 200, "Start task failed");
    report.push("POST /api/user/tasks/:taskId/start OK");

    const completeTask = await makeRequest(
      baseUrl,
      "POST",
      `/api/user/tasks/${taskId}/complete`,
      {
        headers: { Authorization: `Bearer ${userLoginToken}` },
      }
    );
    ensure(completeTask.status === 200, "Complete task failed");
    report.push("POST /api/user/tasks/:taskId/complete OK");

    const history = await makeRequest(baseUrl, "GET", "/api/user/history", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(history.status === 200, "History fetch failed");
    ensure(Array.isArray(history.data?.data?.history), "Invalid history response");
    report.push("GET /api/user/history OK");

    const walletBefore = await makeRequest(baseUrl, "GET", "/api/user/wallet", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(walletBefore.status === 200, "Wallet fetch failed");
    ensure(Number(walletBefore.data?.data?.wallet?.balance) >= 25, "Reward not credited");
    report.push("GET /api/user/wallet OK");

    const profileUpdate = await makeRequest(baseUrl, "PATCH", "/api/user/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userLoginToken}`,
      },
      body: JSON.stringify({ profession: "QA Specialist" }),
    });
    ensure(profileUpdate.status === 200, "Profile update failed");
    report.push("PATCH /api/user/profile OK");

    const settingsGet = await makeRequest(baseUrl, "GET", "/api/user/settings", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(settingsGet.status === 200, "Get settings failed");
    report.push("GET /api/user/settings OK");

    const settingsUpdate = await makeRequest(baseUrl, "PATCH", "/api/user/settings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userLoginToken}`,
      },
      body: JSON.stringify({
        notifyEmail: false,
        notifyPush: true,
        profilePublic: false,
      }),
    });
    ensure(settingsUpdate.status === 200, "Update settings failed");
    report.push("PATCH /api/user/settings OK");

    const imageBuffer = Buffer.from(tinyPngBase64, "base64");

    const upiForm = new FormData();
    upiForm.append("upiId", "tester@upi");
    upiForm.append("screenshot", new Blob([imageBuffer], { type: "image/png" }), "upi.png");

    const upiCreate = await makeRequest(baseUrl, "POST", "/api/user/upi-verifications", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
      body: upiForm,
    });
    ensure(upiCreate.status === 201, "Create UPI verification failed");
    const upiRequestId = upiCreate.data?.data?.id;
    ensure(upiRequestId, "UPI request id missing");
    report.push("POST /api/user/upi-verifications OK");

    const withdrawalWithoutScreenshot = await makeRequest(
      baseUrl,
      "POST",
      "/api/user/withdrawals",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userLoginToken}`,
        },
        body: JSON.stringify({ upiId: "tester@upi", amount: 5 }),
      }
    );
    ensure(
      withdrawalWithoutScreenshot.status === 400,
      "Withdrawal without screenshot should fail"
    );
    report.push("POST /api/user/withdrawals screenshot guard OK");

    const upiListUser = await makeRequest(baseUrl, "GET", "/api/user/upi-verifications", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
    });
    ensure(upiListUser.status === 200, "List user UPI verifications failed");
    report.push("GET /api/user/upi-verifications OK");

    const withdrawForm = new FormData();
    withdrawForm.append("upiId", "tester@upi");
    withdrawForm.append("amount", "10");
    withdrawForm.append(
      "screenshot",
      new Blob([imageBuffer], { type: "image/png" }),
      "withdraw.png"
    );

    const withdrawCreate = await makeRequest(baseUrl, "POST", "/api/user/withdrawals", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
      body: withdrawForm,
    });
    ensure(withdrawCreate.status === 201, "Create withdrawal request failed");
    const withdrawalId = withdrawCreate.data?.data?.id;
    ensure(withdrawalId, "Withdrawal id missing");
    report.push("POST /api/user/withdrawals OK");

    const overWithdrawForm = new FormData();
    overWithdrawForm.append("upiId", "tester@upi");
    overWithdrawForm.append("amount", "999999");
    overWithdrawForm.append(
      "screenshot",
      new Blob([imageBuffer], { type: "image/png" }),
      "over-withdraw.png"
    );

    const overWithdraw = await makeRequest(baseUrl, "POST", "/api/user/withdrawals", {
      headers: { Authorization: `Bearer ${userLoginToken}` },
      body: overWithdrawForm,
    });
    ensure(overWithdraw.status === 400, "Over-withdraw should fail");
    report.push("POST /api/user/withdrawals balance guard OK");

    const adminDashboard = await makeRequest(baseUrl, "GET", "/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    ensure(adminDashboard.status === 200, "Admin dashboard failed");
    report.push("GET /api/admin/dashboard OK");

    const adminWithdrawals = await makeRequest(baseUrl, "GET", "/api/admin/withdrawals", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    ensure(adminWithdrawals.status === 200, "Admin withdrawals list failed");
    report.push("GET /api/admin/withdrawals OK");

    const withdrawalApprove = await makeRequest(
      baseUrl,
      "PATCH",
      `/api/admin/withdrawals/${withdrawalId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: "APPROVED", adminNote: "Approved in integration test" }),
      }
    );
    ensure(withdrawalApprove.status === 200, "Approve withdrawal failed");
    report.push("PATCH /api/admin/withdrawals/:id (APPROVED) OK");

    const withdrawalPaid = await makeRequest(
      baseUrl,
      "PATCH",
      `/api/admin/withdrawals/${withdrawalId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: "PAID", adminNote: "Paid in integration test" }),
      }
    );
    ensure(withdrawalPaid.status === 200, "Mark withdrawal paid failed");
    report.push("PATCH /api/admin/withdrawals/:id (PAID) OK");

    const adminUpiList = await makeRequest(baseUrl, "GET", "/api/admin/upi-verifications", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    ensure(adminUpiList.status === 200, "Admin UPI list failed");
    report.push("GET /api/admin/upi-verifications OK");

    const upiVerify = await makeRequest(
      baseUrl,
      "PATCH",
      `/api/admin/upi-verifications/${upiRequestId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: "VERIFIED", adminNote: "Verified in integration test" }),
      }
    );
    ensure(upiVerify.status === 200, "UPI verify failed");
    report.push("PATCH /api/admin/upi-verifications/:id OK");

    const adminUsers = await makeRequest(baseUrl, "GET", "/api/admin/users", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    ensure(adminUsers.status === 200, "Admin users list failed");
    const createdUser = adminUsers.data?.data?.users?.find((u) => u.email === user.email);
    ensure(createdUser, "Created user missing in admin list");
    report.push("GET /api/admin/users OK");

    const userBlock = await makeRequest(
      baseUrl,
      "PATCH",
      `/api/admin/users/${createdUser.id}/status`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: "BLOCKED" }),
      }
    );
    ensure(userBlock.status === 200, "Block user failed");
    report.push("PATCH /api/admin/users/:id/status (BLOCKED) OK");

    const userUnblock = await makeRequest(
      baseUrl,
      "PATCH",
      `/api/admin/users/${createdUser.id}/status`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: "ACTIVE" }),
      }
    );
    ensure(userUnblock.status === 200, "Unblock user failed");
    report.push("PATCH /api/admin/users/:id/status (ACTIVE) OK");

    const adminTasks = await makeRequest(baseUrl, "GET", "/api/admin/tasks", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    ensure(adminTasks.status === 200, "Admin tasks list failed");
    report.push("GET /api/admin/tasks OK");

    const updateTask = await makeRequest(baseUrl, "PATCH", `/api/admin/tasks/${taskId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ rewardAmount: 30, category: "REGISTER" }),
    });
    ensure(updateTask.status === 200, "Admin task update failed");
    report.push("PATCH /api/admin/tasks/:id OK");

    const deleteTask = await makeRequest(baseUrl, "DELETE", `/api/admin/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    ensure(deleteTask.status === 200, "Admin task delete failed");
    report.push("DELETE /api/admin/tasks/:id OK");

    const logoutUser = await makeRequest(baseUrl, "POST", "/api/auth/logout", {
      headers: { Cookie: userLoginCookie },
    });
    ensure(logoutUser.status === 200, "User logout failed");
    report.push("POST /api/auth/logout OK");

    console.log("\nIntegration API test report:");
    for (const line of report) {
      console.log(`- ${line}`);
    }

    console.log("\nAll API integration checks passed.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
  }
};

run().catch((error) => {
  console.error("Integration API tests failed:", error.message);
  process.exit(1);
});
