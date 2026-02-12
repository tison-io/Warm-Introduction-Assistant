"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { initiateGoogleLogin, signupFounder } from "../lib/founder-api";
import { useToast } from "../components/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const phoneRegex = /^\+\d{7,15}$/;
  
    if (!phoneRegex.test(form.phone)) {
      showToast("Your phone no has invalid details", "error");
      return;
    }

    if (form.password.length < 8) {
      showToast("password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);

    if (form.password.length < 8) {
      showToast("password must be at least 8 characters", "error");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast("passwords do not match", "error");
      setLoading(false);
      return;
    }

    try {
      const result = await signupFounder({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      showToast(`account created for ${result.name}`, "success");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      showToast(err.message || "signup failed", "error");
    } finally {
      setLoading(false);
    }
  }

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
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-white/40 hover:text-white transition-all group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back</span>
        </button>
      </div>

      <div
        className={`relative w-full max-w-[420px] rounded-none shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ 
          background: "linear-gradient(to bottom, #101625 0%, #101625 100%)",
        }}
      >
        <div className="px-10 py-12 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 text-center">
            <Image src="/logo.png" alt="Warmly" width={100} height={40} className="mb-6 opacity-90" />
            <h1 className="text-white text-3xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1 lowercase">start your 7-day free trial today</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                className="w-full h-11 px-4 rounded-sm bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                value={form.name}
                placeholder="john doe"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                className="w-full h-11 px-4 rounded-sm bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                value={form.email}
                placeholder="email@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">
                Phone Number - with country code
              </label>
              <input
                type="tel"
                className="w-full h-11 px-4 rounded-sm bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400 text-sm"
                value={form.phone}
                placeholder="+254 712 345 678"
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, "") })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Create Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full h-11 px-4 rounded-sm bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                  value={form.password}
                  placeholder="••••••••"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 lowercase ml-1">must be atleast 8 characters</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConf ? "text" : "password"}
                  className="w-full h-11 px-4 rounded-sm bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                  value={form.confirmPassword}
                  placeholder="••••••••"
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowConf(!showConf)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConf ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0035C5] hover:bg-[#002db1] text-white font-bold rounded-none transition-all active:scale-[0.99] mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign Up"}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter whitespace-nowrap">or continue with</span>
              <div className="flex-1 hpx bg-white/10" />
            </div>
            
            <button
              type="button"
              onClick={() => initiateGoogleLogin()}
              className="w-full h-12 rounded-none flex items-center gap-3 justify-center text-sm font-bold text-blue-400 border border-white/10 bg-[#070911]/50 hover:bg-black/80 transition-colors"
            >
              <Image src="/google.svg" width={18} height={18} alt="Google" />
              Sign in with Google
            </button>

            <p className="text-center text-[13px] text-slate-400 pt-2">
              Already have an account? <Link href="/login" className="text-blue-400 hover:underline font-medium ml-1">Log In</Link>
            </p>
          </form>
        </div>
        <div className="h-[5px] w-full" style={{ background: "linear-gradient(90deg, #2A4D8F 0%, #0F2438 50%, #070911 100%)" }} />
      </div>
    </div>
  );
}