'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import StartupForm from "../../components/startups/StartupForm";
import { createStartup } from "../../lib/startup-api";
import { CreateStartupDto } from "../../types/startup";
import { useToast } from "../../components/Toast";
import { Check } from "lucide-react";

function SuccessModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#11141b] border border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Submission Received!</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Thanks for filling the form. Your startup profile has been sent to the community owner for review.
                </p>
                <button 
                    onClick={onClose}
                    className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}

export default function NewStartupPage() {
    const params = useParams();
    const founderId = params.founderId as string;
    const { showToast } = useToast();
    const [showSuccess, setShowSuccess] = useState(false);

    async function handleSubmit(data: CreateStartupDto) {
        try {
            await createStartup(data);
            setShowSuccess(true);
        } catch (err: any) {
            showToast(err.message || "Failed to submit form", "error");
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0e14] pt-16 pb-20 px-4">
            {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
            
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Submit Your Startup
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg">
                        Provide your details below to get started.
                    </p>
                </div>

                <div className="bg-[#11141b] p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-800">
                    <StartupForm 
                        founderId={founderId} 
                        submitLabel="Submit Request" 
                        onSubmit={handleSubmit} 
                    />
                </div>
            </div>
        </div>
    );
}