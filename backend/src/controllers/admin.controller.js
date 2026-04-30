const { query, withTransaction } = require("../db/pool");
const {
  WITHDRAWAL_STATUS,
  REVIEW_STATUS,
} = require("../constants");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { buildFileUrl } = require("../utils/fileUrl");

const getDashboard = asyncHandler(async (req, res) => {
  const [statsResult, recentWithdrawals, upiRequests, newUsers] = await Promise.all([
    query(
      `SELECT
         COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN amount ELSE 0 END), 0)::numeric AS total_due_payments,
         (
           SELECT COUNT(*)
           FROM withdrawal_requests
           WHERE status = 'PENDING'
         )::int AS pending_withdrawal_requests,
         (
           SELECT COUNT(*)
           FROM upi_verifications
           WHERE status = 'PENDING'
         )::int AS pending_upi_requests,
         (
           SELECT COUNT(*)
           FROM users
           WHERE role = 'USER'
         )::int AS total_users,
         COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END), 0)::numeric AS total_paid
       FROM withdrawal_requests`
    ),
    query(
      `SELECT wr.id, wr.amount, wr.upi_id, wr.screenshot_url, wr.status, wr.created_at,
              u.id AS user_id, u.name, u.email
       FROM withdrawal_requests wr
       INNER JOIN users u ON u.id = wr.user_id
       ORDER BY wr.created_at DESC
       LIMIT 10`
    ),
    query(
      `SELECT uv.id, uv.upi_id, uv.screenshot_url, uv.status, uv.created_at,
              u.id AS user_id, u.name, u.email
       FROM upi_verifications uv
       INNER JOIN users u ON u.id = uv.user_id
       ORDER BY uv.created_at DESC
       LIMIT 10`
    ),
    query(
      `SELECT id, name, email, phone, profession, status, created_at
       FROM users
       WHERE role = 'USER'
       ORDER BY created_at DESC
       LIMIT 10`
    ),
  ]);

  const stats = statsResult.rows[0];

  return res.status(200).json({
    success: true,
    data: {
      stats: {
        totalDuePayments: Number(stats.total_due_payments || 0),
        totalPendingRequests:
          Number(stats.pending_withdrawal_requests || 0) +
          Number(stats.pending_upi_requests || 0),
        totalUsers: Number(stats.total_users || 0),
        totalPaid: Number(stats.total_paid || 0),
      },
      recentWithdrawals: recentWithdrawals.rows.map((row) => ({
        ...row,
        screenshot_url: row.screenshot_url
          ? buildFileUrl(req, row.screenshot_url)
          : null,
      })),
      upiVerificationRequests: upiRequests.rows.map((row) => ({
        ...row,
        screenshot_url: row.screenshot_url
          ? buildFileUrl(req, row.screenshot_url)
          : null,
      })),
      newUsers: newUsers.rows,
    },
  });
});

const listWithdrawals = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const params = [];

  let sql = `SELECT wr.id, wr.amount, wr.upi_id, wr.screenshot_url, wr.status, wr.admin_note,
                    wr.created_at, wr.reviewed_at,
                    u.id AS user_id, u.name, u.email, u.phone
             FROM withdrawal_requests wr
             INNER JOIN users u ON u.id = wr.user_id`;

  if (status) {
    params.push(status);
    sql += ` WHERE wr.status = $1`;
  }

  sql += ` ORDER BY wr.created_at DESC`;

  const result = await query(sql, params);

  return res.status(200).json({
    success: true,
    data: {
      withdrawals: result.rows.map((row) => ({
        ...row,
        screenshot_url: row.screenshot_url
          ? buildFileUrl(req, row.screenshot_url)
          : null,
      })),
    },
  });
});

const updateWithdrawalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;

  const updated = await withTransaction(async (client) => {
    const withdrawalResult = await client.query(
      `SELECT id, user_id, amount, status
       FROM withdrawal_requests
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [id]
    );

    const withdrawal = withdrawalResult.rows[0];

    if (!withdrawal) {
      throw new ApiError(404, "Withdrawal request not found");
    }

    if (withdrawal.status === WITHDRAWAL_STATUS.PAID) {
      throw new ApiError(409, "Paid withdrawals cannot be changed");
    }

    if (
      withdrawal.status === WITHDRAWAL_STATUS.REJECTED &&
      status !== WITHDRAWAL_STATUS.REJECTED
    ) {
      throw new ApiError(409, "Rejected withdrawal cannot be moved to another status");
    }

    if (status === WITHDRAWAL_STATUS.REJECTED) {
      const walletResult = await client.query(
        `SELECT id
         FROM wallets
         WHERE user_id = $1
         LIMIT 1
         FOR UPDATE`,
        [withdrawal.user_id]
      );

      if (!walletResult.rows[0]) {
        throw new ApiError(404, "Wallet not found");
      }

      if (withdrawal.status !== WITHDRAWAL_STATUS.REJECTED) {
        await client.query(
          `UPDATE wallets
           SET balance = balance + $1,
               updated_at = NOW()
           WHERE id = $2`,
          [withdrawal.amount, walletResult.rows[0].id]
        );

        await client.query(
          `INSERT INTO wallet_transactions (user_id, type, amount, reference_type, reference_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            withdrawal.user_id,
            "WITHDRAW_REVERSED",
            Number(withdrawal.amount),
            "WITHDRAWAL",
            withdrawal.id,
          ]
        );
      }
    }

    if (
      status === WITHDRAWAL_STATUS.PAID &&
      withdrawal.status !== WITHDRAWAL_STATUS.PAID
    ) {
      await client.query(
        `UPDATE wallets
         SET total_withdrawn = total_withdrawn + $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [withdrawal.amount, withdrawal.user_id]
      );
    }

    const updateResult = await client.query(
      `UPDATE withdrawal_requests
       SET status = $1,
           admin_note = $2,
           reviewed_by = $3,
           reviewed_at = NOW(),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, amount, upi_id, screenshot_url, status, admin_note, reviewed_at`,
      [status, adminNote || null, req.user.id, id]
    );

    return updateResult.rows[0];
  });

  return res.status(200).json({
    success: true,
    message: "Withdrawal status updated",
    data: {
      ...updated,
      screenshot_url: updated.screenshot_url
        ? buildFileUrl(req, updated.screenshot_url)
        : null,
    },
  });
});

const listUsers = asyncHandler(async (_req, res) => {
  const result = await query(
    `SELECT id, name, email, phone, profession, role, status, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return res.status(200).json({
    success: true,
    data: {
      users: result.rows,
    },
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await query(
    `UPDATE users
     SET status = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, status, role`,
    [status, id]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    message: "User status updated",
    data: {
      user: result.rows[0],
    },
  });
});

const listTasks = asyncHandler(async (_req, res) => {
  const result = await query(
    `SELECT id, title, category, description, reward_amount, image_url, task_url, is_active, max_users, created_at
     FROM tasks
     ORDER BY created_at DESC`
  );

  return res.status(200).json({
    success: true,
    data: {
      tasks: result.rows,
    },
  });
});

const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    description,
    rewardAmount,
    imageUrl,
    taskUrl,
    isActive = true,
    maxUsers = 0,
  } = req.body;

  const result = await query(
    `INSERT INTO tasks (title, category, description, reward_amount, image_url, task_url, is_active, max_users)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, category, description, reward_amount, image_url, task_url, is_active, max_users, created_at`,
    [title, category, description, rewardAmount, imageUrl, taskUrl, isActive, maxUsers]
  );

  return res.status(201).json({
    success: true,
    message: "Task created",
    data: {
      task: result.rows[0],
    },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fieldMap = {
    title: "title",
    category: "category",
    description: "description",
    rewardAmount: "reward_amount",
    imageUrl: "image_url",
    taskUrl: "task_url",
    isActive: "is_active",
    maxUsers: "max_users",
  };

  const updates = [];
  const values = [];
  let idx = 1;

  for (const [inputKey, dbColumn] of Object.entries(fieldMap)) {
    if (req.body[inputKey] !== undefined) {
      updates.push(`${dbColumn} = $${idx}`);
      values.push(req.body[inputKey]);
      idx += 1;
    }
  }

  if (updates.length === 0) {
    throw new ApiError(400, "No update fields provided");
  }

  values.push(id);

  const result = await query(
    `UPDATE tasks
     SET ${updates.join(", ")}, updated_at = NOW()
     WHERE id = $${idx}
     RETURNING id, title, category, description, reward_amount, image_url, task_url, is_active, max_users, updated_at`,
    values
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res.status(200).json({
    success: true,
    message: "Task updated",
    data: {
      task: result.rows[0],
    },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(`DELETE FROM tasks WHERE id = $1 RETURNING id`, [id]);

  if (result.rows.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res.status(200).json({
    success: true,
    message: "Task deleted",
  });
});

const listPendingCompletions = asyncHandler(async (req, res) => {
  const status = req.query.status || "PENDING";
  const params = [status];

  const result = await query(
    `SELECT tc.id, tc.status, tc.started_at, tc.completed_at, tc.review_status,
            tc.screenshot_url, tc.admin_note,
            t.id AS task_id, t.title, t.category, t.reward_amount,
            u.id AS user_id, u.name, u.email, u.phone
     FROM task_completions tc
     INNER JOIN tasks t ON t.id = tc.task_id
     INNER JOIN users u ON u.id = tc.user_id
     WHERE tc.review_status = $1
     ORDER BY tc.completed_at ASC`,
    params
  );

  return res.status(200).json({
    success: true,
    data: {
      completions: result.rows.map((row) => ({
        ...row,
        screenshot_url: row.screenshot_url
          ? buildFileUrl(req, row.screenshot_url)
          : null,
      })),
    },
  });
});

const reviewTaskCompletion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reviewStatus, adminNote } = req.body;

  const updated = await withTransaction(async (client) => {
    const completionResult = await client.query(
      `SELECT tc.id, tc.review_status, tc.task_id, tc.user_id, t.reward_amount
       FROM task_completions tc
       INNER JOIN tasks t ON t.id = tc.task_id
       WHERE tc.id = $1
       LIMIT 1
       FOR UPDATE`,
      [id]
    );

    const completion = completionResult.rows[0];

    if (!completion) {
      throw new ApiError(404, "Task completion not found");
    }

    if (completion.review_status !== REVIEW_STATUS.PENDING) {
      throw new ApiError(409, `This task completion was already ${completion.review_status}`);
    }

    const updateResult = await client.query(
      `UPDATE task_completions
       SET review_status = $1,
           admin_note = $2,
           reviewed_by = $3,
           reviewed_at = NOW(),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, status, review_status, admin_note, reviewed_at`,
      [reviewStatus, adminNote || null, req.user.id, id]
    );

    if (reviewStatus === REVIEW_STATUS.APPROVED) {
      const walletResult = await client.query(
        `SELECT id, balance, total_earned
         FROM wallets
         WHERE user_id = $1
         LIMIT 1
         FOR UPDATE`,
        [completion.user_id]
      );

      if (!walletResult.rows[0]) {
        throw new ApiError(404, "User wallet not found");
      }

      const reward = Number(completion.reward_amount);

      await client.query(
        `UPDATE wallets
         SET balance = balance + $1,
             total_earned = total_earned + $1,
             updated_at = NOW()
         WHERE id = $2`,
        [reward, walletResult.rows[0].id]
      );

      await client.query(
        `INSERT INTO wallet_transactions (user_id, type, amount, reference_type, reference_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [completion.user_id, "TASK_REWARD", reward, "TASK", completion.task_id]
      );
    }

    return updateResult.rows[0];
  });

  return res.status(200).json({
    success: true,
    message: `Task completion ${reviewStatus.toLowerCase()}`,
    data: updated,
  });
});

module.exports = {
  getDashboard,
  listWithdrawals,
  updateWithdrawalStatus,
  listUsers,
  updateUserStatus,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  listPendingCompletions,
  reviewTaskCompletion,
};
