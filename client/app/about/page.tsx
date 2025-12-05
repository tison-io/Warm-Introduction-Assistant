"use client";

import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Shield, 
    Zap,
    Feather,
    ScrollText,
} from "lucide-react";

// Reusable component for a single value proposition item
const ValueItem: React.FC<{
    Icon: React.ElementType;
    title: string;
    description: string;
}> = ({ Icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-3">
        <div className="p-3 mb-2 rounded-full bg-indigo-600 border border-indigo-400/50">
            <Icon className="w-8 h-8 text-white" />
        </div>
    
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-white text-xs">{description}</p>
    </div>
);

export default function AboutPage() {
    const router = useRouter();

    const BACKGROUND_IMAGE_PATH = "/background-img.jpg"; // Use the same background image

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col"
            style={{ backgroundImage: `url('${BACKGROUND_IMAGE_PATH}')` }}
        >
            {/* Top Section: Back Arrow Left, Title Center */}
            <div className="relative z-10 max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 shrink-0 w-full">
                <div className="flex justify-center items-center relative py-2">
                    <button
                        onClick={() => router.back()}
                        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-white/80 hover:text-white text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </button>

                    <h1 className="text-2xl font-extrabold text-white text-center">
                        About Us
                    </h1>
                </div>
            </div>

            {/* Main Content Area: Compressed Content */}
            <section className="relative z-10 grow max-h-[88vh] overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    {/* About Us Card Content */}
                    <div className="rounded-xl p-6 md:p-8 mb-6 text-white">
            
                        {/* Introduction */}
                        <p className="text-white text-sm text-center mb-6">
                            We are a platform built to make meaningful connections simple, secure, and effortless. Our focus is on creating a smooth experience that helps people interact, collaborate, and get things done without unnecessary complexity. Every feature we design aims to save time, reduce friction, and empower users with tools that feel reliable and intuitive.
                        </p>

                        {/* Our Purpose Section */}
                        <h2 className="text-2xl font-bold text-center text-white mb-4">
                            Our Purpose
                        </h2>
                        <p className="text-gray-200 text-sm text-center mb-8">
                            Our purpose is to bridge gaps—between people, ideas, and opportunities. We exist to make communication easier by providing a trusted space where users can connect confidently and achieve what matters to them. Everything we do centers on improving clarity, convenience, and accessibility in everyday interactions.
                        </p>

                        {/* What We Stand For Section */}
                        <h2 className="text-2xl font-bold text-center text-indigo-300 mb-6">
                            What We Stand For
                        </h2>
            
                        {/* Value Proposition Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ValueItem
                                Icon={Shield}
                                title="Privacy"
                                description="Your data is always handled with respect and responsibility."
                            />
                            <ValueItem
                                Icon={Zap}
                                title="Reliability"
                                description="A platform you can depend on, anytime."
                            />
                            <ValueItem
                                Icon={Feather}
                                title="Simplicity"
                                description="Clean, intuitive experiences without the clutter."
                            />
                            <ValueItem
                                Icon={ScrollText}
                                title="Integrity"
                                description="Clear policies, honest communication, and ethical practices."
                            />
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}