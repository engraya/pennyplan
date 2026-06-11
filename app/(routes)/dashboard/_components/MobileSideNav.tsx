"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menuList } from "./SideNav";
import { cn } from "@/lib/utils";

export default function MobileSideNav() {
  const path = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/8 hover:text-primary"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0 overflow-hidden">
        {/* Top rainbow accent strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 z-10" />

        <div className="h-16 flex items-center px-5 border-b border-border/70">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/60 dark:to-violet-900/60 flex items-center justify-center shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
              <Image src="/pennyplan.svg" alt="PennyPlan logo" width={18} height={18} />
            </div>
            <span className="text-base font-extrabold tracking-tight gradient-text-brand">PennyPlan</span>
          </Link>
        </div>

        <nav className="px-3 py-5 space-y-1">
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
      </SheetContent>
    </Sheet>
  );
}
