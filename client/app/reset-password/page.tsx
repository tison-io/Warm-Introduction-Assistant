"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FOUNDER_API_URL}/founder/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-bg">
      <button className="rp-back" onClick={() => router.push("/login")}>
        ← Back to Login
      </button>
      <div className="rp-center-card">
        <img
          src="/logo.png"
          alt="Warmly Logo"
          style={{ width: 70, margin: "0 auto 9px auto", display: "block" }}
        />
        <h2 className="rp-title">Reset Password</h2>
        <div className="rp-sub">
          Enter your new password below
        </div>
        
        <form className="rp-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="rp-label" htmlFor="password">New Password</label>
            <div className="password-input-container">
              <input
                id="password"
                className="rp-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading || !token}
                minLength={6}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          
          <div className="input-group">
            <label className="rp-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                className="rp-input"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !token}
                minLength={6}
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          
          {message && (
            <div className="rp-message success">{message}</div>
          )}
          
          {error && (
            <div className="rp-message error">{error}</div>
          )}
          
          <button 
            className="rp-btn" 
            type="submit" 
            disabled={loading || !token}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .rp-bg {
          min-height: 100vh;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .rp-back {
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
        .rp-center-card {
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 0 32px rgba(0,0,0,0.13);
          padding: 38px 38px 33px 38px;
          width: 350px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .rp-title {
          font-size: 1.7rem;
          font-weight: 700;
          color: #232b46;
          text-align: center;
          margin-bottom: 7px;
        }
        .rp-sub {
          font-size: 15px;
          color: #858db7;
          margin-bottom: 22px;
          text-align: center;
        }
        .rp-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .rp-label {
          font-size: 15px;
          color: #232b46;
          font-weight: 500;
        }
        .password-input-container {
          position: relative;
        }
        .rp-input {
          width: 100%;
          background: #f4f6fb;
          border: 1.2px solid #ced4da;
          border-radius: 7px;
          padding: 12px 10px;
          font-size: 16px;
          outline: none;
        }
        .password-input-container .rp-input {
          padding-right: 45px;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6c757d;
          display: flex;
          align-items: center;
        }
        .password-toggle:hover {
          color: #495057;
        }
        .rp-input:disabled {
          background: #f8f9fa;
          color: #6c757d;
        }
        .rp-btn {
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
        .rp-btn:hover,
        .rp-btn:focus {
          background: #123bb4;
        }
        .rp-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .rp-message {
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          font-size: 14px;
        }
        .rp-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .rp-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        @media (max-width: 500px) {
          .rp-center-card {
            width: 98vw;
            padding: 18px 3vw 15px 3vw;
          }
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}