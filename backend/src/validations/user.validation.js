const { z } = require("zod");

const taskListQuerySchema = z.object({
  category: z.string().min(2).max(50).optional(),
  search: z.string().min(1).max(100).optional(),
});

const uuidParamSchema = z.object({
  taskId: z.string().uuid(),
});

const withdrawalBodySchema = z.object({
  upiId: z.string().min(5).max(80),
  amount: z.coerce.number().positive(),
});

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().min(8).max(15).optional(),
  profession: z.enum(["Student", "Freelancer", "Developer", "Designer", "Marketer", "Content Creator", "Business Owner", "Other"]).optional(),
});

const settingsSchema = z.object({
  notifyEmail: z.boolean(),
  notifyPush: z.boolean(),
  profilePublic: z.boolean(),
});

const upiVerificationSchema = z.object({
  upiId: z.string().min(5).max(80),
});

module.exports = {
  taskListQuerySchema,
  uuidParamSchema,
  withdrawalBodySchema,
  profileUpdateSchema,
  settingsSchema,
  upiVerificationSchema,
};
