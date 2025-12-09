'use client';

import { useEffect, useState } from 'react';
import { Reminder } from '../types/reminder';
import { fetchReminders, markReminderCompleted } from '../lib/reminder-api';
import { X, CheckCircle } from 'lucide-react'; // Icons for Mark Done and Delete

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
    // Style for 'Due Today'
    badgeStyle = "bg-red-500";
    badgeText = "Due Today";
  } else if (daysDifference < 0) {
    // Overdue items
    badgeStyle = "bg-red-700";
    badgeText = "Overdue";
  } else if (daysDifference === 1) {
    // Singular day
    badgeText = "Due in 1 day";
  }

  // Hide badge if the difference is far in the future (optional) or if overdue is being ignored
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

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await fetchReminders();
      // Sort reminders to put 'Due Today' items first, then by date (ascending)
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
      alert(err.message || 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (introId: string) => {
    try {
      await markReminderCompleted(introId);
      setReminders(reminders.filter(r => r.introId._id !== introId));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to mark reminder as completed');
    }
  };
  
  const handleDeleteReminder = (reminderId: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      setReminders(reminders.filter(r => r._id !== reminderId));
      console.log(`Reminder ${reminderId} deleted (frontend only)`);
    }
  };


  if (loading) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center" 
        style={{ backgroundImage: "url('/background-img.jpg')" }}
      >
        <div className="p-8 text-white">Loading reminders...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-white p-8"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-2">Reminders</h1>
        <p className="text-xl mb-8">{reminders.length} follow-ups due</p>

        {reminders.length === 0 ? (
          <div className="p-4 bg-gray-300 text-black backdrop-blur-sm rounded-lg shadow-xl">No reminders pending.</div>
        ) : (
          <ul className="space-y-4">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.date);
              const personName = reminder.introId.investorName; 
              const followUpText = `Follow up on intro to ${reminder.introId.startupName}`;
              const formattedDate = dueDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).split('/').reverse().join('-'); // Converts MM/DD/YYYY to YYYY-MM-DD

              return (
                <li
                  key={reminder._id}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-2xl flex justify-between items-center transition duration-300 hover:bg-white/20"
                >
                  {/* Left side: Name, Badge, Follow-up, Due Date */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-3">
                      <p className="text-lg font-bold">
                        To Investor: {personName}
                      </p>
                      <DueBadge date={dueDate} />
                    </div>
                    <p className="text-gray-200">
                      {followUpText}
                    </p>
                    <p className="text-sm text-gray-400">
                      Due: {formattedDate}
                    </p>
                  </div>

                  {/* Right side: Action Buttons */}
                  <div className="flex space-x-2 items-center">
                    <button
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition duration-150"
                      onClick={() => handleMarkCompleted(reminder.introId._id)}
                      title="Mark Done"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> 
                      Mark Done
                    </button>
                    {/* Delete Icon (matches design's trashcan icon position) */}
                    <button
                      className="p-2 text-red-400 hover:text-red-500 transition duration-150"
                      onClick={() => handleDeleteReminder(reminder._id)}
                      title="Delete Reminder"
                    >
                      <X size={18} /> 
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