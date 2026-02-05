"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { resetPassword } from "../lib/founder-api"; 

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("invalid or missing reset token.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message?.toLowerCase() || "network error. please try again.");
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

      {/* Back Button */}
      {!isSuccess && (
        <div className="absolute top-8 left-8 z-50">
          <button onClick={() => router.push("/login")} className="flex items-center gap-2 text-white/40 hover:text-white transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium uppercase tracking-widest">Back</span>
          </button>
        </div>
      )}

      {/* THE BOX CONTAINER */}
      <div
        className={`relative w-full max-w-[420px] rounded-none shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ background: "linear-gradient(to bottom, #101625 0%, #101625 50%, #273E75 100%)", backdropFilter: "blur(40px)" }}
      >
        <div className="px-10 py-12 flex flex-col items-center">
          
          {isSuccess ? (
            /* SUCCESS STATE INSIDE BOX */
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 w-full">
              <CheckCircle2 className="w-16 h-16 text-[#22C55E] mb-6" fill="#22C55E" stroke="white" strokeWidth={1} />
              <h1 className="text-white text-2xl font-semibold tracking-tight mb-8 text-center">
                Password changed successfully.
              </h1>
              <button 
                onClick={() => router.push("/login")} 
                className="w-full h-12 bg-[#0035C5] hover:bg-[#002db1] text-white font-bold rounded-none transition-all"
              >
                Proceed to Log in
              </button>
            </div>
          ) : (
            /* FORM STATE INSIDE BOX */
            <>
              <div className="flex flex-col items-center mb-8 text-center">
                <Image src="/logo.png" alt="Warmly" width={100} height={40} className="mb-6 opacity-90" />
                <h1 className="text-white text-3xl font-semibold tracking-tight">Reset Password</h1>
                <p className="text-slate-400 text-sm mt-1 lowercase">enter your new password below</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-11 px-4 rounded-[4px] bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full h-11 px-4 rounded-[4px] bg-white text-slate-900 outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

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
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
        
        {/* Bottom Accent Line */}
        <div className="h-[5px] w-full" style={{ background: "linear-gradient(90deg, #2A4D8F 0%, #0F2438 50%, #070911 100%)" }} />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#070911]"><Loader2 className="w-10 h-10 animate-spin text-white/20" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}