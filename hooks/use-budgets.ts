import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
} from "@/actions/budget.actions";
import type { CreateBudgetInput, UpdateBudgetInput } from "@/validation/budget.schema";

export const BUDGETS_KEY = ["budgets"] as const;

export function useBudgets() {
  return useQuery({
    queryKey: BUDGETS_KEY,
    queryFn: () => getBudgets(),
  });
}

export function useBudgetById(budgetId: number) {
  return useQuery({
    queryKey: [...BUDGETS_KEY, budgetId],
    queryFn: () => getBudgetById(budgetId),
    enabled: !!budgetId,
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBudgetInput) => createBudget(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BUDGETS_KEY });
      toast.success("Budget created!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBudgetInput) => updateBudget(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BUDGETS_KEY });
      toast.success("Budget updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (budgetId: number) => deleteBudget(budgetId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BUDGETS_KEY });
      toast.success("Budget deleted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
