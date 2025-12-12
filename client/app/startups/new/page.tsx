"use client";

import StartupForm from "../../components/startups/StartupForm";
import { createStartup } from "../../lib/startup-api";
import { CreateStartupDto } from "../../types/startup";
import { useRouter } from "next/navigation";

export default function NewStartupPage() {
    const router = useRouter();

    async function handleSubmit(data: CreateStartupDto) {
        await createStartup(data);
        router.push("/startups");
    }

    return (
        <div
            data-testid="page-startup-create"
            className="min-h-screen bg-cover bg-center pt-20 pb-12"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-white mb-8">
                    <h1 className="text-3xl font-bold">Create Startup Profile</h1>
                    <p className="text-gray-300 mt-1">Set up your startup information to get started with generating investor introductions.</p>
                </div>

                <StartupForm data-testid="form-startup-create" submitLabel="Register" onSubmit={handleSubmit} />
            </div>
        </div>
    );
}