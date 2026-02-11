"use client";

import { Check } from 'lucide-react';
import Link from 'next/link';

const CTA = () => {
  const stats = [
    { label: "Community Owners", value: "500+" },
    { label: "Intros Sent", value: "10K+" },
    { label: "Successful Matches", value: "2,500+" },
    { label: "Average Rating", value: "4.9/5" }
  ];

  const features = [
    "Unlimited founder requests", "Full investor network management",
    "AI-powered intro generation",
    "3-step Intro Wizard", "Intro Queue Management", "Follow-up reminders", "Full Community Support"
  ];

  const testimonials = [
    {
      name: "David Park",
      role: "Community Manager, Startup Hub Asia",
      content: "Managing 200+ investor relationships was a nightmare before IntroLink. Now I can filter, match, and send personalized intros in seconds. The follow-up reminders alone are worth the price.",
      tag: "Community Owner"
    },
    {
      name: "Sarah Chen",
      role: "Managing Director, VC Connect",
      content: "The AI-crafted introductions hit the perfect tone every time. It saves me at least 5 hours a week in manual drafting. Essential tool for anyone in the networking space.",
      tag: "VC Partner"
    },
    {
      name: "Marcus Thorne",
      role: "Founder, Angel Network",
      content: "The Kanban board layout makes it so easy to see where every introduction stands. No more founders falling through the cracks. Highly recommended for busy connectors.",
      tag: "Angel Investor"
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="relative w-full bg-[#010204] py-24 overflow-hidden flex flex-col items-center">
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      {/* === TESTIMONIALS SECTION === */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex flex-col items-center">
        <div className="text-center mb-16">
          <h3 className="text-cyan-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">Testimonials</h3>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-12">
            Trusted by <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">Community</span> Owners
          </h2>
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 w-full">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#0a0c12]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm flex flex-col">
              <div className="text-blue-500/30 mb-6 text-4xl font-serif">“</div>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-8 font-light grow">
                {t.content}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400 text-xs font-bold tracking-wider">
                  {getInitials(t.name)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{t.name}</h4>
                  <p className="text-slate-500 text-[11px]">{t.role}</p>
                  <div className="mt-2 inline-block px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                    {t.tag}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full border border-white/5 bg-white/2 rounded-2xl p-12 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 text-center backdrop-blur-md">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-5xl font-bold text-blue-500 mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* === PRICING SECTION === */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            Simple <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Lifetime</span> Pricing
          </h2>
          <p className="text-slate-400 text-lg font-light">Start with a 7-day free trial. Then own it forever with a one-time payment.</p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-[#0a0c12] border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 rounded-b-full" />
            
            <h3 className="text-2xl font-bold text-white mb-2 mt-4">Lifetime Membership</h3>
            <div className="text-6xl font-bold text-white mb-12">$49</div>

            <ul className="w-full space-y-5 mb-12">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check size={16} className="text-blue-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button  
              className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold text-lg transition-all hover:scale-[1.02] shadow-[0_15px_30px_-10px_rgba(211,84,0,0.4)] flex items-center justify-center gap-2"
            >
              <Link href='/signup'>
                Start your free trial
              </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;