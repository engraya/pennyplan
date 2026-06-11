"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Budgets, Expenses } from "@/utils/schema";
import { createBudgetSchema, updateBudgetSchema } from "@/validation/budget.schema";
import type { BudgetWithStats } from "@/types";

export async function getBudgets(): Promise<BudgetWithStats[]> {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number),
      totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, userId))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));

  return result as BudgetWithStats[];
}

export async function getBudgetById(budgetId: number): Promise<BudgetWithStats | null> {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number),
      totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, userId)))
    .groupBy(Budgets.id);

  return (result[0] as BudgetWithStats) ?? null;
}

export async function createBudget(formData: unknown): Promise<void> {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = createBudgetSchema.safeParse(formData);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  await db.insert(Budgets).values({
    name: parsed.data.name,
    amount: String(parsed.data.amount),
    icon: parsed.data.icon,
    createdBy: userId,
  });

  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard");
}

export async function updateBudget(formData: unknown): Promise<void> {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateBudgetSchema.safeParse(formData);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  const [budget] = await db
    .select()
    .from(Budgets)
    .where(and(eq(Budgets.id, parsed.data.id), eq(Budgets.createdBy, userId)));

  if (!budget) throw new Error("Budget not found or unauthorized");

  await db
    .update(Budgets)
    .set({
      name: parsed.data.name,
      amount: String(parsed.data.amount),
      icon: parsed.data.icon,
    })
    .where(eq(Budgets.id, parsed.data.id));

  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/expenses/${parsed.data.id}`);
}

export async function deleteBudget(budgetId: number): Promise<void> {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const [budget] = await db
    .select()
    .from(Budgets)
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, userId)));

  if (!budget) throw new Error("Budget not found or unauthorized");

  await db.delete(Expenses).where(eq(Expenses.budgetId, budgetId));
  await db.delete(Budgets).where(eq(Budgets.id, budgetId));

  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard");
}
