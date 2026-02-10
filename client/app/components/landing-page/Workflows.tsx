'use client';
import React from 'react';
import { FileText, Search, Wand2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Automated Outreach",
    desc: "AI-powered algorithms match members based on interests, goals, and compatibility.",
    icon: <FileText className="w-7 h-7 text-white" />,
  },
  {
    id: 2,
    title: "Choose your Investors",
    desc: "Filter your investor network by tags, sector, or search by name. Select the investors you want to introduce the founder to.",
    icon: <Search className="w-7 h-7 text-white" />,
  },
  {
    id: 3,
    title: "Generate & Send",
    desc: "Review your selections, hit generate, and let AI craft a warm intro tailored to each investor’s preferred format. Send directly from the queue.",
    icon: <Wand2 className="w-7 h-7 text-white" />,
  },
];

const Workflows = () => (
  <section className="relative w-full bg-[#010204] py-32 overflow-hidden flex flex-col items-center">
    
    {/* --- FORCE VISIBILITY RADIANCE (MODIFIED) --- */}
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Blue Glow - Left Side (Lowered blur for more definition) */}
      <div 
        className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'rgba(33, 162, 255, 0.07)', 
          filter: 'blur(100px)', // Lowered from 130px
          boxShadow: '0 0 120px 40px rgba(33, 163, 255, 0.15)',
        }}
      />
      {/* Purple Glow - Right Side (Lowered color and blur very slightly) */}
      <div 
        className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'rgba(132, 86, 201, 0.09)', // Lowered from 0.2
          filter: 'blur(100px)', // Lowered from 130px
          boxShadow: '0 0 120px 40px rgba(132, 86, 201, 0.1)',
        }}
      />
    </div>

    <div className="relative max-w-7xl mx-auto px-8 z-10 w-full text-center">
      {/* Header */}
      <div className="mb-24">
        <h3 className="text-[#21A3FF] text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
          The Solution
        </h3>
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21e6c1] via-[#21A3FF] to-[#8456c9] animate-shimmer bg-[length:200%_auto]">
            Warmly
          </span>
          {' '}Does the Heavy Lifting
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Our platform automates the entire introduction workflow so you can focus on growing your community.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="relative w-full">
        {/* Connective line */}
        <div className="hidden md:block absolute left-[15%] right-[15%] top-[28px] h-px bg-blue-500/20 z-0" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center group">
              <div className="w-14 h-14 rounded-xl bg-[#21A3FF] flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(33,163,255,0.6)] group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <span className="text-[#21A3FF] text-[10px] font-bold uppercase tracking-widest mb-3">
                Step {step.id}
              </span>
              <h4 className="text-white text-xl font-bold mb-4">{step.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[320px] opacity-80">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
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
  </section>
);

export default Workflows;