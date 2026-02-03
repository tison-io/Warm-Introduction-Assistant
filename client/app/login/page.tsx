"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, EyeOff, Eye, Loader2 } from 'lucide-react';
import { loginFounder, initiateGoogleLogin } from '../lib/founder-api';
import { FounderLoginResponse } from '../types/founder';
import { AUTH_EVENT } from '../lib/auth-events';
import Image from 'next/image';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data: FounderLoginResponse = await loginFounder(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event(AUTH_EVENT));
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get('callbackUrl');

      if (callbackUrl) {
        // Redirect to accept invite page
        router.push(callbackUrl);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    initiateGoogleLogin(callbackUrl);
  };

  return (
    <div className="relative h-screen w-full bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-900 via-slate-800 to-gray-900" />
      
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      <div
        className={`bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-8 max-w-[400px] w-full flex flex-col items-center transition-all duration-700 relative z-20 max-h-[90vh] overflow-y-auto scrollbar-hide ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-4 flex flex-col items-center text-center shrink-0">
          <Image src="/logo.png" width={45} height={35} alt="Warmly Logo" className="mb-2" />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Welcome back</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Warm Introduction Assistant</p>
        </div>

        <form className="w-full flex flex-col gap-3 sm:gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-xs font-medium ml-1">Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-gray-400/10 border border-gray-600 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-500 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-gray-300 text-xs font-medium">Password</label>
              <Link href="/forgot-password" className="text-blue-500 text-[11px] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-gray-400/10 border border-gray-600 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20 animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
          </button>

          <div className="flex items-center my-1">
            <div className="grow border-t border-gray-700"></div>
            <span className="px-3 text-gray-500 text-[10px] uppercase tracking-wider">or</span>
            <div className="grow border-t border-gray-700"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-600 text-gray-300 font-medium text-sm transition-colors hover:bg-white/5"
          >
            <Image src="/google.svg" width={16} height={16} alt="Google" />
            Sign in with Google
          </button>

          <p className="text-center text-xs text-gray-400 mt-2 pb-2">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}