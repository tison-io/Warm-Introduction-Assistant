'use client';

import { useEffect, useState } from 'react';
import { Filter, Clock, Users, Bell, CalendarCheck, Scroll, Wand2 } from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import { Reminder } from '../types/reminder';
import { IntroQueue, IntroStatus } from '../types/intro';
import { fetchReminders } from '../lib/reminder-api';
import { getInvestors } from '../lib/investor-api';
import { fetchIntrosByFounder } from '../lib/intro-api';

// Helper for status badges
const getStatusStyle = (status: IntroStatus): { style: string; text: string } => {
    switch (status) {
        case 'queued':
            return { style: 'bg-gray-400', text: 'Drafted' };
        case 'sent':
            return { style: 'bg-blue-300', text: 'Sent' };
        case 'completed':
            return { style: 'bg-purple-500/50', text: 'Completed' };
        default:
            return { style: 'bg-gray-400/50', text: 'Unknown' };
    }
};

const StatusBadge: React.FC<{ status: IntroStatus }> = ({ status }) => {
    const { style, text } = getStatusStyle(status);
    return (
        <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-black ${style}`}>
            {text}
        </span>
    );
};

// Helper for Reminders
const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};
const differenceInDays = (targetDate: Date) => {
    const now = new Date();
    const dueDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Dashboard Data Hook
interface DashboardData {
    totalIntros: number;
    pendingFollowUps: number;
    myInvestors: number;
    remindersDue: number;
    latestIntros: IntroQueue[];
}
const useDashboardData = () => {
    const [data, setData] = useState<DashboardData>({
        totalIntros: 0,
        pendingFollowUps: 0,
        myInvestors: 0,
        remindersDue: 0,
        latestIntros: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const intros = await fetchIntrosByFounder();
                const totalIntros = intros.length;
                const pendingFollowUps = intros.filter(i => i.status === 'queued' || i.status === 'sent').length;
                const latestIntros = intros.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,2);
                const investors = await getInvestors();
                const myInvestors = investors.length;
                const reminders = await fetchReminders();
                const remindersDue = reminders.filter(r => {
                    const dueDate = new Date(r.date);
                    const daysDiff = differenceInDays(dueDate);
                    return isToday(dueDate) || daysDiff < 0;
                }).length;

                setData({ totalIntros, pendingFollowUps, myInvestors, remindersDue, latestIntros });
            } catch (err) {
                console.error(err);
                setData({ totalIntros:0, pendingFollowUps:0, myInvestors:0, remindersDue:0, latestIntros:[] });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return { data, loading };
};

// Main Dashboard
export default function DashboardPage() {
    const { data, loading } = useDashboardData();

    // Skeleton Cards
    const SkeletonCard = () => (
        <div className="p-4 bg-gray-200 rounded-xl animate-pulse h-28" />
    );
    const SkeletonActionCard = () => (
        <div className="p-4 bg-gray-200 rounded-xl animate-pulse h-20" />
    );
    const SkeletonDraftCard = () => (
        <div className="p-4 bg-gray-200 rounded-xl animate-pulse h-24" />
    );
    

    const ActionCardBadge: React.FC<{ count: number }> = ({ count }) => {
        if (count === 0) return null;
        return (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-900 shadow-xl">
                {count > 99 ? '99+' : count}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-cover bg-center p-6 md:p-8" style={{ backgroundImage: "url('/background-img.jpg')" }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-semibold text-white mb-2">Welcome back!</h1>
                <p className="text-xl text-gray-300 mb-8">Track your investor outreach and manage introductions</p>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {loading ? [0,1,2,3].map(i => <SkeletonCard key={i} />) : (
                        <>
                            <DashboardCard title="Total Intros" count={data.totalIntros} icon={Filter} iconColor="text-blue-400" bgColor="border-blue-500" />
                            <DashboardCard title="Pending Follow-ups" count={data.pendingFollowUps} icon={Clock} iconColor="text-yellow-400" bgColor="border-yellow-500" />
                            <DashboardCard title="My Investors" count={data.myInvestors} icon={Users} iconColor="text-green-400" bgColor="border-green-500" />
                            <DashboardCard title="Reminders (Due Today/Overdue)" count={data.remindersDue} icon={Bell} iconColor="text-red-400" bgColor="border-red-500" />
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? [0,1,2,3].map(i => <SkeletonActionCard key={i} />) : (
                            <>
                                <a href="/investors" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:bg-gray-200 transition relative">
                                    <Users className="h-6 w-6 mr-3 text-black" />
                                    <span className="text-lg font-medium text-black">Manage Investors</span>
                                </a>
                                <a href="/startups" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:bg-gray-200 transition relative">
                                    <Scroll className="h-6 w-6 mr-3 text-black" />
                                    <span className="text-lg font-medium text-black">Manage Startups</span>
                                </a>
                                <a href="/intro-wizard" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:bg-gray-200 transition relative">
                                    <Wand2 className="h-6 w-6 mr-3 text-black" />
                                    <span className="text-lg font-medium text-black">Generate new intro</span>
                                </a>
                                <a href="/reminders" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg ring-2 ring-red-500/50 hover:bg-gray-200 transition relative">
                                    <ActionCardBadge count={data.remindersDue} />
                                    <CalendarCheck className="h-6 w-6 mr-3 text-red-400" />
                                    <span className="text-lg font-bold text-black">View Reminders</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>

                {/* Latest Drafts */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Latest Drafts</h2>
                    <div className="space-y-4">
                        {loading ? [0,1].map(i => <SkeletonDraftCard key={i} />) : (
                            data.latestIntros.length > 0 ? data.latestIntros.map((intro) => (
                                <div key={intro._id} className="p-4 bg-white rounded-xl shadow-lg border-l-4" style={{ borderLeftColor: getStatusStyle(intro.status).style.replace('bg-', '#').replace('/50','') }}>
                                    <p className="text-lg font-semibold text-black truncate">Intro for: {intro.startupName}</p>
                                    <p className="text-sm text-black">To: {intro.investorName}</p>
                                    <StatusBadge status={intro.status} />
                                </div>
                            )) : (
                                <div className="p-4 bg-white rounded-xl shadow-lg text-center text-black">
                                    No recent drafts found.
                                </div>
                            )
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
