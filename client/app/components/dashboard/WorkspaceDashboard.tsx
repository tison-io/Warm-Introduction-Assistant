'use client';

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Clock, Filter, Bell, Check, TrendingUp, Activity, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// API & Types
import { getInvestors, fetchFundraisingVelocity } from '../../lib/investor-api';
import { fetchIntrosByFounder, fetchExecutionRate, fetchOutcomeLogs } from '../../lib/intro-api';
import { fetchReminders, markReminderCompleted } from "../../lib/reminder-api"; // Import your reminder API
import { OutcomeLog } from '../../types/intro';
import { useToast } from '../../components/Toast';

export default function WorkspaceDashboard({ workspaceId }: { workspaceId?: string }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [reminders, setReminders] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalIntros: 0, myInvestors: 0, executionRate: 0, remindersDue: 0 });
    const [velocity, setVelocity] = useState<any[]>([]);
    const [logs, setLogs] = useState<OutcomeLog[]>([]);

    const loadWorkspaceData = async () => {
        try {
            const [intros, investors, rate, vel, outLogs, reminderData] = await Promise.all([
                fetchIntrosByFounder(workspaceId),
                getInvestors(workspaceId),
                fetchExecutionRate(workspaceId),
                fetchFundraisingVelocity(workspaceId),
                fetchOutcomeLogs(workspaceId),
                fetchReminders(workspaceId)
            ]);

            setStats({ 
                totalIntros: intros.length, 
                myInvestors: investors.length, 
                executionRate: rate,
                remindersDue: reminderData.length 
            });
            setVelocity(vel);
            setLogs(outLogs);
            setReminders(reminderData);
        } catch (err) {
            showToast("Failed to sync workspace data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteReminder = async (id: string) => {
        try {
            await markReminderCompleted(id);
            setReminders(prev => prev.filter(r => r._id !== id));
            setStats(prev => ({ ...prev, remindersDue: prev.remindersDue - 1 }));
            showToast("Reminder completed", "success");
        } catch (err) {
            showToast("Failed to update reminder", "error");
        }
    };

    useEffect(() => { loadWorkspaceData(); }, [workspaceId]);

    if (loading) return <div className="p-6 lg:p-10 bg-[#020617] min-h-screen text-slate-500">Syncing workspace...</div>;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Workspace Dashboard(NOT COMPLETED YET)</h1>
                        <p className="text-slate-500 text-sm">Workspace ID: {workspaceId || 'Personal'}</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input placeholder="Search workspace..." className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Team Investors" value={stats.myInvestors} icon={<Users size={20} className="text-indigo-400" />} iconBg="bg-indigo-500/20" />
                    <StatCard title="Intro Success" value={`${stats.executionRate}%`} icon={<CheckCircle2 size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" />
                    <StatCard title="Active Intros" value={stats.totalIntros} icon={<Filter size={20} className="text-amber-400" />} iconBg="bg-amber-500/20" />
                    <StatCard title="Team Reminders" value={stats.remindersDue} icon={<Bell size={20} className="text-cyan-400" />} iconBg="bg-cyan-500/20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* DYNAMIC REMINDERS */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <Bell size={16} className="text-indigo-400" /> Upcoming Reminders
                            </h3>
                            <div className="h-[178px] overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                {reminders.length > 0 ? reminders.map(reminder => (
                                    <div key={reminder._id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/30 transition-all shrink-0">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <button 
                                                onClick={() => handleCompleteReminder(reminder._id)}
                                                className="w-5 h-5 rounded border border-slate-700 flex items-center justify-center shrink-0 hover:bg-emerald-500/20 hover:border-emerald-500 group"
                                            >
                                                <Check size={12} className="text-transparent group-hover:text-emerald-500" />
                                            </button>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-slate-200 truncate">
                                                    Follow up: {reminder.introId?.investorName || 'Investor'}
                                                </p>
                                                <p className="text-[10px] text-slate-500 truncate">{reminder.introId?.startupName || 'Project'}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase shrink-0 ml-2">
                                            {new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-xs text-slate-600 italic">No pending tasks</p>
                                )}
                            </div>
                        </section>

                        {/* Activity Logs */}
                        <section className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-emerald-400" /> Workspace History
                            </h3>
                            <div className="h-[178px] overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                {logs.map((log) => (
                                    <div key={log._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Clock size={14} /></div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-200 capitalize truncate">{log.outcome.replace(/_/g, ' ')}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{log.notes || 'Outcome recorded'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Velocity Chart */}
                    <section className="lg:col-span-8 bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Fundraising Velocity</h3>
                            <TrendingUp className="text-emerald-500" size={18} />
                        </div>
                        <div className="h-[430px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={velocity}>
                                    <defs>
                                        <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#1e293b" opacity={0.3} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(_, i) => `W${i + 1}`} />
                                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="investorsContacted" stroke="#a78bfa" strokeWidth={3} fillOpacity={1} fill="url(#colorVel)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, iconBg }: any) {
    return (
        <div className="bg-[#0f172a]/40 border border-slate-800 p-5 rounded-2xl flex justify-between items-start hover:bg-[#0f172a]/60 transition-colors">
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <h4 className="text-3xl font-bold text-white mt-1 tabular-nums">{value}</h4>
            </div>
            <div className={`${iconBg} p-2 rounded-xl`}>{icon}</div>
        </div>
    );
}