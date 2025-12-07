"use client";
import React from "react";

const startup = {
  name: "My Startup",
  description: "We help SaaS Companies reduce churn by 40%",
  intros: 12,
  investors: 24
};

export default function StartupsPage() {
  return (
    <div className="startups-bg">
      <div className="startups-content">
        <div className="startups-header-row">
          <div>
            <h1 className="startups-title">My Startups</h1>
            <div className="startups-sub">Manage your startup profiles</div>
          </div>
          <a href="/create-startup">
            <button className="startup-new-btn">
              <svg width="18" height="18" style={{marginRight:8}} viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.15"/>
                <path d="M10 7v6M7 10h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              New Startup
            </button>
          </a>
        </div>
        <div className="startup-card">
          <div className="startup-card-row" style={{justifyContent:"space-between"}}>
            <div>
              <div className="startup-card-title">{startup.name}</div>
              <div className="startup-card-desc">{startup.description}</div>
            </div>
            <div className="startup-card-actions">
              <button className="startup-action-btn" aria-label="Edit">
                <svg width="19" height="19" fill="none" viewBox="0 0 20 20">
                  <path d="M15.2 3.9c.4-.4 1-.4 1.4 0l.6.6c.4.4.4 1 0 1.4l-9 9.1-2.1.7.7-2.1L15.2 3.9z" stroke="#43436b" strokeWidth="1.25" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="startup-action-btn" aria-label="Delete">
                <svg width="19" height="19" fill="none" viewBox="0 0 20 20">
                  <path d="M7.5 7.5l5 5m0-5l-5 5M5 6.5h10M8 5.5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z" stroke="#e23c3c" strokeWidth="1.15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="startup-card-row" style={{marginTop:19}}>
            <div className="startup-card-meta">
              <div className="startup-meta-label">Intros Created</div>
              <div className="startup-meta-value">{startup.intros}</div>
            </div>
            <div className="startup-card-meta">
              <div className="startup-meta-label">Investors</div>
              <div className="startup-meta-value">{startup.investors}</div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .startups-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }
        .startups-content {
          padding: 32px 38px 35px 38px;
          width: 100%;
          margin-left: 0;
          margin-top: 0;
        }
        .startups-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .startups-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0px;
        }
        .startups-sub {
          font-size: 18px;
          color: #e9eafd;
          margin-bottom: 2px;
          margin-top: 2px;
        }
        .startup-new-btn {
          display: flex;
          align-items: center;
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
        .startup-new-btn:hover, .startup-new-btn:focus {
          background: #4739ca;
        }
        .startup-card {
          margin-top: 11px;
          background: #fff;
          border-radius: 13px;
          box-shadow: 0 3px 18px #595fcc22;
          padding: 23px 23px 12px 23px;
          min-width: 220px;
          max-width: 100%;
        }
        .startup-card-row {
          display: flex;
          align-items: flex-start;
        }
        .startup-card-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: #232b46;
        }
        .startup-card-desc {
          font-size: 15px;
          color: #4e5772;
          margin-top: 4px;
        }
        .startup-card-actions {
          display: flex;
          gap: 6px;
          margin-left: 10px;
        }
        .startup-action-btn {
          background: none;
          border: none;
          font-size: 17px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.1s;
          outline: none;
          padding: 0 3px;
        }
        .startup-action-btn:hover,
        .startup-action-btn:focus {
          opacity: 1;
        }
        .startup-card-meta {
          margin-right: 44px;
        }
        .startup-meta-label {
          font-size: 13px;
          color: #74798b;
          margin-bottom: 1.5px;
        }
        .startup-meta-value {
          font-size: 20px;
          color: #232b46;
          font-weight: 700;
        }
        @media (max-width: 1050px) {
          .startups-content {
            padding: 19px 6vw 22px 6vw;
          }
        }
        @media (max-width: 700px) {
          .startups-content {
            padding: 8px 1vw 8px 1vw;
          }
        }
        @media (max-width: 500px) {
          .startup-card {
            padding: 15px 7px 8px 7px;
          }
          .startup-card-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
