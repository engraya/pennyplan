"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Budgets, Expenses } from "@/utils/schema";
import { createExpenseSchema, updateExpenseSchema } from "@/validation/expense.schema";
import type { Expense } from "@/types";

export async function getAllExpenses(): Promise<Expense[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      budgetId: Expenses.budgetId,
      createdAt: Expenses.createdAt,
    })
    .from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, userId))
    .orderBy(desc(Expenses.id));

  return result.map((r) => ({
    ...r,
    amount: String(r.amount),
    createdAt: r.createdAt instanceof Date
      ? r.createdAt.toLocaleDateString("en-GB")
      : String(r.createdAt),
  }));
}

export async function getExpensesByBudget(budgetId: number): Promise<Expense[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [budget] = await db
    .select()
    .from(Budgets)
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, userId)));

  if (!budget) throw new Error("Budget not found or unauthorized");

  const result = await db
    .select()
    .from(Expenses)
    .where(eq(Expenses.budgetId, budgetId))
    .orderBy(desc(Expenses.id));

  return result.map((r) => ({
    ...r,
    amount: String(r.amount),
    createdAt: r.createdAt instanceof Date
      ? r.createdAt.toLocaleDateString("en-GB")
      : String(r.createdAt),
  }));
}

export async function createExpense(formData: unknown): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = createExpenseSchema.safeParse(formData);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  const [budget] = await db
    .select()
    .from(Budgets)
    .where(and(eq(Budgets.id, parsed.data.budgetId), eq(Budgets.createdBy, userId)));

  if (!budget) throw new Error("Budget not found or unauthorized");

  await db.insert(Expenses).values({
    name: parsed.data.name,
    amount: String(parsed.data.amount),
    budgetId: parsed.data.budgetId,
  });

  revalidatePath(`/dashboard/expenses/${parsed.data.budgetId}`);
  revalidatePath("/dashboard");
}

export async function updateExpense(formData: unknown): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateExpenseSchema.safeParse(formData);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  const [budget] = await db
    .select()
    .from(Budgets)
    .where(and(eq(Budgets.id, parsed.data.budgetId), eq(Budgets.createdBy, userId)));

  if (!budget) throw new Error("Budget not found or unauthorized");

  await db
    .update(Expenses)
    .set({ name: parsed.data.name, amount: String(parsed.data.amount) })
    .where(and(eq(Expenses.id, parsed.data.id), eq(Expenses.budgetId, parsed.data.budgetId)));

  revalidatePath(`/dashboard/expenses/${parsed.data.budgetId}`);
  revalidatePath("/dashboard");
}

export async function deleteExpense(expenseId: number, budgetId: number): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [budget] = await db
    .select()
    .from(Budgets)
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, userId)));

  if (!budget) throw new Error("Budget not found or unauthorized");

  await db.delete(Expenses).where(eq(Expenses.id, expenseId));

  revalidatePath(`/dashboard/expenses/${budgetId}`);
  revalidatePath("/dashboard");
}
