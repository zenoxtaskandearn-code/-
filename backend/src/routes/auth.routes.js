const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
  me,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require("../validations/auth.validation");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, me);

module.exports = router;
