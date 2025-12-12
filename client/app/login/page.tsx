'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, EyeClosed, Eye, Loader2 } from 'lucide-react';
import { loginFounder } from '../lib/founder-api';
import { FounderLoginResponse } from '../types/founder';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data: FounderLoginResponse = await loginFounder(email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/backeground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
        >
          <ArrowLeft style={{ width: 16, height: 16, marginRight: 4 }} /> Back
        </button>
      </div>
      <div
        className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg max-w-sm sm:max-w-md w-full mx-4 border border-gray-200 flex flex-col gap-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 1s ease-out, transform 1s ease-out',
        }}
      >
        <div className="text-center mb-2">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-12 sm:h-16 mb-3 mx-auto"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(-30px)',
              transition: 'opacity 1.2s ease-out 0.3s, transform 1.2s ease-out 0.3s',
            }} 
          />
          <h2 className="text-xl sm:text-2xl font-bold m-0">Welcome back</h2>
          <div className="text-gray-600 text-sm sm:text-base">warm Introduction Assistant</div>
        </div>

        <form onSubmit={handleLogin}>
          <div>
            <label className="font-medium text-sm sm:text-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 text-sm sm:text-base outline-none mt-1 mb-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
            <label className="font-medium text-sm sm:text-base">Password</label>
            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 text-sm sm:text-base outline-none mt-1 pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </span>
            </div>
            <div className="text-left mb-3">
              <a href="/forgot-password" className="text-blue-600 text-sm underline hover:text-blue-800">
                Forget password?
              </a>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-3 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white text-sm sm:text-base font-semibold mb-3 transition-colors flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-2">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 underline hover:text-blue-800">
          Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
