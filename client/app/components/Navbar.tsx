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
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/investors') || pathname?.startsWith('/startups') || pathname?.startsWith('/create-startup') || pathname?.startsWith('/generate-intro') || pathname?.startsWith('/intro-queue') || pathname?.startsWith('/reminders') || pathname?.startsWith('/terms-of-service') || pathname?.startsWith('/settings');

  return (
    <nav className="navbar" style={{ background: 'transparent', backgroundColor: 'transparent' }}>
      <div className="logoSection">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>
        {isDashboardPage && (
          <Link href="/" className="homeIcon" title="Go to Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#0347D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="#0347D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>
      <div className="buttons">
        {isDashboardPage ? (
          <div className="userIcon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#0347D2" strokeWidth="2"/>
              <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="#0347D2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        ) : isAuthPage ? (
          <>
            {isSignupPage && (
              <Link href="/login">
                <button className="loginBtn">Log in</button>
              </Link>
            )}
            {isLoginPage && (
              <Link href="/signup">
                <button className="signupBtn">Sign Up</button>
              </Link>
            )}
          </>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard">
                  <button className="signupBtn">Dashboard</button>
                </Link>
                <button onClick={handleLogout} className="loginBtn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/about">
                  <button className="navBtn">About Us</button>
                </Link>
                <Link href="/contact">
                  <button className="navBtn">Contact Us</button>
                </Link>
                <Link href="/signup">
                  <button className="signupBtn">Sign Up</button>
                </Link>
                <Link href="/login">
                  <button className="loginBtn">Log in</button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border-bottom: none;
          background: transparent;
          min-height: 48px;
        }
        .logoSection {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .homeIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .homeIcon:hover {
          opacity: 0.7;
        }

        .buttons {
          display: flex;
          align-items: center;
        }
        .navBtn {
          border: none;
          background: transparent;
          color: #333;
          border-radius: 8px;
          padding: 6px 16px;
          margin-right: 8px;
          font-size: 15px;
          cursor: pointer;
          font-weight: 500;
        }
        .navBtn:hover {
          color: #0347D2;
        }
        .loginBtn {
          border: 1px solid #cfd1d3;
          background: transparent;
          color: #333;
          border-radius: 8px;
          padding: 6px 24px;
          margin-right: 8px;
          font-size: 15px;
          cursor: pointer;
        }
        .signupBtn {
          background: #0347D2;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 6px 24px;
          margin-right: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
        }
        .userIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
      `}</style>
    </nav>
  );
}