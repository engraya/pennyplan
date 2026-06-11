"use client";

import { useQuery } from "@tanstack/react-query";
import type { HealthScore } from "@/types";

async function fetchHealthScore(
  totalBudget: number,
  totalSpend: number,
  totalIncome: number,
  budgetCount: number
): Promise<HealthScore> {
  const res = await fetch("/api/ai/health-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ totalBudget, totalSpend, totalIncome, budgetCount }),
  });
  if (!res.ok) throw new Error("Failed to fetch health score");
  return res.json();
}

export function useAiHealthScore(
  totalBudget: number,
  totalSpend: number,
  totalIncome: number,
  budgetCount: number
) {
  return useQuery({
    queryKey: ["ai-health-score", totalBudget, totalSpend, totalIncome, budgetCount],
    queryFn: () => fetchHealthScore(totalBudget, totalSpend, totalIncome, budgetCount),
    enabled: budgetCount > 0 || totalIncome > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
}
