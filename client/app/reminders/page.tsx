'use client';

import { useEffect, useState } from 'react';
import { Reminder } from '../types/reminder';
import {
  deleteReminder,
  fetchReminders,
  markReminderCompleted,
} from '../lib/reminder-api';
import { Trash, Loader2, Check } from 'lucide-react';
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
  const dueDate = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface DueBadgeProps {
  date: Date;
}

const DueBadge: React.FC<DueBadgeProps> = ({ date }) => {
  const daysDifference = differenceInDays(date);

  let badgeStyle = 'bg-amber-500';
  let badgeText = `Due in ${daysDifference} days`;

  if (isToday(date)) {
    badgeStyle = 'bg-red-600';
    badgeText = 'Due Today';
  } else if (daysDifference < 0) {
    badgeStyle = 'bg-red-700';
    badgeText = 'Overdue';
  } else if (daysDifference === 1) {
    badgeText = 'Due in 1 day';
  }

  if (daysDifference > 365) return null;

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${badgeStyle}`}>
      {badgeText}
    </span>
  );
};

export default function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
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
      showToast(err.message || 'Failed to load reminders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      setReminders((prev) => prev.filter((r) => r._id !== reminderId));
      await deleteReminder(reminderId);
      showToast('Reminder deleted successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete reminder', 'error');
    }
  };

  const handleMarkAsDone = async (reminder: Reminder) => {
    if (reminder.introId.status === 'completed') return;

    try {
      setProcessingId(reminder._id);

      setReminders((prev) =>
        prev.map((r) =>
          r._id === reminder._id
            ? {
                ...r,
                introId: {
                  ...r.introId,
                  status: 'completed',
                },
              }
            : r
        )
      );

      await markReminderCompleted(reminder._id);
      showToast('Reminder marked as completed', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to mark reminder as done', 'error');
      loadReminders();
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white px-8 py-10"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-1">Reminders</h1>
        <p className="text-lg text-slate-200 mb-8">
          <span className="font-bold">{reminders.length}</span> total reminders
        </p>

        {loading ? (
          <div className="bg-white/95 text-black p-6 rounded-xl shadow-xl flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading reminders...</span>
          </div>
        ) : reminders.length === 0 ? (
          <div className="p-6 bg-slate-200 text-black rounded-xl shadow">
            No reminders available.
          </div>
        ) : (
          <ul className="space-y-4">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.date);
              const investorName = reminder.introId?.investorName ?? 'Unknown';
              const startupName = reminder.introId?.startupName ?? 'Unknown';
              const isCompleted = reminder.introId?.status === 'completed';

              return (
                <li
                  key={reminder._id}
                  className="bg-white/95 text-black p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex justify-between items-center"
                >
                  <div
                    className={`space-y-1 transition-opacity ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <p className="text-lg font-semibold">
                        To Investor: {investorName}
                      </p>
                      <DueBadge date={dueDate} />
                      {isCompleted && (
                        <span className="text-xs font-semibold text-emerald-600">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700">
                      Follow up on intro to {startupName}.
                    </p>
                    <p className="text-sm text-slate-500">
                      Due: {dueDate.toISOString().split('T')[0]}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkAsDone(reminder)}
                      disabled={isCompleted || processingId === reminder._id}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                      title="Mark as done"
                    >
                      {processingId === reminder._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span className="flex items-center space-x-1">
                          <Check size={18} />
                          <span>Completed</span>
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteReminder(reminder._id)}
                      className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition"
                      title="Delete reminder"
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
