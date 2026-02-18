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
import {  ChevronDown, Plus, Pencil, Loader2, Mail, Search, 
  ChevronLeft, ChevronRight, Trash2, Save, Calendar, Briefcase, Send, User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/Toast';

interface StatusBadgeProps {
  status: IntroStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    queued: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
    approvals_requested: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
    investor_approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50',
    founder_approved: 'bg-teal-500/20 text-teal-400 border border-teal-500/50',
    sent: 'bg-green-500/20 text-green-400 border border-green-500/50',
    completed: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md shadow-sm ${styles[status] || styles.queued}`}>
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
      if (intro.followUpDueDate) {
        const d = new Date(intro.followUpDueDate);
        d.setDate(d.getDate() + 1);
        setFollowUpDate(d.toISOString().split('T')[0]);
      } else {
        setFollowUpDate('');
      }
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

  const handleUpdateFollowUp = async (id: string, dateOverride?: string) => {
    const dateToProcess = dateOverride || followUpDate;
    if (!dateToProcess) return;

    const selectedDate = new Date(`${dateToProcess}T00:00:00`);
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
      setFollowUpDate(followUpDate);
      await loadIntros(search, currentPage);
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
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-10 py-4 text-[11px] uppercase tracking-widest font-bold text-gray-500 border-b border-gray-800 bg-gray-950">
                <div>Parties</div>
                <div>Status</div>
                <div>Created</div>
                <div className="text-right pr-12">Actions</div>
              </div>

              <div className="divide-y divide-gray-800 p-4">
                {loading ? (
                  <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500 h-8 w-8" /></div>
                  ) : intros.length === 0 ? (
                  <div className="p-20 text-center text-gray-500 text-sm italic">No introductions found.</div>
                  ) : (
                  intros.map((intro) => (
                    <div key={intro._id} className="group mb-3" title='Click to view more details'>
                      <div
                        onClick={() => handleToggleExpand(intro)}
                        className={`
                          relative grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-5 
                          bg-[#11141A] border border-gray-800 rounded-xl cursor-pointer 
                          hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 
                          transition-all duration-200 overflow-hidden
                          ${expandedId === intro._id ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : ''}
                        `}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
                          intro.status === 'completed' ? 'bg-purple-500' : 
                          intro.status === 'sent' ? 'bg-green-500' : 
                          intro.status === 'approvals_requested' ? 'bg-yellow-500' : 
                          intro.status === 'investor_approved' ? 'bg-emerald-500' : 
                          intro.status === 'founder_approved' ? 'bg-teal-500' : 
                          'bg-blue-500'
                        }`} />

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                            {intro.startupName}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">
                            {intro.founderName} • {intro.investorName}
                          </span>
                        </div>

                        <div className="flex justify-start">
                          <StatusBadge status={intro.status} />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <Calendar size={12} className="text-gray-600" />
                            {new Date(intro.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex justify-end items-center gap-3">
                          {intro.status === 'queued' && (
                            <button
                              disabled={isProcessing === 'sending'}
                              onClick={(e) => { e.stopPropagation(); handleSendIntro(intro._id); }}
                              className="hidden md:flex bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold items-center gap-1.5 transition"
                            >
                              {isProcessing === 'sending' ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                              Send Mail
                            </button>
                          )}
                          
                          <div className="flex items-center gap-2 border-l border-gray-800 pl-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(intro._id); }}
                              className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className={`p-1 transition-transform duration-300 ${expandedId === intro._id ? 'rotate-180 text-indigo-400' : 'text-gray-600'}`}>
                              <ChevronDown size={18} />
                            </div>
                          </div>
                        </div>
                      </div>

                        {/* Expanded Detail View */}
                        {intro._id === expandedId && (
                          <div className="px-8 pb-10 pt-6 bg-[#0F1117] border-t border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        
                              {/* LEFT COLUMN */}
                              <div className="lg:col-span-5 space-y-6">
                                <div>
                                  <h4 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-4">Participants</h4>
                                  <div className="bg-[#161920] rounded-2xl border border-gray-800 divide-y divide-gray-800">
                                    {/* Founder Section */}
                                    <div className="p-4 flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                        <User size={18} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <label className="text-[9px] uppercase text-gray-500 font-bold block">Founder</label>
                                        <div className="text-sm font-semibold text-white truncate">{intro.founderName}</div>
                                        <div className="text-xs text-gray-500 truncate">{intro.founderEmail}</div>
                                      </div>
                                    </div>

                                    {/* Investor Section */}
                                    <div className="p-4 flex items-center gap-4 bg-indigo-500/2">
                                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                        <Briefcase size={18} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <label className="text-[9px] uppercase text-gray-500 font-bold block mb-1">Investor - <span className='italic text-[9px] text-gray-500 font-bold mb-1'>Editable</span></label>
                                          <div className="relative group/field mb-1">
                                            <input 
                                              value={investorName} 
                                              onChange={(e) => setInvestorName(e.target.value)}
                                              className="w-full bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-indigo-500 transition-all pr-6"
                                              placeholder="Investor Name"
                                            />
                                            <Pencil 
                                              size={12} 
                                              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 opacity-0 group-hover/field:opacity-100 transition-opacity pointer-events-none" 
                                            />
                                          </div>
                                          <div className="relative group/field">
                                            <input 
                                              value={investorEmail} 
                                              onChange={(e) => setInvestorEmail(e.target.value)}
                                              className="w-full bg-transparent text-xs text-blue-400 outline-none border-b border-transparent focus:border-indigo-500 transition-all pr-6"
                                              placeholder="investor@email.com"
                                            />
                                            <Pencil 
                                              size={10} 
                                              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 opacity-0 group-hover/field:opacity-100 transition-opacity pointer-events-none" 
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Follow-up Section */}
                                  {intro.status === 'sent' && (
                                    <div className="bg-indigo-500/2 border border-indigo-500/10 rounded-2xl p-5">
                                      <div className="flex items-center gap-3 mb-2">
                                        <Calendar size={16} className="text-blue-400" />
                                        <h4 className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Follow-up Date - <span className="text-[9px] uppercase text-gray-500 font-bold mb-1 italic">Set a follow-up to receive reminders</span></h4>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="date"
                                          min={minDateForInput}
                                          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl py-2 px-3 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                          value={followUpDate}
                                          onChange={(e) => setFollowUpDate(e.target.value)}
                                        />
                                        <button
                                          onClick={() => handleUpdateFollowUp(intro._id)}
                                          disabled={isProcessing === 'date' || !followUpDate}
                                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-30 shadow-lg shadow-blue-500/20"
                                        >
                                          {isProcessing === 'date' ? <Loader2 size={14} className="animate-spin" /> : 'Set Date'}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                              {/* RIGHT COLUMN */}
                              <div className="lg:col-span-7 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Generated Intro Content - <span className='italic text-[10px] text-gray-500 font-bold mb-1'>Editable</span></h4>
                                  {hasContentChanges && (
                                    <span className="text-[10px] text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full">Unsaved Changes</span>
                                  )}
                                </div>
          
                                <div className="relative group flex-1">
                                  <textarea
                                    className="w-full bg-[#161920] border border-gray-800 rounded-2xl p-6 text-sm text-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed min-h-[250px] shadow-inner"
                                    value={draftContent}
                                    onChange={(e) => setDraftContent(e.target.value)}
                                    placeholder="Write the introduction here..."
                                  />
                                </div>

                                <div className="flex justify-end items-center gap-3 mt-6">
                                  {hasContentChanges && (
                                    <button
                                      onClick={() => handleUpdateContent(intro._id)}
                                      disabled={isProcessing === 'saving'}
                                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border border-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
                                    >
                                      {isProcessing === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                      Save Changes
                                    </button>
                                  )}
                                  
                                  {intro.status === 'queued' && (
                                    <button
                                      onClick={() => handleSendIntro(intro._id)}
                                      disabled={isProcessing === 'sending'}
                                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                                    >
                                      {isProcessing === 'sending' ? (
                                        <Loader2 size={14} className="animate-spin" />
                                      ) : (
                                        <>
                                          <Send size={14} />
                                          Send Consent Mail
                                        </>
                                      )}
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