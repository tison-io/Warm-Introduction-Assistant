"use client";

import React, { useEffect, useState } from 'react';
import { createCheckoutSession } from '../lib/payments-api';

const PricingPage = ({ founderId }: { founderId: string }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error('Failed to parse user from storage', e);
        }
    }
  }, []);

  const handlePurchase = async () => {
    if (!user?.id) {
        alert('Please login to continue');
        return;
    }

    setLoading(true);
    try {
      // 1. Get the URL from your NestJS backend
      const checkoutUrl = await createCheckoutSession(user.id);
      // 2. Redirect the browser to Stripe
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Payment Error:", err);
      alert(err.message || "An error occurred during checkout initialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
        className="min-h-screen text-white flex flex-col items-center justify-center p-6" 
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          Simple, Transparent <span className="text-purple-500">Pricing</span>
        </h1>
        <p className="text-gray-400 max-w-lg">
          From finding the right investors to closing the deal, Warmly has you covered.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Trial Card */}
        <div className="bg-[#111827]/50 border border-gray-800 rounded-3xl p-8 flex flex-col items-center hover:border-purple-500/50 transition-all">
          <h3 className="text-xl font-semibold mb-1">7-day Free trial</h3>
          <p className="text-gray-500 text-sm mb-6">Perfect for getting started</p>
          <div className="text-4xl font-bold mb-8">$0</div>
          
          <ul className="space-y-4 mb-12 w-full text-sm text-gray-300 text-left">
            <li>✅ 10 AI-generated intros/month</li>
            <li>✅ Basic investor database</li>
            <li>✅ Email templates</li>
            <li>✅ Community support</li>
          </ul>

          <button 
            type="button"
            onClick={() => window.location.href = '/signup'} // Or your signup flow
            className="w-full py-3 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* The Paid One */}
        <div className="relative bg-[#111827]/50 border-2 border-purple-600/30 rounded-3xl p-8 flex flex-col items-center shadow-[0_0_40px_rgba(88,28,135,0.2)]">
          <div className="absolute -top-3 px-4 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
            Pro
          </div>
          <p className="text-gray-500 text-sm mb-1 mt-2">For Serious founders</p>
          <div className="text-4xl font-bold mb-8">$49</div>
          
          <ul className="space-y-4 mb-12 w-full text-sm text-gray-300 text-left">
            <li>✅ Unlimited AI-generated intros</li>
            <li>✅ Full investor database</li>
            <li>✅ Advanced Personalization</li>
            <li>✅ CRM & Kanban board</li>
            <li>✅ Analytics dashboard</li>
          </ul>

          <button 
            disabled={loading}
            onClick={handlePurchase}
            className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Purchase'}
          </button>
        </div>
      </div>

      <p className="mt-12 text-gray-500 text-sm">
        All plans include a 7-day free trial • No credit card required
      </p>
    </div>
  );
};

export default PricingPage;