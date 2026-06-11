"use client";

import { useIncomes } from "@/hooks/use-incomes";
import CreateIncomes from "./CreateIncomes";
import IncomeItem from "./IncomeItem";

export default function IncomeList() {
  const { data: incomeList = [], isLoading } = useIncomes();

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncomes />
        {isLoading
          ? [1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse" />
            ))
          : incomeList.map((income) => (
              <IncomeItem income={income} key={income.id} />
            ))}
      </div>
    </div>
  );
}
