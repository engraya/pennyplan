import { z } from "zod";

export const categorizeRequestSchema = z.object({
  expenseName: z.string().min(1).max(100),
  amount: z.number().positive(),
  budgets: z.array(z.object({ id: z.number(), name: z.string() })).min(1),
});

export const categorizeResponseSchema = z.object({
  budgetId: z.number(),
  confidence: z.enum(["high", "medium", "low"]),
  reasoning: z.string(),
});

export const budgetSetupRequestSchema = z.object({
  monthlyIncome: z.number().positive(),
  location: z.string().min(1).max(100).optional(),
});

export const budgetSetupItemSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  icon: z.string(),
  reasoning: z.string(),
});

export const budgetSetupResponseSchema = z.object({
  budgets: z.array(budgetSetupItemSchema),
});

export const chatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z.array(z.object({ text: z.string() })),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export const forecastRequestSchema = z.object({
  budgets: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      amount: z.string(),
      totalSpend: z.number(),
    })
  ),
  daysElapsed: z.number().min(1).max(31),
  totalDays: z.number().min(28).max(31),
});

export const healthScoreRequestSchema = z.object({
  totalBudget: z.number().min(0),
  totalSpend: z.number().min(0),
  totalIncome: z.number().min(0),
  budgetCount: z.number().min(0),
});

export type CategorizeRequest = z.infer<typeof categorizeRequestSchema>;
export type CategorizeResponse = z.infer<typeof categorizeResponseSchema>;
export type BudgetSetupRequest = z.infer<typeof budgetSetupRequestSchema>;
export type BudgetSetupItem = z.infer<typeof budgetSetupItemSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ForecastRequest = z.infer<typeof forecastRequestSchema>;
export type HealthScoreRequest = z.infer<typeof healthScoreRequestSchema>;
