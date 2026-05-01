const { query } = require("../db/pool");
const { requireRole } = require("../middlewares/auth.middleware");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const getReferralStats = asyncHandler(async (req, res) => {
  const userResult = await query(
    `SELECT referral_code FROM users WHERE id = $1 LIMIT 1`,
    [req.user.id]
  );

  if (!userResult.rows[0]) {
    throw new ApiError(404, "User not found");
  }

  const referralCode = userResult.rows[0].referral_code;

  const [referredCount, referralEarnings, referredUsers] = await Promise.all([
    query(
      `SELECT COUNT(*)::int AS count FROM users WHERE referred_by = $1`,
      [req.user.id]
    ),
    query(
      `SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM wallet_transactions
       WHERE user_id = $1 AND type = 'REFERRAL_REWARD'`,
      [req.user.id]
    ),
    query(
      `SELECT id, name, email, profession, created_at
       FROM users
       WHERE referred_by = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    ),
  ]);

  const settingResult = await query(
    `SELECT setting_value FROM app_settings WHERE setting_key = 'referral_reward_amount' LIMIT 1`
  );

  const rewardAmount = settingResult.rows.length > 0
    ? Number(settingResult.rows[0].setting_value) || 0
    : 0;

  return res.status(200).json({
    success: true,
    data: {
      referralCode,
      rewardAmount,
      totalReferred: referredCount.rows[0].count,
      totalEarnings: Number(referralEarnings.rows[0].total),
      referredUsers: referredUsers.rows,
    },
  });
});

const getReferralSetting = asyncHandler(async (req, res) => {
  const settingResult = await query(
    `SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('referral_reward_amount', 'min_withdrawal_amount')`
  );

  const settings = {};
  for (const row of settingResult.rows) {
    settings[row.setting_key] = Number(row.setting_value) || 0;
  }

  return res.status(200).json({
    success: true,
    data: {
      referralRewardAmount: settings.referral_reward_amount || 0,
      minWithdrawalAmount: settings.min_withdrawal_amount || 0,
    },
  });
});

const updateReferralSetting = asyncHandler(async (req, res) => {
  const { rewardAmount, minWithdrawalAmount } = req.body;

  if (typeof rewardAmount !== "number" || rewardAmount < 0 || rewardAmount > 10000) {
    throw new ApiError(400, "Invalid reward amount. Must be between 0 and 10000");
  }

  if (
    minWithdrawalAmount !== undefined &&
    (typeof minWithdrawalAmount !== "number" || minWithdrawalAmount < 0 || minWithdrawalAmount > 10000)
  ) {
    throw new ApiError(400, "Invalid minimum withdrawal amount. Must be between 0 and 10000");
  }

  await query(
    `INSERT INTO app_settings (setting_key, setting_value, updated_by, updated_at)
     VALUES ('referral_reward_amount', $1, $2, NOW())
     ON CONFLICT (setting_key)
     DO UPDATE SET setting_value = $1, updated_by = $2, updated_at = NOW()`,
    [String(rewardAmount), req.user.id]
  );

  if (minWithdrawalAmount !== undefined) {
    await query(
      `INSERT INTO app_settings (setting_key, setting_value, updated_by, updated_at)
       VALUES ('min_withdrawal_amount', $1, $2, NOW())
       ON CONFLICT (setting_key)
       DO UPDATE SET setting_value = $1, updated_by = $2, updated_at = NOW()`,
      [String(minWithdrawalAmount), req.user.id]
    );
  }

  return res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: {
      referralRewardAmount: rewardAmount,
      minWithdrawalAmount: minWithdrawalAmount ?? 0,
    },
  });
});

module.exports = {
  getReferralStats,
  getReferralSetting,
  updateReferralSetting,
};
