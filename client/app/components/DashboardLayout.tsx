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
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
