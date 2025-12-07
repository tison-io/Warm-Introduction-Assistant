"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const inputsRef = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Demo resend logic (stub)
  const handleResend = () => {
    setTimer(60);
    // ...API call
  };

  // Handle moving to next
  const handleChange = (idx: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const updated = [...code];
      updated[idx] = value;
      setCode(updated);
      // focus next if typed
      if (value && idx < 3) inputsRef[idx + 1].current?.focus();
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join("").length === 4) {
      router.push("/reset-password/new-password");
    }
  };

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(sec => sec - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="rp-bg">
      <button className="rp-back" onClick={() => router.back()}>← Back</button>
      <div className="rp-center-card">
        <img src="/logo.png" alt="Warmly Logo" style={{ width: 70, margin: "0 auto 9px auto", display: "block" }} />
        <h2 className="rp-title">Verification Code</h2>
        <div className="rp-sub">
          Enter OTP (one time password) sent to <b>abc***@gmail.com</b>
        </div>
        <form className="rp-form" onSubmit={submit}>
          <div className="otp-input-row">
            {code.map((v, i) => (
              <input
                key={i}
                ref={inputsRef[i]}
                maxLength={1}
                type="text"
                inputMode="numeric"
                className="otp-input"
                value={v}
                onChange={e => handleChange(i, e.target.value)}
                onFocus={e => e.target.select()}
                required
              />
            ))}
          </div>
          <button className="rp-btn" type="submit">Verify Code</button>
        </form>
        <div className="rp-links-row">
          <button className="rp-link-btn" type="button" onClick={handleResend} disabled={timer > 0}>Resend</button>
          <span style={{ marginLeft: 11 }}>{timer > 0 ? `00:${String(timer).padStart(2, "0")}` : "00:00"}</span>
        </div>
      </div>
      <style jsx>{`
        .rp-bg { min-height: 100vh; background: url("/backeground.jpg"); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; position: relative; }
        .rp-back { position: absolute; top: 16px; left: 26px; background: none; border: none; color: #e9eafd; font-size: 18px; font-weight: 500; cursor: pointer; }
        .rp-center-card { background: #fff; border-radius: 15px; box-shadow: 0 0 32px rgba(0,0,0,0.13); padding: 30px 35px 32px 35px; width: 350px; display: flex; flex-direction: column; align-items: stretch; }
        .rp-title { font-size: 1.5rem; font-weight: 700; color: #232b46; text-align: center; margin-bottom: 7px; }
        .rp-sub { font-size: 15px; color: #858db7; margin-bottom: 18px; text-align: center;}
        .rp-form { display: flex; flex-direction: column; align-items: center; gap: 18px; }
        .otp-input-row { display: flex; gap: 17px; justify-content: center; margin-bottom: 5px; }
        .otp-input { width: 45px; height: 45px; text-align: center; font-size: 2rem; border-radius: 7px; border: 1.5px solid #b7b7d3; background: #f4f6fb; }
        .rp-btn { background: #1746e0; color: #fff; font-size: 17px; font-weight: 600; border: none; border-radius: 7px; padding: 13px 0; margin-top: 7px; cursor: pointer; transition: background 0.15s; width: 100%; }
        .rp-btn:hover, .rp-btn:focus { background: #123bb4; }
        .rp-links-row { display: flex; justify-content: center; align-items: center; gap: 2px; margin-top: 8px; }
        .rp-link-btn { background: none; border: none; color: #1746e0; font-size: 15px; cursor: pointer; text-decoration: underline; }
        .rp-link-btn:disabled { color: #aaa; cursor: not-allowed;}
        @media (max-width: 500px) { .rp-center-card { width: 98vw; padding: 18px 3vw 15px 3vw; } }
      `}</style>
    </div>
  );
}
