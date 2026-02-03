'use client';

import { useState } from "react";
import { Startup } from "../../types/startup";
import { FileText, ArrowRight, ChevronDown, ChevronUp, Tag } from "lucide-react";

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
    <div className="bg-[#11141b] rounded-2xl p-6 shadow-xl border border-gray-800/50 flex flex-col md:flex-row gap-6 transition-all hover:border-blue-500/30 group">
      
      {/* Left Section: Founder Info */}
      <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-48 shrink-0">
        <div className="w-14 h-14 bg-[#1c212c] border border-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 group-hover:border-blue-500/50 transition-colors">
          {initials}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-white truncate">{startup.founderName}</h3>
          <p className="text-xs text-gray-500 truncate">{startup.founderEmail}</p>
        </div>
      </div>

      {/* Middle Section: Startup Details */}
      <div className="grow flex flex-col">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider">
            {startup.name}
          </h4>
          <span className="h-1 w-1 rounded-full bg-gray-700" />
          <div className="flex gap-2">
             {startup.tags?.slice(0, 2).map(tag => (
               <span key={tag} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20">
                 {tag}
               </span>
             ))}
          </div>
        </div>
        
        <div className="relative">
          <p className={`text-gray-400 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {startup.blurb}
          </p>
          {startup.blurb.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-xs font-semibold mt-2 flex items-center gap-1 hover:text-blue-300 transition-colors"
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
            <FileText className="w-4 h-4 text-blue-500/70" />
            <span>View Pitch Deck</span>
          </a>
        </div>
      </div>

      {/* Right Section: Updated Blue Gradient Button */}
      <div className="flex items-center md:pl-6 md:border-l border-gray-800/60 shrink-0">
        <button 
          className="w-full md:w-auto bg-linear-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center group/btn active:scale-95"
        >
          Make Intro 
          <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}