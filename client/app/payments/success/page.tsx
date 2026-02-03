'use client';

import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white p-4">
            <div className="bg-[#1e1b4b] p-8 rounded-2xl shadow-xl text-center max-w-md border border-purple-500/30">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold mb-2">Payment Received!</h1>
                <p className="text-gray-400 mb-8">
                Welcome to the family! You now have lifetime access to all App features.
                </p>
                <button 
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                Go to Dashboard
                </button>
            </div>
        </div>
    )
}