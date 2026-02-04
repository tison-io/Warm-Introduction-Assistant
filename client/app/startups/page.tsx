'use client';

import { useEffect, useState } from "react";
import { getMyRequests } from "../lib/startup-api";
import { Startup } from "../types/startup";
import StartupCard from "../components/startups/StartupCard";
import { Loader2, Tag, Copy, Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export default function FounderRequestsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchStartups = async () => {
            setIsLoading(true);
            try {
                const data = await getMyRequests(currentPage, 5, debouncedSearch);
                setStartups(data.startups);
                setTotalPages(data.meta.lastPage);
                setTotalCount(data.meta.total);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStartups();
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const baseUrl = process.env.NEXT_PUBLIC_DEPLOYED_URL || 'http://localhost:3000';
                setShareUrl(`${baseUrl}/submit/${user.id}`);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-900 via-slate-800 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Founder Requests</h1>
                        <p className="text-blue-200/60 mt-1">Review new startups looking for introductions</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">Send this to founders to submit their details</label>
                        <div className="flex items-center gap-2 bg-black/40 border border-blue-500/30 p-1.5 rounded-xl backdrop-blur-md">
                            <code className="text-blue-100 px-3 text-sm truncate max-w-[200px]">
                                {shareUrl || "Loading..."}
                            </code>
                            <button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50 w-5 h-5" />
                        <input 
                            type="text"
                            placeholder="Search by startup name or founder..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    <div className="whitespace-nowrap bg-blue-500/10 text-blue-400 border border-blue-500/20 px-6 py-4 rounded-2xl text-sm font-bold shadow-sm h-full">
                        {totalCount} Requests
                    </div>
                </div>

                {/* Main List */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-5"> 
                            {startups.map((s) => (
                                <StartupCard key={s._id} startup={s} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <div className="flex items-center gap-2 px-2">
                                    <span className="text-gray-400 text-sm">
                                        Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!isLoading && startups.length === 0 && (
                    <div className="text-center py-24 bg-gray-900 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <Tag className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">
                            {debouncedSearch ? `No results found for "${debouncedSearch}"` : "No pending requests at the moment."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}