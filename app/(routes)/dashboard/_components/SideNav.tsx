"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PiggyBank, ReceiptText, CircleDollarSign } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const menuList = [
  { id: 0, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { id: 1, name: "Incomes", icon: CircleDollarSign, path: "/dashboard/incomes" },
  { id: 2, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
  { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
];

export { menuList };

export default function SideNav() {
  const path = usePathname();

  return (
    <div className="h-screen p-5 border shadow-sm">
      <Link href="/">
        <div className="flex flex-row items-center">
          <Image src="/pennyplan.svg" alt="PennyPlan logo" width={40} height={25} />
          <span className="text-blue-800 font-bold text-xl">PennyPlan</span>
        </div>
      </Link>
      <nav className="mt-5">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
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
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton />
        <span className="text-sm text-gray-500">Profile</span>
      </div>
    </div>
  );
}
