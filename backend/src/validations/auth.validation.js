const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(8).max(15),
  profession: z.enum(["Student", "Freelancer", "Developer", "Designer", "Marketer", "Content Creator", "Business Owner", "Other"]),
  password: z.string().min(8).max(64),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
};
