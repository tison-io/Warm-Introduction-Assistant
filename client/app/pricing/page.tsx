"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '../lib/payments-api';
import { getFounderProfile } from '../lib/founder-api';
import { CheckCircle2, Rocket, ShieldCheck, Zap } from 'lucide-react';

const PricingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserId(parsed.id);
        }

        const profile = await getFounderProfile();
        setUserTier(profile.tier || "trial");
      } catch (e) {
        console.error('Failed to fetch user status', e);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTrialButtonClick = () => {
    if (userTier === 'trial') {
      router.back();
    } else {
      window.location.href = '/signup';
    }
  };

  const handlePurchase = async () => {
    if (!userId) {
      alert('Please login to continue');
      return;
    }

    setLoading(true);
    try {
      const checkoutUrl = await createCheckoutSession(userId);
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Payment Error:", err);
      alert(err.message || "An error occurred during checkout initialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-slate-800 to-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Simple, Transparent <span className="text-blue-500">Pricing</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-lg">
          Reduce time spent on manually managing the intros with Warmly App.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full relative z-10">
        
        {/* Trial Card */}
        <div className="bg-gray-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-blue-500/30 transition-all duration-300 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600/10 transition-colors">
              <Zap size={24} className="text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">7-day Free Trial</h3>
                {userTier === 'trial' && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">Current Plan</span>
                )}
              </div>
              <p className="text-slate-500 text-sm">Perfect for getting started</p>
            </div>
          </div>
          
          <div className="flex items-baseline gap-1 my-8">
            <span className="text-5xl font-black">$0</span>
          </div>
          
          <ul className="space-y-4 mb-12 grow">
            <FeatureItem text="AI intro templates" />
            <FeatureItem text="Automated mails" />
            <FeatureItem text="Community support" />
            <FeatureItem text="Basic Analytics" muted />
          </ul>

          <button 
            type="button"
            disabled={userTier === 'lifetime'} 
            onClick={handleTrialButtonClick}
            className="w-full py-4 bg-slate-800 border border-slate-700 rounded-2xl font-bold hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {userTier === 'lifetime' 
              ? 'Already on Lifetime' 
              : userTier === 'trial' 
                ? 'Continue Using' 
                : 'Get Started'}
          </button>
        </div>

        {/* The Paid One */}
        <div className="relative bg-gray-900 border-2 border-blue-600 rounded-3xl p-8 flex flex-col shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-2xl">
            Recommended
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600/10 rounded-lg">
              <Rocket size={24} className="text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Lifetime Access</h3>
                {userTier === 'lifetime' && (
                  <span className="text-[10px] bg-blue-400 text-white px-2 py-0.5 rounded-full border border-blue-600">Current Plan</span>
                )}
              </div>
              <p className="text-slate-500 text-sm">Full access for community owners</p>
            </div>
          </div>
          
          <div className="flex items-baseline gap-1 my-8">
            <span className="text-5xl font-black text-white">$49</span>
          </div>
          
          <ul className="space-y-4 mb-12 grow">
            <FeatureItem text="Unlimited AI-generated intros" highlight />
            <FeatureItem text="Automated Mails" highlight />
            <FeatureItem text="Smart Follow-up reminders" highlight />
            <FeatureItem text="Priority community support" highlight />
            <FeatureItem text="Outcome logs" highlight />
          </ul>

          <button 
            disabled={loading || userTier === 'lifetime'}
            onClick={handlePurchase}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-slate-800 disabled:border-slate-700 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : userTier === 'lifetime' ? (
              "Already on lifetime plan"
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>Purchase</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <p className="mt-12 text-slate-500 text-sm">
        Secure payment processing via Stripe. Cancel anytime.
      </p>
    </div>
  );
};

function FeatureItem({ text, highlight = false, muted = false }: { text: string; highlight?: boolean; muted?: boolean }) {
  return (
    <li className={`flex items-start gap-3 text-sm ${muted ? 'opacity-40' : 'opacity-100'}`}>
      <CheckCircle2 
        size={18} 
        className={`shrink-0 mt-0.5 ${highlight ? 'text-blue-500' : 'text-slate-600'}`} 
      />
      <span className={highlight ? 'text-slate-200' : 'text-slate-400'}>{text}</span>
    </li>
  );
}

export default PricingPage;