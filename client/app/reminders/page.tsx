'use client';

import { useEffect, useState } from 'react';
import { Reminder } from '../types/reminder';
import { deleteReminder, fetchReminders } from '../lib/reminder-api';
import { Trash, Loader2 } from 'lucide-react';
import { useToast } from '../components/Toast';

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

interface DueBadgeProps {
  date: Date;
}

const DueBadge: React.FC<DueBadgeProps> = ({ date }) => {
  const daysDifference = differenceInDays(date);
  
  let badgeStyle = "bg-yellow-500";
  let badgeText = `Due in ${daysDifference} days`;

  if (isToday(date)) {
    badgeStyle = "bg-red-500";
    badgeText = "Due Today";
  } else if (daysDifference < 0) {
    badgeStyle = "bg-red-500";
    badgeText = "Overdue";
  } else if (daysDifference === 1) {
    badgeText = "Due in 1 day";
  }

  if (daysDifference > 365) return null;

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${badgeStyle}`}>
      {badgeText}
    </span>
  );
};

export default function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await fetchReminders();
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const isTodayA = isToday(dateA);
        const isTodayB = isToday(dateB);

        if (isTodayA && !isTodayB) return -1;
        if (!isTodayA && isTodayB) return 1;
        return dateA.getTime() - dateB.getTime();
      });
      setReminders(sortedData);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to load reminders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      setReminders(prevReminders => prevReminders.filter(r => r._id !== reminderId));
      await deleteReminder(reminderId);
      showToast('Reminder deleted successfully', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete reminder', 'error');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-white p-8"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 data-testid="reminders-page-title" className="text-4xl font-semibold mb-2">Reminders</h1>
        <p className="text-xl mb-8">
          <span data-testid="reminders-count" className='font-bold'>{reminders.length}</span> follow-ups due
        </p>

        {loading ? (
          <div data-testid="reminders-loading-spinner" className="bg-white text-black p-6 rounded-xl shadow-2xl flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-700" />
            <span className="font-medium text-gray-800">Loading reminders...</span>
          </div>
        ) : reminders.length === 0 ? (
          <div data-testid="reminders-empty-state" className="p-4 bg-gray-300 text-black backdrop-blur-sm rounded-lg shadow-xl">
            No reminders pending.
          </div>
        ) : (
          <ul data-testid="reminders-list" className="space-y-4">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.date);
              const personName = reminder.introId?.investorName || 'Unknown Investor';
              const startupName = reminder.introId?.startupName || 'Unknown Startup';
              const followUpText = `Follow up on intro to ${startupName}`;
              const formattedDate = dueDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).split('/').reverse().join('-'); // YYYY-MM-DD

              return (
                <li
                  data-testid={`reminder-item-${reminder._id}`}
                  key={reminder._id}
                  className="bg-white text-black p-4 rounded-xl shadow-2xl flex justify-between items-center transition duration-300"
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-3">
                      <p data-testid={`reminder-investor-name-${reminder._id}`} className="text-lg font-bold text-black">
                        To Investor: {personName}
                      </p>
                      <DueBadge date={dueDate} />
                    </div>
                    <p className="text-black">{followUpText} startup.</p>
                    <p data-testid={`reminder-due-date-${reminder._id}`} className="text-sm text-black">Due: {formattedDate}</p>
                  </div>

                  <div className="flex space-x-2 items-center">
                    <button
                      data-testid={`reminder-delete-btn-${reminder._id}`}
                      className="p-2 cursor-pointer bg-red-600 text-white hover:bg-red-400 rounded-lg transition duration-150"
                      onClick={() => handleDeleteReminder(reminder._id)}
                      title="Delete Reminder"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
