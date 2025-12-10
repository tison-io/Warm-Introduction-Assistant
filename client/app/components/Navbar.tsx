'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <nav className="flex items-center justify-between px-6 py-3 bg-transparent min-h-[48px]">
      {/* Logo + Home */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center no-underline">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>

        {isDashboardPage && (
          <Link
            href="/"
            title="Go to Home"
            className="flex items-center justify-center p-1.5 cursor-pointer transition-opacity hover:opacity-70"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke="#0347D2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12h6v10"
                stroke="#0347D2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Right Buttons */}
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
        ) : isAuthPage ? (
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
    </nav>
  );
}
