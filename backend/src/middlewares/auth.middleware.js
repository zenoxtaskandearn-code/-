const { query } = require("../db/pool");
const { USER_STATUS } = require("../constants");
const ApiError = require("../utils/apiError");
const { verifyAccessToken } = require("../utils/tokens");

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const payload = verifyAccessToken(token);

    const result = await query(
      `SELECT id, role, status, email, name FROM users WHERE id = $1 LIMIT 1`,
      [payload.userId]
    );

    const user = result.rows[0];

    if (!user) {
      return next(new ApiError(401, "Invalid token"));
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      return next(new ApiError(403, "User account is blocked"));
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden"));
  }

  return next();
};

module.exports = {
  authenticate,
  authorize,
};
