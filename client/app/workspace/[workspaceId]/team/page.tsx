'use client';

import React, { useState, useEffect, useCallback, use } from "react";
import { formatDistanceToNow } from 'date-fns';
import { UserPlus, MoreHorizontal, Mail, ShieldCheck } from "lucide-react";
import { fetchMembers, sendInvite } from "../../../lib/workspace-api";
import { usePresence } from "../../../hooks/usePresence";
import { WorkspaceMember } from "@/app/types/workspace";
import { useToast } from "../../../components/Toast";

const ROLE_STYLES: Record<string, string> = {
  owner: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  member: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  default: "bg-slate-500/10 text-slate-500 border-slate-800",
};

export default function TeamPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const { showToast } = useToast();

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 1. Load User ID from Local Storage (Avoid Hardcoding)
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUserId(parsed.id || parsed._id);
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!workspaceId) return;
    const getInitialData = async () => {
      try {
        setLoading(true);
        const data = await fetchMembers(workspaceId);
        setMembers(data);
      } catch (err) {
        showToast("Failed to load team members", "error");
      } finally {
        setLoading(false);
      }
    };
    getInitialData();
  }, [workspaceId]);

  // WebSocket update handler
  const handleStatusUpdate = useCallback((update: any) => {
    setMembers((prev) => prev.map(m => 
      m.memberId === update.userId 
        ? { ...m, isOnline: update.isOnline, lastActive: update.lastSeen || new Date().toISOString() } 
        : m
    ));
  }, []);

  usePresence(currentUserId || undefined, handleStatusUpdate);

  // 2. Local EAT Formatting Helper
  const formatToEAT = (dateString: string) => {
    const date = new Date(dateString);
    // This converts the UTC string to the user's local browser time
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await sendInvite(workspaceId, inviteEmail);
      setInviteEmail("");
      showToast("Invitation sent successfully", "success");
    } catch (err) {
      showToast("Error sending invitation", "error");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] flex items-center justify-center text-slate-500">Loading workspace...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Invite Section */}
        <div className="bg-[#0f172a]/40 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <UserPlus size={20} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Invite Team Members</h2>
              <p className="text-sm text-slate-500">Send an invitation to add new members to your workspace</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-[#020617]/60 border border-slate-800 pl-12 pr-4 py-3 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-600 text-white"
                placeholder="abc@gmail.com" 
              />
            </div>
            <button 
              onClick={handleInvite} 
              className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              Send Invite
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="space-y-4">
          <div className="flex items-end justify-between px-2">
            <div>
              <h3 className="text-2xl font-bold text-white">Team Members</h3>
              <p className="text-sm text-slate-500">{members.length} members in this workspace</p>
            </div>
          </div>

          <div className="bg-[#0f172a]/20 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-5 text-left">Member</th>
                  <th className="px-6 py-5 text-left">Role</th>
                  <th className="px-6 py-5 text-left">Status</th>
                  <th className="px-6 py-5 text-left">Last Active</th>
                  <th className="px-6 py-5 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {members.map((m) => (
                  <tr key={m.memberId} className="group hover:bg-white/2 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Member</span>
                        <span className="text-xs text-slate-500">{m.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                          ROLE_STYLES[m.role?.toLowerCase()] || ROLE_STYLES.default
                        }`}>
                          {m.role || 'Member'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${m.isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-600'}`} />
                        <span className={`text-xs font-medium ${m.isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {m.isOnline ? 'Active' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-400 tabular-nums">
                        {m.isOnline ? 'Active now' : formatToEAT(m.lastActive)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="text-slate-600 hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}