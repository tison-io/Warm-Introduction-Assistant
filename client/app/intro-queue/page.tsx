'use client';

import { useEffect, useState, useMemo } from 'react';
import { IntroQueue, IntroStatus, StatusUpdatePayload } from '../types/intro';
import { fetchIntrosByFounder, updateIntroStatus } from '../lib/intro-api';
import { ChevronUp, ChevronDown, Send, Save, Calendar } from 'lucide-react';

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

// --- Main IntroQueuePage Component ---

const getDefaultFollowUpDate = (): string => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
}


export default function IntroQueuePage() {
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
      alert(err.message || 'Failed to load intro queue');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (intro: IntroQueue) => {
    if (expandedId === intro._id) {
      setExpandedId(null);
    } else {
      setExpandedId(intro._id);
      setDraftContent(intro.generatedIntro);
      setNewStatus(intro.status);
      setFollowUpDate(getDefaultFollowUpDate());
      setNoteContent('');
      
      if (intro.status === 'sent' && intro.followUpDueDate) {
        setFollowUpDate(new Date(intro.followUpDueDate).toISOString().split('T')[0]);
      } else {
        setFollowUpDate(getDefaultFollowUpDate());
  }
    }
  };

  const handleUpdateStatus = async (introId: string) => {
    let payload: StatusUpdatePayload = { status: newStatus };

    if (newStatus === 'sent') {
        if (!followUpDate) {
            alert("Please set a follow-up date before marking as sent.");
            return;
        }
        payload.followUpDueDate = new Date(followUpDate);
    }
    
    try {
      const updatedIntro = await updateIntroStatus(introId, payload);
      
      setIntros(intros.map(i => i._id === introId ? { ...i, ...updatedIntro } : i));
      
      setExpandedId(null); 
      alert(`Status updated to ${newStatus}. ${newStatus === 'sent' ? `Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString()}.` : ''}`);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update intro status');
    }
  };

  const expandedIntro = useMemo(() => intros.find(i => i._id === expandedId), [intros, expandedId]);
  
  const introCount = intros.length;

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center text-white p-6 md:p-8" 
        style={{ backgroundImage: "url('/background-img.jpg')" }}
      >
        <div className="max-w-6xl mx-auto">Loading intro queue...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center p-6 md:p-8" 
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-white">Intro Queue</h1>
                <p className="text-base md:text-xl text-gray-300">You have <span className='font-bold'>{introCount}</span> introductions queued</p>
            </div>
        </div>

        {/* Intro List Container */}
        <div className="bg-white text-black rounded-lg shadow-2xl overflow-hidden">
          <ul className="text-white">
            {intros.map((intro) => {
              const isExpanded = intro._id === expandedId;
              const createdAtDate = new Date(intro.createdAt).toLocaleDateString();
              
              return (
                <li key={intro._id} className="border-b border-white/10 last:border-b-0">
                  {/* List Item Header Row */}
                  <div
                    className="flex items-center px-4 py-2 cursor-pointer transition duration-150 hover:bg-white/5" 
                    onClick={() => handleToggleExpand(intro)}
                  >
                    {/* Expand/Collapse Icon */}
                    <div className="w-8">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-900" /> : <ChevronDown className="h-4 w-4 text-gray-800" />}
                    </div>
                    {/* Data Columns */}
                    <div className="flex-1 grid grid-cols-4 gap-2 text-sm font-medium"> 
                      <p className="truncate font-semibold text-black">{intro.startupName}</p>
                      <p className="truncate text-black">{intro.investorName}</p>
                      <p className="truncate text-black">{createdAtDate}</p>
                      <StatusBadge status={intro.status} />
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && expandedIntro && (
                    <div className="p-4 bg-white/5 border-t border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Draft Text Area (Left Column) */}
                        <div className="col-span-1">
                          <label className="text-sm font-semibold block mb-1 text-black">Intro</label>
                          <textarea
                            className="w-full p-2 bg-white border border-blue-500 rounded-lg text-black placeholder-gray-400 h-full min-h-36 resize-none text-sm focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Introduction draft text here..."
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                          />
                        </div>
                        
                        {/* Controls (Right Column) */}
                        <div className="col-span-1 flex flex-col justify-start space-y-3">
                            {/* Status and Follow-up Group */}
                            <div className="space-y-3">
                            {/* Change Status Dropdown */}
                                <div>
                                    <label className="text-sm font-semibold block mb-1 text-black">Change Status</label>
                                    <select 
                                        className="w-full p-2 bg-white border border-blue-500 rounded-lg text-black text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none" 
                                        value={newStatus}
                                        onChange={(e) => {
                                            setNewStatus(e.target.value as IntroStatus);
                                            if (e.target.value !== 'sent') {
                                                setFollowUpDate('');
                                            } else {
                                                setFollowUpDate(getDefaultFollowUpDate());
                                            }
                                        }}
                                    >
                                        <option value="queued" className="bg-white text-black">Drafted</option>
                                        <option value="sent" className="bg-white text-black">Sent</option>
                                        <option value="completed" className="bg-white text-black">Completed</option>
                                    </select>
                                </div>
                            
                            {/* Follow-up Date Picker (Conditional) */}
                            {newStatus === 'sent' && (
                                <div>
                                    <label className="text-sm font-semibold mb-1 text-black flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-black" />
                                        Set Follow-up Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-yellow-500 rounded-lg text-black text-sm focus:ring-blue-300 focus:border-blue-400" 
                                        value={followUpDate}
                                        min={new Date().toISOString().split('T')[0]} 
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                    />
                                </div>
                            )}
                            </div>
                            
                            {/* Add Note Text Area */}
                            <div className="mt-auto">
                                <label className="text-sm font-semibold block mb-1 text-white/70">Add Note</label>
                                <textarea
                                    className="w-full p-2 bg-white/10 border rounded-lg text-white placeholder-gray-600 h-12 resize-none text-sm" 
                                    placeholder="Optional follow-up notes..."
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                            </div>
                        </div>

                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 mt-3"> 
                        <button
                          className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 disabled:opacity-50"
                          onClick={() => handleUpdateStatus(expandedIntro._id)}
                          disabled={
                                newStatus === expandedIntro.status ||
                                (newStatus === 'sent' && !followUpDate)
                            }
                        >
                            {newStatus === 'sent' ? (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> 
                                    Mark Sent & Schedule Followup
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> 
                                    Update Status
                                </>
                            )}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}