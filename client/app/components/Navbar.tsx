'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Zap, Menu, X, User } from 'lucide-react';
import { AUTH_EVENT } from '../lib/auth-events';
import { getFounderProfile } from '../lib/founder-api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userTier, setUserTier] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const profile = await getFounderProfile();
          setUserTier(profile.tier || "trial");
          setUserName(profile.name || "");
        } catch (e) {
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            setUserTier(user.tier);
            setUserName(user.name || "");
          }
        }
      } else {
        setUserTier(null);
      }
    };

    syncAuth();
    window.addEventListener(AUTH_EVENT, syncAuth);
    return () => window.removeEventListener(AUTH_EVENT, syncAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_expiry');
    window.dispatchEvent(new Event(AUTH_EVENT));
    setUserTier(null);
    router.push('/');
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    const validParts = parts.filter(p => p && p.toLowerCase() !== 'undefined');
    
    if (validParts.length === 0) return '??';
    if (validParts.length === 1) return validParts[0].substring(0, 2).toUpperCase();
    
    return (validParts[0][0] + validParts[1][0]).toUpperCase();
  };

  const isThirdPartyPage = 
    pathname?.startsWith('/submit') || 
    pathname?.startsWith('/approve-intro');

  const isDashboardPage =
    !isThirdPartyPage && (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/investors') ||
    pathname?.startsWith('/startups') ||
    pathname?.startsWith('/create-startup') ||
    pathname?.startsWith('/generate-intro') ||
    pathname?.startsWith('/intro-wizard') ||
    pathname?.startsWith('/intro-queue') ||
    pathname?.startsWith('/reminders') ||
    pathname?.startsWith('/terms-of-service') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/profile') ||
    pathname?.startsWith('/workspace')
  );

  const navLinkStyles = `
    relative text-sm font-medium text-gray-400 transition-all duration-300 hover:text-blue-600
  `;

  return (
    <nav className="sticky flex items-center justify-between px-8 h-20 bg-[#010204] border-b border-white/5 top-0 z-50 overflow-hidden">
      <div className="absolute left-[-50px] top-[-50px] w-[250px] h-[200px] bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />
      <div className={`relative z-10 flex items-center gap-4 transition-all duration-500 ${isThirdPartyPage ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Warmly" 
            width={120} 
            height={40} 
            className="object-contain" 
          />
        </Link>
      </div>

      {!isDashboardPage && !isThirdPartyPage && (
        <div className="hidden md:flex items-center gap-10 relative z-10">
          <Link href="/about" className={navLinkStyles}>About</Link>
        </div>
      )}

      {!isThirdPartyPage && (
        <div className="flex items-center gap-6 relative z-10">
          {isLoggedIn ? (
            <div className="flex items-center gap-5">
              {userTier === 'trial' && isDashboardPage && (
                <Link href="/pricing" className="flex items-center gap-2 text-xs font-bold text-blue-500 bg-blue-500/10 hover:opacity-95 px-3 py-1 rounded-full border border-blue-500/20">
                  <Zap size={12} fill="currentColor" /> Upgrade
                </Link>
              )}

              {isDashboardPage ? (
                <>
                  <Link href="/settings" className="hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400 text-xs font-bold tracking-wider">
                      {getInitials(userName)}
                    </div>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <button className="bg-linear-to-r from-[#2563eb] to-[#3b82f6] text-white px-6 py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-blue-600/20">
                    Dashboard
                  </button>
                </Link>
              )}

              <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link href="/login" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/signup">
                <button className="bg-linear-to-r from-[#2563eb] to-[#3b82f6] text-white px-7 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
                  Get Started
                </button>
              </Link>
            </div>
          )}

          {!isDashboardPage && (
            <button className="md:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      )}

      {!isDashboardPage && !isThirdPartyPage && isMobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 z-50 bg-[#010204]/95 border-b border-white/10 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 space-y-4">
            <Link href="/" className="text-gray-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/about" className="text-gray-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="text-gray-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <hr className="border-white/5" />
            {!isLoggedIn ? (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-gray-400 py-2">Log In</Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Get Started</button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Go to Dashboard</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}