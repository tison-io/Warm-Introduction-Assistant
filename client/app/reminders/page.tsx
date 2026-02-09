'use client';

import React, { useEffect, useState } from 'react';
import { Reminder } from '../types/reminder';
import {
  deleteReminder,
  fetchReminders,
  markReminderCompleted,
} from '../lib/reminder-api';
import { Trash, Loader2, Check, Bell, Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Toast';
import Link from 'next/link';

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

// --- Sub-components ---
const DueBadge = ({ date }: { date: Date }) => {
  const diff = differenceInDays(date);
  if (diff > 365) return null;

  let style = "bg-amber-500/10 text-amber-500 border-amber-500/20";
  let text = `Due in ${diff} days`;

  if (isToday(date)) {
    style = "bg-rose-500/10 text-rose-500 border-rose-500/20";
    text = "Due Today";
  } else if (diff < 0) {
    style = "bg-rose-600/20 text-rose-400 border-rose-600/30";
    text = "Overdue";
  } else if (diff >= 30) {
    const months = Math.floor(diff / 30);
    style = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    text = `Due in ${months} month${months > 1 ? 's' : ''}`;
  }

  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${style}`}>
      {text}
    </span>
  );
};

export default function RemindersPage({ workspaceId }: { workspaceId?: string }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadReminders();
  }, [workspaceId]);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await fetchReminders(workspaceId);
      // Sort: Overdue & Today first, then by date
      const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setReminders(sorted);
    } catch (err: any) {
      showToast('Failed to sync reminders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      setProcessingId(id);
      await markReminderCompleted(id);
      setReminders(prev => prev.filter(r => r._id !== id));
      showToast("Reminder completed", "success");
    } catch (err) {
      showToast("Failed to update", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setReminders(prev => prev.filter(r => r._id !== id));
      await deleteReminder(id);
      showToast("Reminder removed", "success");
    } catch (err) {
      showToast("Delete failed", "error");
      loadReminders();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 text-slate-200 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Follow-up Reminders</h1>
              <p className="text-slate-500 text-sm mt-1">
                {workspaceId ? `Managing team tasks for ${workspaceId}` : "Manage your upcoming investor follow-ups"}
              </p>
            </div>
            <div className="bg-[#0f172a]/40 border border-slate-800 px-4 py-2 rounded-xl">
               <span className="text-2xl font-bold text-white">{reminders.length}</span>
               <span className="text-xs text-slate-500 ml-2 uppercase font-semibold">Pending</span>
            </div>
          </div>
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-20 bg-[#0f172a]/20 border border-dashed border-slate-800 rounded-2xl">
            <Bell className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 italic">No reminders found. You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.date);
              const isProcessing = processingId === reminder._id;

              return (
                <div 
                key={reminder._id}
                className="bg-gray-800 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/30 transition-all group"
              >
                <Link 
                  href={`/intro-queue`}
                  className="space-y-2 flex-1 group/link"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-slate-400 text-sm">
                      Follow up on intro to <span className="text-slate-200 font-medium">{reminder.introId?.startupName || 'Project'}</span>
                    </p>
                    <DueBadge date={dueDate} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Calendar size={12} />
                    Due: {dueDate.toISOString().split('T')[0]}
                  </div>
                </Link>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleComplete(reminder._id);
                    }}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Mark Done
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(reminder._id);
                    }}
                    className="p-2 bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500/50 rounded-xl transition-all"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}