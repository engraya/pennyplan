"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCreateExpense } from "@/hooks/use-expenses";
import { useAiCategorize } from "@/hooks/use-ai-categorize";
import { useBudgets } from "@/hooks/use-budgets";
import { createExpenseSchema, type CreateExpenseInput } from "@/validation/expense.schema";
import { cn } from "@/lib/utils";

interface AddExpenseProps {
  budgetId: number;
}

export default function AddExpense({ budgetId }: AddExpenseProps) {
  const { mutate, isPending } = useCreateExpense();
  const { mutate: categorize, isPending: isCategorizing } = useAiCategorize();
  const { data: allBudgets = [] } = useBudgets();

  const [suggestedBudgetId, setSuggestedBudgetId] = useState<number | null>(null);
  const [suggestionLabel, setSuggestionLabel] = useState<string>("");
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);

  const form = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: { name: "", amount: 0, budgetId },
  });

  const watchedName = form.watch("name");
  const watchedAmount = form.watch("amount");

  // Reset suggestion when name changes significantly
  useEffect(() => {
    setSuggestedBudgetId(null);
    setSuggestionLabel("");
    setSuggestionAccepted(false);
  }, [watchedName]);

  function handleNameBlur() {
    const name = watchedName.trim();
    if (name.length < 2 || allBudgets.length <= 1) return;

    const otherBudgets = allBudgets.filter((b) => b.id !== budgetId);
    if (otherBudgets.length === 0) return;

    categorize(
      {
        expenseName: name,
        amount: watchedAmount || 0,
        budgets: allBudgets.map((b) => ({ id: b.id, name: b.name })),
      },
      {
        onSuccess: (result) => {
          if (result.budgetId !== budgetId && result.confidence !== "low") {
            const budget = allBudgets.find((b) => b.id === result.budgetId);
            if (budget) {
              setSuggestedBudgetId(result.budgetId);
              setSuggestionLabel(budget.name);
            }
          }
        },
      }
    );
  }

  function acceptSuggestion() {
    if (suggestedBudgetId) {
      form.setValue("budgetId", suggestedBudgetId);
      setSuggestionAccepted(true);
    }
  }

  function dismissSuggestion() {
    setSuggestedBudgetId(null);
    setSuggestionLabel("");
  }

  const onSubmit = (data: CreateExpenseInput) => {
    mutate(data, {
      onSuccess: () => {
        form.reset({ name: "", amount: 0, budgetId });
        setSuggestedBudgetId(null);
        setSuggestionLabel("");
        setSuggestionAccepted(false);
      },
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-sm font-semibold mb-4">Add Expense</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Expense Name</label>
          <Input
            placeholder="e.g. Bedroom Decor"
            {...form.register("name")}
            onBlur={handleNameBlur}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.name.message}
            </p>
          )}

          {/* AI Category Suggestion */}
          {isCategorizing && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>AI is categorizing…</span>
            </div>
          )}
          {suggestedBudgetId && !suggestionAccepted && (
            <div className={cn(
              "mt-2 flex items-center justify-between gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2"
            )}>
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground truncate">
                  Looks like <span className="font-semibold text-foreground">{suggestionLabel}</span>
                </span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={acceptSuggestion}
                  className="text-[10px] font-bold text-primary hover:underline px-1"
                >
                  Switch
                </button>
                <button
                  type="button"
                  onClick={dismissSuggestion}
                  className="text-[10px] text-muted-foreground hover:text-foreground px-1"
                >
                  Keep
                </button>
              </div>
            </div>
          )}
          {suggestionAccepted && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <Check className="w-3 h-3" />
              <span>Budget changed to <span className="font-semibold">{suggestionLabel}</span></span>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700/40 text-[9px] font-bold px-1 py-0 h-3.5 ml-1">
                AI
              </Badge>
            </div>
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
