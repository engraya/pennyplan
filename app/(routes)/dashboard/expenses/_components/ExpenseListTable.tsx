"use client";

import { Trash } from "lucide-react";
import { useDeleteExpense } from "@/hooks/use-expenses";
import type { Expense } from "@/types";

interface ExpenseListTableProps {
  expensesList: Expense[];
  budgetId?: number;
}

export default function ExpenseListTable({ expensesList, budgetId }: ExpenseListTableProps) {
  const { mutate: deleteExpense, isPending } = useDeleteExpense();

  const handleDelete = (expense: Expense) => {
    const bid = budgetId ?? expense.budgetId;
    if (!bid) return;
    deleteExpense({ expenseId: expense.id, budgetId: bid });
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">No expenses yet.</p>
      )}
      {expensesList.map((expense) => (
        <div
          key={expense.id}
          className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2 border-b last:border-b-0"
        >
          <span>{expense.name}</span>
          <span>${expense.amount}</span>
          <span>{expense.createdAt}</span>
          <button
            onClick={() => handleDelete(expense)}
            disabled={isPending}
            className="text-red-500 cursor-pointer hover:text-red-700 disabled:opacity-50 text-left flex items-center gap-1"
            aria-label={`Delete expense ${expense.name}`}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
