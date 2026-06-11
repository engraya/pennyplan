import { z } from "zod";

export const createIncomeSchema = z.object({
  name: z
    .string()
    .min(1, "Income name is required")
    .max(100, "Income name must be under 100 characters"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .max(10_000_000, "Amount cannot exceed 10,000,000"),
  icon: z.string().optional().default("💵"),
});

export const updateIncomeSchema = createIncomeSchema.extend({
  id: z.number().int().positive(),
});

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
