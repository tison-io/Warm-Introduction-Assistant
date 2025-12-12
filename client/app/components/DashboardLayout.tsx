"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const dashboardRoutes = ['/dashboard', '/investors', '/startups', '/create-startup', '/generate-intro', '/intro-queue', '/reminders', '/terms-of-service', '/settings', '/profile'];
  const showSidebar = dashboardRoutes.some(route => pathname?.startsWith(route));

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen w-full overflow-x-hidden">
        <div className="pt-4 px-3 pb-3 sm:p-4 md:p-6 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
