"use client";

import { useAllExpenses } from "@/hooks/use-expenses";
import ExpenseListTable from "./_components/ExpenseListTable";

export default function ExpensesPage() {
  const { data: expensesList = [] } = useAllExpenses();

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>
      <ExpenseListTable expensesList={expensesList} />
    </div>
  );
}
