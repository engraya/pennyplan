"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggler } from "@/components/ThemeToggler";
import MobileSideNav from "./MobileSideNav";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": { title: "Overview", description: "Your financial snapshot" },
  "/dashboard/budgets": { title: "Budgets", description: "Manage spending limits" },
  "/dashboard/incomes": { title: "Income", description: "Track income streams" },
  "/dashboard/expenses": { title: "Expenses", description: "All transactions" },
  "/dashboard/chat": { title: "Ask AI", description: "Your Gemini-powered finance advisor" },
};

export default function DashboardHeader() {
  const path = usePathname();
  const meta = pageMeta[path] ?? { title: "Dashboard", description: "" };

  return (
    <header className="h-16 glass flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <MobileSideNav />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-extrabold gradient-text-brand leading-tight">
            {meta.title}
          </span>
          {meta.description && (
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
              {meta.description}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggler />
        <div className="ring-2 ring-primary/20 rounded-full">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
