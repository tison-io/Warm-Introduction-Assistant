"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Left Side: Logo and Description */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="Warmly Logo" 
                width={64} 
                height={64} 
                className="w-10 h-auto"
              />
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered investor outreach that helps founders raise capital faster with personalized, scalable communication.
            </p>
          </div>

          {/* Right Side: Navigation Links */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-white font-semibold mb-4 uppercase tracking-widest text-xs">
              Nav Links
            </h4>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link 
                href="/about" 
                className="hover:text-blue-500 transition-colors text-sm"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-blue-500 transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link 
                href="/terms-of-service" 
                className="hover:text-blue-500 transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} Warmly. All rights reserved.
          </p>
          
          {/* Social Icons Placeholder (Optional) */}
          <div className="flex gap-6 text-xs italic">
            <span>Powered by Warmly AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}