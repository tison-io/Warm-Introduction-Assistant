'use client';

import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";

const workspaceBackground = `linear-gradient(
  90deg,
  #0A1520 0%,
  rgba(0, 0, 0, 0.4) 25%,
  rgba(1, 2, 8, 0.98) 96.04%,
  #0F2A5C 100%
), #050810`;

const ACCENT_FROM = "#7C59FF";
const ACCENT_TO = "#6F4CFF";

const sample = [
  { id: 1, name: "Markos Chen", firm: "Lightspeed Ventures", stage: "Medium", amount: "$5M - $20M" },
  { id: 2, name: "Markos Chen", firm: "Lightspeed Ventures", stage: "Medium", amount: "$5M - $20M" },
  { id: 3, name: "Markos Chen", firm: "Lightspeed Ventures", stage: "High", amount: "$5M - $20M" },
];

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobile={isMobile} />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-[70px]' : 'ml-[240px]'}`}>
        <div className="min-h-screen" style={{ background: workspaceBackground, color: "rgba(255,255,255,0.92)" }}>
          {/* Top bar */}
          <div
            className="w-full"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
              boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.02)",
            }}
          >
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center bg-[#07162b]">
                  <Image 
                    src="/pipeline.png" 
                    alt="Pipeline" 
                    width={20} 
                    height={20} 
                    className="w-5 h-5"
                  />
                </div>

                <div>
                  <div className="text-lg font-semibold">Pipeline</div>
                  <div className="text-xs text-slate-400">Track and manage your investor relationships</div>
                </div>
              </div>

              <div>
                <SearchInput />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium shadow-sm"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT_FROM}, ${ACCENT_TO})`,
                    boxShadow: "0 6px 18px rgba(111,76,255,0.18)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-95">
                    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm">Add investor</span>
                </button>
              </div>

              <div />
            </div>

        <div className="grid grid-cols-3 gap-8">
          <PipelineColumn title="Identified" dotColor="#E5E7EB" count={1}>
            <InvestorCard {...sample[0]} />
            <AddPlaceholder />
          </PipelineColumn>

          <PipelineColumn title="Contacted" dotColor="#60A5FA" count={2}>
            <InvestorCard {...sample[1]} />
            <InvestorCard {...sample[0]} />
            <AddPlaceholder />
          </PipelineColumn>

          <PipelineColumn title="Meeting Scheduled" dotColor="#F59E0B" count={2}>
            <InvestorCard {...sample[2]} danger />
            <InvestorCard {...sample[2]} danger />
            <AddPlaceholder />
          </PipelineColumn>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/* Search box */
function SearchInput() {
  return (
    <div className="relative">
      <input
        aria-label="Search"
        className="w-[320px] h-11 pl-4 pr-12 rounded-full text-sm placeholder:text-slate-400"
        placeholder="Search investors, intros..."
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.004)), rgba(6,17,26,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.9)",
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-4.35-4.35" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="11" cy="11" r="6" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

/* Column wrapper with small dot + counter */
function PipelineColumn({ title, dotColor, count, children }: { title: string; dotColor?: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: dotColor || "#6B7280" }} />
        <div className="text-sm font-medium">{title}</div>

        {typeof count === "number" && (
          <div className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-slate-800 border border-white/6 text-slate-300">
            {count}
          </div>
        )}
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
}

/* Card */
function InvestorCard({ name, firm, stage, amount, danger }: { name: string; firm: string; stage: string; amount: string; danger?: boolean }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.003))",
        border: "1px solid rgba(255,255,255,0.03)",
        boxShadow: "0 8px 20px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(26,41,74,1), rgba(13,22,33,1))",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
            }}
          >
            {initials(name)}
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-100">{name}</div>
            <div className="text-xs text-slate-400">{firm}</div>
          </div>
        </div>

        <div className="text-slate-400">⋯</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: danger ? "rgba(220,38,38,0.12)" : "rgba(124,89,255,0.12)",
              color: danger ? "#F87171" : "#C7B8FF",
              fontWeight: 600,
            }}
          >
            {danger ? "High" : stage}
          </span>
        </div>

        <div className="text-xs text-slate-400">{amount}</div>
      </div>
    </div>
  );
}

function AddPlaceholder() {
  return (
    <div className="mt-2">
      <button className="text-slate-400 text-sm hover:text-slate-200">+ Add investor</button>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}