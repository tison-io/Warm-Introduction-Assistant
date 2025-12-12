"use client";
import React, { useEffect, useRef, useState } from 'react';

// Asset path
const BACKGROUND_IMAGE = '/background-img.jpg';

// Workflow steps
const steps = [
    {
        number: 1,
        title: "Generate Introduction",
        description: "Use smart templates to quickly draft your warm introduction.",
    },
    {
        number: 2,
        title: "Manage Queue",
        description: "Organize and track all your investor introductions in one place.",
    },
    {
        number: 3,
        title: "Track Follow-ups",
        description: "Receive reminders and monitor the success of your outreach.",
    },
];

// Reusable single step component
const WorkflowStep: React.FC<{ number: number, title: string, description: string, index: number }> = ({ number, title, description, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const stepRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (stepRef.current) {
            observer.observe(stepRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={stepRef}
            className="flex flex-col items-center text-center p-4 sm:p-6 transition-all duration-700 max-w-sm mx-auto md:mx-0"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                transitionDelay: `${index * 200}ms`
            }}
        >
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 shadow-lg">
                {number}
            </div>
        
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-white">
                {title}
            </h3>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {description}
            </p>
        </div>
    );
};

const Workflow: React.FC = () => {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center py-16 sm:py-20 md:pt-32 md:pb-20 bg-cover bg-center"
            style={{
                backgroundImage: `url('${BACKGROUND_IMAGE}')`,
            }}
        >   
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-12 sm:mb-16 tracking-tight">
                    How It Works
                </h2>

                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start gap-8 sm:gap-12 md:gap-16">
                    {steps.map((step, index) => (
                        <WorkflowStep 
                            key={step.number}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Workflow;