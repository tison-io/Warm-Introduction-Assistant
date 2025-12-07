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

  return (
    <nav className="navbar">
      <div className="logoSection">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>
      </div>
      <div className="buttons">
        {isAuthPage ? (
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
              <button onClick={handleLogout} className="loginBtn">
                Logout
              </button>
            ) : (
              <>
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
        }

        .buttons {
          display: flex;
          align-items: center;
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
      `}</style>
    </nav>
  );
}