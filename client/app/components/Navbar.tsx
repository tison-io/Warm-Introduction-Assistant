'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { AUTH_EVENT } from '../lib/auth-events';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    syncAuth(); // initial read

    window.addEventListener(AUTH_EVENT, syncAuth);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

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
    pathname?.startsWith('/profile');

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-6 h-16 bg-transparent relative">
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

          {/* Dashboard Mobile Menu Button */}
          {isDashboardPage && (
            <button
              className="ml-4 md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 hover:bg-gray-100 rounded p-1 transition-colors"
              onClick={() => {
                const event = new CustomEvent('toggleSidebar');
                window.dispatchEvent(event);
              }}
            >
              <span className="block w-5 h-0.5 bg-gray-700"></span>
              <span className="block w-5 h-0.5 bg-gray-700"></span>
              <span className="block w-5 h-0.5 bg-gray-700"></span>
            </button>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="flex items-center space-x-3">
          {isDashboardPage ? (
            isLoggedIn && (
              <>
                <Link href="/about">
                  <button className="bg-transparent text-gray-800 rounded-lg px-3 py-1.5 text-sm hover:text-[#0347D2]">
                    About Us
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="bg-transparent text-gray-800 rounded-lg px-3 py-1.5 text-sm hover:text-[#0347D2]">
                    Contact Us
                  </button>
                </Link>
                <Link href="/settings">
                  <User className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                </Link>
              </> 
            )
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              {isAuthPage ? (
                <>
                  {isSignupPage && (
                    <Link href="/login">
                      <button className="border border-gray-300 text-gray-800 rounded-lg px-4 py-1.5 text-sm">
                        Log in
                      </button>
                    </Link>
                  )}
                  {isLoginPage && (
                    <Link href="/signup">
                      <button className="bg-[#0347D2] text-white rounded-lg px-4 py-1.5 text-sm font-medium">
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
                        <button className="bg-[#0347D2] text-white rounded-lg px-4 py-1.5 text-sm font-medium">
                          Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="border border-gray-300 text-gray-800 rounded-lg px-4 py-1.5 text-sm"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/about">
                        <button className="bg-transparent text-gray-800 rounded-lg px-3 py-1.5 text-sm hover:text-[#0347D2]">
                          About Us
                        </button>
                      </Link>
                      <Link href="/contact">
                        <button className="bg-transparent text-gray-800 rounded-lg px-3 py-1.5 text-sm hover:text-[#0347D2]">
                          Contact Us
                        </button>
                      </Link>
                      <Link href="/signup">
                        <button className="bg-[#0347D2] text-white rounded-lg px-4 py-1.5 text-sm font-medium">
                          Sign Up
                        </button>
                      </Link>
                      <Link href="/login">
                        <button className="border border-gray-300 text-gray-800 rounded-lg px-4 py-1.5 text-sm">
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
              className={`block w-6 h-0.5 bg-gray-800 transition-transform ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-transform ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
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
