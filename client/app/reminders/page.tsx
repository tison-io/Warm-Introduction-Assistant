"use client";
import React, { useState } from "react";

type Reminder = {
  id: number;
  name: string;
  detail: string;
  due: string;
  dueLabel: string;
  dueType: "today" | "future";
};

const remindersInit: Reminder[] = [
  {
    id: 1,
    name: "Abebe Beso",
    detail: "Follow up on intro to MyStartup",
    due: "2025-01-20",
    dueLabel: "Due in 5 days",
    dueType: "future"
  },
  {
    id: 2,
    name: "Abebe Beso",
    detail: "Follow up on intro to MyStartup",
    due: "2025-01-20",
    dueLabel: "Due in 5 days",
    dueType: "future"
  },
  {
    id: 3,
    name: "Abebe Beso",
    detail: "Follow up on intro to MyStartup",
    due: "2025-01-20",
    dueLabel: "Due Today",
    dueType: "today"
  },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState(remindersInit);

  const handleMarkDone = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleDelete = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="reminders-bg">
      <div className="reminders-content">
        <h1 className="reminders-title">Reminders</h1>
        <div className="reminders-sub">{reminders.length} follow-ups due</div>
        <div className="reminders-list">
          {reminders.map(r => (
            <div className="reminder-card" key={r.id}>
              <div className="reminder-card-head">
                <div>
                  <div className="reminder-card-name">{r.name}</div>
                  <div className="reminder-card-detail">{r.detail}</div>
                  <div className="reminder-card-due-row">
                    <span className={`reminder-due-badge ${r.dueType}`}>
                      {r.dueLabel}
                    </span>
                    <span className="reminder-due-date">
                      Due: {r.due}
                    </span>
                  </div>
                </div>
                <div className="reminder-card-actions">
                  <button className="reminder-mark-btn" onClick={() => handleMarkDone(r.id)}>
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.2"/>
                      <path d="M14 8.7l-4.3 4L7 10.6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Mark Done
                  </button>
                  <button className="reminder-delete-btn" aria-label="Delete" onClick={() => handleDelete(r.id)}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                      <path d="M7.5 7.5l5 5m0-5l-5 5M5 6.5h10M8 5.5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z" stroke="#e23c3c" strokeWidth="1.15" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .reminders-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }
        .reminders-content {
          padding: 32px 38px 35px 38px;
          width: 100%;
        }
        .reminders-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0px;
        }
        .reminders-sub {
          font-size: 17px;
          color: #e9eafd;
          margin-bottom: 21px;
          margin-top: 2px;
        }
        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .reminder-card {
          background: #fff;
          border-radius: 13px;
          box-shadow: 0 3px 18px #595fcc22;
          padding: 24px 27px 16px 27px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .reminder-card-head {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .reminder-card-name {
          font-size: 1.09rem;
          font-weight: 700;
          color: #232b46;
          margin-bottom: 2px;
        }
        .reminder-card-detail {
          font-size: 15px;
          color: #495072;
          margin-bottom: 5px;
        }
        .reminder-card-due-row {
          display: flex;
          align-items: center;
          gap: 13px;
        }
        .reminder-due-badge {
          font-size: 13px;
          background: #ffe3c5;
          color: #b77631;
          border-radius: 7px;
          padding: 4px 13px 4px 13px;
          font-weight: 700;
        }
        .reminder-due-badge.today {
          background: #fadada;
          color: #e23c3c;
        }
        .reminder-due-date {
          font-size: 13px;
          margin-left: 6px;
          color: #888;
        }
        .reminder-card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .reminder-mark-btn {
          background: #393fa7;
          color: #fff;
          font-size: 15.5px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          padding: 7px 18px 7px 10px;
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 7px;
          transition: background 0.15s;
        }
        .reminder-mark-btn:hover,
        .reminder-mark-btn:focus {
          background: #251e93;
        }
        .reminder-delete-btn {
          background: none;
          border: none;
          padding: 4px 3px;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.13s;
        }
        .reminder-delete-btn:hover,
        .reminder-delete-btn:focus {
          opacity: 1;
        }
        @media (max-width: 1050px) {
          .reminders-content {
            padding: 16px 4vw 18px 4vw;
          }
        }
        @media (max-width: 700px) {
          .reminders-content {
            padding: 6px 1vw 6px 1vw;
          }
          .reminder-card {
            padding: 14px 6px 10px 12px;
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
