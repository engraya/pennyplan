"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuList } from "./SideNav";

export default function MobileSideNav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 w-64 bg-white dark:bg-gray-900 h-full shadow-xl p-5 flex flex-col">
            <Link href="/" onClick={() => setOpen(false)}>
              <div className="flex flex-row items-center mb-6">
                <Image src="/pennyplan.svg" alt="PennyPlan logo" width={40} height={25} />
                <span className="text-blue-800 font-bold text-xl">PennyPlan</span>
              </div>
            </Link>
            <nav className="flex-1">
              {menuList.map((menu) => (
                <Link href={menu.path} key={menu.id} onClick={() => setOpen(false)}>
                  <div
                    className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-4 cursor-pointer rounded-full hover:text-primary hover:bg-blue-100 transition-colors ${
                      path === menu.path ? "text-primary bg-blue-100" : ""
                    }`}
                  >
                    <menu.icon className="w-5 h-5" />
                    {menu.name}
                  </div>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
