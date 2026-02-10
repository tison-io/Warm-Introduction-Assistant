'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { AUTH_EVENT } from '../lib/auth-events';
import { getFounderProfile } from '../lib/founder-api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        } catch (e) {
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            setUserTier(user.tier);
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

  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/settings') || 
                          pathname?.startsWith('/profile');

  // Text-only sunset gradient hover logic
  const navLinkStyles = `
    relative text-sm font-medium text-gray-400 transition-all duration-300
    hover:text-transparent hover:bg-clip-text 
    hover:bg-gradient-to-br hover:from-[#d35400] hover:via-[#e67e22] hover:to-[#c0392b]
  `;

  return (
    <nav className="relative flex items-center justify-between px-8 h-20 bg-[#010204] border-b border-white/5 sticky top-0 z-50 overflow-hidden">
      
      {/* Left side blue gradient glow */}
      <div className="absolute left-[-50px] top-[-50px] w-[250px] h-[200px] bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center">
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

      {/* Center Nav */}
      <div className="hidden md:flex items-center gap-10 relative z-10">
        <Link href="/" className={navLinkStyles}>Home</Link>
        <Link href="/about" className={navLinkStyles}>About</Link>
        <Link href="/contact" className={navLinkStyles}>Contact</Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 relative z-10">
        {isLoggedIn ? (
          <div className="flex items-center gap-5">
            {userTier === 'trial' && (
              <Link href="/pricing" className="hidden lg:flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Zap size={12} fill="currentColor" /> Upgrade
              </Link>
            )}
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-6 py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-blue-600/20">
                Dashboard
              </button>
            </Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <button className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-7 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
                Get Started
              </button>
            </Link>
          </div>
        )}

        <button className="md:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}