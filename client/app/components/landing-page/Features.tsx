"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Zap, Users, BarChart3, Rocket, Target, ShieldCheck } from 'lucide-react';

//Reusable feature card - With Glassmorphism
const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, index: number, colorClass: string }> = ({ icon, title, description, index, colorClass }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Map the color prop to Tailwind classes for the icon background
    const bgColors: Record<string, string> = {
        purple: "bg-purple-500/10 text-purple-400",
        blue: "bg-blue-500/10 text-blue-400",
        pink: "bg-pink-500/10 text-pink-400",
        green: "bg-green-500/10 text-green-400",
        orange: "bg-orange-500/10 text-orange-400",
    };

    return (
        <div 
            ref={cardRef}
            className="bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-900/80 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 group cursor-pointer"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${index * 100}ms`
            }}
        >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${bgColors[colorClass] || "bg-slate-800 text-white"}`}>
                {icon}
            </div>

            <h3 className="text-xl font-bold mb-3 text-white">
                {title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
};

// Feature card details
const FEATURES = [
    {
        icon: <Zap size={32} />,
        title: "AI-Powered Personalization",
        description: "Our AI analyzes investor profiles and crafts intros that speak directly to their investment thesis.",
        color: "purple",
    },
    {
        icon: <Rocket size={24} />,
        title: "10x Faster Outreach",
        description: "What used to take days now takes minutes. Scale your fundraising without sacrificing quality.",
        color: "blue",
    },
    {
        icon: <Target size={24} />,
        title: "Smart Investor Matching",
        description: "Automatically find investors who are the perfect fit for your startup's stage abd sector.",
        color: "pink"
    },
    {
        icon: <BarChart3 size={24} />,
        title: "Analytics Dashboard",
        description: "Track open investor outreach, intro success rate, and intro-outcome logs. Know exactly what's working.",
        color: "green",
    },
    {
        icon: <Users size={24} />,
        title: "Team Collaboration",
        description: "Coordinate outreach across your funding team and speed up your fundraising journey",
        color: "orange",
    },
    {
        icon: <ShieldCheck size={24} />,
        title: "Relationship CRM",
        description: "Keep track of every interaction, follow-up, and meeting in one unified workspace.",
        color: "blue",
    },
];

const Features: React.FC = () => {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden"
        >
            <div className='absolute inset-0 z-0 bg-linear-to-br from-gray-950 via-slate-800 to-blue-900' />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Everything You Need to <span className="text-blue-500">Raise Capital</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        From finding the right investors to closing the deal, Warmly has you covered.
                    </p>
                </div>

                {/* Features Grid - 3 Columns on Large Screens */}
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
        </section>
    );
};

export default Features;
