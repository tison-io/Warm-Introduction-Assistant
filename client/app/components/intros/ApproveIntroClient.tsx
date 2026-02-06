'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { approveIntro } from "../../lib/intro-api";
import { CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import Link from "next/link";

export default function ApproveIntroClient() {
  const searchParams = useSearchParams();
  const introId = searchParams.get("introId");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your approval...");
  const [subMessage, setSubMessage] = useState("Please wait while we update the introduction status.");

  useEffect(() => {
    async function run() {
      if (!introId || !email) {
        setStatus("error");
        setMessage("Invalid Link");
        setSubMessage("This approval link appears to be broken or incomplete.");
        return;
      }

      try {
        const result = await approveIntro(introId, email);
        
        setStatus("success");
        if (result.intro.status === 'sent') {
          setMessage("Introduction Sent!");
          setSubMessage("Both parties have approved. The formal introduction email has been delivered to your inboxes.");
        } else {
          setMessage("Approval Recorded!");
          setSubMessage("Thank you! We're now waiting for the other party to confirm their interest.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage("Approval Failed");
        setSubMessage(err.message || "We couldn't process this request. The link may have expired.");
      }
    }

    run();
  }, [introId, email]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-slate-800 to-gray-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gray-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center group transition-all duration-500 hover:border-blue-500/30">
          <div className="flex justify-center mb-6">
            {status === "loading" && (
              <div className="p-4 bg-blue-600/10 rounded-2xl">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="p-4 bg-green-500/10 rounded-2xl animate-bounce">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
            )}
            {status === "error" && (
              <div className="p-4 bg-red-500/10 rounded-2xl">
                <AlertCircle size={40} className="text-red-500" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-3 tracking-tight">
            {message}
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {subMessage}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === "success" && (
              <button 
                onClick={() => window.close()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Done
              </button>
            )}
            
            {status === "error" && (
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-800 border border-slate-700 rounded-2xl font-bold hover:bg-slate-700 transition-all text-slate-300"
              >
                Retry Approval
              </button>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50 flex items-center justify-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-semibold">
            <ShieldCheck size={14} />
            Verified by Warmly Intro Assistant
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-sm">
          Want to automate your own community intros?<Link href="/" className="text-blue-500 cursor-pointer hover:underline">Learn More</Link>
        </p>
      </div>
    </div>
  );
}