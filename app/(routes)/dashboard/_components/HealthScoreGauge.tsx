"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAiHealthScore } from "@/hooks/use-ai-health-score";
import type { BudgetWithStats, IncomeWithTotal } from "@/types";

interface HealthScoreGaugeProps {
  budgetList: BudgetWithStats[];
  incomeList: IncomeWithTotal[];
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#f43f5e";

  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
      <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor" strokeWidth="6"
        className="text-border" />
      <circle
        cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

export default function HealthScoreGauge({ budgetList, incomeList }: HealthScoreGaugeProps) {
  const [open, setOpen] = useState(false);

  const totalBudget = budgetList.reduce((s, b) => s + Number(b.amount), 0);
  const totalSpend = budgetList.reduce((s, b) => s + (b.totalSpend ?? 0), 0);
  const totalIncome = incomeList.reduce((s, i) => s + (i.totalAmount ?? 0), 0);

  const { data, isLoading } = useAiHealthScore(
    totalBudget,
    totalSpend,
    totalIncome,
    budgetList.length
  );

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-[72px] h-[72px] rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { score, explanation } = data;
  const color =
    score >= 70
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 40
      ? "text-amber-600 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";
  const label = score >= 70 ? "Healthy" : score >= 40 ? "Fair" : "Needs Attention";
  const Icon = score >= 70 ? TrendingUp : score >= 40 ? Minus : TrendingDown;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 cursor-pointer",
            "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
          )}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500" />
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <ScoreRing score={score} />
              <div className="absolute inset-0 flex items-center justify-center rotate-90">
                <span className={cn("text-lg font-extrabold", color)}>{score}</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                Health Score
              </p>
              <div className="flex items-center gap-1.5">
                <Icon className={cn("w-4 h-4 shrink-0", color)} />
                <span className={cn("text-lg font-extrabold", color)}>{label}</span>
                <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-1.5 py-0 h-4 ml-1">
                  Gemini
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Click for explanation</p>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Financial Health Score: {score}/100
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            <ScoreRing score={score} />
            <div className="absolute inset-0 flex items-center justify-center rotate-90">
              <span className={cn("text-2xl font-extrabold", color)}>{score}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
        <p className="text-xs text-muted-foreground/60 mt-2">
          Score updates when your financial data changes.
        </p>
      </DialogContent>
    </Dialog>
  );
}
