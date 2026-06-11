"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateExpense } from "@/hooks/use-expenses";
import { createExpenseSchema, type CreateExpenseInput } from "@/validation/expense.schema";

interface AddExpenseProps {
  budgetId: number;
}

export default function AddExpense({ budgetId }: AddExpenseProps) {
  const { mutate, isPending } = useCreateExpense();

  const form = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: { name: "", amount: 0, budgetId },
  });

  const onSubmit = (data: CreateExpenseInput) => {
    mutate(data, { onSuccess: () => form.reset({ name: "", amount: 0, budgetId }) });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-sm font-semibold mb-4">Add Expense</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <label className="text-sm font-medium block mb-1.5">Expense Amount</label>
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
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding…
            </>
          ) : (
            "Add Expense"
          )}
        </Button>
      </form>
    </div>
  );
}
