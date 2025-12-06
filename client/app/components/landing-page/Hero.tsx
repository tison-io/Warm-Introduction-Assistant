"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Assets path
const LOGO_PATH = '/logo.png';
const BACKGROUND_IMAGE_PATH = '/background-img.jpg'; 

const Hero: React.FC = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url('${BACKGROUND_IMAGE_PATH}')`,
            }}
        >
            <div className="relative z-10 text-center text-white px-4 py-20 max-w-3xl mx-auto">
        
                {/* Logo */}
                <div className="mb-10 flex justify-center">
                    <div className="bg-white rounded-full p-4 shadow-2xl w-40 h-40 flex items-center justify-center">
                        <Image 
                            src={LOGO_PATH} 
                            alt="Warmly Logo" 
                            width={96}
                            height={96}
                            className="w-24 h-auto"
                            priority
                        />    
                    </div>
                </div>
        
                {/* Main Heading */}
                <h1 className="text-xl sm:text-xl md:text-5xl font-extrabold mb-6 tracking-tight">
                    Warm Introduction Assistant
                </h1>
        
                {/* Subtext */}
                <p className="text-xl md:text-2xl mb-12 text-white font-light">
                    Streamline your investor outreach. Generate tailored introductions, manage follow-ups, and track every warm introduction.
                </p>
        
                {/* Linking Buttons */}
                <div className="flex justify-center space-x-6">
                    <Link 
                        href="/signup"
                        className="bg-blue-600 hover:bg-blue-700 border-white text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Sign Up
                    </Link>

                    <Link 
                        href="/login"
                        className="bg-white text-black hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;