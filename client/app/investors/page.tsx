"use client";
import React, { useState } from "react";

type Investor = {
  name: string;
  tags: string[];
  preferredFormat: string;
};

const sampleInvestors: Investor[] = [
  {
    name: "John Smith",
    tags: ["Early Stage", "AI"],
    preferredFormat: "3-Bullet"
  },
  {
    name: "John Smith",
    tags: ["B2B", "Fintech"],
    preferredFormat: "Email"
  },
  {
    name: "John Smith",
    tags: ["Deep Tech"],
    preferredFormat: "Paragraph"
  },
];

const tagStyles = [
  { bg: "#e8f1fe", color: "#176ede" },
  { bg: "#e0eaff", color: "#565ed7" },
  { bg: "#eafbec", color: "#179648" },
  { bg: "#f7eafd", color: "#a13fbc" },
  { bg: "#fff4e1", color: "#d6920b" }
];

export default function InvestorsPage() {
  const [search, setSearch] = useState("");
  const [investors, setInvestors] = useState(sampleInvestors);

  const filtered = investors.filter(inv =>
    inv.name.toLowerCase().includes(search.toLowerCase())
    || inv.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    || inv.preferredFormat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="investors-bg">
      <div className="investors-content">
        <h1 className="inv-title">Investors</h1>
        <div className="inv-sub">Manage your investor list</div>
        <div className="inv-searchbar">
          <input
            type="text"
            placeholder="Search investors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>No.</th>
                <th>Name</th>
                <th style={{ minWidth:130 }}>Tags</th>
                <th style={{ minWidth: 130 }}>Preferred Format</th>
                <th style={{ width: 75 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{inv.name}</td>
                  <td>
                    {inv.tags.map((t, idx) => (
                      <span
                        key={t}
                        style={{
                          background: tagStyles[idx % tagStyles.length].bg,
                          color: tagStyles[idx % tagStyles.length].color,
                          borderRadius: 8,
                          fontWeight: 500,
                          fontSize: 13,
                          padding: "3px 12px",
                          marginRight: 7,
                          marginBottom: 2,
                          display: "inline-block"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </td>
                  <td>{inv.preferredFormat}</td>
                  <td>
                    <button className="inv-action-btn" title="Edit">
                      <svg width="17" height="17" fill="none" viewBox="0 0 20 20">
                        <path d="M15.2 3.9c.4-.4 1-.4 1.4 0l.6.6c.4.4.4 1 0 1.4l-9 9.1-2.1.7.7-2.1L15.2 3.9z" stroke="#53587a" strokeWidth="1.25" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className="inv-action-btn" title="Delete">
                      <svg width="17" height="17" fill="none" viewBox="0 0 20 20">
                        <path d="M7.5 7.5l5 5m0-5l-5 5M5 6.5h10M8 5.5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z" stroke="#e23c3c" strokeWidth="1.15" strokeLinecap="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#aaa" }}>
                    No investors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        .investors-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }
        .investors-content {
          padding: 32px 38px 35px 38px;
          width: 100%;
          margin-left: 0;
          margin-top: 0;
        }
        .inv-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0px;
        }
        .inv-sub {
          font-size: 18px;
          color: #e9eafd;
          margin-bottom: 28px;
          margin-top: 3px;
        }
        .inv-searchbar {
          margin-bottom: 20px;
        }
        .inv-searchbar input {
          width: 100%;
          padding: 13px 18px;
          font-size: 16px;
          border-radius: 12px;
          border: none;
          background: rgba(255,255,255,0.62);
          outline: none;
          box-shadow: 0 2px 14px #00000007;
        }
        .inv-table-wrap {
          width: 100%;
          overflow-x: auto;
        }
        .inv-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: rgba(255,255,255,0.95);
          border-radius: 13px;
          box-shadow: 0 0 18px #0002;
          overflow: hidden;
        }
        .inv-table th, .inv-table td {
          padding: 13px 14px;
          text-align: left;
        }
        .inv-table th {
          font-weight: 600;
          color: #464c61;
          background: #eef4fb;
        }
        .inv-table tr:not(:last-child) td {
          border-bottom: 1px solid #ececec;
        }
        .inv-table td {
          color: #2b3450;
          font-size: 15px;
        }
        .inv-action-btn {
          background: none;
          border: none;
          font-size: 17px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.1s;
          outline: none;
          padding: 0 3px;
        }
        .inv-action-btn:hover, .inv-action-btn:focus {
          opacity: 1;
        }
        @media (max-width: 1050px) {
          .investors-content {
            padding: 20px 6vw 22px 6vw;
          }
        }
        @media (max-width: 700px) {
          .investors-content {
            padding: 8px 1vw 8px 1vw;
          }
          .inv-table {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
