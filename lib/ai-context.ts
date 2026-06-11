import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { Budgets, Expenses, Incomes } from "@/utils/schema";
import type { BudgetWithStats, IncomeWithTotal } from "@/types";

export interface RecentExpense {
  name: string;
  amount: string;
  budgetName: string | null;
  createdAt: string;
}

export async function getRecentExpensesForContext(
  userId: string,
  days = 30
): Promise<RecentExpense[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = await db
    .select({
      name: Expenses.name,
      amount: Expenses.amount,
      budgetName: Budgets.name,
      createdAt: Expenses.createdAt,
    })
    .from(Expenses)
    .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
    .where(
      and(
        eq(Budgets.createdBy, userId),
        gte(Expenses.createdAt, since)
      )
    )
    .orderBy(desc(Expenses.createdAt))
    .limit(20);

  return result.map((r) => ({
    name: r.name,
    amount: String(r.amount),
    budgetName: r.budgetName ?? "Uncategorized",
    createdAt:
      r.createdAt instanceof Date
        ? r.createdAt.toLocaleDateString("en-US")
        : String(r.createdAt),
  }));
}

export async function buildUserFinancialContext(userId: string): Promise<string> {
  const [budgets, incomes, recentExpenses] = await Promise.all([
    db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number),
        totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, userId))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id)) as Promise<BudgetWithStats[]>,

    db
      .select({
        ...getTableColumns(Incomes),
        totalAmount: sql`SUM(${Incomes.amount})`.mapWith(Number),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, userId))
      .groupBy(Incomes.id) as Promise<IncomeWithTotal[]>,

    getRecentExpensesForContext(userId, 30),
  ]);

  const totalIncome = incomes.reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const totalBudget = budgets.reduce((s, b) => s + Number(b.amount), 0);
  const totalSpend = budgets.reduce((s, b) => s + (b.totalSpend ?? 0), 0);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const incomeLines =
    incomes.length > 0
      ? incomes.map((i) => `${i.name} $${Number(i.amount).toFixed(0)}`).join(", ")
      : "none recorded";

  const budgetLines =
    budgets.length > 0
      ? budgets
          .map((b) => {
            const pct = Number(b.amount) > 0
              ? ((b.totalSpend / Number(b.amount)) * 100).toFixed(0)
              : "0";
            return `${b.name} ($${Number(b.amount).toFixed(0)} budget, $${b.totalSpend.toFixed(0)} spent = ${pct}%)`;
          })
          .join("; ")
      : "none";

  const expenseLines =
    recentExpenses.length > 0
      ? recentExpenses
          .slice(0, 10)
          .map((e) => `${e.name} $${Number(e.amount).toFixed(0)} [${e.budgetName}]`)
          .join(", ")
      : "none in the last 30 days";

  return `User financial summary (as of ${today}):
- Monthly income: $${totalIncome.toFixed(0)} (${incomeLines})
- Total budget: $${totalBudget.toFixed(0)} across ${budgets.length} categor${budgets.length !== 1 ? "ies" : "y"}
- Total spent this period: $${totalSpend.toFixed(0)} (${totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(0) : 0}% of budget)
- Budget breakdown: ${budgetLines}
- Recent expenses (last 30 days): ${expenseLines}`;
}
