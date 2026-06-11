import type { IncomeWithTotal } from "@/types";

interface IncomeItemProps {
  income: IncomeWithTotal;
}

export default function IncomeItem({ income }: IncomeItemProps) {
  return (
    <div className="p-5 border rounded-2xl hover:shadow-md h-[170px] transition-shadow">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {income.icon ?? "💵"}
          </span>
          <div>
            <h2 className="font-bold">{income.name}</h2>
            <p className="text-sm text-gray-500">Income source</p>
          </div>
        </div>
        <span className="font-bold text-primary text-lg">${income.amount}</span>
      </div>
    </div>
  );
}
