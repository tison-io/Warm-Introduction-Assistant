'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AUTH_EVENT } from '../../lib/auth-events';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const syncAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    syncAuth();
    window.addEventListener(AUTH_EVENT, syncAuth);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuth);
    };
  }, []);

  return (
    <div
      className='relative min-h-screen flex flex-col items-center justify-center bg-[#050a14] text-white overflow-hidden'
    >
      {/*BG- Gradient*/}
      <div
        className='absolute inset-0 z-0 bg-gradient-to-br from-blue-900 to-gray-900'
      />
      <div
        className="relative z-10 text-center text-white px-4 py-20 max-w-3xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 1s ease-out, transform 1s ease-out',
        }}
      >

        {/* Main Heading */}
        <h1 className='text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight'>
          Personalize Your Investor <br /> Outreach at Scale
        </h1>

        {/* Subtext */}
        <p className='text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed'>
          Transform cold emails into warm introductions. Our AI crafts personalized messages that resonate with investors, helping you raise capital faster.
        </p>

        {/* CTA Buttons – ONLY when NOT logged in */}
        {!isLoggedIn && (
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center group"
            >
              Start your free trial
            </Link>

            <Link
              href="/login"
              className="bg-[#1a1f2e]/50 border border-gray-700 hover:bg-[#1a1f2e] text-gray-200 font-medium py-3 px-8 rounded-lg transition-all duration-300"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
