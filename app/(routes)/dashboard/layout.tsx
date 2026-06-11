import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-2">
      <div className="hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-60">
        <DashboardHeader />
        <main className="p-6 max-w-[1600px]">{children}</main>
      </div>
    </div>
  );
}
