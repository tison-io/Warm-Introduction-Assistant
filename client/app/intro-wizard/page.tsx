'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, Search, X, Copy, Check, Tag, ChevronLeft, ChevronRight, ArrowRight, Filter, UserPlus } from 'lucide-react';

import StartupCard from '@/app/components/startups/StartupCard';
import InvestorForm from '@/app/components/investors/InvestorForm';
import TransformStep from '../components/intros/TransformStep';
import InvestorCard from '../components/investors/investorCard';

import { getMyRequests, getStartupById } from '@/app/lib/startup-api';
import { getInvestors, createInvestor } from '@/app/lib/investor-api';
import { Startup, VALID_TAGS } from '@/app/types/startup';
import { Investor } from '@/app/types/investor';
import { useToast } from '../components/Toast';

export default function NewIntroWizardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
            </div>
        }>
            <IntroWizardContent />
        </Suspense>
    );
}

function IntroWizardContent() {
    const router = useRouter();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const startupIdFromUrl = searchParams.get('startupId');

    const [currentStep, setCurrentStep] = useState(0);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [wizardData, setWizardData] = useState<{ startup: Startup | null; investor: Investor | null }>({
        startup: null,
        investor: null,
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [startups, setStartups] = useState<Startup[]>([]);
    const [investors, setInvestors] = useState<Investor[]>([]);
    
    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterTag, setFilterTag] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const PAGE_LIMIT = 4; 

    const [shareUrl, setShareUrl] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const autoLoadStartup = async () => {
            if (startupIdFromUrl) {
                setIsLoading(true);
                try {
                    let targetStartup = startups.find(s => s._id === startupIdFromUrl);
                    if (!targetStartup) {
                        targetStartup = await getStartupById(startupIdFromUrl);
                    }

                    if (targetStartup) {
                        setWizardData(prev => ({ ...prev, startup: targetStartup }));
                        setCurrentStep(1);
                        showToast(`Selected: ${targetStartup.name}`, 'success');
                    }
                } catch (error) {
                    console.error("Failed to auto-load startup:", error);
                    showToast("Could not load the requested startup.", "error");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        autoLoadStartup();
    }, [startupIdFromUrl]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch Founders (Step 0)
    const fetchStartups = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMyRequests(currentPage, PAGE_LIMIT, debouncedSearch);
            setStartups(data.startups);
            setTotalPages(data.meta.lastPage || 1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    // Fetch Investors (Step 1) - Modified to ignore tag in API call for frontend filtering
    const fetchInvestorsData = useCallback(async () => {
        setIsLoading(true);
        try {
            // We fetch based on search but handle tags locally for instant responsiveness
            const data = await getInvestors(debouncedSearch, undefined, currentPage, PAGE_LIMIT);
            setInvestors(data.investors);
            setTotalPages(data.meta.lastPage || 1);
        } catch (error) {
            showToast('Failed to load investors.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, showToast]);

    // --- FRONTEND FILTERING LOGIC ---
    const filteredInvestors = useMemo(() => {
        if (!filterTag) return investors;
        return investors.filter(inv => 
            inv.tags?.some(tag => tag.toLowerCase() === filterTag.toLowerCase())
        );
    }, [investors, filterTag]);

    useEffect(() => {
        if (currentStep === 0) fetchStartups();
        if (currentStep === 1 && !showCreateForm) fetchInvestorsData();
    }, [currentStep, fetchStartups, fetchInvestorsData, showCreateForm]);

    // Handle New Investor Creation
    const handleCreateInvestor = async (data: any) => {
        setIsLoading(true);
        try {
            const newInvestor = await createInvestor(data);
            showToast('Investor created successfully!', 'success');
            setWizardData(prev => ({ ...prev, investor: newInvestor }));
            setShowCreateForm(false);
            setCurrentStep(2); // Auto-advance to transform
        } catch (error) {
            showToast('Failed to create investor.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            const baseUrl = window.location.origin;
            setShareUrl(`${baseUrl}/submit/${user.id}`);
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center space-x-2 text-gray-500 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
                        Create New <span className="text-blue-500">Introduction</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                        A seamless <span className="text-white font-medium">3-step process</span> to connect the right founders with the right investors.
                    </p>
                </div>

                <div className="bg-[#0f1219] rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden flex flex-col min-h-[750px]">
                    
                    {/* Dark Tabs */}
                    <div className="flex border-b border-gray-800 bg-[#11141b]">
                        {['Founders', 'Investors', 'Transform'].map((name, i) => (
                            <div 
                                key={name}
                                className={`flex-1 py-5 text-center text-xs font-bold tracking-[0.2em] uppercase transition-all
                                    ${currentStep === i ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-600'}
                                `}
                            >
                                {name}
                            </div>
                        ))}
                    </div>

                    <div className="p-8 grow flex flex-col">
                        
                        {/* --- STEP 1: FOUNDERS --- */}
                        {currentStep === 0 && (
                            <div className="flex flex-col h-full space-y-6">
                                <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Tag className="text-blue-400 w-5 h-5" />
                                        </div>
                                        <p className="text-sm text-blue-100/70">Share this link with founders to get their startup details</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5 w-full md:w-auto">
                                        <code className="text-blue-400 px-3 text-xs font-mono">{shareUrl ? '...'+shareUrl.slice(-20) : "Loading..."}</code>
                                        <button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs">
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input 
                                        type="text"
                                        placeholder="Search by founder or startup name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                                    />
                                </div>

                                <div className="grow space-y-3">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
                                    ) : startups.length > 0 ? (
                                        startups.map(s => (
                                            <div 
                                                key={s._id} 
                                                onClick={() => setWizardData(prev => ({ ...prev, startup: s }))}
                                                className={`transition-all rounded-2xl cursor-pointer ${wizardData.startup?._id === s._id ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : ''}`}
                                            >
                                                <StartupCard startup={s} isSelectable={true} compact={true} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 opacity-40 italic text-gray-400">No founder requests found.</div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-2">
                                        <button disabled={currentPage === 1 || isLoading} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 disabled:opacity-20 hover:text-white"><ChevronLeft size={18}/></button>
                                        <span className="text-xs text-gray-500 font-mono">Page {currentPage} of {totalPages}</span>
                                        <button disabled={currentPage === totalPages || isLoading} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 disabled:opacity-20 hover:text-white"><ChevronRight size={18}/></button>
                                    </div>
                                    <button disabled={!wizardData.startup} onClick={() => { setCurrentStep(1); setSearchTerm(""); }} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-bold py-3.5 px-10 rounded-xl transition-all flex items-center justify-center gap-2">
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 2: INVESTORS --- */}
                        {currentStep === 1 && (
                            <div className="flex flex-col h-full space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">Target Investor</h2>
                                    <button 
                                        onClick={() => setShowCreateForm(!showCreateForm)}
                                        className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        {showCreateForm ? <><ArrowLeft size={16}/> Back to List</> : <><UserPlus size={16}/> Add New Investor</>}
                                    </button>
                                </div>

                                {!showCreateForm ? (
                                    <>
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <div className="relative grow">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                                <input 
                                                    type="text"
                                                    placeholder="Search by name..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                <select 
                                                    value={filterTag}
                                                    onChange={(e) => setFilterTag(e.target.value)} // Now just updates state, no page reset needed for local filter
                                                    className="bg-slate-900 border border-white/10 rounded-xl py-3.5 pl-10 pr-10 text-white text-sm focus:ring-2 focus:ring-blue-500/40 outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="">All Sectors</option>
                                                    {VALID_TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grow space-y-3"> 
                                            {isLoading ? (
                                                <div className="flex flex-col items-center justify-center py-20">
                                                    <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                                                </div>
                                            ) : filteredInvestors.length > 0 ? (
                                                filteredInvestors.map(inv => (
                                                    <div 
                                                        key={inv._id} 
                                                        onClick={() => setWizardData(p => ({...p, investor: inv}))}
                                                        className={`transition-all rounded-2xl cursor-pointer ${
                                                            wizardData.investor?._id === inv._id 
                                                            ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                                                            : ''
                                                        }`}
                                                    >
                                                        {/* Ensure compact prop is passed if you want the exact same height as founders */}
                                                        <InvestorCard investor={inv} isSelected={wizardData.investor?._id === inv._id} />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-20 opacity-40 italic text-gray-400">
                                                    No investors matching your criteria.
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <button disabled={currentPage === 1 || isLoading} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 disabled:opacity-20 hover:text-white"><ChevronLeft size={18}/></button>
                                                <span className="text-xs text-gray-500 font-mono">Page {currentPage} of {totalPages}</span>
                                                <button disabled={currentPage === totalPages || isLoading} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 disabled:opacity-20 hover:text-white"><ChevronRight size={18}/></button>
                                            </div>
                                            <div className="flex gap-4">
                                                {/* Back button added here to return to step 0 */}
                                                <button 
                                                    onClick={() => { setCurrentStep(0); setSearchTerm(""); }} 
                                                    className="px-6 py-3 text-gray-400 hover:text-white font-bold transition-colors"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    disabled={!wizardData.investor}
                                                    onClick={() => setCurrentStep(2)}
                                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-bold py-3.5 px-10 rounded-xl transition-all flex items-center gap-2"
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 h-full overflow-y-auto pr-2">
                                        <InvestorForm 
                                            isEdit={false}
                                            onSubmit={handleCreateInvestor}
                                            submitLabel="Register & Select Investor"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- STEP 3: TRANSFORM --- */}
                        {currentStep === 2 && wizardData.startup && wizardData.investor && (
                            <TransformStep 
                                startup={wizardData.startup} 
                                investor={wizardData.investor}
                                onBack={() => setCurrentStep(1)}
                                onSuccess={(q) => router.push(`/transform?${q}`)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}