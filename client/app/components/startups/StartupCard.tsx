'use client';

import { Startup } from "../../types/startup";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    startup: Startup;
    refreshList: () => void;
    onDelete?: () => void;
}

export default function StartupCard({ startup, onDelete }: Props) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/startups/${startup._id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/startups/${startup._id}/edit`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (onDelete) onDelete();
    };

    return (
        <div 
            onClick={handleCardClick}
            className="group bg-[#0f1120]/50 border border-gray-800 rounded-xl p-6 relative hover:bg-[#161930] hover:border-gray-700 transition-all cursor-pointer shadow-xl"
        >
            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex items-center space-x-4">
                <button
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                </button>

                <button
                    onClick={handleDelete}
                    className="p-2 bg-red-900/20 text-red-500 rounded-md hover:bg-red-900/40 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="pr-24">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {startup.name}
                </h2>
                <p className="text-gray-400 text-base leading-relaxed line-clamp-2">
                    {startup.blurb}
                </p>
                
                {/* Visual Tags (if you want them here too) */}
                {startup.tags && startup.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {startup.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}