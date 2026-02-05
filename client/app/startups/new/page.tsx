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
            className="min-h-screen bg-cover bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 pt-20 pb-12"
        >
            OOPS!
        </div>
    );
}