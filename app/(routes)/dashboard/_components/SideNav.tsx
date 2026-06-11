"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PiggyBank, ReceiptText, CircleDollarSign } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const menuList = [
  { id: 0, name: "Overview", icon: LayoutGrid, path: "/dashboard" },
  { id: 1, name: "Income", icon: CircleDollarSign, path: "/dashboard/incomes" },
  { id: 2, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
  { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
];

export { menuList };

export default function SideNav() {
  const path = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-60 h-screen flex flex-col bg-card border-r border-border/70 fixed left-0 top-0 z-30 overflow-hidden">
      {/* Top rainbow accent strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 z-10" />

      {/* Background glow blob */}
      <div className="absolute -top-24 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border/70 shrink-0 relative">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/60 dark:to-violet-900/60 flex items-center justify-center shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
            <Image src="/pennyplan.svg" alt="PennyPlan logo" width={18} height={18} />
          </div>
          <span className="text-base font-extrabold tracking-tight gradient-text-brand">PennyPlan</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/50 px-3 mb-3">
          Navigation
        </p>
        {menuList.map((menu) => {
          const isActive = path === menu.path;
          return (
            <Link href={menu.path} key={menu.id}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-violet-500/5 text-primary border-l-[3px] border-primary shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
                style={isActive ? { paddingLeft: "calc(0.75rem - 3px)" } : {}}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0",
                    isActive
                      ? "bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/30"
                      : "text-muted-foreground"
                  )}
                >
                  <menu.icon className="w-[15px] h-[15px]" />
                </div>
                {menu.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border/70 p-4 shrink-0 bg-secondary/20">
        <div className="flex items-center gap-3">
          <div className="ring-2 ring-primary/20 rounded-full shrink-0">
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
