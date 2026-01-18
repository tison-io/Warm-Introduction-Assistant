'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AUTH_EVENT } from '../../lib/auth-events';
import TypewriterComponent from 'typewriter-effect';

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
        className='absolute inset-0 z-0 bg-linear-to-br from-blue-900 via-slate-800 to-gray-950'
      />
      <div
        className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto -mt-20"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 1s ease-out, transform 1s ease-out',
        }}
      >

        {/* Logo */}
        <div className='mb-2'>
          <img src='/logo.png' alt='Logo' className='w-52 h-30 mx-auto font-black' style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
        </div>

        {/* Main Heading */}
        <h1 className='text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight'>
          Personalize Your Investor <br /> Outreach at Scale
        </h1>

        {/* Subtext */}
        <div className='text-gray-400 text-sm md:text-base mb-8 max-w-4xl mx-auto leading-relaxed font-normal'>
          Transform cold emails into warm introductions. Our AI crafts personalized messages that resonate with investors, helping you raise capital faster and build meaningful connections.
        </div>

        {/* New CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/signup"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Start Free Trial
          </Link>

          <Link
            href="/about"
            className="bg-[#1a1f2e]/50 border border-gray-700 hover:bg-[#1a1f2e] text-gray-200 font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:border-blue-400"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
