"use client";
import React, { useState } from "react";

type Status = "Drafted" | "Sent";

type QueueItem = {
  id: number;
  startup: string;
  investor: string;
  date: string;
  status: Status;
  draft?: string;
  note?: string;
};

const queueInit: QueueItem[] = [
  {
    id: 1,
    startup: "MyStartup",
    investor: "Abebe Beso",
    date: "2025-10-12",
    status: "Drafted",
    draft: "",
    note: ""
  },
  {
    id: 2,
    startup: "MyStartup",
    investor: "Abebe Beso",
    date: "2025-10-12",
    status: "Sent",
    draft: "",
    note: ""
  }
];

const statusBadge = (s: Status) => {
  const style = {
    Drafted: { bg: "#dbf2ff", color: "#34a1d6" },
    Sent: { bg: "#d6fae3", color: "#40c467" }
  }[s];
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        fontWeight: 500,
        fontSize: 14,
        borderRadius: 8,
        padding: "2px 18px",
        marginLeft: 8,
        display: "inline-block"
      }}
    >
      {s}
    </span>
  );
};

export default function IntroQueuePage() {
  const [expanded, setExpanded] = useState<number | null>(queueInit[0].id);
  const [queue, setQueue] = useState(queueInit);

  const handleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleDraftChange = (id: number, value: string) => {
    setQueue(prev =>
      prev.map(item =>
        item.id === id ? { ...item, draft: value } : item
      )
    );
  };

  const handleStatusChange = (id: number, value: Status) => {
    setQueue(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: value } : item
      )
    );
  };

  const handleNoteChange = (id: number, value: string) => {
    setQueue(prev =>
      prev.map(item =>
        item.id === id ? { ...item, note: value } : item
      )
    );
  };

  const handleAddNew = () => {
    const newId = Math.max(...queue.map(q => q.id), 0) + 1;
    const newItem: QueueItem = {
      id: newId,
      startup: "MyStartup",
      investor: "New Investor",
      date: new Date().toISOString().split('T')[0],
      status: "Drafted",
      draft: "",
      note: ""
    };
    setQueue([...queue, newItem]);
    setExpanded(newId);
  };

  return (
    <div className="introqueue-bg">
      <div className="introqueue-content">
        <div className="introqueue-header-row">
          <div>
            <h1 className="introqueue-title">Intro Queue</h1>
            <div className="introqueue-sub">You have {queue.length} introductions queued</div>
          </div>
          <button className="introqueue-new-btn" onClick={handleAddNew}>
            + New Intro
          </button>
        </div>
        <div className="introqueue-list-card">
          {queue.map((item, idx) => (
            <React.Fragment key={item.id}>
              <div className="introqueue-list-row">
                <button
                  className="introqueue-row-toggle"
                  aria-label={expanded === item.id ? "Collapse details" : "Expand details"}
                  onClick={() => handleExpand(item.id)}
                >
                  <svg width="21" height="21" viewBox="0 0 20 20" fill="none">
                    <path
                      d={expanded === item.id ?
                        "M7 13l5-5 5 5" :
                        "M7 8l5 5 5-5"}
                      stroke="#333a"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <span>{item.startup}</span>
                <span>{item.investor}</span>
                <span>{item.date}</span>
                {statusBadge(item.status)}
              </div>
              {expanded === item.id && (
                <div className="introqueue-details-row">
                  <div className="introqueue-field-group">
                    <label className="introqueue-label">Draft</label>
                    <input
                      className="introqueue-input"
                      type="text"
                      placeholder="Introduction draft text here..."
                      value={item.draft ?? ""}
                      onChange={e => handleDraftChange(item.id, e.target.value)}
                    />
                  </div>
                  <div className="introqueue-field-row">
                    <div className="introqueue-field-group">
                      <label className="introqueue-label">Change Status</label>
                      <select
                        className="introqueue-select"
                        value={item.status}
                        onChange={e => handleStatusChange(item.id, e.target.value as Status)}
                      >
                        <option value="Drafted">Drafted</option>
                        <option value="Sent">Sent</option>
                      </select>
                    </div>
                    <div className="introqueue-field-group" style={{flex:2}}>
                      <label className="introqueue-label">Add Note</label>
                      <input
                        className="introqueue-input"
                        type="text"
                        placeholder="Optional follow-up notes..."
                        value={item.note ?? ""}
                        onChange={e => handleNoteChange(item.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {idx !== queue.length-1 && <div className="introqueue-row-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style jsx>{`
        .introqueue-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }
        .introqueue-content {
          padding: 32px 38px 10px 38px;
          width: 100%;
        }
        .introqueue-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .introqueue-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0px;
        }
        .introqueue-sub {
          font-size: 17px;
          color: #e9eafd;
          margin-bottom: 2px;
          margin-top: 2px;
        }
        .introqueue-new-btn {
          background: #6357fa;
          color: #fff;
          font-size: 15.6px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          padding: 8px 19px;
          cursor: pointer;
          transition: background 0.15s;
          margin-bottom: 4px;
          box-shadow: 0 1px 8px #23265922;
        }
        .introqueue-new-btn:hover, .introqueue-new-btn:focus {
          background: #4739ca;
        }
        .introqueue-list-card {
          margin-top: 11px;
          background: #fff;
          border-radius: 13px;
          box-shadow: 0 3px 18px #595fcc22;
          min-width: 220px;
          padding-top: 4px;
        }
        .introqueue-list-row {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 16px;
          color: #232b46;
          font-weight: 500;
          padding: 10px 27px 10px 12px;
        }
        .introqueue-row-toggle {
          appearance: none;
          background: none;
          border: none;
          cursor: pointer;
          display: inline-flex;
          margin-right: 10px;
          margin-left: 3px;
          padding: 0;
        }
        .introqueue-details-row {
          background: #f7f9fb;
          border-radius: 9px;
          margin-left: 41px;
          margin-right: 18px;
          margin-bottom: 7px;
          margin-top: -5px;
          padding: 15px 16px 12px 13px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .introqueue-field-group {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 3px;
          min-width: 170px;
        }
        .introqueue-label {
          font-size: 15px;
          color: #333c;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .introqueue-input {
          width: 100%;
          border-radius: 6px;
          border: 1px solid #dbe1f2;
          background: #fff;
          font-size: 15px;
          padding: 7px 9px;
        }
        .introqueue-select {
          padding: 7px 10px;
          background: #fff;
          border-radius: 6px;
          border: 1px solid #dbe1f2;
          font-size: 15px;
        }
        .introqueue-field-row {
          display: flex;
          gap: 25px;
        }
        .introqueue-row-divider {
          border-bottom: 1px solid #ebebeb;
          width: 90%;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .introqueue-content {
            padding: 18px 7vw 10px 7vw;
          }
        }
        @media (max-width: 600px) {
          .introqueue-content {
            padding: 8px 2vw 8px 2vw;
          }
          .introqueue-list-row {
            gap: 7px;
            font-size: 13px;
            padding: 8px 5px 8px 8px;
          }
          .introqueue-details-row {
            margin-left: 7px;
            margin-right: 7px;
            padding: 10px 7px 10px 7px;
          }
        }
      `}</style>
    </div>
  );
}
