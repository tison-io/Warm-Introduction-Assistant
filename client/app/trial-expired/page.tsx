'use client';

import Link from 'next/link';
import { ShieldAlert, CreditCard, Mail, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TrialExpiredPage() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-900 via-slate-800 to-gray-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="bg-blue-500/10 p-4 rounded-2xl mb-6">
                        <ShieldAlert size={40} className="text-blue-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Trial Expired</h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Your 7-day access has ended. To continue using the Warmly introduction assistant, please choose a plan.
                    </p>

                    <div className="w-full space-y-3">
                        <Link 
                            href="/pricing" 
                            className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                        >
                            <CreditCard size={18} />
                            See Pricing
                        </Link>

                        <Link 
                            href="mailto:support@warmly.com" 
                            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 transition-all"
                        >
                            <Mail size={18} />
                            Contact Support
                        </Link>
                        
                        <button 
                            onClick={handleLogout}
                            className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 text-slate-500 hover:text-white transition-colors mt-4"
                        >
                            <LogOut size={14} />
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}