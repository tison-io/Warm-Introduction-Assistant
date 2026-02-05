"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
// Using a relative path to avoid the '@' alias error
import { forgotPassword } from "../lib/founder-api"; 

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await forgotPassword(email);
      setMessage(data.message?.toLowerCase() || "a reset link has been sent to your email address.");
    } catch (err: any) {
      setError(err.message?.toLowerCase() || "unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 auth-page-container relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page-container {
          background-color: #070911;
          background-image: linear-gradient(135deg, #2A4D8F 0%, #0F2438 30%, #070910 70%, #070911 100%);
          background-attachment: fixed;
        }
      `}} />

      <div className="absolute top-8 left-8 z-50">
        <button onClick={() => router.push("/login")} className="flex items-center gap-2 text-white/40 hover:text-white transition-all group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back</span>
        </button>
      </div>

      <div
        className={`relative w-full max-w-[420px] rounded-none shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ background: "linear-gradient(to bottom, #101625 0%, #101625 50%, #273E75 100%)", backdropFilter: "blur(40px)" }}
      >
        <div className="px-10 py-12 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 text-center">
            <Image src="/logo.png" alt="Warmly" width={100} height={40} className="mb-6 opacity-90" />
            <h1 className="text-white text-3xl font-semibold tracking-tight">Forgot Password?</h1>
            <p className="text-slate-400 text-sm mt-1 lowercase">provide the email linked with your account to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                className="w-full h-11 px-4 rounded-[4px] bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {message && (
              <p className="text-green-400 text-xs text-center font-medium bg-green-400/5 py-2 border border-green-400/10 lowercase">
                {message}
              </p>
            )}
            
            {error && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-400/5 py-2 border border-red-400/10 lowercase">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 bg-[#0035C5] hover:bg-[#002db1] text-white font-bold rounded-none transition-all active:scale-[0.99] mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit"}
            </button>
          </form>
        </div>
        
        <div className="h-[5px] w-full" style={{ background: "linear-gradient(90deg, #2A4D8F 0%, #0F2438 50%, #070911 100%)" }} />
      </div>
    </div>
  );
}