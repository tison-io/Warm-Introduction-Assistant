'use client';

import React, { useState, useEffect, useCallback, use } from "react";
import { formatDistanceToNow } from 'date-fns';
import { fetchMembers, sendInvite } from "../../../lib/workspace-api";
import { usePresence } from "../../../hooks/usePresence";
import { WorkspaceMember } from "@/app/types/workspace";

// 1. In Next.js 15, params is a Promise. We use 'use' or 'await' to resolve it.
export default function TeamPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  // Use 'use' to unwrap the promise in a client component
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Use a hardcoded ID for testing, but ideally this comes from your Auth context
  const currentUserId = "692f037474f8dfc7b6d2d011"; 

  useEffect(() => {
    if (!workspaceId) return;

    const getInitialData = async () => {
      try {
        setLoading(true);
        const data = await fetchMembers(workspaceId);
        setMembers(data);
      } catch (err) {
        console.error("Fetch error:", err);
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

  usePresence(currentUserId, handleStatusUpdate);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await sendInvite(workspaceId, inviteEmail);
      setInviteEmail("");
      alert("Invitation sent!");
    } catch (err) {
      alert("Error sending invitation.");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-white p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Workspace Team</h1>
          <p className="text-slate-400">ID: {workspaceId}</p>
        </div>

        {/* Invite UI */}
        <div className="flex gap-3 bg-slate-900/40 p-6 rounded-xl border border-white/5">
          <input 
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 p-3 rounded-lg outline-none"
            placeholder="Enter email address" 
          />
          <button onClick={handleInvite} className="bg-indigo-600 px-6 rounded-lg font-bold">
            Invite
          </button>
        </div>

        {/* Members List */}
        <div className="bg-slate-900/20 rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs text-slate-500 uppercase">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.memberId} className="border-t border-white/5">
                  <td className="p-4">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${m.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                      <span className={m.isOnline ? 'text-emerald-400' : 'text-slate-500'}>
                        {m.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {m.isOnline ? 'Active now' : formatDistanceToNow(new Date(m.lastActive), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}