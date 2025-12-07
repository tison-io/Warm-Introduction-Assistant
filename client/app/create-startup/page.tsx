"use client";
import React, { useState } from "react";

export default function CreateStartupPage() {
  const [form, setForm] = useState({ name: "", blurb: "", link: "" });

  return (
    <div className="newstartup-bg">
      <div className="newstartup-content">
        <h1 className="newstartup-title">Create Startup Profile</h1>
        <div className="newstartup-sub">
          Set up your startup information to get started with generating investor introductions.
        </div>
        <form
          className="newstartup-form"
          onSubmit={e => {
            e.preventDefault();
          }}
          autoComplete="off"
        >
          <label className="newstartup-label" htmlFor="startup-name">Startup Name*</label>
          <input
            className="newstartup-input"
            type="text"
            id="startup-name"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />

          <label className="newstartup-label" htmlFor="startup-blurb">Blurb*</label>
          <input
            className="newstartup-input"
            type="text"
            id="startup-blurb"
            required
            value={form.blurb}
            onChange={e => setForm(f => ({ ...f, blurb: e.target.value }))}
          />
          <div className="newstartup-helper">This will be used to generate personalized investor introductions.</div>

          <label className="newstartup-label" htmlFor="startup-link">Pitch Link (optional)</label>
          <input
            className="newstartup-input"
            type="text"
            id="startup-link"
            value={form.link}
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
          />

          <button className="newstartup-btn" type="submit">Register</button>
        </form>
      </div>
      <style jsx>{`
        .newstartup-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }
        .newstartup-content {
          padding: 32px 38px 35px 38px;
          width: 100%;
        }
        .newstartup-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0px;
        }
        .newstartup-sub {
          font-size: 17px;
          color: #e9eafd;
          margin-bottom: 23px;
          margin-top: 5px;
        }
        .newstartup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .newstartup-label {
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 3px;
        }
        .newstartup-input {
          width: 100%;
          background: rgba(255,255,255,0.93);
          border: none;
          border-radius: 8px;
          padding: 12px 10px;
          font-size: 16px;
          outline: none;
          margin-bottom: 0;
        }
        .newstartup-helper {
          font-size: 13px;
          color: #d0d1e8;
          margin-top: -10px;
        }
        .newstartup-btn {
          background: #0152d6;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 13px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
        }
        .newstartup-btn:hover {
          background: #003fa1;
        }
      `}</style>
    </div>
  );
}