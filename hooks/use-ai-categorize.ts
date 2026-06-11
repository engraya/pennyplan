"use client";

import { useMutation } from "@tanstack/react-query";
import type { CategorizeResponse } from "@/validation/ai.schema";

interface CategorizeArgs {
  expenseName: string;
  amount: number;
  budgets: { id: number; name: string }[];
}

async function categorizeExpense(args: CategorizeArgs): Promise<CategorizeResponse> {
  const res = await fetch("/api/ai/categorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error("Failed to categorize");
  return res.json();
}

export function useAiCategorize() {
  return useMutation({
    mutationFn: categorizeExpense,
  });
}
