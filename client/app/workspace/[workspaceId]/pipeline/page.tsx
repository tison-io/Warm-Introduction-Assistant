'use client';

import React, { useState, useEffect, useMemo, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getInvestors, getRecommendations, deleteInvestor } from "../../../lib/investor-api";
import { Investor } from "../../../types/investor";
import { Search, Sparkles, Trash2, Wand2, MoreVertical, Send, X, UserPlus, ArrowRight, Edit2, Plus } from "lucide-react";
import { useToast } from "../../../components/Toast";

const workspaceBackground = `linear-gradient(180deg, #0a0b1e 0%, #05050a 100%)`;

export default function PipelinePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const router = useRouter();

  const [investors, setInvestors] = useState<Investor[]>([]);
  const [recommendations, setRecommendations] = useState<Investor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pipelineData, recommendationData] = await Promise.all([
        getInvestors(undefined, workspaceId),
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

  useEffect(() => {
    if (workspaceId) {
      loadData();
    }
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
    <div className="min-h-screen flex flex-col text-white" style={{ background: workspaceBackground }}>
      
      <div className="max-w-7xl mx-auto w-full pt-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 mt-11">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Image src="/pipeline.png" alt="Pipeline" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Investor Pipeline</h1>
              <p className="text-sm text-gray-500">Managing <span className="text-indigo-400 font-semibold">{investors.length}</span> active relationships</p>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/workspace/${workspaceId}/pipeline/create`)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/10 active:scale-95"
          >
            <Plus size={18} />
            <span>New Investor</span>
          </button>
        </div>
        
        {/* Full Width Search Bar */}
        <div className="relative mb-12">
          <form onSubmit={handleSearchSubmit}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-16 py-4 bg-[#161930]/60 border border-gray-800 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition duration-150"
            />
            {searchQuery.trim().length > 0 && (
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg transition-all animate-in fade-in zoom-in duration-200"
              >
                <ArrowRight size={18} />
              </button>
            )}
          </form>
        </div>

        {/* Pipeline Main Grid - Removed overflow-x-auto to allow natural page scroll */}
        <main className="w-full pb-32">
          <div className="flex flex-col md:flex-row gap-8 min-w-full">
            <PipelineColumn 
              title="Recommendations" 
              icon={<Sparkles size={16} className="text-indigo-400" />}
              count={columns.recommendations.length}
              dotColor="#7C59FF"
            >
              {columns.recommendations.map(inv => (
                <InvestorCard key={inv._id} investor={inv} type="recommendation" workspaceId={workspaceId} onRefresh={loadData} />
              ))}
            </PipelineColumn>

            <PipelineColumn 
              title="Not Contacted" 
              icon={<UserPlus size={16} className="text-slate-400" />}
              count={columns.notContacted.length}
              dotColor="#E5E7EB"
            >
              {columns.notContacted.map(inv => (
                <InvestorCard key={inv._id} investor={inv} type="pipeline" workspaceId={workspaceId} onRefresh={loadData} />
              ))}
            </PipelineColumn>

            <PipelineColumn 
              title="Contacted" 
              icon={<Send size={16} className="text-emerald-400" />}
              count={columns.contacted.length}
              dotColor="#10B981"
            >
              {columns.contacted.map(inv => (
                <InvestorCard key={inv._id} investor={inv} type="pipeline" workspaceId={workspaceId} onRefresh={loadData} />
              ))}
            </PipelineColumn>
          </div>
        </main>
      </div>

      {/* Search Modal */}
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
                    <InvestorCard investor={inv} type="pipeline" workspaceId={workspaceId} onRefresh={loadData} />
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
    <div className="flex flex-col gap-6 flex-1 min-w-[320px]">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">{title}</span>
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 font-mono">
            {count}
          </span>
        </div>
      </div>
      {/* Removed overflow-y-auto to allow card menus to overflow naturally */}
      <div className="flex flex-col gap-4">
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

function InvestorCard({ 
  investor, 
  type, 
  workspaceId, 
  onRefresh 
}: { 
  investor: Investor, 
  type: 'recommendation' | 'pipeline', 
  workspaceId: string,
  onRefresh: () => void 
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const initials = investor.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${investor.name}?`)) return;
    
    try {
      await deleteInvestor(investor._id);
      showToast('Investor deleted successfully', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setShowMenu(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/workspace/${workspaceId}/pipeline/${investor._id}/edit`);
  };

  return (
    <div className={`group relative rounded-xl p-5 border transition-all hover:bg-white/4 ${
      type === 'recommendation' ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-gray-800 bg-[#161930]/40'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-900/40 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-200">
                {initials}
            </div>
            <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{investor.name}</h4>
                <p className="text-[11px] text-gray-500 truncate">{investor.email}</p>
            </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              {/* Removed overflow-hidden from the menu container so icons/text aren't clipped */}
              <div className="absolute right-0 mt-2 w-48 bg-[#0A1520] border border-gray-800 rounded-xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-150">
                
                {type !== 'recommendation' && (
                  <button 
                    onClick={handleEdit}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} /> Edit Profile
                  </button>
                )}
                
                <button 
                  disabled
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 cursor-not-allowed"
                >
                  <Wand2 size={14} /> Transform (AI)
                </button>

                {type !== 'recommendation' && (
                  <>
                    <div className="h-px bg-gray-800 my-1" />
                    <button 
                      onClick={handleDelete}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Investor
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
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