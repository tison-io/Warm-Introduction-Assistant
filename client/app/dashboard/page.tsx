"use client";
import React from "react";

const cards = [
  {
    label: "Total Intros",
    count: 12,
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <rect x="3" y="5" width="16" height="10" rx="4" fill="#646cff" />
        <path d="M7 8v6M11 8v6M15 8v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    border: "2px solid #dbe1ff",
  },
  {
    label: "Pending Follow-ups",
    count: 12,
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <rect x="2" y="6" width="18" height="10" rx="4" fill="#ffd38b" />
        <path d="M11 10v2m0 4v0" stroke="#ad7417" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    border: "2px solid #fdeacc",
  },
  {
    label: "Investors",
    count: 12,
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <rect x="4" y="5" width="14" height="10" rx="4" fill="#bbf7d0" />
        <circle cx="11" cy="11" r="2.7" fill="#34c759"/>
        <path d="M11 8v2M11 12v2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    border: "2px solid #dbfbe3",
  },
  {
    label: "Completed",
    count: 12,
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
        <rect x="4" y="6" width="14" height="10" rx="4" fill="#f5ebff" />
        <path d="M8 11l3 3 4-7" stroke="#8938dc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    border: "2px solid #f1ddfe",
  },
];

const quickActions = [
  {
    label: "Add Investors",
    icon: (
      <svg width="19" height="19" fill="none" viewBox="0 0 20 20" style={{marginRight:12}}>
        <circle cx="10" cy="10" r="9" stroke="#434668" strokeWidth="1.2" />
        <path d="M10 7v6M7 10h6" stroke="#434668" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    arrow: (
      <svg width="23" height="23" fill="none" viewBox="0 0 23 23">
        <path d="M9.7 7l5 5-5 5" stroke="#53587a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    href: "/investors",
  },
  {
    label: "Generate Intros",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:12}}>
        <path d="M6 12l8-4M6 12l4 4M6 12V8" stroke="#434668" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    arrow: (
      <svg width="23" height="23" fill="none" viewBox="0 0 23 23">
        <path d="M9.7 7l5 5-5 5" stroke="#53587a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    href: "/generate-intro",
  },
]

const latestDrafts = [
  { name: "Abebe Beso", time: "2 hours ago", status: "Drafted" },
  { name: "Kebede Chala", time: "1 day ago", status: "Sent" },
];

const badgeColor: Record<string, any> = {
  "Drafted": {bg:"#ececec", color:"#787a85"},
  "Sent": {bg:"#e7f3ff", color:"#2177de"}
};

export default function DashboardPage() {
  return (
    <div className="dash-bg">
      <div className="dash-content">
        <h1 className="dash-title">Welcome back!</h1>
        <div className="dash-sub">Track your investor outreach and manage introductions</div>

        <div className="dash-cards-row">
          {cards.map((c, i) => (
            <div className="dash-card" style={{border: c.border}} key={c.label}>
              <div className="dash-card-label">{c.label}</div>
              <div className="dash-card-val-row">
                <span className="dash-card-value">{c.count}</span>
                <span className="dash-card-ico">{c.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-section-label">Quick Actions</div>
        <div className="dash-quick-row">
          {quickActions.map((qa, i) => (
            <a href={qa.href} className="dash-quick-btn" key={qa.label}>
              <span className="dash-quick-btn-main">
                {qa.icon}
                {qa.label}
              </span>
              <span>
                {qa.arrow}
              </span>
            </a>
          ))}
        </div>

        <div className="dash-section-label" style={{marginTop:32}}>Latest Drafts</div>
        <div className="dash-draft-list">
          {latestDrafts.map((d,i) => (
            <div className="dash-draft-item" key={i}>
              <div className="dash-draft-name">{d.name}</div>
              <div className="dash-draft-time">{d.time}</div>
              <span className="dash-draft-badge" style={{background: badgeColor[d.status].bg, color: badgeColor[d.status].color}}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .dash-bg {min-height:100vh;background:url("/backeground.jpg");background-size:cover;background-position:center;display:flex;align-items:flex-start;width:100%;}
        .dash-content {padding:36px 38px 35px 38px;width:100%;margin-left:0;margin-top:0;}
        .dash-title {font-size:2.2rem;font-weight:700;color:#fff;margin-bottom:0;}
        .dash-sub {font-size:18px;color:#e9eafd;margin-bottom:27px;margin-top:3px;}
        .dash-cards-row {display:flex;gap:19px;margin-bottom:30px;}
        .dash-card {flex:1;background:#f8fafc;border-radius:12px;padding:17px 17px 14px 19px;min-width:140px;box-shadow:0 3px 18px #595fcc1a;display:flex;flex-direction:column;align-items:flex-start;border:2px solid #e9eafd;}
        .dash-card-label {font-size:14.2px;font-weight:500;color:#6b7295;margin-bottom:7px;letter-spacing:0.02em;}
        .dash-card-val-row {display:flex;align-items:center;gap:10px;}
        .dash-card-value {font-size:22px;font-weight:600;color:#1d2442;}
        .dash-card-ico {font-size:22px;}
        .dash-section-label {margin-top:20px;margin-bottom:10px;font-size:16.5px;font-weight:600;color:#233;}
        .dash-quick-row {width:100%;display:flex;gap:15px;margin-bottom:21px;}
        .dash-quick-btn {flex:1;background:#fff;border-radius:9px;padding:13px 20px;display:flex;align-items:center;justify-content:space-between;color:#232b46;font-size:17px;font-weight:500;text-decoration:none;border:1.6px solid #ececf4;box-shadow:0 3px 14px #23265909;transition:background 0.14s;}
        .dash-quick-btn:hover {background:#f5f7fd;}
        .dash-quick-btn-main {display:flex;align-items:center;gap:10px;font-weight:500;font-size:17px;}
        .dash-draft-list {display:flex;flex-direction:column;gap:20px;margin-top:8px;}
        .dash-draft-item {background:#fff;border-radius:14px;box-shadow:0 2px 20px #2326590a;padding:22px 25px 15px 25px;display:flex;flex-direction:column;align-items:flex-start;}
        .dash-draft-name {font-weight:700;font-size:17px;margin-bottom:3px;color:#232b46;}
        .dash-draft-time {font-size:15px;color:#969696;margin-bottom:7px;}
        .dash-draft-badge {font-size:13px;border-radius:7px;padding:4px 18px 3px 18px;font-weight:600;margin-top:0px;}
        @media (max-width:1050px) {.dash-content {padding:26px 7vw 25px 7vw;}}
        @media (max-width:900px) {.dash-content {padding:15px 2vw 10px 2vw;}.dash-cards-row {flex-direction:column;gap:14px;}}
        @media (max-width:600px) {.dash-card,.dash-quick-btn {padding:14px;}}
      `}</style>
    </div>
  );
}
