'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AUTH_EVENT } from '../../lib/auth-events';

// Assets path
const LOGO_PATH = '/logo.png';
const BACKGROUND_IMAGE_PATH = '/background-img.jpg';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsVisible(true);

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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('${BACKGROUND_IMAGE_PATH}')`,
      }}
    >
      <div
        className="relative z-10 text-center text-white px-4 py-20 max-w-3xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 1s ease-out, transform 1s ease-out',
        }}
      >
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div
            className="bg-white rounded-full p-4 shadow-2xl w-40 h-40 flex items-center justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? 'scale(1) rotate(0deg)'
                : 'scale(0.3) rotate(-180deg)',
              transition:
                'opacity 1.2s ease-out 0.2s, transform 1.2s ease-out 0.2s',
            }}
          >
            <Image
              src={LOGO_PATH}
              alt="Warmly Logo"
              width={96}
              height={96}
              className="w-24 h-auto"
              priority
            />
          </div>
        </div>

        {/* Main Heading */}
        <h1
          className="text-xl sm:text-xl md:text-5xl font-extrabold mb-6 tracking-tight"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            transition:
              'opacity 1s ease-out 0.4s, transform 1s ease-out 0.4s',
          }}
        >
          Warm Introduction Assistant
        </h1>

        {/* Subtext */}
        <p
          className="text-xl md:text-2xl mb-12 text-white font-light"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            transition:
              'opacity 1s ease-out 0.6s, transform 1s ease-out 0.6s',
          }}
        >
          Streamline your investor outreach. Generate tailored introductions,
          manage follow-ups, and track every warm introduction.
        </p>

        {/* CTA Buttons – ONLY when NOT logged in */}
        {!isLoggedIn && (
          <div
            className="flex justify-center space-x-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition:
                'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s',
            }}
          >
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-xl"
            >
              Sign Up
            </Link>

            <Link
              href="/login"
              className="bg-white text-black hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-xl"
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
