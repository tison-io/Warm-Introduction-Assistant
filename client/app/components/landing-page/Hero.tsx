'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getRevealStyle = (delay: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
    transition: `opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, 
                 transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center bg-[#010204]">
      
      {/* --- EXACT RADIANCE FROM WORKFLOW SECTION --- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Blue Glow - Left Side (Exact Match) */}
        <div 
          className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'rgba(33, 163, 255, 0.25)',
            filter: 'blur(130px)',
            boxShadow: '0 0 150px 50px rgba(33, 163, 255, 0.2)',
          }}
        />
        {/* Purple Glow - Right Side (Exact Match) */}
        <div 
          className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'rgba(132, 86, 201, 0.2)',
            filter: 'blur(130px)',
            boxShadow: '0 0 150px 50px rgba(132, 86, 201, 0.15)',
          }}
        />
      </div>

      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between px-8 md:px-12 relative z-10">
        
        {/* === LEFT COLUMN === */}
        <div className="md:w-[55%] w-full flex flex-col justify-start">
          
          {/* Badge */}
          <div className="mb-10" style={getRevealStyle(0.1)}>
            <span className="inline-flex items-center space-x-3 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.25em]">
                Built for Community Owners
              </span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-[88px] font-bold leading-[0.98] text-white mb-8 tracking-tighter">
            <div style={getRevealStyle(0.3)}>Warm Intros,</div>
            <div style={getRevealStyle(0.45)} className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 animate-shimmer bg-[length:200%_auto]">
                Automated
              </span>
            </div>
          </h1>

          {/* Typewriter */}
          <div 
            className="text-lg md:text-[21px] text-slate-400/80 mb-12 max-w-xl min-h-[60px] leading-relaxed font-light tracking-wide"
            style={getRevealStyle(0.6)}
          >
            <Typewriter
              options={{ delay: 30, cursor: '|' }}
              onInit={(typewriter) => {
                typewriter
                  .typeString('The connector tool for community owners. Receive startup requests, match founders with your investor network, and generate AI-crafted warm introductions.')
                  .start();
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mb-14 w-full" style={getRevealStyle(0.75)}>
            <Link
              href="#"
              className="group flex items-center justify-center px-10 py-4.5 rounded-xl bg-blue-600 text-white font-bold text-lg transition-all shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.4)] active:scale-95"
            >
              Start Free Trial
              <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">&#8594;</span>
            </Link>
            <Link
              href="#"
              className="flex items-center justify-center px-10 py-4.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Watch demo
            </Link>
          </div>

          {/* Trust Features */}
          <div className="flex items-center gap-10 opacity-50" style={getRevealStyle(0.9)}>
             <div className="flex items-center text-cyan-500 text-[11px] font-bold uppercase tracking-widest gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                <span>Free 7-day trial</span>
             </div>
             <div className="flex items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                <span>No credit card required</span>
             </div>
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="md:w-[45%] w-full flex justify-end items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#010204] via-transparent to-transparent z-20 pointer-events-none" />
          <img
            src="/public-network.png"
            alt="People network"
            className="w-[125%] md:scale-[1.45] max-w-none object-contain relative z-10 translate-x-20"
            style={{
              mixBlendMode: 'screen', 
              maskImage: 'radial-gradient(circle at 40% 50%, white 20%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(circle at 40% 50%, white 20%, transparent 85%)',
              filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
            }}
            draggable={false}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;