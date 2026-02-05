"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AUTH_EVENT } from '@/app/lib/auth-events';
import { 
  LayoutDashboard, Users, Rocket, Wand2, ListOrdered, 
  Settings, LogOut, ChevronLeft, ChevronRight,
  Info, PenTool, LayoutGrid,
  Zap
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

const menu = [
  { href: "/dashboard", label: "My Dashboard", icon: LayoutGrid},
  { href: "/startups", label: "Founder requests", icon: Rocket },
  { href: "/investors", label: "Investor network", icon: Users },
  { href: "/intro-queue", label: "Intro Queue", icon: ListOrdered },
  { href: "/intro-wizard", label: "Intro Wizard", icon: Wand2 },
  { href: "/reminders", label: "Reminders", icon: PenTool },
  { href: "/terms-of-service", label: "Terms of Service", icon: Info }
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userTier, setUserTier] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserTier(user.tier);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    const handleToggleSidebar = () => setIsCollapsed(!isCollapsed);
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, [isCollapsed, setIsCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_expiry');
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
        className={`fixed top-0 left-0 h-screen bg-[#152E4D] not-visited: flex flex-col justify-between py-6 transition-all duration-300 ease-in-out border-r border-white/10
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
              <Link href="/" className="flex items-center no-underline">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="sm:w-[55px] sm:h-[55px]"
                />
              </Link>
              <div className="h-1px bg-white/10 mt-4"></div>
            </div>
          )}

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
                        ${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}
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

          {!isCollapsed && userTier === 'trial' && (
            <div className="mt-3 px-2">
              <div className="relative p-4 rounded-2xl bg-linear-to-r from-[#7b78ff] to-[#4d91ff] overflow-hidden shadow-xl border border-white/10 group">
                <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Trial Plan</span>
                  </div>
                  <Link 
                    href="/pricing"
                    className="block w-full py-2 px-3 bg-white text-indigo-600 text-center text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          )}
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