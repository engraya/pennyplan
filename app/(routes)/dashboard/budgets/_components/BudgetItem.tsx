"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, PenLine, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteBudget } from "@/hooks/use-budgets";
import EditBudget from "../../expenses/_components/EditBudget";
import type { BudgetWithStats } from "@/types";

interface BudgetItemProps {
  budget: BudgetWithStats;
  showActions?: boolean;
}

export default function BudgetItem({ budget, showActions = false }: BudgetItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget();

  const perc = Math.min(
    ((budget.totalSpend ?? 0) / Number(budget.amount)) * 100,
    100
  );
  const remaining = Number(budget.amount) - (budget.totalSpend ?? 0);

  const statusConfig =
    perc > 80
      ? {
          bar: "bg-gradient-to-r from-rose-500 to-rose-600",
          badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
          hoverGlow: "hover:shadow-rose-200/60 dark:hover:shadow-rose-950/30",
        }
      : perc > 60
      ? {
          bar: "bg-gradient-to-r from-amber-500 to-orange-500",
          badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
          hoverGlow: "hover:shadow-amber-200/60 dark:hover:shadow-amber-950/30",
        }
      : {
          bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
          badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
          hoverGlow: "hover:shadow-emerald-200/60 dark:hover:shadow-emerald-950/30",
        };

  return (
    <>
      <div className="relative group">
        <Link href={`/dashboard/expenses/${budget.id}`}>
          <div
            className={cn(
              "bg-card rounded-2xl border border-border/80 p-5 cursor-pointer",
              "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-border/50",
              statusConfig.hoverGlow
            )}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0 shadow-sm border border-border/60">
                  {budget.icon ?? "💰"}
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight">{budget.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {budget.totalItem} item{budget.totalItem !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className={cn("text-right", showActions && "mr-7")}>
                <p className="text-base font-extrabold text-primary">${budget.amount}</p>
                <span
                  className={cn(
                    "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full",
                    statusConfig.badge
                  )}
                >
                  {perc.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out shimmer-bar",
                    statusConfig.bar
                  )}
                  style={{ width: `${perc}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>${(budget.totalSpend ?? 0).toLocaleString()} spent</span>
                <span>${remaining.toFixed(0)} left</span>
              </div>
            </div>
          </div>
        </Link>

        {showActions && (
          <div
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-secondary"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <PenLine className="w-3.5 h-3.5 mr-2" />
                  Edit budget
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash className="w-3.5 h-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {showActions && (
        <>
          <EditBudget
            budgetInfo={budget}
            open={editOpen}
            onOpenChange={setEditOpen}
          />

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this budget?</AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="font-medium text-foreground">{budget.name}</span> and
                  all its expenses will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteBudget(budget.id, {
                      onSuccess: () => setDeleteOpen(false),
                    })
                  }
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting…" : "Delete Budget"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
