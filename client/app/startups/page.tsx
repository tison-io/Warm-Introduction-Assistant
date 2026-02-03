'use client';

import { useEffect, useState } from "react";
import { getMyRequests } from "../lib/startup-api";
import { Startup } from "../types/startup";
import StartupCard from "../components/startups/StartupCard";
import { Loader2, Tag } from "lucide-react";

export default function FounderRequestsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMyRequests()
            .then(setStartups)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0e14] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Founder Requests</h1>
                        <p className="text-gray-400 mt-1">Review new startups looking for introductions</p>
                    </div>
                    {/* Updated badge to Blue theme */}
                    <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm shadow-blue-500/5">
                        {startups.length} Requests
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-5"> 
                        {startups.map((s) => (
                            <StartupCard key={s._id} startup={s} />
                        ))}
                    </div>
                )}

                {!isLoading && startups.length === 0 && (
                    <div className="text-center py-24 bg-[#11141b] rounded-3xl border border-gray-800/50 shadow-inner">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                           <Tag className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-500 font-medium">No pending requests at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}