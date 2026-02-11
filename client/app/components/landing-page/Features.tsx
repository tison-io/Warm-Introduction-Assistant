"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Zap, Rocket, Bell, ListOrdered, Filter, Wand } from 'lucide-react';

const FeatureCard: React.FC<{ 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  index: number, 
  colorClass: string 
}> = ({ icon, title, description, index, colorClass }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const bgColors: Record<string, string> = {
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        blue: "bg-blue-600/10 text-blue-500 border-blue-500/20",
        pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
        green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };

    return (
        <div 
            ref={cardRef}
            className="bg-[#0a0c12]/40 border border-white/5 backdrop-blur-md rounded-2xl p-8 group cursor-pointer hover:border-blue-500/30 hover:bg-[#0d111a] transition-all duration-500"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionProperty: 'opacity, transform',
                transitionDuration: '1000ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${index * 100}ms`
            }}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-500 ${bgColors[colorClass] || "bg-slate-800 text-white"}`}>
                {icon}
            </div>

            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-slate-400/70 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                {description}
            </p>
        </div>
    );
};

const FEATURES = [
    { icon: <Zap size={22} />, title: "AI-Powered Personalization", description: "Our AI analyzes investor profiles and crafts intros that speak directly to their investment thesis.", color: "purple" },
    { icon: <Rocket size={22} />, title: "10x Faster Outreach", description: "What used to take days now takes minutes. Scale your fundraising without sacrificing quality.", color: "blue" },
    { icon: <Wand size={22} />, title: "3-step Intro Wizard", description: "Select a founer request, pick your investors with smart filters, review details, and hit generate. Done in under a minute.", color: "pink" },
    { icon: <ListOrdered size={22} />, title: "Intro-Queue Management", description: "All generated intros land in a centralized queue. Review, edit, and send them when you're ready; on your schedule.", color: "green" },
    { icon: <Bell size={22} />, title: "Follow-up reminders", description: "Automated in-app reminders ensure no intro falls through the cracks. Stay on top of the connection you make.", color: "orange" },
    { icon: <Filter size={22} />, title: "Smart Filters & search", description: "Filter investors by tags, searxh by name, and quickly narrow down the perfect match for every founder request.", color: "blue" },
];

const Features: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden bg-[#010204]">
            
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 75%)',
                        filter: 'blur(100px)',
                    }}
                />
                <div 
                    className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-15"
                    style={{
                        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 75%)',
                        filter: 'blur(100px)',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12">
                <div className="text-center mb-24">
                    <h3 className="text-blue-500 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
                        Powerful Features
                    </h3>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
                        Everything You Need to {" "}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500 animate-shimmer bg-size-[200%_auto]">
                                Connect
                            </span>
                        </span>
                    </h2>
                    <p className="text-slate-400/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Built for community owners who broker founder-investor relationships at scale.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                            colorClass={feature.color}
                        />
                    ))}
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
};

export default Features;