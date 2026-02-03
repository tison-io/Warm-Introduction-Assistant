'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePresence } from '../hooks/usePresence';
import { Users, CheckCircle2, Clock, ChevronRight, Bell, Check, Loader2, TrendingUp, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// API & Types
import { fetchReminders, markReminderCompleted } from '../lib/reminder-api';
import { getInvestors } from '../lib/investor-api';
import { fetchIntrosByFounder, fetchExecutionRate, fetchOutcomeLogs } from '../lib/intro-api';
import { getMyRequests } from '../lib/startup-api'; // Added this
import { IntroQueue, OutcomeLog } from '../types/intro';
import { Reminder } from '../types/reminder';
import { Startup } from '../types/startup'; // Added this
import { useToast } from '../components/Toast';

// --- Helpers ---
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
    recentRequests: Startup[]; // Added for the preview tile
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

    const loadDashboardData = async () => {
        try {
            const [intros, investors, reminders, rate, logs, requests] = await Promise.all([
                fetchIntrosByFounder(),
                getInvestors(),
                fetchReminders(),
                fetchExecutionRate(),
                fetchOutcomeLogs(),
                getMyRequests() // Fetching the startups
            ]);

            const pendingCount = intros.filter(i => i.status === 'queued' || i.status === 'sent').length;
            const completedCount = intros.filter(i => i.status === 'completed').length;
            
            setData({
                totalIntros: intros.length,
                pendingFollowUps: pendingCount,
                myInvestors: investors.length,
                remindersDue: reminders.filter(r => (isToday(new Date(r.date)) || differenceInDays(new Date(r.date)) < 0) && r.introId?.status !== 'completed').length,
                executionRate: rate,
                completedIntros: completedCount,
                latestIntros: intros.slice(0, 3),
                reminders: reminders,
                logs: logs.slice(0, 6),
                recentRequests: requests.slice(0, 3), // Show top 3
            });
        } catch (err: any) {
            showToast("Failed to load dashboard", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.id) setFounder({ ...parsed, _id: parsed.id });
        }
        loadDashboardData();
    }, []);

    usePresence(founder?._id, (update) => console.log(update));

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

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-10">
            {!loading && (
                <div className="max-w-7xl mx-auto space-y-8">
                    {founder && (
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                            Welcome back, <span className="text-blue-500">{founder.name}</span>
                        </h2>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Investors" value={data.myInvestors} icon={<Users className="text-indigo-400" />} iconBg="bg-indigo-500/20" />
                        <StatCard title="Intro Success" value={`${data.executionRate}%`} icon={<CheckCircle2 className="text-emerald-400" />} iconBg="bg-emerald-500/20" />
                        <StatCard title="Requests" value={data.recentRequests.length} icon={<Activity className="text-blue-400" />} iconBg="bg-blue-500/20" />
                        <StatCard title="Reminders" value={data.remindersDue} icon={<Bell className="text-cyan-400" />} iconBg="bg-cyan-500/20" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Reminders Tile */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 h-[350px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Upcoming Reminders</h3>
                                <Link href="/reminders" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">View All</Link>
                            </div>
                            <div className="space-y-3 overflow-y-auto custom-scrollbar grow">
                                {data.reminders.filter(r => r.introId?.status !== 'completed').map(reminder => (
                                    <div key={reminder._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 group hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => handleMarkAsDone(reminder)}
                                                className="w-5 h-5 rounded-md border-2 border-slate-600 group-hover:border-indigo-500 flex items-center justify-center"
                                            >
                                                <Check size={14} className="text-indigo-500 scale-0 group-hover:scale-100 transition-transform" />
                                            </button>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-200 truncate">{reminder.introId?.investorName}</p>
                                                <p className="text-[11px] text-slate-500">Follow up due</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500">{new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* NEW: Founder Requests Sneak Preview (Replaced Velocity Chart) */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 h-[350px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Founder Requests</h3>
                                <Link href="/startups" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4 grow overflow-y-auto custom-scrollbar">
                                {data.recentRequests.length > 0 ? (
                                    data.recentRequests.map((request) => (
                                        <Link key={request._id} href="/startups">
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-[#11141b] border border-slate-800/50 hover:border-blue-500/30 transition-all group">
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className="w-10 h-10 bg-[#1c212c] border border-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:border-blue-500/50 transition-colors">
                                                        {request.founderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold text-white truncate">{request.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{request.founderName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 italic text-sm">No new requests found.</div>
                                )}
                            </div>
                        </section>

                        {/* Outcome Logs */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 lg:col-span-2 h-[280px]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Intro Outcome Logs</h3>
                                <Activity className="text-slate-500" size={18} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-2 h-[180px]"> 
                                {data.logs.map((log) => (
                                    <div key={log._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Clock size={16} /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-slate-200 capitalize truncate">{log.outcome.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-slate-500 truncate">{log.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, iconBg }: any) {
    return (
        <div className="bg-[#0f172a]/40 border border-slate-800 p-5 rounded-2xl flex justify-between items-start">
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
            </div>
            <div className={`${iconBg} p-2 rounded-xl`}>{icon}</div>
        </div>
    );
}