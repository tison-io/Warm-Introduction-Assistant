'use client';

import { useEffect, useState, useCallback } from "react";
import { getMyRequests } from "../lib/startup-api";
import { Startup } from "../types/startup";
import StartupCard from "../components/startups/StartupCard";
import { Loader2, Tag, Copy, Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FounderRequestsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const PAGE_LIMIT = 5;
    const router = useRouter();

    // Search debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Data Fetching
    const fetchStartups = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMyRequests(currentPage, PAGE_LIMIT, debouncedSearch);
            setStartups(data.startups);
            setTotalPages(data.meta.lastPage || 1);
            setTotalCount(data.meta.total || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        fetchStartups();
    }, [fetchStartups]);

    // Share URL Logic
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

    const handleStartIntro = (startup: Startup) => {
        router.push(`/intro-wizard?startupId=${startup._id}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-10 min-w-0">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 min-w-0">
            <div className="min-w-0">
                <h1 className="text-3xl font-bold text-white tracking-tight">Founder Requests</h1>
                <p className="text-blue-200/60 mt-1">
                Review new startups looking for introductions
                </p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto min-w-0">
                <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">
                Share this link with founders to get their startup details
                </label>

                <div className="flex items-center gap-2 bg-black/40 border border-blue-500/30 p-1.5 rounded-xl backdrop-blur-md min-w-0">
                <code className="text-blue-100 px-3 text-sm truncate grow min-w-0">
                    {shareUrl || "Loading..."}
                </code>

                <button
                    onClick={copyToClipboard}
                    className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-500/20"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy Link"}
                </button>
                </div>
            </div>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center min-w-0">
            <div className="relative w-full min-w-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50 w-5 h-5" />
                <input
                type="text"
                placeholder="Search by startup name or founder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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

            <div className="whitespace-nowrap bg-blue-500/10 text-blue-400 border border-blue-500/20 px-6 py-4 rounded-2xl text-sm font-bold">
                {totalCount} Total Requests
            </div>
            </div>

            {/* List */}
            {isLoading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
            </div>
            ) : (
            <div className="flex flex-col gap-5">
                {startups.map((s) => (
                <StartupCard
                    key={s._id}
                    startup={s}
                    onMakeIntro={handleStartIntro}
                    onDeleteSuccess={fetchStartups}
                />
                ))}

                {startups.length === 0 && (
                <div className="text-center py-24 bg-gray-900/50 rounded-3xl border border-white/10">
                    <Tag className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">
                    {debouncedSearch
                        ? `No results found for "${debouncedSearch}"`
                        : "No pending requests at the moment."}
                    </p>
                </div>
                )}
            </div>
            )}

            {/* Pagination */}
            {!isLoading && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 min-w-0">
                <p className="text-sm text-gray-400 text-center sm:text-left">
                Showing <span className="text-white font-medium">
                    {startups.length > 0 ? (currentPage - 1) * PAGE_LIMIT + 1 : 0}
                </span> to <span className="text-white font-medium">
                    {Math.min(currentPage * PAGE_LIMIT, totalCount)}
                </span> of <span className="text-white font-medium">{totalCount}</span> requests
                </p>

                <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20"
                >
                    <ChevronLeft size={20} />
                </button>

                <span className="text-sm text-gray-400 font-medium px-2">
                    Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20"
                >
                    <ChevronRight size={20} />
                </button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}