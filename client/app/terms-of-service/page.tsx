"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#010204] relative overflow-hidden flex justify-center items-center p-5 md:p-10">
      
      {/* === BACKGROUND GLOW ORBS === */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div 
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'rgba(33, 162, 255, 0.08)',
            filter: 'blur(120px)',
          }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'rgba(132, 86, 201, 0.12)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      <div className="max-w-[900px] w-full relative z-10">

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl">
          
          <div className="flex flex-col mb-12 border-b border-white/5 pb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
              Last Updated: February 2026
            </p>
          </div>

          <div className="flex flex-col gap-10">
            <section>
              <h2 className="text-blue-400 text-lg font-bold mb-4 tracking-tight">1. Acceptance of Terms</h2>
              <p className="text-[1rem] leading-relaxed text-slate-400 font-light">
                By accessing or using Warmly, you agree to use the platform in a lawful, respectful, and responsible manner. You are responsible for ensuring all contact data and introductions are handled with the explicit consent of the parties involved.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-4 tracking-tight">2. Billing & Subscription</h2>
              <div className="space-y-4 text-[1rem] leading-relaxed text-slate-400 font-light">
                <p>
                  <strong className="text-slate-200">Payment:</strong> By selecting a paid plan, you agree to pay Warmly the monthly or annual subscription fees indicated for that service. Payments will be charged on a pre-pay basis on the day you sign up and will cover the use of that service for a monthly or annual subscription period as indicated.
                </p>
                <p>
                  <strong className="text-slate-200">No Refunds:</strong> To maintain our infrastructure and AI service costs, all payments are non-refundable. There are no refunds or credits for partially used subscription periods, or for periods where your account was active but not utilized.
                </p>
                <p>
                  <strong className="text-slate-200">Automatic Renewal:</strong> Unless you notify Warmly before the end of the applicable subscription period that you want to cancel, your subscription will automatically renew and you authorize us to collect the then-applicable fee using any credit card or other payment mechanism we have on record for you.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-[1.1rem] font-bold mb-3">3. User Responsibilities</h2>
              <p className="text-[1rem] leading-relaxed text-slate-400 font-light">
                You are fully responsible for maintaining the security of your account. Warmly is a tool to streamline introductions; the "warmth" and success of those intros rely on your professional conduct and the accuracy of the data you provide.
              </p>
            </section>

            <section>
              <h2 className="text-white text-[1.1rem] font-bold mb-3">4. Service Limitations</h2>
              <p className="text-[1rem] leading-relaxed text-slate-400 font-light">
                We do not guarantee specific investment outcomes or response rates from investors. AI-generated drafts should be reviewed for accuracy before sending. We reserve the right to modify or discontinue features to improve the matching engine.
              </p>
            </section>

            <section>
              <h2 className="text-white text-[1.1rem] font-bold mb-3">5. Liability & Termination</h2>
              <p className="text-[1rem] leading-relaxed text-slate-400 font-light">
                Warmly is not liable for data loss, missed opportunities, or damages resulting from introduction friction. Failure to comply with these terms may result in immediate termination of your access to the platform without notice or refund.
              </p>
            </section>
            
            <section className="pt-8 border-t border-white/5">
              <h2 className="text-white text-[1.1rem] font-bold mb-3">6. Contact</h2>
              <p className="text-[1rem] leading-relaxed text-slate-400 font-light">
                For billing inquiries or legal questions, please reach us at: 
                <br />
                <span className="text-blue-500 font-medium cursor-pointer hover:text-blue-400 transition-colors">support@warmintro.ai</span>
              </p>
            </section>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-10">
          &copy; 2026 Warm Intro Assistant. All rights reserved.
        </p>
      </div>
    </div>
  );
}