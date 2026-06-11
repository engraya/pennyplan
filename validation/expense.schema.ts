import { z } from "zod";

export const createExpenseSchema = z.object({
  name: z
    .string()
    .min(1, "Expense name is required")
    .max(100, "Expense name must be under 100 characters"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .max(1_000_000, "Amount cannot exceed 1,000,000"),
  budgetId: z.number().int().positive(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
