'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { transformIntroApi, queueIntroApi } from '../lib/transform-api';
import { TransformIntroDto, QueueIntroDto } from '../types/transform';
import { useToast } from '../components/Toast';
import { startupSnapshot } from 'v8';

export default function GeneratedIntroPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const hasTriggeredRef = useRef(false);

    // Simplified State
    const [isApiLoading, setIsApiLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [displayedIntro, setDisplayedIntro] = useState('');

    const details = {
        startupId: searchParams.get('startupId') || '',
        startupName: searchParams.get('startupName') || '',
        startupBlurb: searchParams.get('startupBlurb') || '',
        investorId: searchParams.get('investorId') || '',
        investorName: searchParams.get('investorName') || '',
        investorEmail: searchParams.get('investorEmail') || '',
        founderId: searchParams.get('founderId') || '',
        format: searchParams.get('preferredIntroFormat') || '',
        prefText: searchParams.get('introPreferencesText') || '',
        workspaceId: searchParams.get('workspaceId') || '',
    };

    useEffect(() => {
        // Prevent double API calls in development mode
        if (hasTriggeredRef.current) return;

        const triggerTransform = async () => {
            if (!details.startupId) return;
            hasTriggeredRef.current = true;

            const dto: TransformIntroDto = {
                startup_id: details.startupId,
                startup_name: details.startupName,
                startup_pitch_link: '', 
                blurb: details.startupBlurb,
                investor_id: details.investorId,
                investor_name: details.investorName,
                investor_email: details.investorEmail,
                founder_id: details.founderId,
                investor_preference: details.format as any,
                intro_preferences_text: details.prefText,
            };

            try {
                const res = await transformIntroApi(dto);
                // Clean the text and display it immediately
                const cleanText = res.transformed_intro.replace(/\\n/g, '\n').trim();
                setDisplayedIntro(cleanText);
                setIsApiLoading(false);
            } catch (err: any) {
                showToast(`Failed: ${err.message}`, 'error');
                router.back();
            }
        };

        triggerTransform();
    }, []); // Empty dependency array because we use hasTriggeredRef

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayedIntro);
            setIsCopied(true);
            showToast('Copied to clipboard', 'success');
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
    };

    const handleSave = async () => {
        if (isApiLoading || isSaving) return;
        
        setIsSaving(true);
        try {
            await queueIntroApi({
                ...details,
                preferredIntroFormat: details.format,
                introPreferencesText: details.prefText,
                generatedIntro: displayedIntro,
                workspaceId: details.workspaceId || undefined 
            } as QueueIntroDto);
            showToast('Saved to queue!', 'success');

            if (details.workspaceId) {
                router.push(`/workspace/${details.workspaceId}/intro-queue`);
            } else {
                router.push('/intro-queue');
            }
        } catch (error: any) {
            showToast('Save failed', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0b1e] text-white pt-12 pb-12">
            <div className="max-w-6xl mx-auto px-6">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Startup
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    
                    {/* LEFT CONTAINER: Input Details (Scrollable) */}
                    <div className="bg-[#111327] border border-gray-800 rounded-2xl p-8 space-y-6 shadow-xl h-[450px] flex flex-col">
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                            <Sparkles className="w-5 h-5" />
                            <span>Input Details</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Investor Details</label>
                                <p className="text-lg font-medium text-white">{details.investorName}</p>
                                <p className="text-sm text-indigo-300">{details.investorEmail}</p>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Startup Details</label>
                                <p className='text-lg font-medium text-white mb-2'>{details.startupName}</p>
                                
                                <div className="text-gray-300 text-sm leading-relaxed bg-[#0a0b1e]/30 p-4 rounded-lg border border-gray-800/50 h-32 overflow-y-auto overflow-x-hidden custom-scrollbar whitespace-pre-wrap wrap-break-word">
                                    {details.startupBlurb}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTAINER: AI Preview */}
                    <div className="bg-[#111327] border border-gray-800 rounded-2xl p-8 h-[600px] flex flex-col shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                                <Sparkles className="w-5 h-5" />
                                <span>AI Preview</span>
                            </div>
                            
                            {!isApiLoading && (
                                <button 
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                                >
                                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            )}
                        </div>

                        <div className="flex-1 bg-[#0a0b1e]/50 border border-gray-800 rounded-xl relative overflow-hidden flex flex-col">
                            {isApiLoading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                                        <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                                    </div>
                                    <p className="text-gray-400">Connecting to AI engine...</p>
                                    <p className="text-xs text-gray-600 mt-2">Personalizing your intro email...</p>
                                </div>
                            ) : (
                                <textarea
                                    value={displayedIntro}
                                    onChange={(e) => setDisplayedIntro(e.target.value)}
                                    className="flex-1 w-full p-6 bg-transparent font-mono text-sm leading-relaxed text-gray-200 resize-none outline-none custom-scrollbar"
                                    placeholder="AI draft will appear here..."
                                />
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleSave}
                                disabled={isApiLoading || isSaving}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : ""}
                                {isApiLoading ? 'Drafting...' : 'Save to Queue'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}