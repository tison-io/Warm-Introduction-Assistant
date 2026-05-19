'use client';

import { useState, useEffect } from 'react';
import { usePresence } from '../hooks/usePresence';
import { Users, CheckCircle2, Clock, Bell, Check, Activity, ChevronRight, Plus, Sparkles, Copy } from 'lucide-react';
import Link from 'next/link';
import { fetchReminders, markReminderCompleted } from '../lib/reminder-api';
import { getInvestors } from '../lib/investor-api';
import { fetchIntrosByFounder, fetchExecutionRate, fetchOutcomeLogs } from '../lib/intro-api';
import { getMyRequests } from '../lib/startup-api';
import { getTrialStatus } from '../lib/founder-api';
import { IntroQueue, OutcomeLog } from '../types/intro';
import { Reminder } from '../types/reminder';
import { Startup } from '../types/startup';
import { TrialStatus } from '../types/founder';
import { useToast } from '../components/Toast';

const isToday = (someDate: Date): boolean => {
    const today = new Date();
    return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
    );
};

const differenceInDays = (targetDate: Date): number => {
    const now = new Date();
    const dueDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface DashboardData {
    totalIntros: number;
    pendingFollowUps: number;
    myInvestors: number;
    remindersDue: number;
    executionRate: number;
    completedIntros: number;
    latestIntros: IntroQueue[];
    reminders: Reminder[];
    logs: OutcomeLog[];
    recentRequests: Startup[];
}

export default function DashboardPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [data, setData] = useState<DashboardData>({
        totalIntros: 0, pendingFollowUps: 0, myInvestors: 0, remindersDue: 0,
        executionRate: 0, completedIntros: 0, latestIntros: [], reminders: [],
        logs: [], recentRequests: [],
    });
    
    const [founder, setFounder] = useState<{ _id?: string; name: string; email: string; tier: string; } | null>(null);
    const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
    const [shareUrl, setShareUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const loadDashboardData = async () => {
        try {
            const [introsResponse, investorsResponse, reminders, rate, logs, requests] = await Promise.all([
                fetchIntrosByFounder(undefined, '', 1),
                getInvestors(),
                fetchReminders(),
                fetchExecutionRate(),
                fetchOutcomeLogs(),
                getMyRequests(1, 10)
            ]);

            const status = await getTrialStatus();
            setTrialStatus(status);

            const introsData = introsResponse.data || [];
            const investorsData = investorsResponse.investors || [];

            const pendingCount = introsData.filter(i => i.status === 'queued' || i.status === 'sent').length;
            const completedCount = introsData.filter(i => i.status === 'completed').length;
            
            setData({
                totalIntros: introsResponse.meta?.total || introsData.length,
                pendingFollowUps: pendingCount,
                myInvestors: investorsResponse.meta?.total || investorsData.length,
                remindersDue: reminders.filter(r => r.status === 'sent').length,
                executionRate: rate,
                completedIntros: completedCount,
                latestIntros: introsData.slice(0, 3),
                reminders: reminders,
                logs: logs.slice(0, 6),
                recentRequests: requests.startups.slice(0, 3),
            });
        } catch (err: any) {
            showToast("An error occured while loading the dashboard", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_DEPLOYED_URL || 'http://localhost:3000';
            if (parsed.id) setFounder({ ...parsed, _id: parsed.id });
            setShareUrl(`${baseUrl}/submit/${parsed.id}`);
        }
        loadDashboardData();
    }, []);

    usePresence(founder?._id, (update) => console.log(update));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleMarkAsDone = async (reminder: Reminder) => {
        try {
            setProcessingId(reminder._id);
            await markReminderCompleted(reminder._id);
            showToast('Reminder completed', 'success');
            await loadDashboardData();
        } catch (err) {
            showToast('Update failed', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 p-6 lg:p-10 space-y-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="h-10 w-64 bg-slate-800/50 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-900 border border-slate-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[350px] bg-gray-900 border border-slate-800 rounded-2xl animate-pulse" />
                        <div className="h-[350px] bg-gray-900 border border-slate-800 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 text-slate-200 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    {founder && (
                        <h2 className="text-4xl font-bold text-white tracking-tight">
                            Welcome back, <span className="text-blue-500">{founder.name}</span>
                        </h2>
                    )}
                    
                    <Link 
                        href="/intro-wizard"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 shrink-0"
                    >
                        <Plus size={20} />
                        <span>Make Intros</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Investors" value={data.myInvestors} icon={<Users className="text-indigo-400" />} iconBg="bg-indigo-500/20" />
                    <StatCard title="Intro Success" value={`${data.executionRate}%`} icon={<CheckCircle2 className="text-emerald-400" />} iconBg="bg-emerald-500/20" />
                    <StatCard title="Requests" value={data.recentRequests?.length || 0} icon={<Activity className="text-blue-400" />} iconBg="bg-blue-500/20" />
                    <StatCard title="Reminders" value={data.remindersDue} icon={<Bell className="text-cyan-400" />} iconBg="bg-cyan-500/20" />
                </div>

                {trialStatus?.tier === 'trial' && (
                    <div className="relative overflow-hidden bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20 hidden sm:block">
                                    <Clock size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${trialStatus.daysRemaining <= 2 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {trialStatus.daysRemaining} days left
                                        </span>
                                    </h4>
                                    <p className="text-slate-400 text-sm mt-1">
                                        You are currently on a free trial. Upgrade to Pro for unlimited AI intros and community access.
                                    </p>
                                </div>
                            </div>
                            
                            <Link 
                                href="/pricing"
                                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} />
                                Upgrade to Pro
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-gray-900 border border-slate-800 rounded-2xl p-6 h-[350px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Upcoming Reminders</h3>
                            <Link href="/reminders" className="text-xs font-medium text-white hover:opacity-80 flex items-center gap-1">
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="space-y-3 overflow-y-auto grow custom-scrollbar">
                            {(() => {
                            const activeReminders = data.reminders.filter(r => r.status !== 'completed');

                            if (activeReminders.length === 0) {
                                return (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 italic text-sm">You have no reminders at the moment.</div>
                                </div>
                                );
                            }

                            // 3. Otherwise, map through the reminders
                            return activeReminders.map(reminder => (
                                <div key={reminder._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 group hover:border-indigo-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <button 
                                    onClick={() => handleMarkAsDone(reminder)}
                                    className="w-5 h-5 rounded-md border-2 border-slate-600 group-hover:border-indigo-500 flex items-center justify-center"
                                    >
                                    <Check size={14} className="text-indigo-500 scale-0 group-hover:scale-100 transition-transform" />
                                    </button>
                                    <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-200 truncate">{reminder.investorName}</p>
                                    <p className="text-[11px] text-slate-500">Follow up due</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">
                                    {new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                </div>
                            ));
                            })()}
                        </div>
                    </section>

                    <section className="bg-gray-900 border border-slate-800 rounded-2xl p-6 h-[350px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Founder Requests</h3>
                            <Link href="/startups" className="text-xs font-medium text-white hover:opacity-80 flex items-center gap-1">
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="space-y-4 grow overflow-y-auto">
                            {data.recentRequests.length > 0 ? (
                                data.recentRequests.map((request) => (
                                    <Link key={request._id} href="/startups">
                                        <div className="flex items-center justify-between p-4 mb-2 rounded-xl bg-slate-900/60 border border-slate-800/50 hover:border-blue-500/30 transition-all group">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="w-10 h-10 bg-[#1c212c] border border-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 transition-colors">
                                                    {request.founderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                                
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-white truncate">{request.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{request.founderName}</p>
                                                </div>
                                            </div>

                                            <div className="shrink-0 ml-4">
                                                {request.status === 'done' ? (
                                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                                        <CheckCircle2 size={12} className="stroke-[3px]" />
                                                        <span className="hidden sm:inline">Done</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                        <Clock size={12} className="stroke-[3px]" />
                                                        <span className="hidden sm:inline">Pending</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center px-2">
                                    <div className="p-3 bg-blue-500/10 rounded-full mb-4">
                                        <Users size={24} className="text-blue-400" />
                                    </div>
                                    <p className="text-slate-500 italic text-sm font-medium mb-1">No founder requests found.</p>
                                    <p className="text-xs text-slate-500 mb-5">Share your link to receive startup details</p>
                                    
                                    <div className="w-full flex items-center gap-2 bg-black/40 border border-blue-500/20 p-1.5 rounded-xl backdrop-blur-md">
                                        <code className="text-blue-100/70 px-2 text-[10px] truncate grow text-left">
                                            {shareUrl || "Loading link..."}
                                        </code>
                                        <button 
                                            onClick={copyToClipboard} 
                                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-blue-500/20"
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            <span className="text-[10px] font-bold uppercase">{copied ? "Copied" : "Copy"}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-gray-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2 h-[280px] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="text-lg font-semibold text-white">Intro Outcome Logs</h3>
                            <Activity className="text-slate-500" size={18} />
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto pr-2 grow custom-scrollbar"> 
                            {data.logs.length > 0 ? (
                                data.logs.map((log) => (
                                    <div key={log._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/30 transition-all shrink-0">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                                <Clock size={16} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-slate-200 capitalize truncate">
                                                    {log.outcome.replace(/_/g, ' ')}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {log.notes}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="shrink-0 text-right ml-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                {log.createdAt ? new Date(log.createdAt).toLocaleDateString(undefined, { 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                }) : 'Recent'}
                                            </p>
                                            <p className="text-[9px] text-slate-600">
                                                {log.createdAt ? new Date(log.createdAt).toLocaleTimeString(undefined, { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit',
                                                    hour12: true 
                                                }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 italic text-sm">
                                    No activity logs to display.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, iconBg }: any) {
    return (
        <div className="bg-gray-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-start">
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
            </div>
            <div className={`${iconBg} p-2 rounded-xl`}>{icon}</div>
        </div>
    );
}