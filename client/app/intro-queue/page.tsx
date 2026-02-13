'use client';

import { useEffect, useState, useCallback } from 'react';
import { IntroQueue, IntroStatus } from '../types/intro';
import { 
  fetchIntrosByFounder, 
  updateIntroStatus, 
  sendIntroRequest, 
  deleteIntro, 
  updateIntroContent 
} from '../lib/intro-api';
import { 
  ChevronUp, ChevronDown, Plus, Pencil, Loader2, Mail, Search, 
  ChevronLeft, ChevronRight, ArrowRight, Trash2, Save, Calendar 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/Toast';

interface StatusBadgeProps {
  status: IntroStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    queued: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
    sent: 'bg-green-500/20 text-green-400 border border-green-500/50',
    completed: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
    investor_approval_requested: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
    investor_approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50',
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${styles[status] || styles.queued}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default function IntroQueuePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [intros, setIntros] = useState<IntroQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [draftContent, setDraftContent] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorName, setInvestorName] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const loadIntros = useCallback(async (query: string, page: number) => {
    setLoading(true);
    try {
      const response = await fetchIntrosByFounder(undefined, query, page);
      setIntros(response.data || []);
      setTotalPages(response.meta?.lastPage || 1);
      setTotalItems(response.meta?.total || 0);
    } catch (err: any) {
      showToast(err.message || 'Failed to load queue', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadIntros(search, currentPage);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, currentPage, loadIntros]);

  const activeIntro = intros.find(i => i._id === expandedId);

  const hasContentChanges = activeIntro && (
    draftContent !== activeIntro.generatedIntro || 
    investorEmail !== activeIntro.investorEmail ||
    investorName !== activeIntro.investorName
  );

  const handleToggleExpand = (intro: IntroQueue) => {
    if (expandedId === intro._id) {
      setExpandedId(null);
    } else {
      setExpandedId(intro._id);
      setDraftContent(intro.generatedIntro);
      setInvestorEmail(intro.investorEmail);
      setInvestorName(intro.investorName);
      setFollowUpDate(
        intro.followUpDueDate 
          ? new Date(intro.followUpDueDate).toISOString().split('T')[0] 
          : ''
      );
    }
  };

  const handleUpdateContent = async (id: string) => {
    setIsProcessing('saving');
    try {
      await updateIntroContent(id, { generatedIntro: draftContent, investorEmail, investorName });
      showToast("Intro content updated successfully", "success");
      setIntros(intros.map(i => i._id === id ? { ...i, generatedIntro: draftContent, investorEmail, investorName } : i));
    } catch (err: any) {
      showToast(err.message || "Update failed", "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUpdateFollowUp = async (id: string) => {
    if (!followUpDate) return;

    const selectedDate = new Date(`${followUpDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showToast("Follow-up date cannot be a past date", "error");
      return;
    }
    setIsProcessing('date');
    try {
      await updateIntroStatus(id, { followUpDueDate: selectedDate });
      showToast("Follow-up date updated", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update date", "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this introduction? This cannot be undone.")) return;
    try {
      await deleteIntro(id);
      showToast("Introduction deleted", "success");
      loadIntros(search, currentPage);
    } catch (err: any) {
      showToast("Failed to delete introduction.", "error");
    }
  };

  const handleSendIntro = async (id: string) => {
    setIsProcessing('sending');
    try {
      await sendIntroRequest(id);
      showToast("Consent request sent to founder and investor.", "success");
      loadIntros(search, currentPage);
      setExpandedId(null);
    } catch (err: any) {
      showToast(err.message || "Failed to send request.", "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const minDateForInput = new Date().toLocaleDateString('en-CA');


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Introduction Queue</h1>
            <p className="text-sm text-gray-500 mt-1">Manage warm introductions and follow-ups</p>
          </div>
          <button
            onClick={() => router.push('/intro-wizard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} /> New Intro
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Startup, Investor or Founder..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
        </div>

        {/* Table/List Container */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-gray-500 border-b border-gray-800 bg-gray-950">
                <div>Startup</div>
                <div>Founder</div>
                <div>Investor</div>
                <div>Status</div>
                <div>Created</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-gray-800">
                {loading ? (
                  <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500 h-8 w-8" /></div>
                ) : intros.length === 0 ? (
                  <div className="p-20 text-center text-gray-500 text-sm italic">No introductions found.</div>
                ) : (
                  intros.map((intro) => (
                    <div key={intro._id} className="group">
                      <div
                        onClick={() => handleToggleExpand(intro)}
                        className="grid grid-cols-6 px-6 py-5 items-center cursor-pointer hover:bg-[#11141A] transition"
                      >
                        <div className="text-sm font-semibold text-white truncate pr-2">{intro.startupName}</div>
                        <div className="text-sm text-gray-400 truncate pr-2">{intro.founderName}</div>
                        <div className="text-sm text-gray-400 truncate pr-2">{intro.investorName}</div>
                        <div><StatusBadge status={intro.status} /></div>
                        <div className="text-sm text-gray-500">{new Date(intro.createdAt).toLocaleDateString()}</div>
                        <div className="flex justify-end items-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(intro._id); }}
                            className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="p-1.5 rounded-md bg-gray-800/50 group-hover:text-indigo-400 transition-colors">
                            {intro._id === expandedId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Detail View */}
                      {intro._id === expandedId && (
                        <div className="px-6 pb-8 pt-2 bg-gray-800 border-t border-gray-800">
                          <div className="max-w-4xl">
                            <div className="flex items-center justify-between gap-8 mb-8 p-5 bg-[#161920] rounded-xl border border-gray-700/50 mt-4 w-[500px] ml-0">
                              <div className="shrink-0 min-w-[140px]">
                                <label className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Founder</label>
                                <div className="text-sm font-medium text-white truncate">{intro.founderName}</div>
                                <div className="text-xs text-gray-500 truncate">{intro.founderEmail}</div>
                              </div>

                              <div className="h-8 w-px bg-gray-800 hidden md:block" />

                              <div className="flex-1 text-right min-w-[180px]">
                                <label className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Investor</label>
                                
                                <div className="relative group/field inline-block w-full">
                                  <input 
                                    value={investorName} 
                                    onChange={(e) => setInvestorName(e.target.value)}
                                    placeholder="Investor Name"
                                    className="w-full bg-transparent text-right text-sm font-medium text-white outline-none border-b border-transparent hover:border-gray-700/50 focus:border-indigo-500 transition-all pr-6"
                                  />
                                  <Pencil size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 opacity-0 group-hover/field:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                <div className="relative group/field inline-block w-full mt-1">
                                  <input 
                                    value={investorEmail} 
                                    onChange={(e) => setInvestorEmail(e.target.value)}
                                    placeholder="investor@email.com"
                                    className="w-full bg-transparent text-right text-sm font-medium text-blue-400 outline-none border-b border-transparent hover:border-gray-700/50 focus:border-indigo-500 transition-all pr-6"
                                  />
                                  <Pencil size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 opacity-0 group-hover/field:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] uppercase text-gray-500 font-bold mb-2 block">Generated Intro Content - Editable</label>
                                <textarea
                                  className="w-full bg-[#161920] border border-gray-700 rounded-lg p-4 text-sm text-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed"
                                  rows={6}
                                  value={draftContent}
                                  onChange={(e) => setDraftContent(e.target.value)}
                                />
                              </div>

                              {intro.status === 'sent' && (
                                <div className="p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-xl flex items-end gap-4">
                                  <div className="flex-1">
                                    <label className="text-[10px] uppercase text-indigo-400 font-bold mb-2 block">Follow-up Due Date</label>
                                    <input
                                      type="date"
                                      min={minDateForInput}
                                      className="w-full bg-[#0A0C10] border border-gray-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-indigo-500"
                                      value={followUpDate}
                                      onChange={(e) => setFollowUpDate(e.target.value)}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleUpdateFollowUp(intro._id)}
                                    disabled={isProcessing === 'date' || !followUpDate}
                                    className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-30"
                                  >
                                    {isProcessing === 'date' ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
                                    Set Date
                                  </button>
                                </div>
                              )}

                              <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-800">
                                {hasContentChanges && (
                                  <button
                                    onClick={() => handleUpdateContent(intro._id)}
                                    disabled={isProcessing === 'saving'}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
                                  >
                                    {isProcessing === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save Changes
                                  </button>
                                )}
                                {intro.status === 'queued' && (
                                  <button
                                    disabled={isProcessing === 'sending'}
                                    onClick={() => handleSendIntro(intro._id)}
                                    className="bg-blue-600 hover:opacity-95 text-white px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition disabled:opacity-50"
                                  >
                                    {isProcessing === 'sending' ? (
                                      <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                      <Mail size={16} />
                                    )}
                                    Send Consent Email
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-5 bg-gray-900/30 border-t border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white font-medium">{intros.length > 0 ? (currentPage - 1) * 5 + 1 : 0}</span> to <span className="text-white font-medium">{Math.min(currentPage * 5, totalItems)}</span> of <span className="text-white font-medium">{totalItems}</span> intros
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-xl border border-gray-800 hover:bg-gray-800 disabled:opacity-20 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <span className="text-sm text-gray-400 font-medium">
                Page <span className="text-white">{currentPage}</span> of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-xl border border-gray-800 hover:bg-gray-800 disabled:opacity-20 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}