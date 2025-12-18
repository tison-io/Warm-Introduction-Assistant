'use client';

import { useEffect, useState, useMemo } from 'react';
import { IntroQueue, IntroStatus, StatusUpdatePayload } from '../types/intro';
import { fetchIntrosByFounder, updateIntroStatus, sendIntroRequest } from '../lib/intro-api';
import { ChevronUp, ChevronDown, Plus, Loader2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/Toast';

interface StatusBadgeProps {
  status: IntroStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let style = 'bg-gray-400';
  let text = 'Queued';

  switch (status) {
    case 'queued':
      style = 'bg-blue-400';
      text = 'Queued';
      break;
    case 'sent':
      style = 'bg-green-500';
      text = 'Sent';
      break;
    case 'completed':
      style = 'bg-purple-500';
      text = 'Completed';
      break;
  }

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${style}`}>
      {text}
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

  useEffect(() => {
    loadIntros();
  }, []);

  const loadIntros = async () => {
    setLoading(true);
    try {
      const data = await fetchIntrosByFounder();
      setIntros(data);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to load intro queue', 'error');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleSendIntro = async (introId: string) => {
    try {
      await sendIntroRequest(introId);
      showToast("Email request sent to investor!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to send intro request.", "error");
    }
  };

  const handleToggleExpand = (intro: IntroQueue) => {
    if (expandedId === intro._id) {
      setExpandedId(null);
    } else {
      setExpandedId(intro._id);
      setDraftContent(intro.generatedIntro);
      setNewStatus(intro.status);
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

    try {
      const updatedIntro = await updateIntroStatus(introId, payload);
      setIntros(intros.map(i => i._id === introId ? { ...i, ...updatedIntro } : i));
      setExpandedId(null);
      showToast(
        `Status updated to ${newStatus}. ${newStatus === 'sent' ? `Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString()}.` : ''}`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update intro status', 'error');
    }
  };

  const expandedIntro = useMemo(() => intros.find(i => i._id === expandedId), [intros, expandedId]);
  const introCount = intros.length;

  return (
    <div data-testid="page-intro-queue" className="min-h-screen bg-cover bg-center p-6 md:p-8" style={{ backgroundImage: "url('/background-img.jpg')" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white">Intro Queue</h1>
            <p className="text-base md:text-xl text-gray-300">
              You have <span className='font-bold'>{introCount}</span> introductions queued
            </p>
          </div>
          <button
            data-testid="new-intro-btn"
            onClick={() => router.push('/intro-wizard')}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-xl hover:bg-blue-700 transition duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>New Intro</span>
          </button>
        </div>

        {/* Intro List */}
        <div data-testid="intro-list-container" className="bg-white text-black rounded-lg shadow-2xl overflow-hidden">
          {loading ? (
            <div data-testid="queue-loading-spinner" className="flex items-center justify-center px-4 py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : intros.length === 0 ? (
            <div data-testid="queue-empty-message" className="p-6 text-center text-gray-500">
              You have no intro queues at the moment.
            </div>
          ) : (
            <ul data-testid="intro-queue-list">
              {intros.map((intro) => {
                const isExpanded = intro._id === expandedId;
                const createdAtDate = new Date(intro.createdAt).toLocaleDateString();
                return (
                  <li data-testid={`intro-row-${intro._id}`} key={intro._id} className="border-b border-gray-200 last:border-b-0">
                    <div
                      data-testid={`intro-toggle-btn-${intro._id}`}
                      className="flex items-center px-4 py-2 cursor-pointer transition duration-150 hover:bg-gray-50"
                      onClick={() => handleToggleExpand(intro)}
                    >
                      <div className="w-8">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-900" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-800" />
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-4 gap-2 text-sm font-medium">
                        <p data-testid={`intro-startup-name-${intro._id}`} className="truncate font-semibold">{intro.startupName}</p>
                        <p data-testid={`intro-investor-name-${intro._id}`} className="truncate">{intro.investorName}</p>
                        <p data-testid={`intro-created-at-${intro._id}`} className="truncate">{createdAtDate}</p>
                        <StatusBadge status={intro.status} />
                      </div>
                    </div>

                    {isExpanded && expandedIntro && (
                      <div data-testid={`intro-details-panel-${intro._id}`} className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
                        {/* Draft intro content */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Generated Intro</label>
                          <textarea
                            data-testid="details-draft-textarea"
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
                            rows={4}
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                          />
                        </div>

                        {/* Status selector */}
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              data-testid="details-status-select"
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value as IntroStatus)}
                              className="mt-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="queued">Queued</option>
                              <option value="sent">Sent</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>

                          {newStatus === 'sent' && (
                            <div data-testid="details-followup-container">
                              <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                              <input
                                data-testid="details-followup-date-input"
                                type="date"
                                value={followUpDate}
                                onChange={(e) => setFollowUpDate(e.target.value)}
                                className="mt-1 border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          )}
                        </div>

                        {/* Investor Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Investor Email</label>
                          <p className="mt-1 border border-gray-300 rounded-md p-2 text-sm bg-gray-100">{expandedIntro.investorEmail}</p>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Notes</label>
                          <textarea
                            data-testid="details-notes-textarea"
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
                            rows={2}
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                          />
                        </div>

                        {/* Update button */}
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleSendIntro(intro._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center space-x-2"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Send Intro</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(intro._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                          >
                            Update Status
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
