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
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="text-white">
                        <h1 className="text-3xl font-bold">My Startups</h1>
                        <p className="text-gray-300">Manage your startup profiles</p>
                    </div>

                    <Link
                        href="/startups/new"
                        className="flex items-center space-x-1 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-[#6e7099] transition duration-150"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Startup</span>
                    </Link>
                </div>

                {/* Startup List */}
                <div className="space-y-4">

                    {(isLoading || isPending) && (
                        <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-700">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && startups.length === 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-700">
                            You don't have startups at the moment.
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
