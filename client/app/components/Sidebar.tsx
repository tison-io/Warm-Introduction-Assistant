"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="7" height="6" rx="2" fill="currentColor"/>
      <rect x="11" y="3" width="7" height="4" rx="2" fill="currentColor" opacity="0.55"/>
      <rect x="11" y="9" width="7" height="8" rx="2" fill="currentColor"/>
      <rect x="2" y="11" width="7" height="6" rx="2" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  investors: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13.4 14.1A4 4 0 0 0 3.6 14.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M18 15a3 3 0 0 0-4-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  startups: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <path d="M3 17l7-13 7 13h-3.5L10 10l-3.5 7H3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  queue: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor"/>
      <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="3" y="13" width="14" height="2" rx="1" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  reminders: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  terms: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  profile: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 17a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  settings: (
    <svg width="17" height="17" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.41 1.41M14.37 14.37l1.41 1.41M4.22 15.78l1.41-1.41M14.37 5.63l1.41-1.41" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  logout: (
    <svg width="17" height="17" fill="none" viewBox="0 0 20 20">
      <path d="M13 7l3 3-3 3M16 10H7M10 17v-1a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v1" stroke="#e23c3c" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const menu: MenuItem[] = [
  { href: "/", label: "Home", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { href: "/dashboard", label: "Dashboard", icon: icons.dashboard },
  { href: "/investors", label: "Investors", icon: icons.investors },
  { href: "/startups", label: "Startups", icon: icons.startups },
  { href: "/intro-queue", label: "Intro Queue", icon: icons.queue },
  { href: "/reminders", label: "Reminders", icon: icons.reminders },
  { href: "/profile", label: "Profile", icon: icons.profile },
  { href: "/terms-of-service", label: "Terms of Service", icon: icons.terms }
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    
    const handleToggleSidebar = () => {
      setIsMobileOpen(prev => !prev);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('toggleSidebar', handleToggleSidebar);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <>

      
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className={`${styles['mobile-overlay']} ${isMobileOpen ? styles.show : ''}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={`${styles['sidebar-root']} ${isMobile && isMobileOpen ? styles['mobile-open'] : ''} ${isMobile && !isMobileOpen ? styles['mobile-closed'] : ''}`}>
      <div>
        <nav>
          <ul className={styles['sidebar-list']}>
            {menu.map(({ href, label, icon }) => (
              <li key={href}>
                <Link 
                  href={href} 
                  className={`${styles['sidebar-link']}${pathname === href ? ` ${styles.active}` : ""}`}
                  onClick={() => isMobile && setIsMobileOpen(false)}
                >
                  <span className={styles['sidebar-ico']}>{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <Link 
          href="/settings" 
          className={styles['sidebar-btn']}
          onClick={() => isMobile && setIsMobileOpen(false)}
        >
          <span className={styles['sidebar-ico']}>{icons.settings}</span>
          Settings
        </Link>
        <button 
          className={`${styles['sidebar-btn']} ${styles['sidebar-logout']}`} 
          type="button" 
          onClick={() => {
            handleLogout();
            isMobile && setIsMobileOpen(false);
          }}
        >
          <span className={styles['sidebar-ico']}>{icons.logout}</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
