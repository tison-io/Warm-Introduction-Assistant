'use client';
import { useState } from "react";
import { Startup } from "../../types/startup";
import { FileText, ArrowRight, ChevronDown, Clock, CheckCircle2, ChevronUp, Trash2 } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { deleteStartup } from "@/app/lib/startup-api";

interface Props {
  startup: Startup;
  isSelectable?: boolean;
  compact?: boolean;
  onMakeIntro?: (startup: Startup) => void;
  onDeleteSuccess?: () => void;
}

export default function StartupCard({ startup, isSelectable, compact, onMakeIntro, onDeleteSuccess }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initials = (startup.founderName || "??").split(' ').map(n => n[0]).join('').toUpperCase();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStartup(startup._id);
      setIsDeleteModalOpen(false);
      onDeleteSuccess?.();
    } catch (err) {
      alert(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`bg-gray-800 rounded-2xl border border-gray-800/50 flex flex-col md:flex-row gap-4 transition-all hover:border-blue-500/30 group ${compact ? 'p-4' : 'p-6 shadow-xl'}`}>      
        <div className={`flex flex-row md:flex-col items-center md:items-start gap-3 shrink-0 ${compact ? 'md:w-32' : 'md:w-48'}`}>
          <div className={`${compact ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-xl'} bg-[#1c212c] border border-gray-800 rounded-full flex items-center justify-center text-white font-bold shrink-0 group-hover:border-blue-500/50 transition-colors`}>
            {initials}
          </div>
          <div className="overflow-hidden min-w-0">
            <h3 className={`font-bold text-white truncate ${compact ? 'text-sm' : ''}`}>{startup.founderName}</h3>
            <p className="text-[10px] text-gray-500 truncate">{startup.founderEmail}</p>
          </div>
        </div>

        <div className="grow flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider">{startup.name}</h4>
            {!compact && <span className="hidden sm:block h-1 w-1 rounded-full bg-gray-700" />}
            <div className="flex gap-1">
              {startup.tags?.map(tag => (
                <span key={tag} className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <p className={`text-gray-400 leading-relaxed transition-all duration-300 ${compact ? 'text-xs' : 'text-sm'} ${!isExpanded ? 'line-clamp-2 md:line-clamp-1' : 'block mt-2'}`}>
              {startup.blurb}
            </p>
            
            <div className="flex items-center gap-3 mt-2">
              {startup.blurb.length > 60 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} 
                  className="text-blue-500 text-[10px] font-bold flex items-center gap-1 hover:text-blue-400 transition-colors"
                >
                  {isExpanded ? (
                    <><ChevronUp size={12}/> Show Less</>
                  ) : (
                    <><ChevronDown size={12}/> See More</>
                  )}
                </button>
              )}
              
              <a 
                href={startup.pitchLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} 
                className="flex items-center gap-1 text-gray-500 hover:text-white text-[10px] transition-colors"
              >
                <FileText size={12} className="text-blue-500/70" />
                <span>Pitch</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end gap-3 md:pl-6 md:border-l border-white/5 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0">
          
          <div className="w-full flex justify-start mb-5">
            {startup.status === 'done' ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
                <CheckCircle2 size={12} className="stroke-[3px]" />
                Done
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/30 border border-slate-700/50 text-slate-400 text-[10px] font-bold tracking-wide uppercase">
                <Clock size={12} className="stroke-[3px]" />
                Pending
              </div>
            )}
          </div>

          {!isSelectable && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2.5 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10 active:scale-95"
                aria-label="Delete Request"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => onMakeIntro?.(startup)} 
                className="flex-1 md:flex-none bg-linear-to-r from-blue-600 to-blue-400 text-white font-medium py-2 px-6 rounded-lg text-sm flex items-center justify-center group/btn active:scale-95 transition-all shadow-lg shadow-blue-500/20"
              >
                <span className="whitespace-nowrap">Make Intro</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        name={startup.name}
      />
    </>
  );
}