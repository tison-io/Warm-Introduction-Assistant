"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signupFounder } from "../lib/founder-api";

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await signupFounder({ name: form.name, email: form.email, password: form.password });
      setMsg(`Account created successfully for ${result.name}.`);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setMsg(err.message || "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-bg">
      <div className="signup-container" style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 1s ease-out, transform 1s ease-out'
      }}>
        <div className="logo-area" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(-30px)',
          transition: 'opacity 1.2s ease-out 0.3s, transform 1.2s ease-out 0.3s'
        }}>
          <Image src="/logo.png" width={60} height={48} alt="Warmly Logo" />
        </div>
        <h2 className="title">Create Account</h2>
        <div className="subtitle">warm Introduction Assistant</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <div className="password-field">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Create Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              aria-label="Show/hide password"
              className="show-hide"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          <div className="password-field">
            <input
              type={showConf ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            <button
              type="button"
              aria-label="Show/hide confirm password"
              className="show-hide"
              onClick={() => setShowConf(!showConf)}
              tabIndex={-1}
            >
              {showConf ? "🙈" : "👁️"}
            </button>
          </div>
          {msg && <div className="error-msg">{msg}</div>}
          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I have read and agree to the Terms of Service</label>
          </div>
          <span className="or">or sign up with email</span>
          <div className="social-icons">
            <button type="button" className="social-btn">
              <Image src="/google.svg" alt="Google" width={22} height={22} />
            </button>
            <button type="button" className="social-btn">
              <Image src="/apple.svg" alt="Apple" width={22} height={22} />
            </button>
            <button type="button" className="social-btn">
              <Image src="/facebook.svg" alt="Facebook" width={22} height={22} />
            </button>
          </div>
          <div className="login-link">
            Already have an account? <Link href="/login">Log in</Link>
          </div>
        </form>
      </div>
      <style jsx>{`
        .signup-bg {
          height: 100vh;
          width: 100vw;
          background-image: url('/backeground.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .signup-container {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
          padding: 2.5rem 2rem;
          max-width: 420px;
          width: 100%;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .logo-area {
          width: 60px;
          margin-bottom: 10px;
        }
        .title {
          font-size: 26px;
          font-weight: 600;
          margin: 8px 0 2px;
        }
        .subtitle {
          font-size: 13px;
          color: #555;
          margin-bottom: 10px;
          text-align: center;
        }
        form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="password"] {
          padding: 10px;
          margin-bottom: 13px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 16px;
        }
        .password-field {
          position: relative;
          margin-bottom: 13px;
        }
        .show-hide {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          opacity: 0.4;
        }
        .error-msg {
          color: red;
          font-size: 13px;
          margin-bottom: 10px;
          text-align: center;
        }
        .register-btn {
          background: #0152d6;
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          padding: 12px 0;
          margin-bottom: 8px;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s;
        }
        .register-btn:hover {
          background: #003fa1;
        }
        .register-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .terms {
          font-size: 13px;
          color: #666;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .terms label {
          margin-left: 7px;
        }
        .or {
          text-align: center;
          color: #999;
          margin: 9px 0 7px;
          font-size: 13px;
        }
        .social-icons {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
          gap: 15px;
        }
        .social-btn {
          background: #f8f9fa;
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .login-link {
          margin-top: 8px;
          font-size: 13px;
          text-align: center;
          color: #999;
        }
        .login-link a {
          color: #0152d6;
          text-decoration: none;
          font-weight: 500;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}