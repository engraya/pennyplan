"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Incomes } from "@/utils/schema";
import { createIncomeSchema, updateIncomeSchema } from "@/validation/income.schema";
import type { IncomeWithTotal } from "@/types";

export async function getIncomes(): Promise<IncomeWithTotal[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .select({
      ...getTableColumns(Incomes),
      totalAmount: sql`SUM(${Incomes.amount})`.mapWith(Number),
    })
    .from(Incomes)
    .where(eq(Incomes.createdBy, userId))
    .groupBy(Incomes.id)
    .orderBy(desc(Incomes.id));

  return result.map((r) => ({
    ...r,
    amount: String(r.amount),
  })) as IncomeWithTotal[];
}

export async function createIncome(formData: unknown): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = createIncomeSchema.safeParse(formData);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  await db.insert(Incomes).values({
    name: parsed.data.name,
    amount: String(parsed.data.amount),
    icon: parsed.data.icon,
    createdBy: userId,
  });

  revalidatePath("/dashboard/incomes");
  revalidatePath("/dashboard");
}

export async function updateIncome(formData: unknown): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateIncomeSchema.safeParse(formData);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  const [income] = await db
    .select()
    .from(Incomes)
    .where(and(eq(Incomes.id, parsed.data.id), eq(Incomes.createdBy, userId)));

  if (!income) throw new Error("Income not found or unauthorized");

  await db
    .update(Incomes)
    .set({
      name: parsed.data.name,
      amount: String(parsed.data.amount),
      icon: parsed.data.icon,
    })
    .where(eq(Incomes.id, parsed.data.id));

  revalidatePath("/dashboard/incomes");
  revalidatePath("/dashboard");
}

export async function deleteIncome(incomeId: number): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [income] = await db
    .select()
    .from(Incomes)
    .where(and(eq(Incomes.id, incomeId), eq(Incomes.createdBy, userId)));

  if (!income) throw new Error("Income not found or unauthorized");

  await db.delete(Incomes).where(eq(Incomes.id, incomeId));

  revalidatePath("/dashboard/incomes");
  revalidatePath("/dashboard");
}
