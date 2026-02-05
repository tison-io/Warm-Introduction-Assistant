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

      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      localStorage.setItem('auth_expiry', expiryTime.toString());
      window.dispatchEvent(new Event(AUTH_EVENT));
      
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 auth-page-container relative overflow-hidden">
      {/* Background: Navy Top-Left to Black */}
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page-container {
          background-color: #070911;
          background-image: linear-gradient(135deg, 
            #2A4D8F 0%, 
            #0F2438 30%, 
            #070910 70%, 
            #070911 100%
          );
          background-attachment: fixed;
        }
      `}} />

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <button 
          onClick={() => router.push("/")} 
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back</span>
        </button>
      </div>

      {/* Card with Split Gradient: #101625 Top / #273E75 Bottom */}
      <div
        className={`relative w-full max-w-[400px] rounded-none shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ 
          background: "linear-gradient(to bottom, #101625 0%, #101625 50%, #273E75 100%)",
          backdropFilter: "blur(40px)" 
        }}
      >
        <div className="px-10 py-12 flex flex-col items-center">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <Image src="/logo.png" alt="Warmly" width={100} height={40} className="mb-6 opacity-90" />
            <h1 className="text-white text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1 lowercase">warm introduction assistant</p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full h-12 px-4 rounded-sm bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-sm bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Link 
                href="/forgot-password" 
                className="text-[13px] text-blue-400 hover:text-blue-300 transition-colors block ml-1 mt-1 font-medium"
              >
                Forget password?
              </Link>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-400/5 py-2 border border-red-400/10">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0035C5] hover:bg-[#002db1] text-white font-bold rounded-none transition-all active:scale-[0.99]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Log in"}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter whitespace-nowrap">or continue with</span>
              <div className="flex-1 hpx bg-white/10" />
            </div>

            <button
              type="button"
              onClick={() => initiateGoogleLogin()}
              className="w-full h-12 rounded-none flex items-center gap-3 justify-center text-sm font-bold text-blue-400 border border-white/10 bg-[#070911]/50 hover:bg-black/80 transition-colors"
            >
              <Image src="/google.svg" width={18} height={18} alt="Google" />
              Sign in with Google
            </button>

            <p className="text-center text-[13px] text-slate-400 pt-2">
              Don't have an account? <Link href="/signup" className="text-blue-400 hover:underline font-medium ml-1">Sign Up</Link>
            </p>
          </form>
        </div>

        {/* Brand Accent Bar */}
        <div className="h-[5px] w-full" style={{ background: "linear-gradient(90deg, #2A4D8F 0%, #0F2438 50%, #070911 100%)" }} />
      </div>
    </div>
  );
}
