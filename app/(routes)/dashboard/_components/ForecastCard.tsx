"use client";

import { AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAiForecast } from "@/hooks/use-ai-forecast";
import type { BudgetWithStats } from "@/types";

interface ForecastCardProps {
  budgetList: BudgetWithStats[];
}

export default function ForecastCard({ budgetList }: ForecastCardProps) {
  const { data: forecasts, isLoading } = useAiForecast(budgetList);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (!forecasts || forecasts.length === 0) return null;

  const now = new Date();
  const daysLeft =
    new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();

  return (
    <div className="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <TrendingUp className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <span className="text-sm font-extrabold text-amber-700 dark:text-amber-300">
            AI Forecast
          </span>
          <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/40 text-[10px] font-bold px-1.5 py-0 h-4">
            Gemini
          </Badge>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{daysLeft}d left</span>
      </div>

      <div className="space-y-3">
        {forecasts.map((f) => {
          const overagePct = f.budgetAmount > 0
            ? ((f.projectedOverage / f.budgetAmount) * 100).toFixed(0)
            : "0";

          return (
            <div
              key={f.budgetId}
              className={cn(
                "rounded-xl border p-3.5",
                f.projectedOverage > f.budgetAmount * 0.3
                  ? "border-rose-200/60 bg-rose-50/60 dark:border-rose-800/40 dark:bg-rose-950/20"
                  : "border-amber-200/60 bg-amber-50/40 dark:border-amber-800/30 dark:bg-amber-950/10"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-bold truncate">{f.budgetName}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <AlertTriangle className={cn(
                    "w-3.5 h-3.5",
                    f.projectedOverage > f.budgetAmount * 0.3
                      ? "text-rose-500"
                      : "text-amber-500"
                  )} />
                  <span className={cn(
                    "text-xs font-bold",
                    f.projectedOverage > f.budgetAmount * 0.3 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
                  )}>
                    +${f.projectedOverage} ({overagePct}%)
                  </span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="h-1.5 bg-border/60 rounded-full mb-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    f.projectedOverage > f.budgetAmount * 0.3
                      ? "bg-gradient-to-r from-rose-500 to-pink-500"
                      : "bg-gradient-to-r from-amber-500 to-orange-500"
                  )}
                  style={{
                    width: `${Math.min((f.projectedSpend / f.budgetAmount) * 100, 100)}%`,
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{f.narrative}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
