'use client';

import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import { fetchMembers, sendInvite } from "../../lib/workspace-api";
import { usePresence } from "../../hooks/usePresence";
import { WorkspaceMember } from "@/app/types/workspace";

export default function TeamPage({ params }: { params: { id: string } }) {
  const workspaceId = params.id;
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers(workspaceId).then(data => {
      setMembers(data);
      setLoading(false);
    });
  }, [workspaceId]);

  const currentUserId = "692f037474f8dfc7b6d2d011"; 
  usePresence(currentUserId, (update) => {
    setMembers(prev => prev.map(m => 
      m.memberId === update.userId 
        ? { ...m, isOnline: update.isOnline, lastActive: new Date().toISOString() } 
        : m
    ));
  });

  const handleInvite = async () => {
    await sendInvite(workspaceId, inviteEmail);
    setInviteEmail("");
    alert("Invite sent!");
  };

  if (loading) return <div className="p-10 text-white">Loading team...</div>;

  return (
    <div className="flex bg-[#050810] min-h-screen text-white">
      <main className="flex-1 ml-60 p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Invite Section */}
          <div className="card flex items-center justify-between p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <div>
              <h2 className="text-lg font-semibold">Invite Team</h2>
              <p className="text-sm text-slate-400">Add collaborators to this workspace</p>
            </div>
            <div className="flex gap-3">
              <input 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="invite-input" 
                placeholder="email@example.com" 
              />
              <button onClick={handleInvite} className="btn-accent">Send Invite</button>
            </div>
          </div>

          {/* Members Table */}
          <div className="card p-6 bg-slate-900/50 rounded-xl border border-white/5">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="pb-4">Member</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((m) => (
                  <tr key={m.memberId} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                            {initials(m.name)}
                          </div>
                          {/* THE ONLINE PULSE DOT */}
                          {m.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#050810] rounded-full animate-pulse" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-slate-500">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4"><RolePill role={m.role} /></td>
                    <td className="py-4">
                      <span className={m.isOnline ? "text-emerald-400 text-xs" : "text-slate-500 text-xs"}>
                        {m.isOnline ? "Online Now" : "Offline"}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-slate-400">
                      {m.isOnline ? "Active now" : formatDistanceToNow(new Date(m.lastActive), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helpers
function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

function RolePill({ role }: { role: string }) {
  const isOwner = role.toLowerCase() === 'owner';
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
      isOwner ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
    }`}>
      {role}
    </span>
  );
}