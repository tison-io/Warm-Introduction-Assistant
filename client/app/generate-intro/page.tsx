"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Draft = {
  id: number;
  name: string;
  format: string;
  text: string;
  highlight?: boolean;
  editing?: boolean;
};

const sampleDrafts: Draft[] = [
  {
    id: 1,
    name: "Abebe Beso",
    format: "3-Bullet",
    text: [
      "We help SaaS companies reduce churn by 40% with AI",
      "Already working with 50+ enterprise customers",
      "Raising $1M series A, link to desk: [pitch]"
    ].map((line) => `• ${line}`).join("\n"),
    highlight: true
  },
  {
    id: 2,
    name: "Kebede Chala",
    format: "Email",
    text: `Hi Kebede,

I wanted to introduce you to a fintech platform that's solving payment reconciliation for B2B companies. They've already seen 3x revenue growth in 6 months.

Check out their pitch: [ https://abc.com ]

Best,
Founder`
  }
];

export default function GenerateIntroPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>(sampleDrafts);
  const [msg, setMsg] = useState("");

  return (
    <div className="genintro-bg">
      <div className="genintro-content">
        <h1 className="genintro-title">Generated Intro Drafts</h1>
        <div className="genintro-sub">
          Review and customize your investor introductions before sending.
        </div>
        <div className="genintro-drafts-list">
          {drafts.map((draft, idx) => (
            <div
              className={`genintro-draft${draft.highlight ? " genintro-highlight" : ""}`}
              key={draft.name + idx}
            >
              <div className="genintro-draft-header">
                <div className="genintro-draft-name">{draft.name}</div>
                <div className="genintro-draft-format">{draft.format}</div>
              </div>
              <textarea
                className="genintro-draft-text"
                value={draft.text}
                readOnly={!draft.editing}
                rows={draft.format === "Email" ? 5 : 4}
                onChange={(e) => {
                  setDrafts(drafts.map(d => d.id === draft.id ? {...d, text: e.target.value} : d));
                }}
              />
              <div className="genintro-draft-actions">
                <button className="genintro-action-btn" onClick={() => {
                  navigator.clipboard.writeText(draft.text);
                  setMsg("Copied to clipboard!");
                  setTimeout(() => setMsg(""), 2000);
                }}>Copy</button>
                <button className="genintro-action-btn" onClick={() => {
                  setDrafts(drafts.map(d => d.id === draft.id ? {...d, editing: !d.editing} : d));
                }}>{draft.editing ? "Done" : "Edit"}</button>
                <button className="genintro-action-btn genintro-delete-btn" onClick={() => {
                  setDrafts(drafts.filter(d => d.id !== draft.id));
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        {msg && <div className="genintro-msg">{msg}</div>}
        <div className="genintro-footer-row">
          <button className="genintro-save-btn" type="button" onClick={() => {
            setMsg("Drafts saved successfully!");
            setTimeout(() => setMsg(""), 2000);
          }}>Save</button>
          <button className="genintro-back-btn" type="button" onClick={() => router.back()}>Back</button>
        </div>
      </div>
      <style jsx>{`
        .genintro-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }
        .genintro-content {
          padding: 32px 38px 25px 38px;
          width: 100%;
        }
        .genintro-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0px;
        }
        .genintro-sub {
          font-size: 17px;
          color: #e9eafd;
          margin-bottom: 26px;
          margin-top: 5px;
        }
        .genintro-drafts-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 35px;
        }
        .genintro-draft {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 3px 22px #23265913;
          padding: 14px 21px 12px 21px;
          border: 2.3px solid transparent;
        }
        .genintro-highlight {
          border-color: #2896ff;
          box-shadow: 0 0 0 2.5px #e6f3ff;
        }
        .genintro-draft-header {
          display: flex;
          align-items: flex-end;
          gap: 19px;
          margin-bottom: 6px;
        }
        .genintro-draft-name {
          font-weight: 700;
          font-size: 18px;
          color: #222545;
        }
        .genintro-draft-format {
          font-size: 15px;
          color: #999ab3;
          font-weight: 500;
        }
        .genintro-draft-text {
          width: 100%;
          background: #f6f7fa;
          border-radius: 9px;
          border: 1px solid #e6e8ef;
          font-size: 15px;
          color: #26304a;
          padding: 10px 12px;
          margin-bottom: 10px;
          resize: none;
        }
        .genintro-draft-actions {
          display: flex;
          gap: 10px;
        }
        .genintro-action-btn {
          padding: 6px 19px;
          background: #f6f8fa;
          border-radius: 7px;
          border: 1px solid #ececf2;
          font-size: 15px;
          color: #2a3046;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.12s, box-shadow 0.12s;
        }
        .genintro-action-btn:hover, .genintro-action-btn:focus {
          background: #edf2ff;
        }
        .genintro-delete-btn {
          color: #d32f2f;
        }
        .genintro-delete-btn:hover {
          background: #ffebee;
        }
        .genintro-msg {
          color: #175de6;
          font-size: 15px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 12px;
        }
        .genintro-footer-row {
          display: flex;
          gap: 16px;
          margin-top: 18px;
        }
        .genintro-save-btn {
          flex: 1;
          background: #175de6;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          padding: 15px 0;
          cursor: pointer;
          transition: background 0.13s;
        }
        .genintro-save-btn:hover, .genintro-save-btn:focus {
          background: #1745b7;
        }
        .genintro-back-btn {
          flex: 1;
          background: #f7f7fa;
          color: #222545;
          font-size: 18px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          padding: 15px 0;
          cursor: pointer;
          transition: background 0.14s;
          margin-left: 0;
        }
        .genintro-back-btn:hover, .genintro-back-btn:focus {
          background: #e7e7ee;
        }
        @media (max-width: 900px) {
          .genintro-content {
            padding: 18px 7vw 12px 7vw;
          }
        }
        @media (max-width: 600px) {
          .genintro-content {
            padding: 8px 2vw 8px 2vw;
          }
          .genintro-draft {
            padding: 10px 5px 11px 7px;
          }
        }
      `}</style>
    </div>
  );
}
