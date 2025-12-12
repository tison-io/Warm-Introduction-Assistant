'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    pathname?.startsWith('/intro-queue') ||
    pathname?.startsWith('/reminders') ||
    pathname?.startsWith('/terms-of-service') ||
    pathname?.startsWith('/settings');

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-6 py-1.5 bg-transparent relative">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center no-underline">
            <Image src="/logo.png" alt="Logo" width={55} height={55} className="sm:w-[65px] sm:h-[65px]" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="flex items-center">
          {isDashboardPage ? (
            <div className="flex items-center justify-center p-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#0347D2" strokeWidth="2" />
                <path
                  d="M4 20c0-4 3.5-7 8-7s8 3 8 7"
                  stroke="#0347D2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              {isAuthPage ? (
            <>
              {isSignupPage && (
                <Link href="/login">
                  <button className="border border-gray-300 text-gray-800 rounded-lg px-6 py-1.5 text-[15px] mr-2">
                    Log in
                  </button>
                </Link>
              )}
              {isLoginPage && (
                <Link href="/signup">
                  <button className="bg-[#0347D2] text-white rounded-lg px-6 py-1.5 text-[15px] font-medium mr-2">
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
                    <button className="bg-[#0347D2] text-white rounded-lg px-6 py-1.5 text-[15px] font-medium mr-2">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="border border-gray-300 text-gray-800 rounded-lg px-6 py-1.5 text-[15px] mr-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/about">
                    <button className="bg-transparent text-gray-800 rounded-lg px-4 py-1.5 text-[15px] font-medium mr-2 hover:text-[#0347D2]">
                      About Us
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="bg-transparent text-gray-800 rounded-lg px-4 py-1.5 text-[15px] font-medium mr-2 hover:text-[#0347D2]">
                      Contact Us
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="bg-[#0347D2] text-white rounded-lg px-6 py-1.5 text-[15px] font-medium mr-2">
                      Sign Up
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="border border-gray-300 text-gray-800 rounded-lg px-6 py-1.5 text-[15px] mr-2">
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
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        )}
      </nav>

      {/* Mobile Menu - Only show on non-dashboard pages */}
      {!isDashboardPage && isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg border-t z-50">
          <div className="flex flex-col p-4 space-y-3">
            {isAuthPage ? (
              <>
                {isSignupPage && (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full border border-gray-300 text-gray-800 rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-50">
                      Log in
                    </button>
                  </Link>
                )}
                {isLoginPage && (
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-[#0347D2] text-white rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-700">
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
                      <button className="w-full bg-[#0347D2] text-white rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-700">
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full border border-gray-300 text-gray-800 rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full text-gray-800 rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-50 border border-transparent hover:border-blue-200">
                        About Us
                      </button>
                    </Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full text-gray-800 rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-50 border border-transparent hover:border-blue-200">
                        Contact Us
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-[#0347D2] text-white rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-700">
                        Sign Up
                      </button>
                    </Link>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full border border-gray-300 text-gray-800 rounded-lg px-6 py-3 text-base font-medium hover:bg-blue-50">
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
