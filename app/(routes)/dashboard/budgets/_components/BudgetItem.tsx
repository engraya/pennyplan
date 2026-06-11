import Link from "next/link";
import type { BudgetWithStats } from "@/types";

interface BudgetItemProps {
  budget: BudgetWithStats;
}

export default function BudgetItem({ budget }: BudgetItemProps) {
  const progressPerc = Math.min(
    ((budget.totalSpend ?? 0) / Number(budget.amount)) * 100,
    100
  ).toFixed(1);

  const remaining = Number(budget.amount) - (budget.totalSpend ?? 0);

  return (
    <Link href={`/dashboard/expenses/${budget.id}`}>
      <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] transition-shadow">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
              {budget.icon ?? "💰"}
            </span>
            <div>
              <h2 className="font-bold">{budget.name}</h2>
              <p className="text-sm text-gray-500">{budget.totalItem} item{budget.totalItem !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <span className="font-bold text-primary text-lg">${budget.amount}</span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">${budget.totalSpend ?? 0} spent</span>
            <span className="text-xs text-slate-400">${remaining.toFixed(2)} remaining</span>
          </div>
          <div className="w-full bg-slate-300 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progressPerc}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
