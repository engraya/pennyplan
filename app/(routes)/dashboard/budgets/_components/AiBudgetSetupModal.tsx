"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateBudget } from "@/hooks/use-budgets";
import type { BudgetSetupItem } from "@/types";

export default function AiBudgetSetupModal() {
  const [open, setOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState<"form" | "preview" | "creating">("form");
  const [suggestions, setSuggestions] = useState<BudgetSetupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCount, setCreatedCount] = useState(0);

  const { mutateAsync: createBudget } = useCreateBudget();

  async function generateBudgets() {
    const income = parseFloat(monthlyIncome);
    if (!income || income <= 0) {
      setError("Please enter a valid monthly income.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/budget-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyIncome: income, location: location || undefined }),
      });
      if (!res.ok) throw new Error("Failed to generate budgets");
      const data = await res.json();
      setSuggestions(data.budgets ?? []);
      setStep("preview");
    } catch {
      setError("Failed to generate budgets. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function createAllBudgets() {
    setStep("creating");
    setCreatedCount(0);

    for (const item of suggestions) {
      try {
        await createBudget({
          name: item.name,
          amount: item.amount,
          icon: item.icon,
        });
        setCreatedCount((c) => c + 1);
      } catch {
        // continue even if one fails
      }
    }

    setOpen(false);
    resetState();
  }

  function resetState() {
    setStep("form");
    setSuggestions([]);
    setMonthlyIncome("");
    setLocation("");
    setError(null);
    setCreatedCount(0);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState(); }}>
      <DialogTrigger asChild>
        <div className="col-span-full rounded-2xl border-2 border-dashed border-primary/30 bg-primary/3 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
            <Wand2 className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-extrabold gradient-text-brand mb-1">
              Let AI Set Up Your Budgets
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tell us your income and city — Gemini will create a personalized budget plan in seconds.
            </p>
          </div>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/8">
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started with AI
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Budget Setup
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Answer 2 quick questions and Gemini will create your personalized budget plan.
            </p>
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Monthly Income (USD) <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Your City{" "}
                <span className="text-muted-foreground text-xs">(optional — helps with cost of living)</span>
              </label>
              <Input
                placeholder="e.g. Austin, TX"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button onClick={generateBudgets} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating your plan…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Budget Plan
                </>
              )}
            </Button>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-3 mt-2">
            <p className="text-sm text-muted-foreground mb-3">
              Gemini created{" "}
              <span className="font-bold text-foreground">{suggestions.length} budget categories</span>{" "}
              for you. Review and create them all.
            </p>
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-secondary/30"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-bold truncate">{item.name}</span>
                      <span className="text-sm font-extrabold gradient-text-brand shrink-0">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.reasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                Regenerate
              </Button>
              <Button onClick={createAllBudgets} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Create All {suggestions.length} Budgets
              </Button>
            </div>
          </div>
        )}

        {step === "creating" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-semibold">
              Creating budgets… {createdCount}/{suggestions.length}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
