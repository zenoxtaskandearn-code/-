const { z } = require("zod");
const {
  WITHDRAWAL_STATUS,
  USER_STATUS,
  REVIEW_STATUS,
} = require("../constants");

const taskSchema = z.object({
  title: z.string().min(3).max(120),
  category: z.enum(["YouTube", "Instagram", "Twitter/X", "Telegram", "Discord", "Website Visit", "App Install", "Survey", "Referral", "Other"]),
  description: z.string().min(10).max(2000),
  rewardAmount: z.coerce.number().positive(),
  imageUrl: z.string().url(),
  taskUrl: z.string().url(),
  isActive: z.boolean().optional(),
  maxUsers: z.coerce.number().int().min(0).optional(),
});

const updateTaskSchema = taskSchema.partial();

const withdrawalStatusSchema = z.object({
  status: z.enum([
    WITHDRAWAL_STATUS.APPROVED,
    WITHDRAWAL_STATUS.REJECTED,
    WITHDRAWAL_STATUS.PAID,
  ]),
  adminNote: z.string().max(200).optional(),
});

const userStatusSchema = z.object({
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.BLOCKED]),
});

const reviewStatusSchema = z.object({
  reviewStatus: z.enum([REVIEW_STATUS.APPROVED, REVIEW_STATUS.REJECTED]),
  adminNote: z.string().max(200).optional(),
});

const uuidParamsSchema = z.object({
  id: z.string().uuid(),
});

module.exports = {
  taskSchema,
  updateTaskSchema,
  withdrawalStatusSchema,
  userStatusSchema,
  reviewStatusSchema,
  uuidParamsSchema,
};
