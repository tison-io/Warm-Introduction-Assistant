'use client';

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Clock, ChevronRight, Filter, Bell, Check, Loader2, TrendingUp, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { fetchReminders, markReminderCompleted } from '../lib/reminder-api';
import { getInvestors, fetchFundraisingVelocity } from '../lib/investor-api';
import type { velocityData } from '../types/investor';
import { fetchIntrosByFounder, fetchExecutionRate, fetchOutcomeLogs } from '../lib/intro-api';
import { getFounderProfile } from '../lib/founder-api';
import { IntroQueue } from '../types/intro';
import { Reminder } from '../types/reminder';
import { OutcomeLog } from '../types/intro';
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
    logs: OutcomeLog[]; // Added logs
}

export default function DashboardPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [data, setData] = useState<DashboardData>({
        totalIntros: 0,
        pendingFollowUps: 0,
        myInvestors: 0,
        remindersDue: 0,
        executionRate: 0,
        completedIntros: 0,
        latestIntros: [],
        reminders: [],
        velocity: [],
        logs: [],
    });
    const [founder, setFounder] = useState<{ name: string; email: string; tier:string; } | null>(null);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [intros, investors, reminders, rate, velocity, logs] = await Promise.all([
            fetchIntrosByFounder(),
            getInvestors(),
            fetchReminders(),
            fetchExecutionRate(),
            fetchFundraisingVelocity(),
            fetchOutcomeLogs() // Fetching history logs
        ]);

        const pendingCount = intros.filter(i => i.status === 'queued' || i.status === 'sent').length;
        const completedCount = intros.filter(i => i.status === 'completed').length;
        const latest = intros
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);

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
    }, []);

    useEffect(() => {
        getFounderProfile()
            .then(data => {
            setFounder({
                name: data.name,
                email: data.email,
                tier: data.tier
            });
        })
        .catch(err => console.error(err));
    }, []);


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
                        <h3 className="text-lg font-semibold text-white mb-6">Upcoming Reminders</h3>
                            <div className="space-y-4">
                                {data.reminders.filter(r => r.introId?.status !== 'completed').slice(0, 4).map(reminder => (
                                    <div key={reminder._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 group">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => handleMarkAsDone(reminder)}
                                                disabled={!!processingId}
                                                className="w-6 h-6 rounded-full border-2 border-indigo-500/40 flex items-center justify-center hover:bg-indigo-500/20 transition-all"
                                            >
                                                {processingId === reminder._id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} className="opacity-0 group-hover:opacity-100" />}
                                            </button>
                                            <div>
                                                <p className="text-sm font-medium text-slate-200">{reminder.introId?.investorName}</p>
                                                <p className="text-xs text-slate-500">Follow up due</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tabular-nums">
                                            {new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                                {data.reminders.length === 0 && <p className="text-slate-500 italic text-sm text-center py-10">All caught up!</p>}
                            </div>
                    </section>

                    {/* Fundraising Velocity Chart */}
                    <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 min-h-[350px]">
                        <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Fundraising Velocity</h3>
                        <TrendingUp className="text-emerald-500" size={18} />
                        </div>
                        <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.velocity} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#64748b" 
                                fontSize={11} 
                                tickLine={false} 
                                axisLine={false} 
                                dy={10} 
                                padding={{ left: 0, right: 0 }}
                                tickFormatter={(val) => val ? new Date(val).toLocaleDateString(undefined, { month: 'short' }) : ''} 
                            />
                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="investorsContacted" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVel)" dot={false} connectNulls={true} activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Activity Logs Tile */}
                    <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                            <Activity className="text-slate-500" size={18} />
                        </div>
                        
                        {/* CHANGED: Switched from grid to flex-col for vertical stacking */}
                        <div className="flex flex-col gap-3"> 
                            {data.logs && data.logs.length > 0 ? (
                            data.logs.map((log) => (
                                <div 
                                key={log._id} 
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 group hover:border-indigo-500/30 transition-all"
                                >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div className="min-w-0"> {/* min-w-0 helps with text truncation */}
                                        <p className="text-sm font-medium text-slate-200 capitalize">
                                            {log.outcome.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-1">
                                            {log.notes}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="text-right flex flex-col items-end shrink-0 ml-4">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleDateString(undefined, { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                    <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </span>
                                </div>
                                </div>
                            ))
                            ) : (
                            <div className="py-12 text-center text-slate-500 italic text-sm border border-dashed border-slate-800 rounded-xl">
                                No activity history found.
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
        <div className="bg-[#0f172a]/40 border border-slate-800 p-5 rounded-2xl flex justify-between items-start">
        <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
        </div>
        <div className={`${iconBg} p-2 rounded-xl`}>{icon}</div>
        </div>
    );
}