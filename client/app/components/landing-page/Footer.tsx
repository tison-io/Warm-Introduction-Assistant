"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    // Reduced pt-24 to pt-16 and pb-12 to pb-8 to shrink overall height
    <footer className="relative w-full bg-[#010204] pt-16 pb-8 overflow-hidden">
      
      {/* --- TOP SEPARATOR LINE --- */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* --- CENTERED BLUE RADIANCE --- */}
      {/* Reduced height from 400px to 300px to fit the smaller footprint */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        
        {/* Main Content: Reduced mb-20 to mb-12 */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          
          {/* Left Side: Logo and Description */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4"> {/* Reduced mb-8 to mb-4 */}
              {/* Maintained big logo size but adjusted width for better fit */}
              <Image 
                src="/logo.png" 
                alt="Warmly Logo" 
                width={400} 
                height={400} 
                className="w-40 h-auto object-contain"
              />
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-light">
              The connector tool for community owners. Match founders and generate AI-crafted warm introductions instantly.
            </p>
          </div>

          {/* Right Side: Navigation */}
          {/* Adjusted mt-12 to mt-6 for a tighter look */}
          <nav className="flex items-center gap-8 md:mt-6">
            <Link href="#home" className="text-slate-400 hover:text-white transition-colors text-xs font-medium tracking-tight">Home</Link>
            <Link href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-xs font-medium tracking-tight">How It Works</Link>
            <Link href="#pricing" className="text-slate-400 hover:text-white transition-colors text-xs font-medium tracking-tight">Pricing</Link>
          </nav>

        </div>

        {/* Bottom Section Divider: Reduced mb-8 to mb-6 */}
        <div className="w-full h-px bg-white/[0.03] mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[10px] font-medium tracking-wide">
            © 2026 Warmly. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-slate-600 hover:text-slate-400 text-[10px] transition-colors font-light">Privacy Policy</Link>
            <Link href="#" className="text-slate-600 hover:text-slate-400 text-[10px] transition-colors font-light">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;