"use client";

import { PiggyBank } from "lucide-react";
import { useBudgets } from "@/hooks/use-budgets";
import { Skeleton } from "@/components/ui/skeleton";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";
import AiBudgetSetupModal from "./AiBudgetSetupModal";

export default function BudgetList() {
  const { data: budgetList = [], isLoading } = useBudgets();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0 mt-0.5">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight gradient-text-brand">
              Budgets
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {budgetList.length} budget{budgetList.length !== 1 ? "s" : ""} · manage spending limits
            </p>
          </div>
        </div>
        <CreateBudget />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-[136px] rounded-2xl" />
            ))
          : budgetList.length === 0
          ? <AiBudgetSetupModal />
          : budgetList.map((budget) => (
              <BudgetItem budget={budget} key={budget.id} showActions />
            ))}
      </div>
    </div>
  );
}
