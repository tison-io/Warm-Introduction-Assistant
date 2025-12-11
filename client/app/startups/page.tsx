"use client";

import { useEffect, useState } from "react";
import { getMyStartups } from "../lib/startup-api";
import { Startup } from "../types/startup";
import StartupCard from "../components/startups/StartupCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyStartupsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        })
        .finally(() =>
            setIsLoading(false)
        );
    };

    useEffect(() => {
        fetchStartups();
    }, []);

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

                    {isLoading && (
                        <p className="text-gray-300 text-center">Loading your startups...</p>
                    )}

                    {!isLoading && error && (
                        <p className="text-gray-200 text-center">{error}</p>
                    )}

                    {!isLoading && !error && startups.length === 0 && (
                        <p className="text-gray-200 text-center">
                            You don't have startups at the moment.
                        </p>
                    )}

                    {!isLoading && !error && startups.length > 0 && (
                        startups.map((s) => (
                            <StartupCard key={s._id} startup={s} refreshList={fetchStartups} />
                        ))
                    )}

                </div>
            </div>
        </div>
    );
}