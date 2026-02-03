'use client';

import { useState } from "react";
import { Startup } from "../../types/startup";
import { FileText, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  startup: Startup;
}

export default function StartupCard({ startup }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = startup.founderName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-[#11141b] rounded-2xl p-6 shadow-xl border border-gray-800/50 flex flex-col md:flex-row gap-6 transition-all hover:border-gray-700/50 group">
      
      {/* Left Section: Founder Info */}
      <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-48 shrink-0">
        <div className="w-14 h-14 bg-[#1c212c] border border-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 group-hover:border-orange-500/30 transition-colors">
          {initials}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-white truncate">{startup.founderName}</h3>
          <p className="text-xs text-gray-500 truncate">{startup.founderEmail}</p>
        </div>
      </div>

      {/* Middle Section: Startup Details */}
      <div className="grow flex flex-col">
        <h4 className="text-[#f97316] font-bold text-sm mb-1 uppercase tracking-wider">
          {startup.name}
        </h4>
        
        <div className="relative">
          <p className={`text-gray-400 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {startup.blurb}
          </p>
          {startup.blurb.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-400 text-xs font-semibold mt-2 flex items-center gap-1 hover:text-indigo-300 transition-colors"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read More <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Pitch Deck Link */}
        <div className="mt-4 pt-4 border-t border-gray-800/60">
          <a 
            href={startup.pitchLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-medium transition-colors"
          >
            <FileText className="w-4 h-4 text-orange-500/70" />
            <span>View Pitch Deck</span>
          </a>
        </div>
      </div>

      {/* Right Section: Action Button */}
      <div className="flex items-center md:pl-6 md:border-l border-gray-800/60 shrink-0">
        <button 
          className="w-full md:w-auto px-8 bg-[#f97316] hover:bg-[#ea580c] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-950/20 active:scale-[0.98]"
        >
          Make Intro <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}