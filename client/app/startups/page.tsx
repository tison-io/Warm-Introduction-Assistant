'use client';

import { useEffect, useState } from "react";
import { getMyRequests } from "../lib/startup-api";
import { Startup } from "../types/startup";
import StartupCard from "../components/startups/StartupCard";
import { Loader2 } from "lucide-react";

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
                        <h1 className="text-3xl font-bold text-white">Founder Requests</h1>
                        <p className="text-gray-400">Review new startups looking for introductions</p>
                    </div>
                    <div className="bg-[#1c212c] text-orange-500 border border-orange-500/20 px-3 py-1 rounded-full text-sm font-semibold">
                        {startups.length} Requests
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin h-10 w-10 text-[#f97316]" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4"> 
                        {startups.map((s) => (
                            /* Ensure StartupCard is also updated to use bg-[#11141b] and text-white */
                            <StartupCard key={s._id} startup={s} />
                        ))}
                    </div>
                )}

                {!isLoading && startups.length === 0 && (
                    <div className="text-center py-20 bg-[#11141b] rounded-2xl border-2 border-dashed border-gray-800">
                        <p className="text-gray-500">No requests found at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}