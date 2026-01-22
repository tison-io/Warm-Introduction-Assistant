'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IntroQueue, IntroStatus } from '../../../types/intro';
import { 
    fetchIntrosByFounder, 
    updateIntroStatus, 
    sendIntroRequest, 
    deleteIntro,
    updateIntroContent 
} from '../../../lib/intro-api';
import { 
    Plus, 
    Loader2, 
    Mail, 
    Trash2, 
    Search,
    MoreHorizontal 
} from 'lucide-react';
import { useToast } from '../../../components/Toast';

const StatusBadge = ({ status }: { status: IntroStatus }) => {
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

// Helper for default date
const getDefaultFollowUpDate = (): string => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
};

export default function WorkspaceIntroQueue() {
    const { workspaceId } = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const [intros, setIntros] = useState<IntroQueue[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');

    // Form States
    const [draftContent, setDraftContent] = useState('');
    const [emailDraft, setEmailDraft] = useState('');
    const [newStatus, setNewStatus] = useState<IntroStatus>('queued');
    const [followUpDate, setFollowUpDate] = useState(getDefaultFollowUpDate());
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (workspaceId) loadIntros();
    }, [workspaceId]);

    const loadIntros = async () => {
        setLoading(true);
        try {
            const data = await fetchIntrosByFounder(workspaceId as string);
            setIntros(data);
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: () => Promise<any>, successMsg: string) => {
        setIsProcessing(true);
        try {
            await action();
            showToast(successMsg, 'success');
            await loadIntros();
            setExpandedId(null);
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // New Update Status Logic incorporating the Follow-up Date
    const handleUpdateStatusAndSave = async (introId: string) => {
        const payload: any = { 
            status: newStatus,
            generatedIntro: draftContent,
            investorEmail: emailDraft
        };

        if (newStatus === 'sent') {
            if (!followUpDate) {
                showToast("Please set a follow-up date for sent intros.", "error");
                return;
            }
            payload.followUpDueDate = new Date(followUpDate);
        }

        handleAction(async () => {
            // We update content and status in tandem
            await updateIntroContent(introId, { generatedIntro: draftContent, investorEmail: emailDraft });
            await updateIntroStatus(introId, payload);
        }, `Intro updated and marked as ${newStatus}`);
    };

    const filteredIntros = useMemo(() => {
        return intros.filter(i => {
            const matchesSearch = i.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                i.startupName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All Status' || i.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [intros, searchQuery, statusFilter]);

    return (
        <div className="min-h-screen bg-[#05070A] text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Metrics Header */}
                <div className="grid grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Pending Approval', val: intros.filter(i => i.status === 'investor_approval_requested').length, color: 'text-yellow-500' },
                        { label: 'Queued', val: intros.filter(i => i.status === 'queued').length, color: 'text-blue-400' },
                        { label: 'Sent', val: intros.filter(i => i.status === 'sent').length, color: 'text-green-500' },
                        { label: 'Completed', val: intros.filter(i => i.status === 'completed').length, color: 'text-purple-400' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-[#0A0C10] border border-gray-800 p-4 rounded-xl text-center">
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.val}</div>
                            <div className="text-xs text-gray-500 uppercase mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Card */}
                <div className="bg-[rgb(10,12,16)] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Introduction Requests</h2>
                            <p className="text-sm text-gray-500">Track and manage warm introductions from your network</p>
                        </div>
                    </div>

                    <div className="p-4 bg-[#0D0F14] flex gap-4">
                       <div className=" bg-[#0D0F14] flex gap-4">
                            {/* Status Filter Dropdown */}
                            <div className="w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full bg-[#161920] border border-gray-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 transition text-gray-300"
                                >
                                    <option value="All Status">All Status</option>
                                    <option value="queued">Queued</option>
                                    <option value="investor_approval_requested">Pending Approval</option>
                                    <option value="sent">Sent</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-5 px-6 py-3 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-800">
                        <div>Investor</div>
                        <div>Startup</div>
                        <div>Status</div>
                        <div>Date</div>
                        <div>Owner</div>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-gray-800">
                        {loading ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
                        ) : filteredIntros.map((intro) => (
                            <div key={intro._id} className="group">
                                <div 
                                    onClick={() => {
                                        if (expandedId === intro._id) {
                                            setExpandedId(null);
                                        } else {
                                            setExpandedId(intro._id);
                                            setDraftContent(intro.generatedIntro);
                                            setEmailDraft(intro.investorEmail);
                                            setNewStatus(intro.status);
                                            // Logic: If status is 'sent' and has a date, use it. Otherwise use default.
                                            setFollowUpDate(
                                                intro.status === 'sent' && intro.followUpDueDate
                                                    ? new Date(intro.followUpDueDate).toISOString().split('T')[0]
                                                    : getDefaultFollowUpDate()
                                            );
                                        }
                                    }}
                                    className="grid grid-cols-5 px-6 py-4 items-center cursor-pointer hover:bg-[#11141A] transition"
                                >
                                    <div className="text-sm font-medium text-white">{intro.investorName}</div>
                                    <div className="text-sm text-gray-400">{intro.startupName}</div>
                                    <div><StatusBadge status={intro.status} /></div>
                                    <div className="text-sm text-gray-500">{new Date(intro.createdAt).toLocaleDateString()}</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">{intro.founderId?.name || 'Unknown'}</span>
                                        <MoreHorizontal size={16} className="text-gray-600 group-hover:text-white" />
                                    </div>
                                </div>

                                {expandedId === intro._id && (
                                    <div className="px-6 pb-6 pt-2 bg-[#0D0F14] border-t border-gray-800 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Investor Email Field */}
                                            <div>
                                                <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Investor Email</label>
                                                <input 
                                                    value={emailDraft}
                                                    onChange={(e) => setEmailDraft(e.target.value)}
                                                    className="w-full bg-[#161920] border border-gray-700 rounded p-2 text-sm text-gray-300"
                                                />
                                            </div>

                                            {/* Status and Date Selection Row */}
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Update Status</label>
                                                    <select
                                                        value={newStatus}
                                                        onChange={(e) => setNewStatus(e.target.value as IntroStatus)}
                                                        className="w-full bg-[#161920] border border-gray-700 rounded p-2 text-sm text-gray-300"
                                                    >
                                                        <option value="queued">Queued</option>
                                                        <option value="sent">Sent</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </div>

                                                {newStatus === 'sent' && (
                                                    <div className="flex-1">
                                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Follow-up Date</label>
                                                        <input 
                                                            type="date"
                                                            value={followUpDate}
                                                            onChange={(e) => setFollowUpDate(e.target.value)}
                                                            className="w-full bg-[#161920] border border-gray-700 rounded p-2 text-sm text-gray-300"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Generated Intro</label>
                                            <textarea 
                                                value={draftContent}
                                                onChange={(e) => setDraftContent(e.target.value)}
                                                rows={4}
                                                className="w-full bg-[#161920] border border-gray-700 rounded p-3 text-sm text-gray-300 focus:border-indigo-500 outline-none custom-scrollbar"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <button 
                                                onClick={() => handleAction(() => deleteIntro(intro._id), 'Intro deleted')}
                                                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                            <div className="flex gap-3">
                                                <button 
                                                    disabled={isProcessing}
                                                    onClick={() => handleUpdateStatusAndSave(intro._id)}
                                                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                                >
                                                    {isProcessing ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                <button 
                                                    disabled={isProcessing}
                                                    onClick={() => handleAction(() => sendIntroRequest(intro._id), 'Consent request sent')}
                                                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                                                >
                                                    <Mail size={16} /> Send Intro
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}