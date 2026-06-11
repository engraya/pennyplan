"use client";

import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils";
import type { BudgetWithStats, IncomeWithTotal } from "@/types";

interface CardInfoProps {
  budgetList: BudgetWithStats[];
  incomeList: IncomeWithTotal[];
}

interface StatCardConfig {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  iconGradient: string;
  iconShadow: string;
  accentBar: string;
  hoverGlow: string;
  blobColor: string;
}

function StatCard({ card }: { card: StatCardConfig }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5",
        "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group cursor-default",
        card.hoverGlow
      )}
    >
      {/* Top accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", card.accentBar)} />

      {/* Background glow blob */}
      <div
        className={cn(
          "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-15 transition-opacity duration-300 group-hover:opacity-35",
          card.blobColor
        )}
      />

      <div className="relative">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-lg bg-gradient-to-br",
            card.iconGradient,
            card.iconShadow
          )}
        >
          <card.icon className="w-5 h-5 text-white" />
        </div>

        <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
          {card.label}
        </p>
        <p className="text-3xl font-extrabold tracking-tight">{card.value}</p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 shrink-0" />
          {card.subtext}
        </p>
      </div>
    </div>
  );
}

export default function CardInfo({ budgetList, incomeList }: CardInfoProps) {
  const totalBudget = budgetList.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpend = budgetList.reduce((sum, b) => sum + (b.totalSpend ?? 0), 0);
  const totalIncome = incomeList.reduce((sum, i) => sum + (i.totalAmount ?? 0), 0);
  const spendPercent =
    totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(1) : "0";

  const [financialAdvice, setFinancialAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const [debouncedBudget] = useDebounce(totalBudget, 800);
  const [debouncedSpend] = useDebounce(totalSpend, 800);
  const [debouncedIncome] = useDebounce(totalIncome, 800);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (debouncedBudget === 0 && debouncedIncome === 0) return;
    hasFetchedRef.current = false;
  }, [debouncedBudget, debouncedSpend, debouncedIncome]);

  useEffect(() => {
    if ((debouncedBudget === 0 && debouncedIncome === 0) || hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    setLoadingAdvice(true);

    fetch("/api/ai/financial-advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalBudget: debouncedBudget,
        totalIncome: debouncedIncome,
        totalSpend: debouncedSpend,
      }),
    })
      .then((res) => res.json())
      .then((data) => setFinancialAdvice(data.advice ?? ""))
      .catch(() => setFinancialAdvice("Unable to load financial advice right now."))
      .finally(() => setLoadingAdvice(false));
  }, [debouncedBudget, debouncedSpend, debouncedIncome]);

  if (budgetList.length === 0) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-[88px] rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[152px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards: StatCardConfig[] = [
    {
      label: "Total Budget",
      value: `$${formatNumber(totalBudget)}`,
      subtext: `${budgetList.length} active budget${budgetList.length !== 1 ? "s" : ""}`,
      icon: PiggyBank,
      iconGradient: "from-violet-500 to-indigo-600",
      iconShadow: "shadow-violet-500/30",
      accentBar: "bg-gradient-to-r from-violet-500 to-indigo-500",
      hoverGlow: "hover:shadow-violet-200/80 dark:hover:shadow-violet-950/40",
      blobColor: "bg-violet-400",
    },
    {
      label: "Total Spent",
      value: `$${formatNumber(totalSpend)}`,
      subtext: `${spendPercent}% of budget used`,
      icon: ReceiptText,
      iconGradient: "from-rose-500 to-pink-600",
      iconShadow: "shadow-rose-500/30",
      accentBar: "bg-gradient-to-r from-rose-500 to-pink-500",
      hoverGlow: "hover:shadow-rose-200/80 dark:hover:shadow-rose-950/40",
      blobColor: "bg-rose-400",
    },
    {
      label: "Active Budgets",
      value: String(budgetList.length),
      subtext: "categories tracked",
      icon: Wallet,
      iconGradient: "from-amber-500 to-orange-500",
      iconShadow: "shadow-amber-500/30",
      accentBar: "bg-gradient-to-r from-amber-500 to-orange-500",
      hoverGlow: "hover:shadow-amber-200/80 dark:hover:shadow-amber-950/40",
      blobColor: "bg-amber-400",
    },
    {
      label: "Total Income",
      value: `$${formatNumber(totalIncome)}`,
      subtext: `${incomeList.length} income stream${incomeList.length !== 1 ? "s" : ""}`,
      icon: CircleDollarSign,
      iconGradient: "from-emerald-500 to-teal-600",
      iconShadow: "shadow-emerald-500/30",
      accentBar: "bg-gradient-to-r from-emerald-500 to-teal-500",
      hoverGlow: "hover:shadow-emerald-200/80 dark:hover:shadow-emerald-950/40",
      blobColor: "bg-emerald-400",
    },
  ];

  return (
    <div className="space-y-5">
      {/* AI Insight card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/8 via-violet-500/5 to-fuchsia-500/5 p-5">
        <div className="shimmer-bar absolute inset-0 pointer-events-none opacity-60" />

        <div className="relative flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-extrabold gradient-text-brand">
                AI Financial Insight
              </span>
              <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-1.5 py-0 h-4">
                GPT-4o
              </Badge>
            </div>
            {loadingAdvice ? (
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {financialAdvice || "Analyzing your finances…"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>
    </div>
  );
}
