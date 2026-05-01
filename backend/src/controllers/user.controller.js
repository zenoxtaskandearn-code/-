const { query, withTransaction } = require("../db/pool");
const {
  COMPLETION_STATUS,
  WITHDRAWAL_STATUS,
  UPI_VERIFICATION_STATUS,
  REVIEW_STATUS,
} = require("../constants");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { buildFileUrl } = require("../utils/fileUrl");
const { uploadBufferToCloudinary } = require("../utils/cloudinary");

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [walletResult, completedResult, tasksResult] = await Promise.all([
    query(
      `SELECT balance, total_earned, total_withdrawn
       FROM wallets
       WHERE user_id = $1
       LIMIT 1`,
      [userId]
    ),
    query(
      `SELECT COUNT(*)::int AS completed_tasks
       FROM task_completions
       WHERE user_id = $1 AND status = $2 AND review_status = $3`,
      [userId, COMPLETION_STATUS.COMPLETED, REVIEW_STATUS.APPROVED]
    ),
    query(
      `SELECT
         t.id,
         t.title,
         t.category,
         t.reward_amount,
         t.image_url,
         t.is_active,
         t.max_users,
         COALESCE(utc.status, 'NOT_STARTED') AS my_status,
         COALESCE(utc.review_status, 'NOT_STARTED') AS review_status,
         COALESCE(utc.admin_note, NULL) AS admin_note,
         COALESCE(tc.completed_count, 0)::int AS completed_count
       FROM tasks t
       LEFT JOIN task_completions utc
         ON utc.task_id = t.id AND utc.user_id = $1
       LEFT JOIN (
         SELECT task_id, COUNT(*) AS completed_count
         FROM task_completions
         WHERE status = $2
         GROUP BY task_id
       ) tc ON tc.task_id = t.id
       WHERE t.is_active = true
       ORDER BY t.created_at DESC`,
      [userId, COMPLETION_STATUS.COMPLETED]
    ),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      stats: {
        walletBalance: Number(walletResult.rows[0]?.balance || 0),
        totalEarned: Number(walletResult.rows[0]?.total_earned || 0),
        totalWithdrawn: Number(walletResult.rows[0]?.total_withdrawn || 0),
        totalTasksCompleted: completedResult.rows[0]?.completed_tasks || 0,
      },
      tasks: tasksResult.rows,
    },
  });
});

const listTasks = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  let whereClause = "WHERE t.is_active = true";
  const params = [req.user.id, COMPLETION_STATUS.COMPLETED];
  let paramIndex = params.length;

  if (category) {
    paramIndex += 1;
    params.push(category);
    whereClause += ` AND t.category ILIKE $${paramIndex}`;
  }

  if (search) {
    paramIndex += 1;
    params.push(`%${search}%`);
    whereClause += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
  }

  const tasksResult = await query(
    `SELECT
       t.id,
       t.title,
       t.category,
       t.description,
       t.reward_amount,
       t.image_url,
       t.task_url,
       t.max_users,
       COALESCE(utc.status, 'NOT_STARTED') AS my_status,
       COALESCE(utc.review_status, 'NOT_STARTED') AS review_status,
       COALESCE(tc.completed_count, 0)::int AS completed_count
     FROM tasks t
     LEFT JOIN task_completions utc
       ON utc.task_id = t.id AND utc.user_id = $1
     LEFT JOIN (
       SELECT task_id, COUNT(*) AS completed_count
       FROM task_completions
       WHERE status = $2
       GROUP BY task_id
     ) tc ON tc.task_id = t.id
     ${whereClause}
     ORDER BY t.created_at DESC`,
    params
  );

  return res.status(200).json({
    success: true,
    data: {
      tasks: tasksResult.rows,
    },
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const taskResult = await query(
    `SELECT
       t.id,
       t.title,
       t.category,
       t.description,
       t.reward_amount,
       t.image_url,
       t.task_url,
       t.is_active,
       t.max_users,
       COALESCE(utc.status, 'NOT_STARTED') AS my_status,
       COALESCE(utc.review_status, 'NOT_STARTED') AS review_status,
       COALESCE(utc.admin_note, NULL) AS admin_note,
       COALESCE(tc.completed_count, 0)::int AS completed_count
     FROM tasks t
     LEFT JOIN task_completions utc
       ON utc.task_id = t.id AND utc.user_id = $1
     LEFT JOIN (
       SELECT task_id, COUNT(*) AS completed_count
       FROM task_completions
       WHERE status = $2
       GROUP BY task_id
     ) tc ON tc.task_id = t.id
     WHERE t.id = $3
     LIMIT 1`,
    [req.user.id, COMPLETION_STATUS.COMPLETED, taskId]
  );

  const task = taskResult.rows[0];

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (!task.is_active) {
    throw new ApiError(403, "Task is not active");
  }

  return res.status(200).json({
    success: true,
    data: { task },
  });
});

const startTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const taskResult = await query(
    `SELECT id, title, task_url, is_active, max_users
     FROM tasks
     WHERE id = $1
     LIMIT 1`,
    [taskId]
  );

  const task = taskResult.rows[0];

  if (!task || !task.is_active) {
    throw new ApiError(404, "Task not found or inactive");
  }

  if (task.max_users > 0) {
    const slotResult = await query(
      `SELECT COUNT(*)::int AS started_count
       FROM task_completions
       WHERE task_id = $1 AND status = $2`,
      [taskId, COMPLETION_STATUS.COMPLETED]
    );

    const startedCount = slotResult.rows[0].started_count;

    if (startedCount >= task.max_users) {
      throw new ApiError(409, `Task is full (${task.max_users}/${task.max_users}). No more slots available.`);
    }
  }

  const existingResult = await query(
    `SELECT id, status
     FROM task_completions
     WHERE user_id = $1 AND task_id = $2
     LIMIT 1`,
    [req.user.id, taskId]
  );

  const existing = existingResult.rows[0];

  if (existing && existing.status === COMPLETION_STATUS.COMPLETED) {
    return res.status(200).json({
      success: true,
      message: "You have already completed this task",
      data: {
        redirectUrl: task.task_url,
      },
    });
  }

  if (existing) {
    await query(
      `UPDATE task_completions
       SET started_at = NOW()
       WHERE id = $1 AND status = $2`,
      [existing.id, COMPLETION_STATUS.STARTED]
    );
  } else {
    await query(
      `INSERT INTO task_completions (user_id, task_id, status, started_at)
       VALUES ($1, $2, $3, NOW())`,
      [req.user.id, taskId, COMPLETION_STATUS.STARTED]
    );
  }

  return res.status(200).json({
    success: true,
    message: "Task started",
    data: {
      redirectUrl: task.task_url,
    },
  });
});

const completeTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const taskResult = await query(
    `SELECT id, reward_amount, is_active, max_users
     FROM tasks
     WHERE id = $1
     LIMIT 1`,
    [taskId]
  );

  const task = taskResult.rows[0];

  if (!task || !task.is_active) {
    throw new ApiError(404, "Task not found or inactive");
  }

  if (!req.file) {
    throw new ApiError(400, "Screenshot proof is required to complete this task");
  }

  if (task.max_users > 0) {
    const slotResult = await query(
      `SELECT COUNT(*)::int AS completed_count
       FROM task_completions
       WHERE task_id = $1 AND status = $2`,
      [taskId, COMPLETION_STATUS.COMPLETED]
    );

    const completedCount = slotResult.rows[0].completed_count;

    if (completedCount >= task.max_users) {
      throw new ApiError(409, `Task is full (${task.max_users}/${task.max_users}). No more slots available.`);
    }
  }

  const cloudinaryUpload = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "zenox/task-completions",
  });

  const response = await withTransaction(async (client) => {
    const completionResult = await client.query(
      `SELECT id, status, started_at
       FROM task_completions
       WHERE user_id = $1 AND task_id = $2
       LIMIT 1
       FOR UPDATE`,
      [req.user.id, taskId]
    );

    const completion = completionResult.rows[0];

    if (!completion) {
      throw new ApiError(400, "You must start this task before completing it. Click 'Start Task' first.");
    }

    if (completion.status === COMPLETION_STATUS.COMPLETED && completion.review_status === REVIEW_STATUS.APPROVED) {
      throw new ApiError(409, "Task is already completed and approved");
    }

    const startedAt = new Date(completion.started_at).getTime();
    const now = Date.now();
    const minDuration = 60 * 1000;

    if (now - startedAt < minDuration) {
      throw new ApiError(400, "Please wait at least 1 minute after starting before marking complete.");
    }

    await client.query(
      `UPDATE task_completions
       SET status = $1, completed_at = NOW(), screenshot_url = $2, review_status = $3, updated_at = NOW()
       WHERE id = $4`,
      [COMPLETION_STATUS.COMPLETED, cloudinaryUpload.secure_url, REVIEW_STATUS.PENDING, completion.id]
    );

    return { screenshotUrl: cloudinaryUpload.secure_url };
  });

  return res.status(200).json({
    success: true,
    message: "Task completion submitted. Admin will review your proof and credit the reward.",
    data: response,
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT
       tc.id,
       tc.status,
       tc.started_at,
       tc.completed_at,
       tc.review_status,
       tc.screenshot_url,
       t.id AS task_id,
       t.title,
       t.category,
       t.reward_amount
     FROM task_completions tc
     INNER JOIN tasks t ON t.id = tc.task_id
     WHERE tc.user_id = $1 AND tc.status = $2
     ORDER BY tc.completed_at DESC`,
    [req.user.id, COMPLETION_STATUS.COMPLETED]
  );

  return res.status(200).json({
    success: true,
    data: {
      history: result.rows,
    },
  });
});

const getWallet = asyncHandler(async (req, res) => {
  const [walletResult, transactionsResult, withdrawalsResult, settingResult] = await Promise.all([
    query(
      `SELECT balance, total_earned, total_withdrawn
       FROM wallets
       WHERE user_id = $1
       LIMIT 1`,
      [req.user.id]
    ),
    query(
      `SELECT id, type, amount, reference_type, created_at
       FROM wallet_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [req.user.id]
    ),
    query(
      `SELECT id, amount, upi_id, screenshot_url, status, admin_note, created_at
       FROM withdrawal_requests
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [req.user.id]
    ),
    query(
      `SELECT setting_value FROM app_settings WHERE setting_key = 'min_withdrawal_amount' LIMIT 1`
    ),
  ]);

  const withdrawals = withdrawalsResult.rows.map((row) => ({
    ...row,
    screenshot_url: row.screenshot_url
      ? buildFileUrl(req, row.screenshot_url)
      : null,
  }));

  const minWithdrawalAmount = settingResult.rows.length > 0
    ? Number(settingResult.rows[0].setting_value) || 0
    : 0;

  return res.status(200).json({
    success: true,
    data: {
      wallet: walletResult.rows[0] || {
        balance: 0,
        total_earned: 0,
        total_withdrawn: 0,
      },
      transactions: transactionsResult.rows,
      withdrawals,
      minWithdrawalAmount,
    },
  });
});

const createWithdrawalRequest = asyncHandler(async (req, res) => {
  const { amount, upiId } = req.body;

  const settingResult = await query(
    `SELECT setting_value FROM app_settings WHERE setting_key = 'min_withdrawal_amount' LIMIT 1`
  );

  const minWithdrawalAmount = settingResult.rows.length > 0
    ? Number(settingResult.rows[0].setting_value) || 0
    : 0;

  const withdrawal = await withTransaction(async (client) => {
    const walletResult = await client.query(
      `SELECT id, balance
       FROM wallets
       WHERE user_id = $1
       LIMIT 1
       FOR UPDATE`,
      [req.user.id]
    );

    const wallet = walletResult.rows[0];

    if (!wallet) {
      throw new ApiError(404, "Wallet not found");
    }

    const numericAmount = Number(amount);

    if (numericAmount < minWithdrawalAmount) {
      throw new ApiError(400, `Minimum withdrawal amount is ₹${minWithdrawalAmount.toFixed(2)}`);
    }

    if (numericAmount > Number(wallet.balance)) {
      throw new ApiError(400, "Insufficient wallet balance");
    }

    await client.query(
      `UPDATE wallets
       SET balance = balance - $1,
           updated_at = NOW()
       WHERE id = $2`,
      [numericAmount, wallet.id]
    );

    const requestResult = await client.query(
      `INSERT INTO withdrawal_requests (user_id, amount, upi_id, screenshot_url, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, amount, upi_id, screenshot_url, status, created_at`,
      [
       req.user.id,
        numericAmount,
        upiId,
        null,
        WITHDRAWAL_STATUS.PENDING,
      ]
    );

    await client.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, reference_type, reference_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user.id,
        "WITHDRAW_REQUEST",
        -numericAmount,
        "WITHDRAWAL",
        requestResult.rows[0].id,
      ]
    );

    return requestResult.rows[0];
  });

  return res.status(201).json({
    success: true,
    message: "Withdrawal request submitted",
    data: {
      ...withdrawal,
      screenshot_url: buildFileUrl(req, withdrawal.screenshot_url),
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key of ["name", "phone", "profession"]) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(req.body[key]);
      idx += 1;
    }
  }

  if (fields.length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  values.push(req.user.id);

  const result = await query(
    `UPDATE users
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${idx}
     RETURNING id, name, email, phone, profession, role, status, updated_at`,
    values
  );

  return res.status(200).json({
    success: true,
    message: "Profile updated",
    data: {
      user: result.rows[0],
    },
  });
});

const getSettings = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT notify_email, notify_push, profile_public
     FROM user_settings
     WHERE user_id = $1
     LIMIT 1`,
    [req.user.id]
  );

  return res.status(200).json({
    success: true,
    data: {
      settings: result.rows[0] || {
        notify_email: true,
        notify_push: true,
        profile_public: false,
      },
    },
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { notifyEmail, notifyPush, profilePublic } = req.body;

  const result = await query(
    `UPDATE user_settings
     SET notify_email = $1,
         notify_push = $2,
         profile_public = $3,
         updated_at = NOW()
     WHERE user_id = $4
     RETURNING notify_email, notify_push, profile_public, updated_at`,
    [notifyEmail, notifyPush, profilePublic, req.user.id]
  );

  return res.status(200).json({
    success: true,
    message: "Settings updated",
    data: {
      settings: result.rows[0],
    },
  });
});

module.exports = {
  getDashboard,
  listTasks,
  getTaskById,
  startTask,
  completeTask,
  getHistory,
  getWallet,
  createWithdrawalRequest,
  updateProfile,
  getSettings,
  updateSettings,
};
