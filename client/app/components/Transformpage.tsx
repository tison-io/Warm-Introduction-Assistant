'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Copy, Check, Loader2, Sparkles, User, Mail, Tag, Link as LinkIcon, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { transformIntroApi, queueIntroApi } from '../lib/transform-api';
import { TransformIntroDto, QueueIntroDto } from '../types/transform';
import { useToast } from '../components/Toast';

export default function GeneratedIntroPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const hasTriggeredRef = useRef(false);

    const [isApiLoading, setIsApiLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [displayedIntro, setDisplayedIntro] = useState('');
    const [error, setError] = useState<string | null>(null);

    const details = {
        startupId: searchParams.get('startupId') || '',
        startupName: searchParams.get('startupName') || '',
        startupBlurb: searchParams.get('startupBlurb') || '',
        startupTags: searchParams.get('startupTags') || '',
        pitchLink: searchParams.get('pitchLink') || '',
        founderId: searchParams.get('founderId') || '',
        founderName: searchParams.get('founderName') || '',
        founderEmail: searchParams.get('founderEmail') || '',
        investorId: searchParams.get('investorId') || '',
        investorName: searchParams.get('investorName') || '',
        investorEmail: searchParams.get('investorEmail') || '',
        investorTags: searchParams.get('investorTags') || '',
        format: searchParams.get('preferredIntroFormat') || '',
        prefText: searchParams.get('introPreferencesText') || '',
        workspaceId: searchParams.get('workspaceId') || '',
    };

    useEffect(() => {
        if (hasTriggeredRef.current) return;

        const triggerTransform = async () => {
            if (!details.startupId) return;
            hasTriggeredRef.current = true;

            const dto: TransformIntroDto = {
                startup_id: details.startupId,
                startup_name: details.startupName,
                startup_pitch_link: details.pitchLink, 
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
                const cleanText = res.transformed_intro.replace(/\\n/g, '\n').trim();
                setDisplayedIntro(cleanText);
                setIsApiLoading(false);
            } catch (err: any) {
                setError("Our transformation engine is temporarily unavailable. Please try again later.");
                setIsApiLoading(false);
            }
        };

        triggerTransform();
    }, []);

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
            router.push(details.workspaceId ? `/workspace/${details.workspaceId}/intro-queue` : '/intro-queue');
        } catch (error: any) {
            showToast('Save failed', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='relative min-h-screen'>
            <div className="min-h-screen bg-[#0a0b1e] text-white pt-12 pb-12">
                <div className="max-w-6xl mx-auto px-6">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Review
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        
                        {/* LEFT CONTAINER: Input Details */}
                        <div className="bg-[#111327] border border-gray-800 rounded-2xl p-8 space-y-6 shadow-xl h-[600px] flex flex-col">
                            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                                <Sparkles className="w-5 h-5" />
                                <span>Match Context</span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                {/* Founder & Startup Header */}
                                <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">From: {details.founderName}</label>
                                    <p className="text-lg font-bold text-white leading-tight">{details.startupName}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {details.startupTags.split(',').map((tag, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 uppercase">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Investor Target */}
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-2">Recipient</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                            <User className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{details.investorName}</p>
                                            <p className="text-xs text-gray-400">{details.investorEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pitch Link */}
                                {details.pitchLink && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-1">Attached Deck</label>
                                        <div className="flex items-center gap-2 text-indigo-400 text-sm italic underline truncate">
                                            <LinkIcon size={14} /> {details.pitchLink}
                                        </div>
                                    </div>
                                )}

                                {/* Startup Blurb */}
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-2">Reference Blurb</label>
                                    <div className="text-gray-400 text-xs leading-relaxed bg-[#0a0b1e]/30 p-4 rounded-lg border border-gray-800/50 italic">
                                        "{details.startupBlurb}"
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTAINER: AI Preview */}
                        <div className="bg-[#111327] border border-gray-800 rounded-2xl p-8 h-[600px] flex flex-col shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                                    <Sparkles className="w-5 h-5" />
                                    <span>AI Generated Draft</span>
                                </div>
                                
                                {!isApiLoading && (
                                    <button onClick={handleCopy} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                                        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 bg-[#0a0b1e]/50 border border-gray-800 rounded-xl relative overflow-hidden flex flex-col">
                                {isApiLoading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                        <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30">
                                            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                                        </div>
                                        <p className="text-gray-300 font-medium">Drafting customized intro...</p>
                                        <p className="text-xs text-gray-500 mt-2 max-w-[200px]">Our AI is aligning your blurb with {details.investorName}'s preferences.</p>
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
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/10"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    {isApiLoading ? 'Processing...' : 'Save & Close'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md transition-opacity">
                    <div className="max-w-md w-full bg-gray-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Glow effect */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="bg-indigo-500/10 p-4 rounded-2xl mb-6">
                                <ShieldAlert size={40} className="text-indigo-500" />
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">Engine Unavailable</h1>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                {error}
                            </p>

                            <div className="w-full space-y-3">
                                <button 
                                    onClick={() => router.push(details.workspaceId ? `/workspace/${details.workspaceId}` : '/dashboard')}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    <LayoutDashboard size={18} />
                                    Return to Dashboard
                                </button>

                                <button 
                                    onClick={() => window.location.reload()}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 transition-all"
                                >
                                    Try Again
                                </button>
                                
                                <button 
                                    onClick={() => router.back()}
                                    className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 text-slate-500 hover:text-white transition-colors mt-4 text-sm"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}