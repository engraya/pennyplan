"use client";

import { PiggyBank, ReceiptText, Wallet, Sparkles, CircleDollarSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import formatNumber from "@/utils";
import type { BudgetWithStats, IncomeWithTotal } from "@/types";

interface CardInfoProps {
  budgetList: BudgetWithStats[];
  incomeList: IncomeWithTotal[];
}

export default function CardInfo({ budgetList, incomeList }: CardInfoProps) {
  const totalBudget = budgetList.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpend = budgetList.reduce((sum, b) => sum + (b.totalSpend ?? 0), 0);
  const totalIncome = incomeList.reduce((sum, i) => sum + (i.totalAmount ?? 0), 0);

  const [financialAdvice, setFinancialAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const [debouncedBudget] = useDebounce(totalBudget, 800);
  const [debouncedSpend] = useDebounce(totalSpend, 800);
  const [debouncedIncome] = useDebounce(totalIncome, 800);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (debouncedBudget === 0 && debouncedIncome === 0) return;
    hasFetchedRef.current = false;
  }, [debouncedBudget, debouncedSpend, debouncedIncome]);

  useEffect(() => {
    if ((debouncedBudget === 0 && debouncedIncome === 0) || hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    setLoadingAdvice(true);

    fetch("/api/ai/financial-advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalBudget: debouncedBudget,
        totalIncome: debouncedIncome,
        totalSpend: debouncedSpend,
      }),
    })
      .then((res) => res.json())
      .then((data) => setFinancialAdvice(data.advice ?? ""))
      .catch(() => setFinancialAdvice("Unable to load financial advice right now."))
      .finally(() => setLoadingAdvice(false));
  }, [debouncedBudget, debouncedSpend, debouncedIncome]);

  if (budgetList.length === 0) {
    return (
      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
        <div>
          <div className="flex mb-2 flex-row space-x-1 items-center">
            <h2 className="text-md">Finan Smart AI</h2>
            <Sparkles
              className="rounded-full text-white w-10 h-10 p-2
              bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate"
            />
          </div>
          <p className="font-light text-md">
            {loadingAdvice ? "Analyzing your finances..." : financialAdvice || "Loading financial advice..."}
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-7 border rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-sm">Total Budget</h2>
            <h2 className="font-bold text-2xl">${formatNumber(totalBudget)}</h2>
          </div>
          <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
        </div>
        <div className="p-7 border rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-sm">Total Spend</h2>
            <h2 className="font-bold text-2xl">${formatNumber(totalSpend)}</h2>
          </div>
          <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
        </div>
        <div className="p-7 border rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-sm">No. Of Budgets</h2>
            <h2 className="font-bold text-2xl">{budgetList.length}</h2>
          </div>
          <Wallet className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
        </div>
        <div className="p-7 border rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-sm">Sum of Income Streams</h2>
            <h2 className="font-bold text-2xl">${formatNumber(totalIncome)}</h2>
          </div>
          <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
        </div>
      </div>
    </div>
  );
}
