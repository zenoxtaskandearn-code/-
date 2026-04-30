const express = require("express");
const {
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
} = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants");
const validate = require("../middlewares/validate.middleware");
const {
  taskSchema,
  updateTaskSchema,
  withdrawalStatusSchema,
  userStatusSchema,
  reviewStatusSchema,
  uuidParamsSchema,
} = require("../validations/admin.validation");

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get("/dashboard", getDashboard);

router.get("/withdrawals", listWithdrawals);
router.patch(
  "/withdrawals/:id",
  validate(uuidParamsSchema, "params"),
  validate(withdrawalStatusSchema),
  updateWithdrawalStatus
);

router.get("/users", listUsers);
router.patch(
  "/users/:id/status",
  validate(uuidParamsSchema, "params"),
  validate(userStatusSchema),
  updateUserStatus
);

router.get("/tasks", listTasks);
router.post("/tasks", validate(taskSchema), createTask);
router.patch(
  "/tasks/:id",
  validate(uuidParamsSchema, "params"),
  validate(updateTaskSchema),
  updateTask
);
router.delete("/tasks/:id", validate(uuidParamsSchema, "params"), deleteTask);

router.get("/completions", listPendingCompletions);
router.patch(
  "/completions/:id",
  validate(uuidParamsSchema, "params"),
  validate(reviewStatusSchema),
  reviewTaskCompletion
);

module.exports = router;
