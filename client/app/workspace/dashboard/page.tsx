'use client';

import React, { useState } from "react";
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Image from "next/image";
import Sidebar from "../../components/Sidebar";

/* ---------------- Sample Data ---------------- */
type Stat = {
  title: string;
  value: string;
  hint?: string;
  accent?: string;
};

const stats: Stat[] = [
  { title: "Total Investors", value: "8", hint: "+2% this month", accent: "#7C5CFF" },
  { title: "Intro Success Rate", value: "58%", hint: "+6% vs last month", accent: "#2EE6A6" },
  { title: "Active Pipeline", value: "6", hint: "Across all stages", accent: "#FFB86B" },
  { title: "Pending Tasks", value: "3", hint: "2 overdue", accent: "#63B3ED" },
];

const chartData = [
  { week: "Week 1", investors: 5, meetings: 2 },
  { week: "Week 2", investors: 10, meetings: 6 },
  { week: "Week 3", investors: 18, meetings: 10 },
  { week: "Week 4", investors: 28, meetings: 14 },
  { week: "Week 5", investors: 42, meetings: 18 },
];

const introOutcomes = { percent: 62, accepted: 28, pending: 12, declined: 5, total: 45 };

const pipeline = [
  { name: "Identified", value: 1, color: "#8B5CF6" },
  { name: "Contacted", value: 2, color: "#60A5FA" },
  { name: "Meeting", value: 2, color: "#F59E0B" },
  { name: "Due Diligence", value: 1, color: "#EC4899" },
  { name: "Committed", value: 1, color: "#10B981" },
  { name: "Passed", value: 1, color: "#EF4444" },
];

/* ---------------- Page ---------------- */
const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
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
                    src="/workspace.png" 
                    alt="Workspace" 
                    width={20} 
                    height={20} 
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <div className="text-lg font-semibold">Workspace Dashboard</div>
                  <div className="text-xs text-slate-400">Team performance and functioning metrics</div>
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
              <section className="stats-grid">
                {stats.map((s) => (
                  <div className="stat-card" key={s.title}>
                    <div className="stat-left">
                      <div className="stat-title">{s.title}</div>
                      <div className="stat-value">{s.value}</div>
                      {s.hint && <div className="stat-hint">{s.hint}</div>}
                    </div>
                    <div
                      className="stat-accent"
                      style={{ background: `linear-gradient(135deg, ${s.accent}55, ${s.accent})` }}
                    />
                  </div>
                ))}
              </section>

              <section className="main-grid">
                <div className="card large">
                  <h2 className="card-title">Fundraising Velocity</h2>
                  <p className="muted">Investors reached and meeting cover time</p>
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={220}>
                      <RechartsAreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorInvestors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0.15}/>
                          </linearGradient>
                          <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00D4B6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#00D4B6" stopOpacity={0.12}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9aa8b6' }} />
                        <YAxis hide />
                        <Area type="monotone" dataKey="meetings" stackId="1" stroke="#00D4B6" strokeOpacity={0.22} fill="url(#colorMeetings)" />
                        <Area type="monotone" dataKey="investors" stackId="1" stroke="#7C5CFF" strokeOpacity={0.22} fill="url(#colorInvestors)" />
                      </RechartsAreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card small">
                  <h2 className="card-title">Intro Outcomes</h2>
                  <div className="intro-content">
                    <div className="big-percent">
                      <div className="percent-value">{introOutcomes.percent}%</div>
                      <div className="percent-label">Success rate</div>
                    </div>
                    <div className="progress-list">
                      <ProgressRow label="Accepted" value={introOutcomes.accepted} color="#60A5FA" />
                      <ProgressRow label="Pending" value={introOutcomes.pending} color="#10B981" />
                      <ProgressRow label="Declined" value={introOutcomes.declined} color="#EF4444" />
                      <div className="muted small">Total introductions: {introOutcomes.total}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="pipeline-grid">
                <div className="card">
                  <h2 className="card-title">Pipeline Overview</h2>
                  <p className="muted">Investors by stage</p>
                  <div className="pipeline-list">
                    {pipeline.map((p) => (
                      <HorizontalBar key={p.name} label={p.name} value={p.value} color={p.color} />
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h2 className="card-title">Stage Distribution</h2>
                  <div className="flex justify-center items-center mt-2">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={pipeline}
                          cx={80}
                          cy={80}
                          innerRadius={40}
                          outerRadius={68}
                          dataKey="value"
                          stroke="none"
                        >
                          {pipeline.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="legend">
                    {pipeline.map((p) => (
                      <div key={p.name} className="legend-item">
                        <span className="legend-dot" style={{ background: p.color }} />
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="card">
                <h2 className="card-title">Team Reminders</h2>
                <p className="muted">Upcoming follow-ups and tasks</p>
                <div className="reminders">
                  <Reminder title="Follow up with Sequoia Capital" due="Due in 2d" person="David B." />
                  <Reminder title="Follow up with Sequoia Capital" due="Due in 3d" person="David B." />
                  <Reminder title="Follow up with Sequoia Capital" due="Due in 5d" person="David B." />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
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
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .stat-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .stat-title { color: #9aa8b6; font-size: 13px; }
        .stat-value { font-size: 26px; font-weight: 700; }
        .stat-hint { color: #9aa8b6; font-size: 12px; }
        .stat-accent { width: 54px; height: 54px; border-radius: 10px; margin-left: 12px; }

        .main-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 16px; }

        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.03);
        }
        .card.large { min-height: 320px; }
        .card.small { min-height: 320px; display:flex; flex-direction:column; justify-content:space-between; }

        .card-title { margin: 0 0 6px 0; font-size: 15px; }
        .muted { color: #9aa8b6; font-size: 13px; margin-bottom: 10px; }
        .muted.small { font-size: 12px; margin-top: 6px; }

        .chart-wrap {
          margin-top: 8px;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));
          border-radius: 8px;
          padding: 14px;
        }

        .intro-content { display:flex; gap:12px; align-items:center; height:100%; }
        .big-percent { flex: 0 0 120px; text-align:center; }
        .percent-value { font-size: 36px; font-weight: 700; color: #60A5FA; }
        .percent-label { color: #9aa8b6; font-size: 12px; }
        .progress-list { flex:1; }

        .pipeline-grid { display: grid; grid-template-columns: 1fr 420px; gap: 16px; }
        .pipeline-list { margin-top: 12px; display:flex; flex-direction:column; gap:8px; }
        .reminders { display:flex; gap:12px; margin-top: 12px; }

        .hb { display:flex; align-items:center; gap:12px; }
        .hb .label { width:120px; color:#9aa8b6; font-size:13px; }
        .hb .bar { background: rgba(255,255,255,0.03); border-radius:8px; height:14px; flex:1; overflow:hidden; }
        .hb .fill { height:100%; border-radius:8px; }
        .hb .count { width:28px; text-align:right; color:#9aa8b6; font-size:13px; }

        .legend { margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; }
        .legend-item { display:flex; gap:8px; align-items:center; color:#9aa8b6; font-size:13px; }
        .legend-dot { width:12px; height:12px; border-radius:50%; display:inline-block; }

        .reminder { background: rgba(255,255,255,0.02); padding: 10px; border-radius: 10px; flex:1; border:1px solid rgba(255,255,255,0.02); }
        .reminder .title { font-weight:600; font-size:13px; }
        .reminder .meta { color:#9aa8b6; font-size:12px; margin-top:6px; }

        @media (max-width: 980px) {
          .main-grid { grid-template-columns: 1fr; }
          .pipeline-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

// Components
function SearchInput() {
  return (
    <div className="relative">
      <input
        aria-label="Search"
        className="w-[320px] h-11 pl-4 pr-12 rounded-full text-sm placeholder:text-slate-400"
        placeholder="Search investors, intros..."
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

const ProgressRow: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const total = introOutcomes.total || 1;
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9aa8b6" }}>
        <div>{label}</div>
        <div>{value}</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", height: 10, borderRadius: 6, marginTop: 6 }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 6 }} />
      </div>
    </div>
  );
};

const HorizontalBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const max = 3;
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="hb">
      <div className="label">{label}</div>
      <div className="bar" aria-hidden>
        <div className="fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="count">{value}</div>
    </div>
  );
};

const Reminder: React.FC<{ title: string; due: string; person: string }> = ({ title, due, person }) => {
  return (
    <div className="reminder">
      <div className="title">{title}</div>
      <div className="meta">
        {due} • {person}
      </div>
    </div>
  );
};