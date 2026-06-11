import { UserButton } from "@clerk/nextjs";
import { ThemeToggler } from "@/components/ThemeToggler";
import MobileSideNav from "./MobileSideNav";

export default function DashboardHeader() {
  return (
    <div className="p-5 shadow-sm border-b flex justify-between items-center">
      <div className="md:hidden">
        <MobileSideNav />
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <ThemeToggler />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
