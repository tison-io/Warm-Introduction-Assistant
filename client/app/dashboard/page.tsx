'use client';

import React, { useState, useEffect } from 'react';
import { usePresence } from '../hooks/usePresence';
import { Users, CheckCircle2, Clock, ChevronRight, Filter, Bell, Check, Loader2, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// API & Types
import { fetchReminders, markReminderCompleted } from '../lib/reminder-api';
import { getInvestors, fetchFundraisingVelocity } from '../lib/investor-api';
import type { velocityData } from '../types/investor';
import { fetchIntrosByFounder, fetchExecutionRate, fetchOutcomeLogs } from '../lib/intro-api';
import { getFounderProfile } from '../lib/founder-api';
import { IntroQueue, OutcomeLog } from '../types/intro';
import { Reminder } from '../types/reminder';
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

// --- Skeleton Components ---
const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`} />
);

function DashboardSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#0f172a]/40 border border-slate-800 p-5 rounded-2xl flex justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-12" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-xl" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 h-[300px]">
                    <div className="flex justify-between mb-6"><Skeleton className="h-6 w-40" /><Skeleton className="h-6 w-16" /></div>
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl opacity-50" />
                    </div>
                </section>
                <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 h-[300px]">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <Skeleton className="h-full w-full rounded-xl" />
                </section>
            </div>
        </div>
    );
}

// --- Types ---
interface DashboardData {
    totalIntros: number;
    pendingFollowUps: number;
    myInvestors: number;
    remindersDue: number;
    executionRate: number;
    completedIntros: number;
    latestIntros: IntroQueue[];
    reminders: Reminder[];
    velocity: velocityData[];
    logs: OutcomeLog[];
}

export default function DashboardPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [data, setData] = useState<DashboardData>({
        totalIntros: 0, pendingFollowUps: 0, myInvestors: 0, remindersDue: 0,
        executionRate: 0, completedIntros: 0, latestIntros: [], reminders: [],
        velocity: [], logs: [],
    });
    
    // Updated type to include _id for presence tracking
    const [founder, setFounder] = useState<{ _id?: string; name: string; email: string; tier: string; } | null>(null);

    const loadDashboardData = async () => {
        try {
            const [intros, investors, reminders, rate, velocity, logs] = await Promise.all([
                fetchIntrosByFounder(),
                getInvestors(),
                fetchReminders(),
                fetchExecutionRate(),
                fetchFundraisingVelocity(),
                fetchOutcomeLogs()
            ]);

            const pendingCount = intros.filter(i => i.status === 'queued' || i.status === 'sent').length;
            const completedCount = intros.filter(i => i.status === 'completed').length;
            const latest = intros.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
            const dueCount = reminders.filter(r => {
                const d = new Date(r.date);
                return (isToday(d) || differenceInDays(d) < 0) && r.introId?.status !== 'completed';
            }).length;

            setData({
                totalIntros: intros.length,
                pendingFollowUps: pendingCount,
                myInvestors: investors.length,
                remindersDue: dueCount,
                executionRate: rate,
                completedIntros: completedCount,
                latestIntros: latest,
                reminders: reminders,
                velocity: velocity,
                logs: logs.slice(0, 6),
            });
        } catch (err: any) {
            console.error("Error loading dashboard:", err);
            showToast("Failed to load dashboard data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        
        // Fetch full profile to ensure we have the MongoDB _id
        getFounderProfile()
            .then(res => {
                setFounder(res);
                localStorage.setItem('user', JSON.stringify(res));
            })
            .catch(err => {
                console.error(err);
                // Fallback to local storage if API is slow/fails
                const storedUser = localStorage.getItem('user');
                if (storedUser) setFounder(JSON.parse(storedUser));
            });
    }, []);

    // --- Presence Hook ---
    // This connects the WebSocket and flips 'isOnline' to true in the DB
    usePresence(founder?._id, (presenceUpdate) => {
        console.log("Presence status update received:", presenceUpdate);
    });

    const handleMarkAsDone = async (reminder: Reminder) => {
        try {
            setProcessingId(reminder._id);
            await markReminderCompleted(reminder._id);
            showToast('Reminder completed', 'success');
            await loadDashboardData();
        } catch (err: any) {
            showToast('Update failed', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-10">
            {loading ? (
                <DashboardSkeleton />
            ) : (
                <div className="max-w-7xl mx-auto space-y-8">
                    {founder && (
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Welcome back, <span className="text-blue-500">{founder.name}</span>
                        </h2>
                    )}

                    {/* Top Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Investors" value={data.myInvestors} icon={<Users className="text-indigo-400" />} iconBg="bg-indigo-500/20" />
                        <StatCard title="Intro Success" value={`${data.executionRate}%`} icon={<CheckCircle2 className="text-emerald-400" />} iconBg="bg-emerald-500/20" />
                        <StatCard title="Completed" value={data.completedIntros} icon={<Filter className="text-amber-400" />} iconBg="bg-amber-500/20" />
                        <StatCard title="Reminders" value={data.remindersDue} icon={<Bell className="text-cyan-400" />} iconBg="bg-cyan-500/20" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Reminders Tile */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Upcoming Reminders</h3>
                                <Link href="/reminders" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-3 h-[185px] overflow-y-auto pr-2 custom-scrollbar">
                                {data.reminders.filter(r => r.introId?.status !== 'completed').map(reminder => (
                                    <div key={reminder._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 group hover:bg-slate-800/40 hover:border-indigo-500/30 transition-all shrink-0">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => handleMarkAsDone(reminder)}
                                                disabled={!!processingId}
                                                className={`relative w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center shrink-0 ${processingId === reminder._id ? "border-indigo-500/20" : "border-slate-600 group-hover:border-indigo-500 bg-transparent hover:bg-indigo-500/10"}`}
                                            >
                                                {processingId === reminder._id ? <Loader2 size={12} className="animate-spin text-indigo-400" /> : <Check size={14} strokeWidth={3} className="text-indigo-500 scale-0 group-hover:scale-100 transition-transform duration-200" />}
                                            </button>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{reminder.introId?.investorName}</p>
                                                <p className="text-[11px] text-slate-500">Follow up due</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-400 uppercase tabular-nums ml-4 shrink-0 transition-colors">
                                            {new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                                {data.reminders.filter(r => r.introId?.status !== 'completed').length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center"><p className="text-slate-500 italic text-sm">All caught up!</p></div>
                                )}
                            </div>
                        </section>

                        {/* Fundraising Velocity Chart */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 min-h-[350px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-white">Fundraising Velocity</h3>
                                <TrendingUp className="text-emerald-500" size={18} />
                            </div>
                            <div className="h-52 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.velocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                        <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#1e293b" opacity={0.3} />
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={15} tickFormatter={(str, index) => `Week ${index + 1}`} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={true} domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                                        <Area type="monotone" dataKey="investorsContacted" stroke="#a78bfa" strokeWidth={3} fillOpacity={1} fill="url(#colorVel)" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Activity Logs Tile */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Intro Outcome Logs</h3>
                                <Activity className="text-slate-500" size={18} />
                            </div>
                            <div className="flex flex-col gap-3 h-[200px] overflow-y-auto pr-2 custom-scrollbar"> 
                                {data.logs && data.logs.length > 0 ? (
                                    data.logs.map((log) => (
                                        <div key={log._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 group hover:border-indigo-500/30 transition-all shrink-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors shrink-0"><Clock size={16} /></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-200 capitalize">{log.outcome.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{log.notes}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end shrink-0 ml-4">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">{new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                <span className="text-[10px] text-slate-600 whitespace-nowrap">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-slate-500 italic text-sm border border-dashed border-slate-800 rounded-xl">No activity history found.</div>
                                )}
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