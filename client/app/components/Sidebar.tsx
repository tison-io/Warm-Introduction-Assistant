"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AUTH_EVENT } from '@/app/lib/auth-events';
import { 
  LayoutDashboard, Users, Rocket, Wand2, ListOrdered, 
  Bell, FileText, Settings, LogOut, Home, ChevronLeft, ChevronRight 
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

const menu = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/investors", label: "Investors", icon: Users },
  { href: "/startups", label: "Startups", icon: Rocket },
  { href: "/intro-wizard", label: "Intro Wizard", icon: Wand2 },
  { href: "/intro-queue", label: "Intro Queue", icon: ListOrdered },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/terms-of-service", label: "Terms of Service", icon: FileText }
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleToggleSidebar = () => setIsCollapsed(!isCollapsed);
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, [isCollapsed, setIsCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event(AUTH_EVENT));
    router.push('/');
  };

  const sidebarWidth = isCollapsed ? "w-[70px]" : "w-[220px]";
  const shadowClass = (!isCollapsed && isMobile) ? "shadow-2xl ring-1 ring-black/5" : "border-r border-gray-100";

  return (
    <>
      {/* Mobile Overlay - Only when expanded */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/40 z-1000 transition-opacity duration-300" 
          onClick={() => setIsCollapsed(true)} 
        />
      )}
      
      <aside 
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white flex flex-col justify-between py-6 transition-all duration-300 ease-in-out
          ${sidebarWidth} 
          ${shadowClass}
          ${isMobile ? "z-1011" : "z-999"}
        `}
      >
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-1012"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        <div className="overflow-y-auto px-3 custom-scrollbar">
          <nav>
            <ul className="space-y-1 list-none p-0 m-0">
              {menu.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link 
                      href={href} 
                      title={isCollapsed ? label : ""}
                      onClick={() => isMobile && setIsCollapsed(true)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200
                        ${isActive ? "bg-[#393fa7] text-white" : "text-[#151633] hover:bg-indigo-50 hover:text-[#2730a8]"}
                        ${isCollapsed ? "justify-center" : "justify-start"}`}
                    >
                      <Icon size={20} className="shrink-0" />
                      {(!isCollapsed || (!isMobile && !isCollapsed)) && (
                        <span className="text-[15.5px] truncate animate-in fade-in duration-500">
                          {label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className={`space-y-2 pt-4 px-3 border-t border-gray-50 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          <Link 
            href="/settings" 
            onClick={() => isMobile && setIsCollapsed(true)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-gray-100 text-[#2a2b34] font-medium text-[15px] hover:bg-indigo-50 transition-colors ${isCollapsed ? "justify-center" : ""}`}
          >
            <Settings size={20} className="text-[#393fa7] shrink-0" />
            {!isCollapsed && <span className="truncate">Settings</span>}
          </Link>
          <button 
            onClick={handleLogout} 
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-red-100 bg-white text-[#e23c3c] font-medium text-[15px] hover:bg-red-50 transition-colors ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="truncate">Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;