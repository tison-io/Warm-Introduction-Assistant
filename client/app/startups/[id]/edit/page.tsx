"use client";

import { useEffect, useState } from "react";
import { getStartupById, updateStartup } from "../../../lib/startup-api";
import StartupForm from "../../../components/startups/StartupForm";
import { Startup, CreateStartupDto } from "../../../types/startup";
import { useRouter, useParams } from "next/navigation";

export default function EditStartupPage() {
    const [startup, setStartup] = useState<Startup | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        getStartupById(id).then(setStartup).catch(console.error);
    }, [id]);

    async function handleSubmit(data: CreateStartupDto) {
        await updateStartup(id, data);
        router.push("/startups");
    }

    if (!startup) return <p className="text-white">Loading...</p>;

    return (
        <div
            data-testid="page-startup-edit"
            className="min-h-screen bg-cover bg-center pt-20 pb-12"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-white mb-8">
                    <h1 className="text-3xl font-bold">Edit Startup Profile</h1>
                    <p className="text-gray-300 mt-1">Update your startup information.</p>
                </div>

                <StartupForm
                    data-testid="form-startup-edit"
                    initialData={startup}
                    submitLabel="Save Changes"
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}