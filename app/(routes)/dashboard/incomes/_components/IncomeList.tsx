"use client";

import { CircleDollarSign } from "lucide-react";
import { useIncomes } from "@/hooks/use-incomes";
import { Skeleton } from "@/components/ui/skeleton";
import CreateIncomes from "./CreateIncomes";
import IncomeItem from "./IncomeItem";

export default function IncomeList() {
  const { data: incomeList = [], isLoading } = useIncomes();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 mt-0.5">
            <CircleDollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight gradient-text-brand">
              Income Streams
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {incomeList.length} source{incomeList.length !== 1 ? "s" : ""} · track all earnings
            </p>
          </div>
        </div>
        <CreateIncomes />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-[80px] rounded-2xl" />
            ))
          : incomeList.map((income) => (
              <IncomeItem income={income} key={income.id} />
            ))}
      </div>
    </div>
  );
}
