"use client";

import { useState } from "react";
import { Trash, PenLine, ReceiptText, Loader2, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteExpense, useUpdateExpense } from "@/hooks/use-expenses";
import { updateExpenseSchema, type UpdateExpenseInput } from "@/validation/expense.schema";
import type { Expense } from "@/types";

interface ExpenseListTableProps {
  expensesList: Expense[];
  budgetId?: number;
}

export default function ExpenseListTable({ expensesList, budgetId }: ExpenseListTableProps) {
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);

  const { mutate: doUpdate, isPending: isUpdating } = useUpdateExpense();
  const { mutate: doDelete, isPending: isDeleting } = useDeleteExpense();

  const form = useForm<UpdateExpenseInput>({
    resolver: zodResolver(updateExpenseSchema),
  });

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    form.reset({
      id: expense.id,
      name: expense.name,
      amount: Number(expense.amount),
      budgetId: budgetId ?? expense.budgetId ?? 0,
    });
  };

  const handleUpdate = (data: UpdateExpenseInput) => {
    doUpdate(data, { onSuccess: () => setEditing(null) });
  };

  const handleDelete = () => {
    if (!deleting) return;
    const bid = budgetId ?? deleting.budgetId;
    if (!bid) return;
    doDelete(
      { expenseId: deleting.id, budgetId: bid },
      { onSuccess: () => setDeleting(null) }
    );
  };

  return (
    <>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-primary/30">
              <ReceiptText className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-extrabold">Latest Expenses</h2>
          </div>
          {expensesList.length > 0 && (
            <span className="text-[10px] font-extrabold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
              {expensesList.length} transaction{expensesList.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {expensesList.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <ReceiptText className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold">No expenses yet</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Add your first expense to get started
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/10">
                <th className="text-left px-6 py-3 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {expensesList.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-colors group"
                >
                  <td className="px-6 py-3.5 text-sm font-semibold">{expense.name}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/50">
                      <DollarSign className="w-3 h-3" />
                      {expense.amount}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">
                    {expense.createdAt}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => openEdit(expense)}
                        aria-label={`Edit ${expense.name}`}
                      >
                        <PenLine className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleting(expense)}
                        aria-label={`Delete ${expense.name}`}
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium block mb-1.5">Expense Name</label>
              <Input placeholder="e.g. Bedroom Decor" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Amount</label>
              <Input
                type="number"
                placeholder="e.g. 1000"
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="flex-1">
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{deleting?.name}</span>{" "}
              (${deleting?.amount}) will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
