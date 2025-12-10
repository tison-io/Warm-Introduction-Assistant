'use client';

import { useEffect, useState, useMemo } from 'react';
import { Filter, Clock, Users, Bell, CalendarCheck, Scroll } from 'lucide-react'; // Import additional icons
import DashboardCard from '../components/dashboard/DashboardCard';
import { Reminder } from '../types/reminder';
import { IntroQueue, IntroStatus } from '../types/intro';
import { fetchReminders } from '../lib/reminder-api'; 
import { getInvestors } from '../lib/investor-api';
import { fetchIntrosByFounder } from '../lib/intro-api';

// --- Helper Functions from IntroQueuePage component ---

// NOTE: You'll likely need a real utility function for time-ago formatting, 
// but for simplicity, we'll use a placeholder for now.
const timeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
};

interface StatusBadgeProps {
    status: IntroStatus;
}

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

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const { style, text } = getStatusStyle(status);
    return (
        <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-black ${style}`}>
            {text}
        </span>
    );
};


// --- Helper Functions from ReminderList component ---

const isToday = (someDate: Date): boolean => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};

const differenceInDays = (targetDate: Date): number => {
    const now = new Date();
    const dueDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// --- Custom Hooks for Data Fetching ---

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
                // 1. Fetch Intros
                const intros: IntroQueue[] = await fetchIntrosByFounder();
                const totalIntros = intros.length;
                const pendingFollowUps = intros.filter(i => i.status === 'queued' || i.status === 'sent').length;

                // Sort intros by creation date (latest first) and take the first 2
                const latestIntros = intros
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 2); 

                // 2. Fetch Investors
                const investors = await getInvestors();
                const myInvestors = investors.length;

                // 3. Fetch Reminders (RemindersDue count)
                const reminders: Reminder[] = await fetchReminders();
                const remindersDue = reminders.filter(r => {
                    const dueDate = new Date(r.date);
                    const daysDiff = differenceInDays(dueDate);
                    return isToday(dueDate) || daysDiff < 0;
                }).length;


                setData({
                    totalIntros,
                    pendingFollowUps,
                    myInvestors,
                    remindersDue,
                    latestIntros, // Stored the latest 2 intros
                });
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                // Set counts to 0 and latestIntros to [] on failure
                setData({
                    totalIntros: 0,
                    pendingFollowUps: 0,
                    myInvestors: 0,
                    remindersDue: 0,
                    latestIntros: [],
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, loading };
};


// --- Main DashboardPage Component ---

export default function DashboardPage() {
    const { data, loading } = useDashboardData();

    if (loading) {
        return (
            <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/background-img.jpg')" }}
            >
                <div className="p-8 text-white max-w-7xl mx-auto">Loading dashboard data...</div>
            </div>
        );
    }

    // Custom Badge component for Quick Action Cards
    const ActionCardBadge: React.FC<{ count: number }> = ({ count }) => {
        if (count === 0) return null;
        return (
            <span className="absolute top-[-8px] right-[-8px] bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-900 shadow-xl">
                {count > 99 ? '99+' : count}
            </span>
        );
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center p-6 md:p-8"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <h1 className="text-4xl font-semibold text-white mb-2">Welcome back!</h1>
                <p className="text-xl text-gray-300 mb-8">Track your investor outreach and manage introductions</p>
                
                {/* --- 1. Summary Cards Row --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <DashboardCard
                        title="Total Intros"
                        count={data.totalIntros}
                        icon={Filter}
                        iconColor="text-blue-400"
                        bgColor="border-blue-500"
                    />
                    <DashboardCard
                        title="Pending Follow-ups"
                        count={data.pendingFollowUps}
                        icon={Clock}
                        iconColor="text-yellow-400"
                        bgColor="border-yellow-500"
                    />
                    <DashboardCard
                        title="My Investors"
                        count={data.myInvestors}
                        icon={Users}
                        iconColor="text-green-400"
                        bgColor="border-green-500"
                    />
                    <DashboardCard
                        title="Reminders (Due Today/Overdue)"
                        count={data.remindersDue}
                        icon={Bell}
                        iconColor="text-red-400"
                        bgColor="border-red-500"
                    />
                </div>
                
                {/* --- 2. Quick Actions (New Card Added) --- */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
                    {/* Changed grid to grid-cols-3 to accommodate the new card */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> 
                        
                        {/* Manage Investors */}
                        <a href="/investors" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg text-white hover:bg-gray-200 transition duration-150 relative">
                            <div className="flex items-center">
                                <Users className="h-6 w-6 mr-3 text-black" />
                                <span className="text-lg font-medium text-black">Manage Investors</span>
                            </div>
                        </a>
                        
                        {/* Generate New Intro */}
                        <a href="/startups" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg text-white hover:bg-gray-200 transition duration-150 relative">
                            <div className="flex items-center">
                                <Scroll className="h-6 w-6 mr-3 text-black" />
                                <span className="text-lg font-medium text-black">Manage Startups</span>
                            </div>
                        </a>
                        
                        {/* View Reminders (NEW CARD) */}
                        <a href="/reminders" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg text-white ring-2 ring-red-500/50 hover:bg-gray-200 transition duration-150 relative">
                            <ActionCardBadge count={data.remindersDue} />
                            <div className="flex items-center">
                                <CalendarCheck className="h-6 w-6 mr-3 text-red-400" />
                                <span className="text-lg font-bold text-black">View Reminders</span>
                            </div>
                        </a>
                        
                    </div>
                </div>

                {/* --- 3. Latest Drafts/Activity (Dynamic Content) --- */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Latest Drafts</h2>
                    <div className="space-y-4">
                        {data.latestIntros.length > 0 ? (
                            data.latestIntros.map((intro) => (
                                <div 
                                    key={intro._id} 
                                    className="p-4 bg-white rounded-xl shadow-lg text-white border-l-4"
                                    style={{ borderLeftColor: getStatusStyle(intro.status).style.replace('bg-', '#').replace('/50', '') }}
                                >
                                    <p className="text-lg font-semibold truncate text-black">
                                        Intro for: {intro.startupName}
                                    </p>
                                    <p className="text-sm text-black">
                                        To: {intro.investorName} 
                                    </p>
                                    <StatusBadge status={intro.status} />
                                </div>
                            ))
                        ) : (
                            <div className="p-4 bg-white rounded-xl shadow-lg text-white text-center text-black">
                                No recent drafts found.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}