'use client';

import { useEffect, useState, useMemo } from 'react';
import { IntroQueue, IntroStatus, StatusUpdatePayload } from '../types/intro';
import { fetchIntrosByFounder, updateIntroStatus, sendIntroRequest } from '../lib/intro-api';
import { ChevronUp, ChevronDown, Plus, Loader2, Mail, MoreHorizontal } from 'lucide-react';
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
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${styles[status] || styles.queued}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const getDefaultFollowUpDate = (): string => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek.toISOString().split('T')[0];
};

export default function IntroQueuePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [intros, setIntros] = useState<IntroQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [draftContent, setDraftContent] = useState('');
  const [newStatus, setNewStatus] = useState<IntroStatus>('queued');
  const [noteContent, setNoteContent] = useState('');
  const [followUpDate, setFollowUpDate] = useState(getDefaultFollowUpDate());
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [hasDateChanged, setHasDateChanged] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [hasStatusChanged, setHasStatusChanged] = useState(false);

  useEffect(() => {
    loadIntros();
  }, []);

  const loadIntros = async () => {
    setLoading(true);
    try {
      const data = await fetchIntrosByFounder();
      setIntros(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load intro queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendIntro = async (introId: string) => {
    setIsSendingEmail(true);
    try {
      await sendIntroRequest(introId);
      showToast("Email consent request has been sent to investor", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to send intro request.", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleToggleExpand = (intro: IntroQueue) => {
    if (expandedId === intro._id) {
      setExpandedId(null);
    } else {
      setExpandedId(intro._id);
      setDraftContent(intro.generatedIntro);
      setNewStatus(intro.status);
      setHasDateChanged(false);
      setHasStatusChanged(false);
      setFollowUpDate(
        intro.status === 'sent' && intro.followUpDueDate
          ? new Date(intro.followUpDueDate).toISOString().split('T')[0]
          : getDefaultFollowUpDate()
      );
      setNoteContent('');
    }
  };

  const handleUpdateStatus = async (introId: string) => {
    let payload: StatusUpdatePayload = { status: newStatus };

    if (newStatus === 'sent') {
      if (!followUpDate) {
        showToast("Please set a follow-up date before marking as sent.", "error");
        return;
      }
      payload.followUpDueDate = new Date(followUpDate);
    }

    setIsUpdatingStatus(true);
    try {
      const updatedIntro = await updateIntroStatus(introId, payload);
      setIntros(intros.map(i => i._id === introId ? { ...i, ...updatedIntro } : i));
      setExpandedId(null);
      setHasDateChanged(false);
      setHasStatusChanged(false);
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update intro status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const expandedIntro = useMemo(() => intros.find(i => i._id === expandedId), [intros, expandedId]);

  return (
    <div className="min-h-screen bg-[#05070A] text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Introduction Queue</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your warm introduction requests</p>
          </div>
          <button
            onClick={() => router.push('/intro-wizard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-lg"
          >
            <Plus size={16} /> New Intro
          </button>
        </div>

        {/* Main List Card */}
        <div className="bg-[#0A0C10] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Table Header Styling */}
          <div className="grid grid-cols-5 px-6 py-3 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-800 bg-[#0D0F14]">
            <div>Startup</div>
            <div>Investor</div>
            <div>Status</div>
            <div>Created</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-800">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
            ) : intros.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm italic">You have no intro queues at the moment.</div>
            ) : (
              intros.map((intro) => {
                const isExpanded = intro._id === expandedId;
                return (
                  <div key={intro._id} className="group">
                    <div
                      onClick={() => handleToggleExpand(intro)}
                      className="grid grid-cols-5 px-6 py-4 items-center cursor-pointer hover:bg-[#11141A] transition"
                    >
                      <div className="text-sm font-semibold text-white truncate">{intro.startupName}</div>
                      <div className="text-sm text-gray-400 truncate">{intro.investorName}</div>
                      <div><StatusBadge status={intro.status} /></div>
                      <div className="text-sm text-gray-500">{new Date(intro.createdAt).toLocaleDateString()}</div>
                      <div className="flex justify-end">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} className="text-gray-600 group-hover:text-white" />}
                      </div>
                    </div>

                    {isExpanded && expandedIntro && (
                      <div className="px-6 pb-6 pt-2 bg-[#0D0F14] border-t border-gray-800 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Generated Intro Field */}
                          <div className="col-span-2">
                            <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Generated Intro</label>
                            <textarea
                              className="w-full bg-[#161920] border border-gray-700 rounded-lg p-3 text-sm text-gray-300 focus:border-indigo-500 outline-none custom-scrollbar"
                              rows={4}
                              value={draftContent}
                              onChange={(e) => setDraftContent(e.target.value)}
                            />
                          </div>

                          {/* Status and Follow up */}
                          <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Status</label>
                            <select
                              value={newStatus}
                              onChange={(e) => {
                                setNewStatus(e.target.value as IntroStatus);
                                setHasStatusChanged(true);
                              }}
                              className="w-full bg-[#161920] border border-gray-800 rounded p-2 text-sm text-gray-300"
                            >
                              <option value="queued">Queued</option>
                              <option value="sent">Sent</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>

                          {newStatus === 'sent' && (
                            <div>
                              <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Follow-up Date</label>
                              <input
                                type="date"
                                value={followUpDate}
                                onChange={(e) => {
                                  setFollowUpDate(e.target.value);
                                  setHasDateChanged(true);
                                }}
                                className="w-full bg-[#161920] border border-gray-800 rounded p-2 text-sm text-gray-300"
                              />
                            </div>
                          )}

                          {/* Investor Email (Read Only style) */}
                          <div className={newStatus !== 'sent' ? 'col-span-1' : 'col-span-2'}>
                            <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Investor Email</label>
                            <div className="w-full bg-[#11141A] border border-gray-800 rounded p-2 text-sm text-gray-500">
                              {expandedIntro.investorEmail}
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="col-span-2">
                            <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Internal Notes</label>
                            <textarea
                              className="w-full bg-[#161920] border border-gray-700 rounded p-2 text-sm text-gray-300"
                              rows={2}
                              value={noteContent}
                              onChange={(e) => setNoteContent(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                          {(hasStatusChanged || hasDateChanged) && (
                            <button
                              disabled={isUpdatingStatus}
                              onClick={() => handleUpdateStatus(intro._id)}
                              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                            >
                              {isUpdatingStatus && <Loader2 size={14} className="animate-spin" />}
                              Save Changes
                            </button>
                          )}
                          <button
                            disabled={isSendingEmail}
                            onClick={() => handleSendIntro(intro._id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                          >
                            {isSendingEmail ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                            {isSendingEmail ? 'Sending...' : 'Send Intro'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}