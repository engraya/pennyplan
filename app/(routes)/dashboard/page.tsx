"use client";

import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { useBudgets } from "@/hooks/use-budgets";
import { useIncomes } from "@/hooks/use-incomes";
import { useAllExpenses } from "@/hooks/use-expenses";

export default function Dashboard() {
  const { user } = useUser();
  const { data: budgetList = [] } = useBudgets();
  const { data: incomeList = [] } = useIncomes();
  const { data: expensesList = [] } = useAllExpenses();

  return (
    <div className="p-8">
      <h2 className="font-bold text-4xl">
        <span className="bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent">
          Hi, {user?.fullName}
        </span>
        {" "}👋
      </h2>
      <p className="text-gray-500">
        Here&apos;s what&apos;s happening with your money. Let&apos;s manage your expenses.
      </p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable expensesList={expensesList} />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList.length > 0
            ? budgetList.map((budget) => (
                <BudgetItem budget={budget} key={budget.id} />
              ))
            : [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[180px] w-full bg-slate-200 rounded-lg animate-pulse"
                />
              ))}
        </div>
      </div>
    </div>
  );
}
