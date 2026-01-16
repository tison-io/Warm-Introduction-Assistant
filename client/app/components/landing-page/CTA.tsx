'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CTASection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-linear-to-tr from-gray-900 to-blue-900" />

      <div
        className="relative z-10 w-full max-w-5xl px-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
        }}
      >
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md rounded-3xl p-10 md:p-20 text-center shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Ready to <span className="text-blue-500">Transform</span> Your <br className="hidden md:block" /> Fundraising?
          </h2>

          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of founders who have already raised millions using Warmly&apos;s 
            AI-powered investor outreach platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center group"
            >
              Start Your Free Trial 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              View Pricing
            </Link>
          </div>

          <p className="text-slate-500 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;