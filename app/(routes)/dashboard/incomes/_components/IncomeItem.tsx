"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteIncome } from "@/hooks/use-incomes";
import EditIncome from "./EditIncome";
import type { IncomeWithTotal } from "@/types";

interface IncomeItemProps {
  income: IncomeWithTotal;
}

export default function IncomeItem({ income }: IncomeItemProps) {
  const { mutate: deleteIncome, isPending: isDeleting } = useDeleteIncome();
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <div className="group bg-card rounded-2xl border border-border/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-950/30 hover:border-emerald-200/60 dark:hover:border-emerald-800/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-xl shrink-0 shadow-sm">
            {income.icon ?? "💵"}
          </span>
          <div>
            <p className="text-sm font-bold leading-tight">{income.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Income source</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            ${income.amount}
          </p>
          <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
            Monthly
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
        <EditIncome income={income} />

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete income source?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{income.name}&rdquo; will be permanently removed. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={() => deleteIncome(income.id)}
                disabled={isDeleting}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
