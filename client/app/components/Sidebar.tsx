"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AUTH_EVENT } from '@/app/lib/auth-events';
import { 
  LayoutDashboard, Users, Rocket, Wand2, ListOrdered, 
  Settings, LogOut, Home, ChevronLeft, ChevronRight,
  Database, Info, PenTool, LayoutGrid
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

// Updated menu to match the labels in your screenshot
const menu = [
  { href: "/dashboard", label: "My Dashboard", icon: LayoutGrid, category: "PERSONAL" },
  { href: "/workspace-db", label: "Workspace Db", icon: Database, category: "WORKSPACE" },
  { href: "/pipeline", label: "Pipeline", icon: ListOrdered },
  { href: "/startups", label: "Startups", icon: Rocket },
  { href: "/investors", label: "Investors", icon: Users },
  { href: "/intro-queue", label: "Intro Queue", icon: ListOrdered },
  { href: "/intro-wizard", label: "Intro Wizard", icon: Wand2 },
  { href: "/ai-writer", label: "Ai Writer", icon: PenTool },
  { href: "/team", label: "Team", icon: Users },
  { href: "/terms-of-service", label: "Terms of Service", icon: PenTool },
  { href: "/about", label: "About", icon: Info }
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

  const sidebarWidth = isCollapsed ? "w-[70px]" : "w-[240px]";

  return (
    <>
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/60 z-1000 transition-opacity duration-300" 
          onClick={() => setIsCollapsed(true)} 
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 h-screen bg-blue-950 via not-visited: flex flex-col justify-between py-6 transition-all duration-300 ease-in-out border-r border-white/10
          ${sidebarWidth} 
          ${isMobile ? "z-1011" : "z-999"}
        `}
      >
        {/* Toggle Button */}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-20 bg-[#7b78ff] text-white rounded-full p-1.5 shadow-lg hover:bg-[#6a67ff] transition-colors z-1012 flex items-center justify-center"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}

        <div className="overflow-y-auto px-4 custom-scrollbar">
          {!isCollapsed && (
            <div className="px-3 mb-8">
              <Image 
                src="/logo.png" 
                alt="Warmly Logo" 
                width={64} 
                height={64} 
                className="w-10 h-auto"
              />
              <div className="h-1px bg-white/10 mt-4"></div>
            </div>
          )}

          <nav>
            <ul className="space-y-1 list-none p-0 m-0">
              {menu.map(({ href, label, icon: Icon, category }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    {category && !isCollapsed && (
                      <p className="text-[11px] font-semibold text-gray-400 mt-6 mb-2 ml-3 tracking-wider">
                        {category}
                      </p>
                    )}
                    <Link 
                      href={href} 
                      title={isCollapsed ? label : ""}
                      onClick={() => isMobile && setIsCollapsed(true)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200
                        ${isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}
                        ${isCollapsed ? "justify-center" : "justify-start"}`}
                    >
                      <Icon size={20} className="shrink-0" />
                      {!isCollapsed && (
                        <span className="text-[14px] truncate">
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

        {/* Footer Buttons */}
        <div className={`space-y-3 pt-4 px-4 border-t border-white/10 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          <Link 
            href="/settings" 
            onClick={() => isMobile && setIsCollapsed(true)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-linear-to-r from-[#7b78ff] to-[#4d91ff] text-white font-semibold text-[15px] hover:opacity-90 transition-all ${isCollapsed ? "justify-center" : ""}`}
          >
            <Settings size={20} className="shrink-0" />
            {!isCollapsed && <span className="truncate">Settings</span>}
          </Link>
          
          <button 
            onClick={handleLogout} 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-white/20 bg-[#0a1421] text-red-500 font-semibold text-[15px] hover:bg-red-500/10 transition-all ${isCollapsed ? "justify-center" : ""}`}
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