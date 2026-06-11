"use client";

import { ArrowLeft, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div>
      {/* Back + actions row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">
            {budgetInfo?.name ?? "Budget Details"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <EditBudget budgetInfo={budgetInfo} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this budget?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this budget and all its expenses. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Budget
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div>
          {budgetInfo ? (
            <BudgetItem budget={budgetInfo} />
          ) : (
            <Skeleton className="h-[130px] rounded-xl" />
          )}
        </div>
        <div className="lg:col-span-2 space-y-5">
          <AddExpense budgetId={budgetId} />
          <ExpenseListTable expensesList={expensesList} budgetId={budgetId} />
        </div>
      </div>
    </div>
  );
}
