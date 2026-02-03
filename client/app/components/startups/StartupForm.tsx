'use client';

import { useState } from "react";
import { CreateStartupDto, VALID_TAGS } from "../../types/startup";
import { Loader2, Check } from "lucide-react";

interface Props {
    founderId: string;
    onSubmit: (data: CreateStartupDto) => Promise<void>;
    submitLabel: string;
}

export default function StartupForm({ founderId, onSubmit, submitLabel }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Initial state for easy resetting
    const initialFormState = {
        name: "",
        founderName: "",
        founderEmail: "",
        blurb: "",
        pitchLink: "",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => {
            if (prev.includes(tag)) return prev.filter(t => t !== tag);
            if (prev.length >= 6) return prev;
            return [...prev, tag];
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({ 
                ...formData, 
                tags: selectedTags, 
                founderId 
            });
            
            // --- CLEAR FORM ON SUCCESS ---
            setFormData(initialFormState);
            setSelectedTags([]);
            // -----------------------------
            
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputClasses = "w-full p-3 bg-[#1c212c] border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all placeholder-gray-500";
    const labelClasses = "block text-sm font-semibold text-gray-400 mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Startup Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="e.g. EcoTrack" />
                </div>
                <div>
                    <label className={labelClasses}>Founder Name</label>
                    <input name="founderName" value={formData.founderName} onChange={handleChange} required className={inputClasses} placeholder="Your full name" />
                </div>
            </div>

            <div>
                <label className={labelClasses}>Email Address</label>
                <input name="founderEmail" type="email" value={formData.founderEmail} onChange={handleChange} required className={inputClasses} placeholder="founder@company.com" />
            </div>

            <div>
                <label className={labelClasses}>Startup Blurb</label>
                <textarea name="blurb" value={formData.blurb} onChange={handleChange} required rows={4} className={inputClasses} placeholder="Describe your product..." />
            </div>

            <div>
                <label className={labelClasses}>Pitch Deck URL</label>
                <input name="pitchLink" type="url" value={formData.pitchLink} onChange={handleChange} required className={inputClasses} placeholder="Link to deck" />
            </div>

            <div>
                <label className={labelClasses}>Industries</label>
                <div className="flex flex-wrap gap-2">
                    {VALID_TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                                selectedTags.includes(tag)
                                    ? "bg-[#f97316] border-[#f97316] text-white"
                                    : "bg-[#1c212c] border-gray-800 text-gray-400 hover:border-[#f97316]"
                            }`}
                        >
                            {selectedTags.includes(tag) && <Check className="w-3 h-3" />}
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting || selectedTags.length < 3}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : submitLabel}
            </button>
        </form>
    );
}