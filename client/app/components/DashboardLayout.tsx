"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const dashboardRoutes = ['/dashboard', '/investors', '/startups', '/create-startup', '/generate-intro',  '/intro-wizard', '/intro-queue', '/reminders', '/terms-of-service', '/settings', '/profile', '/transform'];
  const showSidebar = dashboardRoutes.some(route => pathname?.startsWith(route));

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobile={isMobile} 
      />
      
      <main 
        className={`
          flex-1 min-h-screen w-full transition-all duration-300 ease-in-out ${isMobile ? "ml-[70px]" : (isCollapsed ? "ml-[70px]" : "ml-[220px]")}
        `}
      >
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}