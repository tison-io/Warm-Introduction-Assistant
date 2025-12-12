"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { signupFounder } from "../lib/founder-api";

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setIsSuccess(false);

    // Validation
    if (!form.name.trim()) {
      setMsg("Please enter your name");
      setLoading(false);
      return;
    }

    if (!form.email.trim()) {
      setMsg("Please enter your email");
      setLoading(false);
      return;
    }

    if (!form.phone.trim()) {
      setMsg("Please enter your phone number");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMsg("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting signup with:", { name: form.name, email: form.email });
      const fullPhone = countryCode + form.phone;
      const result = await signupFounder({ 
        name: form.name, 
        email: form.email, 
        password: form.password,
        phone: fullPhone 
      });
      console.log("Signup successful:", result);
      setMsg(`Account created successfully for ${result.name}!`);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMsg = err.message || err.error || "Network error. Please check your connection and try again.";
      setMsg(errorMsg);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-bg">
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
        >
          <ArrowLeft style={{ width: 16, height: 16, marginRight: 4 }} /> Back
        </button>
      </div>
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
          <div className="phone-field">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="country-code"
            >
              <option value="+213">Algeria 🇩🇿 +213</option>
              <option value="+61">Australia 🇦🇺 +61</option>
              <option value="+55">Brazil 🇧🇷 +55</option>
              <option value="+86">China 🇨🇳 +86</option>
              <option value="+20">Egypt 🇪🇬 +20</option>
              <option value="+251">Ethiopia 🇪🇹 +251</option>
              <option value="+33">France 🇫🇷 +33</option>
              <option value="+49">Germany 🇩🇪 +49</option>
              <option value="+233">Ghana 🇬🇭 +233</option>
              <option value="+91">India 🇮🇳 +91</option>
              <option value="+225">Ivory Coast 🇨🇮 +225</option>
              <option value="+39">Italy 🇮🇹 +39</option>
              <option value="+81">Japan 🇯🇵 +81</option>
              <option value="+254">Kenya 🇰🇪 +254</option>
              <option value="+52">Mexico 🇲🇽 +52</option>
              <option value="+212">Morocco 🇲🇦 +212</option>
              <option value="+234">Nigeria 🇳🇬 +234</option>
              <option value="+7">Russia 🇷🇺 +7</option>
              <option value="+250">Rwanda 🇷🇼 +250</option>
              <option value="+221">Senegal 🇸🇳 +221</option>
              <option value="+27">South Africa 🇿🇦 +27</option>
              <option value="+82">South Korea 🇰🇷 +82</option>
              <option value="+34">Spain 🇪🇸 +34</option>
              <option value="+255">Tanzania 🇹🇿 +255</option>
              <option value="+216">Tunisia 🇹🇳 +216</option>
              <option value="+256">Uganda 🇺🇬 +256</option>
              <option value="+44">United Kingdom 🇬🇧 +44</option>
              <option value="+1">United States 🇺🇸 +1</option>
              <option value="+260">Zambia 🇿🇲 +260</option>
              <option value="+263">Zimbabwe 🇿🇼 +263</option>
            </select>
            <input
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
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
          {msg && <div className={isSuccess ? "success-msg" : "error-msg"}>{msg}</div>}
          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I have read and agree to the Terms of Service</label>
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
          position: relative;
        }
        .signup-container {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
          padding: 1.5rem 1rem;
          max-width: 420px;
          width: 90%;
          margin: 0 1rem;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (min-width: 640px) {
          .signup-container {
            padding: 2.5rem 2rem;
            width: 100%;
            margin: 0;
          }
        }
        .logo-area {
          width: 60px;
          margin-bottom: 10px;
        }
        .title {
          font-size: 20px;
          font-weight: 600;
          margin: 8px 0 2px;
        }
        @media (min-width: 640px) {
          .title {
            font-size: 26px;
          }
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
          padding: 12px;
          margin-bottom: 13px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .phone-field {
          display: flex;
          gap: 6px;
          margin-bottom: 13px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .phone-field {
            gap: 8px;
          }
        }
        .country-code {
          padding: 12px 6px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
          cursor: pointer;
          width: 80px;
          box-sizing: border-box;
        }
        @media (min-width: 640px) {
          .country-code {
            padding: 12px 8px;
            font-size: 16px;
            width: 90px;
          }
        }
        .phone-field input {
          flex: 1;
          margin-bottom: 0;
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
        .success-msg {
          color: green;
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
          padding: 14px 0;
          margin-bottom: 8px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          transition: background 0.2s;
        }
        @media (min-width: 640px) {
          .register-btn {
            font-size: 18px;
          }
        }
        .register-btn:hover {
          background: #003fa1;
        }
        .register-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .terms {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
          display: flex;
          align-items: flex-start;
          text-align: left;
        }
        @media (min-width: 640px) {
          .terms {
            font-size: 13px;
            align-items: center;
          }
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