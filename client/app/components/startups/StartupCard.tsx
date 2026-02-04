'use client';
import { useState } from "react";
import { Startup } from "../../types/startup";
import { FileText, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  startup: Startup;
  isSelectable?: boolean;
  compact?: boolean;
  onMakeIntro?: (startup: Startup) => void;
}

export default function StartupCard({ startup, isSelectable, compact, onMakeIntro }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const initials = (startup.founderName || "??").split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={`bg-[#11141b] rounded-2xl border border-gray-800/50 flex flex-col md:flex-row gap-4 transition-all hover:border-blue-500/30 group ${compact ? 'p-4' : 'p-6 shadow-xl'}`}>
      
      {/* Founder Info */}
      <div className={`flex flex-row md:flex-col items-center md:items-start gap-3 shrink-0 ${compact ? 'md:w-32' : 'md:w-48'}`}>
        <div className={`${compact ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-xl'} bg-[#1c212c] border border-gray-800 rounded-full flex items-center justify-center text-white font-bold shrink-0 group-hover:border-blue-500/50 transition-colors`}>
          {initials}
        </div>
        <div className="overflow-hidden">
          <h3 className={`font-bold text-white truncate ${compact ? 'text-sm' : ''}`}>{startup.founderName}</h3>
          <p className="text-[10px] text-gray-500 truncate">{startup.founderEmail}</p>
        </div>
      </div>

      {/* Startup Details */}
      <div className="grow flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider">{startup.name}</h4>
          {!compact && <span className="h-1 w-1 rounded-full bg-gray-700" />}
          <div className="flex gap-1">
             {startup.tags?.slice(0, 1).map(tag => (
               <span key={tag} className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                 {tag}
               </span>
             ))}
          </div>
        </div>
        
        <p className={`text-gray-400 leading-relaxed ${compact ? 'text-xs' : 'text-sm'} ${!isExpanded ? 'line-clamp-1' : ''}`}>
          {startup.blurb}
        </p>

        <div className="flex items-center gap-3 mt-2">
            {startup.blurb.length > 80 && (
                <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="text-blue-500 text-[10px] font-bold flex items-center gap-1">
                    {isExpanded ? <ChevronUp size={10}/> : <ChevronDown size={10}/>}
                </button>
            )}
            <a href={startup.pitchLink} target="_blank" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-gray-500 hover:text-white text-[10px]">
                <FileText size={12} className="text-blue-500/70" />
                <span>Pitch</span>
            </a>
        </div>
      </div>

      {/* Right Section: Only show if NOT in wizard selection */}
      {!isSelectable && (
        <div className="flex items-center md:pl-6 md:border-l border-gray-800/60 shrink-0">
          <button onClick={() => onMakeIntro?.(startup)} className="bg-linear-to-r from-blue-600 to-blue-400 text-white font-medium py-2 px-6 rounded-lg text-sm flex items-center group/btn active:scale-95 transition-all">
            Make Intro <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
}