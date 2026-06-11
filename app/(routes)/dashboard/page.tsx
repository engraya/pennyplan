"use client";

import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import HealthScoreGauge from "./_components/HealthScoreGauge";
import ForecastCard from "./_components/ForecastCard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgets } from "@/hooks/use-budgets";
import { useIncomes } from "@/hooks/use-incomes";
import { useAllExpenses } from "@/hooks/use-expenses";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { user } = useUser();
  const { data: budgetList = [], isLoading: budgetsLoading } = useBudgets();
  const { data: incomeList = [] } = useIncomes();
  const { data: expensesList = [] } = useAllExpenses();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {getGreeting()},{" "}
              <span className="gradient-text">{user?.firstName}</span>
            </h1>
            <span className="text-xl leading-none">👋</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{getFormattedDate()}</p>
        </div>
      </div>

      {/* Stats + AI insight */}
      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      {/* AI Health Score + Forecast Row */}
      {budgetList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <HealthScoreGauge budgetList={budgetList} incomeList={incomeList} />
          <ForecastCard budgetList={budgetList} />
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable expensesList={expensesList} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-primary to-violet-600 rounded-full" />
            <h2 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Recent Budgets
            </h2>
          </div>
          {budgetsLoading
            ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-[130px] rounded-2xl" />)
            : budgetList.slice(0, 5).map((budget) => (
                <BudgetItem budget={budget} key={budget.id} />
              ))}
        </div>
      </div>
    </div>
  );
}
