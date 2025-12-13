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

  let badgeStyle = 'bg-yellow-500';
  let badgeText = `Due in ${daysDifference} days`;

  if (isToday(date)) {
    badgeStyle = 'bg-red-500';
    badgeText = 'Due Today';
  } else if (daysDifference < 0) {
    badgeStyle = 'bg-red-500';
    badgeText = 'Overdue';
  } else if (daysDifference === 1) {
    badgeText = 'Due in 1 day';
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

      // Optimistically update the status for UI
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

      await markReminderCompleted(reminder.introId._id);
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
      className="min-h-screen bg-cover bg-center text-white p-8"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-2">Reminders</h1>
        <p className="text-xl mb-8">
          <span className="font-bold">{reminders.length}</span> total reminders
        </p>

        {loading ? (
          <div className="bg-white text-black p-6 rounded-xl shadow-2xl flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading reminders...</span>
          </div>
        ) : reminders.length === 0 ? (
          <div className="p-4 bg-gray-300 text-black rounded-lg shadow-xl">
            No reminders available.
          </div>
        ) : (
          <ul className="space-y-4">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.date);
              const investorName = reminder.introId?.investorName ?? 'Unknown';
              const startupName = reminder.introId?.startupName ?? 'Unknown';
              const isCompleted = reminder.introId.status === 'completed';

              return (
                <li
                  key={reminder._id}
                  className="bg-white text-black p-4 rounded-xl shadow-2xl flex justify-between items-center"
                >
                  {/* Content fades */}
                  <div className={`space-y-1 transition-opacity ${isCompleted ? 'opacity-70' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <p className="text-lg font-bold">
                        To Investor: {investorName}
                      </p>
                      <DueBadge date={dueDate} />
                      {isCompleted && (
                        <span className="text-xs font-semibold text-green-600">
                          Completed
                        </span>
                      )}
                    </div>
                    <p>Follow up on intro to {startupName}.</p>
                    <p className="text-sm">
                      Due: {dueDate.toISOString().split('T')[0]}
                    </p>
                  </div>

                  {/* Actions stay fully opaque */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkAsDone(reminder)}
                      disabled={isCompleted || processingId === reminder._id}
                      className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
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
