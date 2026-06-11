"use client";

import { useQuery } from "@tanstack/react-query";
import type { ForecastItem } from "@/types";
import type { BudgetWithStats } from "@/types";

async function fetchForecast(
  budgets: BudgetWithStats[],
  daysElapsed: number,
  totalDays: number
): Promise<ForecastItem[]> {
  const res = await fetch("/api/ai/forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      budgets: budgets.map((b) => ({
        id: b.id,
        name: b.name,
        amount: b.amount,
        totalSpend: b.totalSpend,
      })),
      daysElapsed,
      totalDays,
    }),
  });
  if (!res.ok) throw new Error("Failed to fetch forecast");
  const data = await res.json();
  return data.forecasts ?? [];
}

export function useAiForecast(budgets: BudgetWithStats[]) {
  const now = new Date();
  const daysElapsed = now.getDate();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return useQuery({
    queryKey: ["ai-forecast", budgets.map((b) => `${b.id}:${b.totalSpend}`).join(",")],
    queryFn: () => fetchForecast(budgets, daysElapsed, totalDays),
    enabled: budgets.length > 0 && daysElapsed >= 3,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
}
