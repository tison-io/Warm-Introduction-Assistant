"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Zap, Users, Clock, BarChart3 } from 'lucide-react';

// Asset Path
const BACKGROUND_IMAGE = '/background-img.jpg';

//Reusable feature card
const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, index: number }> = ({ icon, title, description, index }) => {
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

    return (
        <div 
            ref={cardRef}
            className="bg-white/95 backdrop-blur-sm rounded-xl p-8 md:p-10 shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-purple-500/50"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                transitionDelay: `${index * 150}ms`
            }}
        >
            <div className="text-indigo-700 mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
            <p className="text-gray-600 text-base">{description}</p>
        </div>
    );
};

// Feature card details
const FEATURES = [
    {
        icon: <Zap size={32} strokeWidth={2.5} />,
        title: "Smart Templates",
        description: "Generate investor-preferred introduction formats instantly",
    },
    {
        icon: <Users size={32} strokeWidth={2.5} />,
        title: "Investor Queue",
        description: "Organize and track all your investor introductions in one place",
    },
    {
        icon: <Clock size={32} strokeWidth={2.5} />,
        title: "Follow-up Reminders",
        description: "Never miss a follow-up with automatic reminder notifications",
    },
    {
        icon: <BarChart3 size={32} strokeWidth={2.5} />,
        title: "Analytics Dashboard",
        description: "Track your outreach performance and completion rates",
    },
];

const Features: React.FC = () => {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center py-20 bg-cover bg-center"
            style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
        >
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16 tracking-tight">
                    Features
                </h2>

                {/* Map over the FEATURES card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Features;
