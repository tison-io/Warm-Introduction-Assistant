"use client";
import React, { useState } from "react";

export default function SettingsPage() {
  const [tab, setTab] = useState<"personal" | "startup">("personal");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [startup, setStartup] = useState({
    name: "MyStartup",
    blurb: "We help SaaS companies reduce churn...",
    link: "https://abc.com"
  });

  return (
    <div className="settings-bg">
      <div className="settings-content">
        <h1 className="settings-title">Settings</h1>
        <div className="settings-sub">Manage your profile and preferences</div>

        <div className="settings-tabs">
          <button
            className={`settings-tab${tab === "personal" ? " selected" : ""}`}
            onClick={() => setTab("personal")}
          >Personal Profile</button>
          <button
            className={`settings-tab${tab === "startup" ? " selected" : ""}`}
            onClick={() => setTab("startup")}
          >Startup Details</button>
        </div>

        <div className="settings-form-card">
          {tab === "personal" ? (
            <form className="settings-form">
              <div className="settings-form-title">Personal Information</div>
              <label className="settings-label">Full Name</label>
              <input
                className="settings-input"
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              />
              <label className="settings-label">Email</label>
              <input
                className="settings-input"
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              />
              <label className="settings-label">Phone</label>
              <input
                className="settings-input"
                type="tel"
                value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              />
              <label className="settings-label">Password</label>
              <input
                className="settings-input"
                type="password"
                value={profile.password}
                onChange={e => setProfile(p => ({ ...p, password: e.target.value }))}
              />
              <button className="settings-save-btn" type="button">Save Changes</button>
            </form>
          ) : (
            <form className="settings-form">
              <div className="settings-form-title">Startup Details</div>
              <label className="settings-label">Startup Name</label>
              <input
                className="settings-input"
                type="text"
                value={startup.name}
                onChange={e => setStartup(s => ({ ...s, name: e.target.value }))}
              />
              <label className="settings-label">Blurb</label>
              <input
                className="settings-input"
                type="text"
                value={startup.blurb}
                onChange={e => setStartup(s => ({ ...s, blurb: e.target.value }))}
              />
              <label className="settings-label">Pitch Link</label>
              <input
                className="settings-input"
                type="text"
                value={startup.link}
                onChange={e => setStartup(s => ({ ...s, link: e.target.value }))}
              />
              <button className="settings-save-btn" type="button">Save Changes</button>
            </form>
          )}
        </div>
      </div>
      <style jsx>{`
        .settings-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          width: 100%;
        }
        .settings-content {
          padding: 32px 38px;
          width: 100%;
        }
        .settings-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0;
        }
        .settings-sub {
          font-size: 17px;
          color: #e9eafd;
          margin-bottom: 20px;
          margin-top: 5px;
        }
        .settings-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .settings-tab {
          padding: 10px 24px;
          background: #d4d6e8;
          color: #555;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .settings-tab.selected {
          background: #fff;
          color: #222;
          font-weight: 600;
        }
        .settings-form-card {
          background: #fff;
          border-radius: 12px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .settings-form {
          display: flex;
          flex-direction: column;
        }
        .settings-form-title {
          font-size: 20px;
          font-weight: 700;
          color: #222;
          margin-bottom: 20px;
        }
        .settings-label {
          font-size: 15px;
          font-weight: 500;
          color: #444;
          margin-bottom: 6px;
          margin-top: 12px;
        }
        .settings-input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 15px;
          background: #f9fafb;
        }
        .settings-save-btn {
          margin-top: 24px;
          padding: 12px;
          background: #0152d6;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
        .settings-save-btn:hover {
          background: #003fa1;
        }
      `}</style>
    </div>
  );
}
