"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="fp-bg">
      <button className="fp-back" onClick={() => router.back()}>
        <span role="img" aria-label="back">←</span> Back
      </button>
      <div className="fp-center-card">
        <img
          src="/logo.png"
          alt="Warmly Logo"
          style={{ width: 70, margin: "0 auto 9px auto", display: "block" }}
        />
        <h2 className="fp-title">Forgot Password?</h2>
        <div className="fp-sub">
          Provide the Email or Phone Number linked with your account to reset your password.
        </div>
        <form
          className="fp-form"
          autoComplete="off"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            setMessage("");

            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_FOUNDER_API_URL}/founder/forgot-password`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
              });

              const data = await response.json();

              if (response.ok) {
                setMessage(data.message);
              } else {
                setError(data.message || 'Failed to send reset email');
              }
            } catch (error) {
              setError('Network error. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="fp-label" htmlFor="fp-input">Email Address</label>
          <input
            id="fp-input"
            className="fp-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          
          {message && (
            <div className="fp-message success">{message}</div>
          )}
          
          {error && (
            <div className="fp-message error">{error}</div>
          )}
          <button className="fp-btn" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
      <style jsx>{`
        .fp-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .fp-back {
          position: absolute;
          top: 16px;
          left: 26px;
          background: none;
          border: none;
          color: #e9eafd;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
        }
        .fp-center-card {
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 0 32px rgba(0,0,0,0.13);
          padding: 38px 38px 33px 38px;
          width: 350px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .fp-title {
          font-size: 1.7rem;
          font-weight: 700;
          color: #232b46;
          text-align: center;
          margin-bottom: 7px;
        }
        .fp-sub {
          font-size: 15px;
          color: #858db7;
          margin-bottom: 22px;
          text-align: center;
        }
        .fp-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .fp-label {
          font-size: 15px;
          color: #232b46;
          margin-bottom: 3px;
          font-weight: 500;
        }
        .fp-input {
          width: 100%;
          background: #f4f6fb;
          border: 1.2px solid #ced4da;
          border-radius: 7px;
          padding: 12px 10px;
          font-size: 16px;
          outline: none;
        }
        .fp-btn {
          background: #1746e0;
          color: #fff;
          font-size: 17px;
          font-weight: 600;
          border: none;
          border-radius: 7px;
          padding: 13px 0;
          margin-top: 14px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .fp-btn:hover,
        .fp-btn:focus {
          background: #123bb4;
        }
        .fp-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .fp-message {
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
        }
        .fp-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .fp-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        @media (max-width: 500px) {
          .fp-center-card {
            width: 98vw;
            padding: 18px 3vw 15px 3vw;
          }
        }
      `}</style>
    </div>
  );
}
