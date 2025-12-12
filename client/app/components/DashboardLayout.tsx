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
      <main className="flex-1 min-h-screen w-full overflow-x-hidden -mt-1 -ml-3.5 -mr-4">
        <div className="sm:p-4 md:p-6 lg:pl-6">
          {children}
        </div>
      </main>
    </div>
  );
}
