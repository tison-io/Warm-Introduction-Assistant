'use client';

import { useEffect, useState, useTransition } from "react";
import { getMyStartups, deleteStartup } from "../lib/startup-api";
import { Startup } from "../types/startup";
import StartupCard from "../components/startups/StartupCard";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useToast } from "../components/Toast";
import { Loader2 } from "lucide-react";

export default function MyStartupsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const fetchStartups = () => {
        setIsLoading(true);
        getMyStartups()
            .then((data) => {
                setStartups(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Failed to fetch startups:", err);
                setError("You don't have startups at the moment.");
                showToast("Failed to load your startups.", "error");
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchStartups();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this startup?")) return;

        try {
            await deleteStartup(id);
            showToast("Startup deleted successfully!", "success");
            startTransition(() => {
                setStartups(prev => prev.filter(s => s._id !== id));
            });
        } catch (err) {
            console.error(err);
            showToast("Failed to delete startup.", "error");
        }
    };

    return (
        <div
            data-testid="page-startup-list"
            className="min-h-screen text-white"
            /* Deep dark blue/black gradient similar to the image */
            style={{ background: "linear-gradient(180deg, #0a0b1e 0%, #05050a 100%)" }}
        >
            <div className="max-w-4xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 data-testid="startups-title" className="text-4xl font-bold tracking-tight">My Startups</h1>
                        <p className="text-gray-400 mt-1">Manage your startup profiles</p>
                    </div>

                    <Link
                        data-testid="btn-new-startup"
                        href="/startups/new"
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Startup</span>
                    </Link>
                </div>

                {/* Subtext instruction */}
                {!isLoading && startups.length > 0 && (
                    <p className="text-gray-500 text-sm mb-4 italic">
                        Click on a startup card to view more details.
                    </p>
                )}

                {/* Startup List */}
                <div data-testid="startups-container" className="space-y-4">
                    {/* ... (Loading and Error states remain the same, just adjust colors to match dark theme) ... */}
                    
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
                        </div>
                    )}

                    {!isLoading && !error && startups.length > 0 && (
                        startups.map((s) => (
                            <StartupCard
                                key={s._id}
                                startup={s}
                                refreshList={fetchStartups}
                                onDelete={() => handleDelete(s._id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
