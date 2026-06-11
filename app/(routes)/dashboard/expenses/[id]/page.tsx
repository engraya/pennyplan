"use client";

import { ArrowLeft, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import EditBudget from "../_components/EditBudget";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBudgetById, useDeleteBudget } from "@/hooks/use-budgets";
import { useExpensesByBudget } from "@/hooks/use-expenses";

interface ExpensesScreenProps {
  params: { id: string };
}

export default function ExpensesScreen({ params }: ExpensesScreenProps) {
  const budgetId = Number(params.id);
  const router = useRouter();

  const { data: budgetInfoRaw } = useBudgetById(budgetId);
  const budgetInfo = budgetInfoRaw ?? undefined;
  const { data: expensesList = [] } = useExpensesByBudget(budgetId);
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget();

  const handleDelete = () => {
    deleteBudget(budgetId, {
      onSuccess: () => router.replace("/dashboard/budgets"),
    });
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
          My Expenses
        </span>
        <div className="flex gap-2 items-center">
          <EditBudget budgetInfo={budgetInfo} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive" disabled={isDeleting}>
                <Trash className="w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this budget and all its expenses. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse" />
        )}
        <AddExpense budgetId={budgetId} />
      </div>

      <div className="mt-4">
        <ExpenseListTable expensesList={expensesList} budgetId={budgetId} />
      </div>
    </div>
  );
}
