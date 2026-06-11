import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllExpenses,
  getExpensesByBudget,
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/actions/expense.actions";
import { BUDGETS_KEY } from "./use-budgets";
import type { CreateExpenseInput, UpdateExpenseInput } from "@/validation/expense.schema";

export const EXPENSES_KEY = ["expenses"] as const;

export function useAllExpenses() {
  return useQuery({
    queryKey: EXPENSES_KEY,
    queryFn: () => getAllExpenses(),
  });
}

export function useExpensesByBudget(budgetId: number) {
  return useQuery({
    queryKey: [...EXPENSES_KEY, budgetId],
    queryFn: () => getExpensesByBudget(budgetId),
    enabled: !!budgetId,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExpenseInput) => createExpense(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY });
      qc.invalidateQueries({ queryKey: BUDGETS_KEY });
      qc.invalidateQueries({ queryKey: [...EXPENSES_KEY, variables.budgetId] });
      toast.success("Expense added!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateExpenseInput) => updateExpense(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY });
      qc.invalidateQueries({ queryKey: BUDGETS_KEY });
      qc.invalidateQueries({ queryKey: [...EXPENSES_KEY, variables.budgetId] });
      toast.success("Expense updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, budgetId }: { expenseId: number; budgetId: number }) =>
      deleteExpense(expenseId, budgetId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY });
      qc.invalidateQueries({ queryKey: BUDGETS_KEY });
      toast.success("Expense deleted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
