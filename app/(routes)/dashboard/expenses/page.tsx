"use client";

import { ReceiptText } from "lucide-react";
import { useAllExpenses } from "@/hooks/use-expenses";
import ExpenseListTable from "./_components/ExpenseListTable";

export default function ExpensesPage() {
  const { data: expensesList = [] } = useAllExpenses();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start gap-3 mb-7">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0 mt-0.5">
          <ReceiptText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight gradient-text-brand">
            Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All transactions across budgets
          </p>
        </div>
      </div>

      <ExpenseListTable expensesList={expensesList} />
    </div>
  );
}
