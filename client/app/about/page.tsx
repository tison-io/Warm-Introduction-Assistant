"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, Target, ShieldCheck, BarChart3 } from "lucide-react";
import ContactPage from "../contact/page";

export default function AboutPage() {
  const router = useRouter();

  const values = [
    {
      icon: <Zap className="w-10 h-10 mb-2 text-blue-400" />,
      name: "No more Copy-Paste",
      desc: "Stop wasting hours rewriting emails and sending cold intros. Our AI engine personalizes intros in seconds.",
    },
    {
      icon: <Target className="w-10 h-10 mb-2 text-emerald-400" />,
      name: "Automated mails",
      desc: "Send consent requests and intro mails without ever touching the keyboard.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 mb-2 text-purple-400" />,
      name: "Double Opt-In",
      desc: "Protect your reputation. We ensure investors only see what they want, when they want it.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 mb-2 text-cyan-400" />,
      name: "See What's Working",
      desc: "Track every intro from start to finish. Know exactly which matches turn into real deals.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#010204] flex flex-col items-center overflow-x-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div 
          className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'rgba(33, 162, 255, 0.12)',
            filter: 'blur(120px)',
          }}
        />
        <div 
          className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'rgba(132, 86, 201, 0.18)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      <div className="w-full max-w-7xl pt-8 px-6 grid grid-cols-3 items-center relative z-10">
        <div className="flex justify-start">
        </div>

        <div className="flex justify-center">
          <h1 className="text-white text-2xl md:text-3xl font-bold whitespace-nowrap tracking-tight">
            The Vision
          </h1>
        </div>
        <div className="hidden md:block"></div>
      </div>

      <div className="max-w-[1000px] mx-auto w-[92vw] mt-16 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
            We help Community Owners <br /> 
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
              reduce time spent on making manual intros.
            </span>
          </h2>
          
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 max-w-3xl mx-auto font-light">
            Warm Intro Assistant was built to solve the "Middleman Bottleneck." 
            We provide Community Owners with the tools to manage high-volume 
            founder-investor matching and reduce the time spent by the connector through our Transform AI engine that crafts warm intros based on investor's preference.
          </p>

          <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-16" />

          <h2 className="text-white text-3xl font-bold mb-10 tracking-tight">Built for Community Owners</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 group text-left"
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-white font-bold text-lg mt-6 mb-3">
                  {value.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}