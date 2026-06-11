"use client";

import { useBudgets } from "@/hooks/use-budgets";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";

export default function BudgetList() {
  const { data: budgetList = [], isLoading } = useBudgets();

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget />
        {isLoading
          ? [1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse" />
            ))
          : budgetList.map((budget) => (
              <BudgetItem budget={budget} key={budget.id} />
            ))}
      </div>
    </div>
  );
}
