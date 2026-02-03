"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Ensure your .env has NEXT_PUBLIC_API_URL pointing to your NestJS server
      const response = await fetch(`${process.env.NEXT_PUBLIC_FOUNDER_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // We show the same message regardless of whether the email exists for security
      if (response.ok) {
        setMessage("A reset link has been sent to your email address.");
      } else {
        const data = await response.json();
        setError(data.message || "Unable to process request. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-bg">
      <button className="fp-back" onClick={() => router.back()}>
        <span>←</span> Back
      </button>

      <div className="fp-center-card">
        <img src="/logo.png" alt="Warmly Logo" className="fp-logo" />
        <h2 className="fp-title">Forgot Password?</h2>
        <p className="fp-sub">Enter your email address below and we'll send you a link to reset your password.</p>

        <form className="fp-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {message && <div className="fp-alert success">{message}</div>}
          {error && <div className="fp-alert error">{error}</div>}

          <button className="fp-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .fp-bg {
          min-height: 100vh;
          background: url("/backeground.jpg") center/cover;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
        }
        .fp-back {
          position: absolute;
          top: 25px;
          left: 25px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }
        .fp-back:hover { background: rgba(255, 255, 255, 0.2); }
        .fp-center-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .fp-logo {
          width: 64px;
          display: block;
          margin: 0 auto 20px;
        }
        .fp-title {
          text-align: center;
          color: #1a202c;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .fp-sub {
          text-align: center;
          color: #4a5568;
          font-size: 14px;
          margin-bottom: 30px;
          line-height: 1.5;
        }
        .input-group { margin-bottom: 20px; }
        .input-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .input-group input {
          width: 100%;
          padding: 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        .input-group input:focus {
          outline: none;
          border-color: #1746e0;
          background: white;
        }
        .fp-btn {
          width: 100%;
          padding: 14px;
          background: #1746e0;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .fp-btn:hover { background: #123bb4; }
        .fp-btn:disabled { background: #cbd5e0; cursor: not-allowed; }
        
        .fp-alert {
          padding: 14px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
          text-align: center;
          line-height: 1.4;
        }
        .success { background: #f0fff4; color: #22543d; border: 1px solid #c6f6d5; }
        .error { background: #fff5f5; color: #9b2c2c; border: 1px solid #fed7d7; }

        @media (max-width: 480px) {
          .fp-center-card { padding: 30px 20px; margin: 15px; }
        }
      `}</style>
    </div>
  );
}