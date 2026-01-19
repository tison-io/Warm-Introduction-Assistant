'use client';

import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";

const members = [
  { id: 1, name: "Member", email: "liya@gmail.com", role: "Owner", status: "Active", last: "2 mins ago" },
  { id: 2, name: "Member", email: "liya@gmail.com", role: "Admin", status: "Active", last: "2 mins ago" },
  { id: 3, name: "Member", email: "liya@gmail.com", role: "Member", status: "Active", last: "2 mins ago" },
  { id: 4, name: "Member", email: "liya@gmail.com", role: "Member", status: "Active", last: "2 mins ago" },
  { id: 5, name: "Member", email: "liya@gmail.com", role: "Member", status: "Pending", last: "2 mins ago" },
];

export default function TeamPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <>
      <Head>
        <title>Team</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobile={isMobile} />
        
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-[70px]' : 'ml-[240px]'}`}>
          <div className="min-h-screen page-bg">
            {/* Top bar */}
            <div
              className="w-full"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.02)",
              }}
            >
              <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded flex items-center justify-center bg-[#07162b]">
                    <Image 
                      src="/teams.png" 
                      alt="Teams" 
                      width={20} 
                      height={20} 
                      className="w-5 h-5"
                    />
                  </div>

                  <div>
                    <div className="text-lg font-semibold">Team</div>
                    <div className="text-xs text-slate-400">Manage your workspace members</div>
                  </div>
                </div>

                <div>
                  <SearchInput />
                </div>
              </div>
            </div>

            {/* Main content */}
            <main className="max-w-6xl mx-auto px-8 py-10">
              <div className="space-y-8">
                {/* Invite panel */}
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">Invite Team Members</div>
                      <div className="text-sm text-slate-400">
                        Send an invitation to add new members to your workspace
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <input className="invite-input" placeholder="abc@gmail.com" aria-label="invite email" />
                      <button className="btn-accent" aria-label="Send invite">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline-block">
                          <path d="M16 12h-8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Send Invite</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team table panel */}
                <div className="card">
                  <div className="mb-6">
                    <div className="text-xl font-semibold">Team Members</div>
                    <div className="text-sm text-slate-400">5 members in this workspace</div>
                  </div>

                    <div className="w-full overflow-hidden rounded">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-slate-400 text-xs">
                            <th className="pb-3">Member</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Last Active</th>
                            <th className="pb-3"></th>
                          </tr>
                        </thead>

                        <tbody>
                          {members.map((m) => (
                            <tr key={m.id} className="row-divider">
                              <td className="py-4 align-top">
                                <div className="flex items-center gap-3">
                                  <div className="avatar">{initials(m.name)}</div>
                                  <div>
                                    <div className="font-medium text-slate-100">Member</div>
                                    <div className="text-xs text-slate-400">{m.email}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 align-top">
                                <RolePill role={m.role} />
                              </td>

                              <td className="py-4 align-top">
                                <StatusPill status={m.status} />
                              </td>

                              <td className="py-4 align-top text-xs text-slate-400">{m.last}</td>

                              <td className="py-4 align-top text-slate-400">⋯</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </main>
          </div>
        </div>
      </div>

      {/* Scoped styles */}
      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .page-bg {
          background: linear-gradient(
              90deg,
              #0A1520 0%,
              rgba(0, 0, 0, 0.4) 25%,
              rgba(1, 2, 8, 0.98) 96.04%,
              #0F2A5C 100%
            ),
            #050810;
          min-height: 100vh;
          color: rgba(255, 255, 255, 0.92);
        }

        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius: 12px;
          padding: 22px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .invite-input {
          width: 420px;
          height: 44px;
          padding: 10px 14px;
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.003)),
            rgba(6, 17, 26, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.92);
          outline: none;
        }

        .btn-accent {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          background: linear-gradient(90deg, #7C59FF, #6F4CFF);
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 18px rgba(111, 76, 255, 0.16);
          border: none;
          cursor: pointer;
        }

        .avatar {
          min-width: 40px;
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(26, 41, 74, 1), rgba(13, 22, 33, 1));
          border-radius: 9999px;
          color: white;
          font-weight: 700;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
        }

        .row-divider {
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .row-divider:last-child {
          border-bottom: none;
        }
      `}</style>
    </>
  );
}

// Components
function SearchInput() {
  return (
    <div className="relative">
      <input
        aria-label="Search"
        className="w-[320px] h-11 pl-4 pr-12 rounded-full text-sm placeholder:text-slate-400"
        placeholder="Search members..."
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.004)), rgba(6,17,26,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.9)",
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-4.35-4.35" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="11" cy="11" r="6" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

function RolePill({ role }: { role: string }) {
  const colors = {
    Owner: { bg: "rgba(239, 68, 68, 0.12)", text: "#F87171" },
    Admin: { bg: "rgba(124, 89, 255, 0.12)", text: "#C7B8FF" },
    Member: { bg: "rgba(96, 165, 250, 0.12)", text: "#93C5FD" },
  };
  const color = colors[role as keyof typeof colors] || colors.Member;
  
  return (
    <span
      className="text-xs px-2 py-1 rounded-full font-medium"
      style={{ background: color.bg, color: color.text }}
    >
      {role}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors = {
    Active: { bg: "rgba(16, 185, 129, 0.12)", text: "#34D399" },
    Pending: { bg: "rgba(251, 191, 36, 0.12)", text: "#FBBF24" },
  };
  const color = colors[status as keyof typeof colors] || colors.Pending;
  
  return (
    <span
      className="text-xs px-2 py-1 rounded-full font-medium"
      style={{ background: color.bg, color: color.text }}
    >
      {status}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}