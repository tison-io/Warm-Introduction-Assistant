'use client';

import React, { useState, useEffect, useMemo, use } from "react";
import Image from "next/image";
import { getInvestors, getRecommendations } from "../../../lib/investor-api";
import { Investor } from "../../../types/investor";
import { Search, Sparkles, UserCheck, Send, X, UserPlus, ArrowRight } from "lucide-react";

const workspaceBackground = `linear-gradient(90deg, #0A1520 0%, rgba(0, 0, 0, 0.4) 25%, rgba(1, 2, 8, 0.98) 96.04%, #0F2A5C 100%), #050810`;

export default function PipelinePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;

  const [investors, setInvestors] = useState<Investor[]>([]);
  const [recommendations, setRecommendations] = useState<Investor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [pipelineData, recommendationData] = await Promise.all([
          getInvestors(workspaceId),
          getRecommendations(workspaceId)
        ]);
        
        setInvestors(pipelineData);
        setRecommendations(recommendationData);
      } catch (err) {
        console.error("Failed to load pipeline data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workspaceId]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    const allKnown = [...investors, ...recommendations];
    
    const uniqueMap = new Map();
    allKnown.forEach(inv => uniqueMap.set(inv._id, inv));
    
    return Array.from(uniqueMap.values()).filter(inv => 
    inv.name.toLowerCase().includes(lowerQuery) || 
    inv.email.toLowerCase().includes(lowerQuery) ||
    inv.tags.some((t: string) => t.toLowerCase().includes(lowerQuery)) 
    );
  }, [searchQuery, investors, recommendations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setIsSearchModalOpen(true);
  };

  const columns = useMemo(() => ({
    recommendations: recommendations,
    notContacted: investors.filter(i => i.status === 'not-contacted'),
    contacted: investors.filter(i => i.status === 'contacted'),
  }), [investors, recommendations]);

  if (loading) return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="animate-pulse text-indigo-400 font-medium">Loading Pipeline Context...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: workspaceBackground }}>
      
      <div className="border-b border-white/5 bg-black/20 backdrop-blur-md px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Image src="/pipeline.png" alt="Pipeline" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Investor Pipeline</h1>
              <p className="text-sm text-slate-500">Managing <span className="text-indigo-400">{investors.length}</span> active relationships</p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or tag..."
              className="bg-[#020617]/60 border border-slate-800 pl-12 pr-12 py-2.5 rounded-full w-80 focus:border-indigo-500/50 outline-none text-sm transition-all text-white placeholder:text-slate-600"
            />
            {searchQuery.trim().length > 0 && (
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all animate-in fade-in zoom-in duration-200"
              >
                <ArrowRight size={16} />
              </button>
            )}
          </form>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 overflow-x-auto">
        <div className="flex gap-8 h-full min-w-[1000px]">
          
          <PipelineColumn 
            title="Recommendations" 
            icon={<Sparkles size={16} className="text-indigo-400" />}
            count={columns.recommendations.length}
            dotColor="#7C59FF"
          >
            {columns.recommendations.map(inv => (
              <InvestorCard key={inv._id} investor={inv} type="recommendation" />
            ))}
          </PipelineColumn>

          <PipelineColumn 
            title="Not Contacted" 
            icon={<UserPlus size={16} className="text-slate-400" />}
            count={columns.notContacted.length}
            dotColor="#E5E7EB"
          >
            {columns.notContacted.map(inv => (
              <InvestorCard key={inv._id} investor={inv} type="pipeline" />
            ))}
          </PipelineColumn>

          <PipelineColumn 
            title="Contacted" 
            icon={<Send size={16} className="text-emerald-400" />}
            count={columns.contacted.length}
            dotColor="#10B981"
          >
            {columns.contacted.map(inv => (
              <InvestorCard key={inv._id} investor={inv} type="pipeline" />
            ))}
          </PipelineColumn>

        </div>
      </main>

      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1520] border border-white/10 w-full max-w-xl rounded-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Search Results</h2>
                <p className="text-xs text-slate-500">Found {searchResults.length} matches for "{searchQuery}"</p>
              </div>
              <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {searchResults.length > 0 ? (
                searchResults.map(inv => (
                  <div key={inv._id} className="w-full">
                    <InvestorCard investor={inv} type="pipeline" />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-600">No matching investors found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineColumn({ title, icon, count, dotColor, children }: { title: string; icon: React.ReactNode; count: number; dotColor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 w-1/3 min-w-[320px]">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">{title}</span>
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 font-mono">
            {count}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pb-20 no-scrollbar">
        {children}
        {count === 0 && (
          <div className="border border-dashed border-white/5 rounded-2xl py-12 flex flex-col items-center justify-center text-slate-600 text-xs italic">
            No investors in this stage
          </div>
        )}
      </div>
    </div>
  );
}

function InvestorCard({ investor, type }: { investor: Investor, type: 'recommendation' | 'pipeline' }) {
  const initials = investor.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={`group rounded-xl p-5 border transition-all hover:bg-white/4 ${
      type === 'recommendation' ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-white/5 bg-white/2'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-900/40 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-200">
                {initials}
            </div>
            <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{investor.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{investor.email}</p>
            </div>
        </div>
        
        {type === 'recommendation' && (
          <button title="Add to Pipeline" className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500 hover:text-white">
            <UserPlus size={14} />
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {investor.tags?.map(tag => (
          <span key={tag} className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-black/40 border border-white/5 text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}