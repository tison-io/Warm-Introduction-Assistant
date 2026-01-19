"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Award, Leaf, Scale } from "lucide-react";
import ContactPage from "../contact/page";

export default function AboutPage() {
  const router = useRouter();

  const values = [
    {
      icon: <ShieldCheck className="w-10 h-10 mb-2 text-blue-400" />,
      name: "Privacy",
      desc: "Your data is always handled with respect and responsibility.",
    },
    {
      icon: <Award className="w-10 h-10 mb-2 text-yellow-400" />,
      name: "Reliability",
      desc: "A platform you can depend on, anytime.",
    },
    {
      icon: <Leaf className="w-10 h-10 mb-2 text-green-400" />,
      name: "Simplicity",
      desc: "Clean, intuitive experiences without the clutter.",
    },
    {
      icon: <Scale className="w-10 h-10 mb-2 text-purple-400" />,
      name: "Integrity",
      desc: "Clear policies, honest communication, and ethical practices.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-linear-to-r from-blue-900 via-slate-800 to-gray-950 flex flex-col items-center overflow-x-hidden pb-20">
      <div className="w-full max-w-7xl pt-8 px-6 grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-transparent text-slate-300 text-[17px] cursor-pointer font-medium hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Back
          </button>
        </div>

        <div className="flex justify-center">
          <h1 className="text-white text-2xl md:text-3xl font-bold whitespace-nowrap tracking-tight">
            About Us
          </h1>
        </div>

        <div className="hidden md:block"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto w-[92vw] mt-12 p-8 md:p-12">
        <div className="text-center">
          <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
            We are a platform built to make meaningful connections simple, secure,
            and effortless. Our focus is on creating a smooth experience that
            helps people interact, collaborate, and get things done without
            unnecessary complexity.
          </p>

          <hr className="border-white/10 my-10" />

          <h2 className="text-white text-3xl font-bold mb-6 italic tracking-tight">Our Purpose</h2>
          <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-16 max-w-3xl mx-auto">
            Our purpose is to bridge gaps—between people, ideas, and
            opportunities. We exist to make communication easier by providing a
            trusted space where users can connect confidently.
          </p>

          <h2 className="text-white text-3xl font-bold mb-10 tracking-tight">What We Stand For</h2>

          {/* Value Cards*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300 group shadow-lg"
              >
                <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-white font-bold text-lg mt-4 mb-2">
                  {value.name}
                </h3>
                <p className="text-slate-400 text-sm leading-snug font-light">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 my-16">
        <hr className="border-t border-white/10" />
      </div>
      
      {/* Contact page Section */}
      <div className="text-white text-2xl md:text-3xl font-bold whitespace-nowrap tracking-tight">
        Contact Us
      </div>
      <div className="w-full">
        <ContactPage />
      </div>
    </div>
  );
}