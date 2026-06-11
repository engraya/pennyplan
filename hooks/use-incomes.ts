import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getIncomes, createIncome, updateIncome, deleteIncome } from "@/actions/income.actions";
import type { CreateIncomeInput, UpdateIncomeInput } from "@/validation/income.schema";

export const INCOMES_KEY = ["incomes"] as const;

export function useIncomes() {
  return useQuery({
    queryKey: INCOMES_KEY,
    queryFn: () => getIncomes(),
  });
}

export function useCreateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIncomeInput) => createIncome(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INCOMES_KEY });
      toast.success("Income added!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateIncomeInput) => updateIncome(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INCOMES_KEY });
      toast.success("Income updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (incomeId: number) => deleteIncome(incomeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INCOMES_KEY });
      toast.success("Income deleted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
