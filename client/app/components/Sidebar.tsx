"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AUTH_EVENT } from '@/app/lib/auth-events';
import { getFounderProfile } from "../lib/founder-api";
import { 
  Users, Rocket, Wand2, ListOrdered, 
  Settings, LogOut, ChevronLeft, ChevronRight,
  Info, LayoutGrid,
  Zap,
  Bell
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
  { href: "/intro-wizard", label: "Intro Wizard", icon: Wand2 },
  { href: "/intro-queue", label: "Intro Queue", icon: ListOrdered },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/terms-of-service", label: "Terms of Service", icon: Info }
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userTier, setUserTier] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    const fetchTier = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const profile = await getFounderProfile();
        setUserTier(profile.tier || "trial");
        setUserName(profile.name || "Founder");
      } catch (e) {
        console.error("Failed to fetch user tier in Sidebar", e);
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserTier(user.tier);
          setUserName(user.name || "Founder");
        }
      }
    };

    fetchTier();

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
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-20 bg-[#7b78ff] text-white rounded-full p-1.5 shadow-lg hover:bg-[#6a67ff] transition-colors z-1012 flex items-center justify-center"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

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
        </div>

        {/* Footer Buttons */}
        <div className={`space-y-3 pt-4 px-4 border-t border-white/10 ${isCollapsed ? "flex flex-col items-center" : ""}`}>     
          {!isCollapsed && (
            <div className="flex items-center justify-between p-2 rounded-xl mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-white text-xs font-bold truncate">{userName}</span>
                  <span className="text-gray-400 text-[10px] capitalize tracking-wider">{userTier} plan</span>
                </div>
              </div>
              
              {userTier === 'trial' && (
                <Link 
                  href="/pricing"
                  className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 hover:opacity-95 px-3 py-1 rounded-full border border-amber-500/20"
                >
                  Upgrade
                </Link>
              )}
            </div>
          )}

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