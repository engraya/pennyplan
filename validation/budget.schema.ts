import { z } from "zod";

export const createBudgetSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(100, "Budget name must be under 100 characters"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .max(1_000_000, "Amount cannot exceed 1,000,000"),
  icon: z.string().optional().default("💰"),
});

export const updateBudgetSchema = createBudgetSchema.extend({
  id: z.number().int().positive(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
