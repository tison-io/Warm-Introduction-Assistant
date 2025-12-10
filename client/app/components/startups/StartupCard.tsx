"use client";

import { Startup } from "../../types/startup";
import { Pencil, Trash2 } from "lucide-react";
import { deleteStartup } from "../../lib/startup-api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
    startup: Startup;
    refreshList: () => void;
}

export default function StartupCard({ startup, refreshList }: Props) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        try {
            await deleteStartup(startup._id);
            refreshList(); 
        } catch (err) {
            console.error(err);
            alert("Failed to delete startup.");
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/startups/${startup._id}/edit`);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 relative hover:cursor-pointer">
            <div className="absolute top-4 right-4 flex space-x-2 z-10">

                <button
                    aria-label="Edit"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <Pencil className="w-5 h-5" />
                </button>

                <button
                    aria-label="Delete"
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-600"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Clickable area of the card */}
            <Link href={`/startups/${startup._id}`}>
                <div className="pr-16">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{startup.name}</h2>
                    <p className="text-gray-700 text-sm">{startup.blurb}</p>
                </div>
            </Link>
        </div>
    );
}
