'use client';

import { Startup } from "../../types/startup";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../Toast";

interface Props {
    startup: Startup;
    refreshList: () => void;
    onDelete?: () => void;
}

export default function StartupCard({ startup, refreshList, onDelete }: Props) {
    const router = useRouter();
    const { showToast } = useToast();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (onDelete) {
                onDelete();
            } else {
                // fallback if no onDelete passed
                throw new Error("Delete handler not provided");
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to delete startup.", "error");
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/startups/${startup._id}/edit`);
    };

    return (
        <div data-testid="startup-card" className="bg-white rounded-xl shadow-lg p-6 relative hover:cursor-pointer">
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <button
                    data-testid="edit-startup-btn"
                    aria-label="Edit"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <Pencil className="w-5 h-5" />
                </button>

                <button
                    data-testid="delete-startup-btn"
                    aria-label="Delete"
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-600"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <Link href={`/startups/${startup._id}`}>
                <div className="pr-16">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{startup.name}</h2>
                    <p className="text-gray-700 text-sm">{startup.blurb}</p>
                </div>
            </Link>
        </div>
    );
}
