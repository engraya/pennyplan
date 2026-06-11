"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
        <div>
          <label className="text-black font-medium block mb-1">Expense Name</label>
          <Input placeholder="e.g. Bedroom Decor" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-black font-medium block mb-1">Expense Amount</label>
          <Input
            type="number"
            placeholder="e.g. 1000"
            {...form.register("amount", { valueAsNumber: true })}
          />
          {form.formState.errors.amount && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full rounded-full">
          {isPending ? <Loader className="animate-spin" /> : "Add New Expense"}
        </Button>
      </form>
    </div>
  );
}
