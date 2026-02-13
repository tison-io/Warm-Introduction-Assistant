"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative w-full bg-[#010204] pt-16 pb-8 overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="Warmly Logo" 
                width={160} 
                height={40} 
                className="w-40 h-auto object-contain"
              />
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-light">
              The connector tool for community owners. Match founders to investors and generate AI-crafted warm introductions instantly.
            </p>
          </div>

          <nav className="flex items-center gap-8 md:mt-6">
            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-xs font-medium tracking-tight">Home</Link>
            <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-xs font-medium tracking-tight">About Us</Link>
            <Link href="/signup" className="text-slate-400 hover:text-white transition-colors text-xs font-medium tracking-tight">Start free trial</Link>
          </nav>

        </div>

        <div className="w-full h-px bg-white/5 mb-6" />

        <div className="flex items-center justify-center">
          <p className="text-slate-500 text-[10px] font-medium tracking-wide">
            © {currentYear} Warmly. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;