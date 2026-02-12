'use client';

import { ArrowLeft, ExternalLink, User, Rocket, Mail } from 'lucide-react';
import { IntroFormat } from '@/app/types/transform';
import { Startup } from '@/app/types/startup';
import { Investor } from '@/app/types/investor';
import { getFounderId } from '@/app/lib/auth-utils';

interface TransformStepProps {
    startup: Startup;
    investor: Investor;
    onSuccess: (query: string) => void;
    onBack: () => void;
}

export default function TransformStep({ startup, investor, onSuccess, onBack }: TransformStepProps) {
    
    const handleProceedToGenerator = () => {
        if (!investor.email) {
            alert('Error: This investor does not have an email address assigned.');
            return;
        }

        const founderId = getFounderId();
        if (!founderId) {
            alert('Authentication error: Please log in again.');
            return;
        }

        // Bundling ALL data including tags for the AI Writer page
        const query = new URLSearchParams({
            // IDs
            startupId: startup._id,
            investorId: investor._id,
            founderId: founderId,
            
            // Startup Context
            startupName: startup.name,
            startupBlurb: startup.blurb,
            pitchLink: startup.pitchLink || '',
            founderName: startup.founderName || '',
            founderEmail: startup.founderEmail || '',
            startupTags: (startup.tags || []).join(','),
            
            // Investor Context
            investorName: investor.name,
            investorEmail: investor.email,
            preferredIntroFormat: (investor.preferred_intro_format || 'email') as IntroFormat,
            investorTags: (investor.tags || []).join(','),
            introPreferencesText: investor.intro_preferences_text || '', 
        }).toString();

        onSuccess(query);
    };

    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <header>
                <h2 className="text-xl font-bold text-white">
                    Review both profiles before heading to the AI Writer
                </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Startup Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 flex flex-col">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider">
                        <Rocket size={16} />
                        <span>Startup Profile</span>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">Startup Details</label>
                            <p className="text-white font-semibold text-lg">{startup.name}</p>
                        </div>

                        {/* Startup Tags */}
                        <div>
                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">Startup Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {startup.tags && startup.tags.length > 0 ? (
                                    startup.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-[11px] font-medium uppercase">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-600 text-xs italic">No tags assigned</span>
                                )}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-white/5">
                            <label className="text-[10px] tracking-widest text-gray-400 block mb-2 uppercase font-bold opacity-70">Founder Details</label>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-blue-400" />
                                    <p className="text-sm text-gray-200">{startup.founderName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-blue-400" />
                                    <p className="text-sm text-gray-200 truncate">{startup.founderEmail}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">Pitch Deck</label>
                            {startup.pitchLink ? (
                                <a 
                                href={startup.pitchLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1.5 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors cursor-pointer no-underline"
                                >
                                View Pitch Link <ExternalLink size={14} />
                                </a>
                            ) : (
                                <p className="text-gray-600 text-sm italic">No Pitch link provided</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Investor Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 flex flex-col">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider">
                        <User size={16} />
                        <span>Investor Profile</span>
                    </div>
                    
                    <div className="space-y-4">
                        <div className='flex'>
                            <div className="w-48">
                                <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">Name</label>
                                <p className="text-white font-semibold text-[16px]">{investor.name}</p>
                            </div>
                            <div>
                                <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">Email</label>
                                <p className="text-white font-semibold text-[16px] truncate">{investor.email}</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">Investor Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {investor.tags && investor.tags.length > 0 ? (
                                    investor.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-md text-[11px] font-medium uppercase">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-600 text-xs italic">No focus tags listed</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">Intro Style</label>
                            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded text-[11px] font-bold">
                                {investor.preferred_intro_format?.toUpperCase() || 'EMAIL'}
                            </span>
                        </div>

                        {investor.intro_preferences_text && (
                        <div>
                            <label className="text-[10px] tracking-widest text-gray-400 block mb-1 uppercase font-bold opacity-70">
                            Intro Preference
                            </label>
                            <p className="text-gray-300 text-sm italic border-l-2 border-white/10 pl-3 line-clamp-3">
                            {investor.intro_preferences_text}
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 mt-auto">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white font-bold transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    Back
                </button>
                
                <button
                    onClick={handleProceedToGenerator}
                    className="w-full md:w-auto bg-blue-600 hover:opacity-95 text-white font-bold py-4 px-12 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <span>Generate Intro Draft</span>
                </button>
            </div>
        </div>
    );
}