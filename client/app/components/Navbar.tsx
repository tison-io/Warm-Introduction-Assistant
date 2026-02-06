'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Zap } from 'lucide-react';
import { AUTH_EVENT } from '../lib/auth-events';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      setIsLoggedIn(!!token);

      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserTier(user.tier);
        } catch (e) {
          setUserTier(null);
        }
      }
    };

    syncAuth(); 

    window.addEventListener(AUTH_EVENT, syncAuth);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_expiry');

    window.dispatchEvent(new Event(AUTH_EVENT));

    router.push('/');
  };

  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';
  const isAuthPage = isLoginPage || isSignupPage;

  const isDashboardPage =
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
    pathname?.startsWith('/workspace');

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-6 h-16 bg-linear-to-r from-gray-800 via-slate-900 to-gray-950 border-b border-white/10 sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center no-underline">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="sm:w-[55px] sm:h-[55px]"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="flex items-center space-x-3">
          {isDashboardPage ? (
            isLoggedIn && (
              <>
                {userTier === 'trial' && (
                  <Link href="/pricing">
                    <button className="flex items-center gap-1.5 px-3 py-1 border border-indigo-500/50 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold transition-all mr-2">
                      <Zap size={12} className="fill-indigo-400" />
                      Upgrade
                    </button>
                  </Link>
                )}
                
                <Link href="/about">
                  <button className="bg-transparent text-gray-300 rounded-lg px-3 py-1.5 text-sm hover:text-[#0347D2]">
                    About Us
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="bg-transparent text-gray-300 rounded-lg px-3 py-1.5 text-sm hover:text-[#0347D2]">
                    Contact Us
                  </button>
                </Link>
                <Link href="/settings">
                  <User className="w-6 h-6 text-gray-300 hover:text-blue-600" />
                </Link>
              </> 
            )
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              {isAuthPage ? (
                <>
                  {isSignupPage && (
                    <Link href="/login">
                      <button className="border bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-lg px-4 py-1.5 text-sm transition-colors">
                        Log in
                      </button>
                    </Link>
                  )}
                  {isLoginPage && (
                    <Link href="/signup">
                      <button className="bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-colors">
                        Sign Up
                      </button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard">
                        <button className="bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-lg px-4 py-1.5 text-sm font-medium">
                          Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/signup">
                        <button className="bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-lg px-4 py-1.5 text-sm font-medium">
                          Sign Up
                        </button>
                      </Link>
                      <Link href="/login">
                        <button className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white rounded-lg px-4 py-1.5 text-sm transition-colors">
                          Log in
                        </button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger - Only show on non-dashboard pages */}
        {!isDashboardPage && (
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span
              className={`block w-6 h-0.5 bg-gray-300 transition-transform ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-300 transition-opacity ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-300 transition-transform ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
        )}
      </nav>

      {/* Mobile Menu - Only show on non-dashboard pages */}
      {!isDashboardPage && isMobileMenuOpen && (
        <div className="
            md:hidden fixed top-16 left-0 right-0 z-50
            bg-linear-to-l from-gray-900 via-slate-800 to-blue-900
            border-t border-white/10
            shadow-lg
            backdrop-blur-md
          "
        >
          <div className="flex flex-col p-4 space-y-3 text-gray-300">
            {isAuthPage ? (
              <>
                {isSignupPage && (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-transparent border border-white/20 hover:bg-white/10 text-gray-200 rounded-lg px-6 py-3 text-base font-medium transition-colors">
                      Log in
                    </button>
                  </Link>
                )}
                {isLoginPage && (
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-lg px-6 py-3 text-base font-medium transition-colors">
                      Sign Up
                    </button>
                  </Link>
                )}
              </>
            ) : (
              <>
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-lg px-6 py-3 text-base font-medium transition-colors">
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-transparent border border-white/20 hover:bg-white/10 text-gray-200 rounded-lg px-6 py-3 text-base font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-transparent border border-white/20 hover:bg-white/10 text-gray-200 rounded-lg px-6 py-3 text-base font-medium transition-colors">
                        About Us
                      </button>
                    </Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-transparent border border-white/20 hover:bg-white/10 text-gray-200 rounded-lg px-6 py-3 text-base font-medium transition-colors">
                        Contact Us
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-lg px-6 py-3 text-base font-medium transition-colors">
                        Sign Up
                      </button>
                    </Link>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-transparent border border-white/20 hover:bg-white/10 text-gray-200 rounded-lg px-6 py-3 text-base font-medium transition-colors">
                        Log in
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}