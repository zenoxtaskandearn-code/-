const bcrypt = require("bcryptjs");
const { query, withTransaction } = require("../db/pool");
const { ROLES, USER_STATUS } = require("../constants");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");
const env = require("../config/env");

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateReferralCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ZN";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const getUserPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profession: user.profession,
  role: user.role,
  status: user.status,
});

const issueTokens = (user) => {
  const payload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, profession, password, referralCode } = req.body;

  const existing = await query(
    `SELECT id FROM users WHERE email = $1 OR phone = $2 LIMIT 1`,
    [email.toLowerCase(), phone]
  );

  if (existing.rows.length > 0) {
    throw new ApiError(409, "Email or phone already registered");
  }

  let referralRewardAmount = 0;
  let referrerUserId = null;

  if (referralCode) {
    const referrerResult = await query(
      `SELECT id FROM users WHERE referral_code = $1 LIMIT 1`,
      [referralCode.toUpperCase()]
    );

    if (referrerResult.rows.length > 0) {
      referrerUserId = referrerResult.rows[0].id;
      const settingResult = await query(
        `SELECT setting_value FROM app_settings WHERE setting_key = 'referral_reward_amount' LIMIT 1`
      );

      if (settingResult.rows.length > 0) {
        referralRewardAmount = Number(settingResult.rows[0].setting_value) || 0;
      }
    }
  }

  let uniqueReferralCode = generateReferralCode();
  let codeExists = true;
  while (codeExists) {
    const checkCode = await query(
      `SELECT id FROM users WHERE referral_code = $1 LIMIT 1`,
      [uniqueReferralCode]
    );

    if (checkCode.rows.length === 0) {
      codeExists = false;
    } else {
      uniqueReferralCode = generateReferralCode();
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await withTransaction(async (client) => {
    const createdUser = await client.query(
      `INSERT INTO users (name, email, phone, profession, password_hash, role, status, referral_code, referred_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, email, phone, profession, role, status, referral_code, referred_by`,
      [
        name,
        email.toLowerCase(),
        phone,
        profession,
        passwordHash,
        ROLES.USER,
        USER_STATUS.ACTIVE,
        uniqueReferralCode,
        referrerUserId,
      ]
    );

    await client.query(
      `INSERT INTO wallets (user_id, balance, total_earned, total_withdrawn)
       VALUES ($1, 0, 0, 0)`,
      [createdUser.rows[0].id]
    );

    await client.query(
      `INSERT INTO user_settings (user_id, notify_email, notify_push, profile_public)
       VALUES ($1, true, true, false)`,
      [createdUser.rows[0].id]
    );

    if (referrerUserId && referralRewardAmount > 0) {
      await client.query(
        `UPDATE wallets
         SET balance = balance + $1, total_earned = total_earned + $1
         WHERE user_id = $2`,
        [referralRewardAmount, referrerUserId]
      );

      await client.query(
        `INSERT INTO wallet_transactions (user_id, type, amount, reference_type, reference_id)
         VALUES ($1, 'REFERRAL_REWARD', $2, 'USER', $3)`,
        [referrerUserId, referralRewardAmount, createdUser.rows[0].id]
      );
    }

    return createdUser.rows[0];
  });

  const { accessToken, refreshToken } = issueTokens(user);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: { ...getUserPayload(user), referral_code: user.referral_code },
      accessToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userResult = await query(
    `SELECT id, name, email, phone, profession, role, status, password_hash
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email.toLowerCase()]
  );

  const user = userResult.rows[0];

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(403, "Account is blocked");
  }

  const passwordOk = await bcrypt.compare(password, user.password_hash);

  if (!passwordOk) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = issueTokens(user);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: getUserPayload(user),
      accessToken,
    },
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let payload;
  try {
    payload = verifyRefreshToken(incomingToken);
  } catch (_error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const userResult = await query(
    `SELECT id, name, email, phone, profession, role, status
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [payload.userId]
  );

  const user = userResult.rows[0];

  if (!user || user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(401, "User not authorized");
  }

  const newAccessToken = signAccessToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  return res.status(200).json({
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

const me = asyncHandler(async (req, res) => {
  const userResult = await query(
    `SELECT id, name, email, phone, profession, role, status, created_at, referral_code, referred_by
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [req.user.id]
  );

  const user = userResult.rows[0];

  return res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const userResult = await query(
    `SELECT id, password_hash FROM users WHERE id = $1 LIMIT 1`,
    [req.user.id]
  );

  const user = userResult.rows[0];

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const passwordOk = await bcrypt.compare(currentPassword, user.password_hash);

  if (!passwordOk) {
    throw new ApiError(400, "Current password is incorrect");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [newPasswordHash, req.user.id]
  );

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  me,
  changePassword,
};
