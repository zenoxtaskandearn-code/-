const express = require("express");
const {
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
} = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  taskListQuerySchema,
  uuidParamSchema,
  withdrawalBodySchema,
  profileUpdateSchema,
  settingsSchema,
} = require("../validations/user.validation");

const router = express.Router();

router.use(authenticate, authorize(ROLES.USER));

router.get("/dashboard", getDashboard);
router.get("/tasks", validate(taskListQuerySchema, "query"), listTasks);
router.get("/tasks/:taskId", validate(uuidParamSchema, "params"), getTaskById);
router.post("/tasks/:taskId/start", validate(uuidParamSchema, "params"), startTask);
router.post(
  "/tasks/:taskId/complete",
  upload.single("screenshot"),
  validate(uuidParamSchema, "params"),
  completeTask
);

router.get("/history", getHistory);
router.get("/wallet", getWallet);

router.post(
  "/withdrawals",
  validate(withdrawalBodySchema),
  createWithdrawalRequest
);

router.patch("/profile", validate(profileUpdateSchema), updateProfile);

router.get("/settings", getSettings);
router.patch("/settings", validate(settingsSchema), updateSettings);

module.exports = router;
