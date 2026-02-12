'use client';

import { useState } from "react";
import { CreateStartupDto, Startup, VALID_TAGS } from "../../types/startup";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface Props {
    founderId: string;
    onSubmit: (data: CreateStartupDto) => Promise<void>;
    submitLabel: string;
    initialData?: Startup;
}

export default function StartupForm({ founderId, onSubmit, submitLabel, initialData, ...props }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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

    const isBlurbValid = formData.blurb.length >= 50;
    const isTagsValid = selectedTags.length >= 3 && selectedTags.length <= 6;
    const canSubmit = isBlurbValid && isTagsValid && !isSubmitting;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        
        setIsSubmitting(true);
        try {
            await onSubmit({ 
                ...formData, 
                tags: selectedTags, 
                founderId 
            });
            setFormData(initialFormState);
            setSelectedTags([]);
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputClasses = "w-full p-3 bg-[#1c212c] border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500";
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
                <div className="flex justify-between items-end mb-2">
                    <label className="text-sm font-semibold text-gray-400">Startup Blurb</label>
                    <span className={`text-[10px] font-bold ${isBlurbValid ? 'text-green-500' : 'text-blue-500'}`}>
                        {formData.blurb.length} / 50 characters min
                    </span>
                </div>
                <textarea 
                    name="blurb" 
                    value={formData.blurb} 
                    onChange={handleChange} 
                    required 
                    rows={4} 
                    className={`${inputClasses} ${!isBlurbValid && formData.blurb.length > 0 ? 'border-blue-700/50' : ''}, custom-scrollbar`}
                    placeholder="Describe your product, traction, and what you're looking for..." 
                />
                {!isBlurbValid && formData.blurb.length > 0 && (
                    <p className="flex items-center gap-1.5 mt-2 text-blue-500 text-xs">
                        <AlertCircle size={12} /> Needs at least {50 - formData.blurb.length} more characters
                    </p>
                )}
            </div>

            <div>
                <label className={labelClasses}>Pitch Deck URL</label>
                <input name="pitchLink" type="url" value={formData.pitchLink} onChange={handleChange} required className={inputClasses} placeholder="https://example.com/pitch-deck" />
            </div>

            <div>
                <label className={labelClasses}>Industries of target invetors (Select 3-6)</label>
                <div className="flex flex-wrap gap-2">
                    {VALID_TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                                selectedTags.includes(tag)
                                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                    : "bg-[#1c212c] border-gray-800 text-gray-400 hover:border-blue-500/50"
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
                className="w-full bg-linear-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center justify-center group disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 disabled:shadow-none"
            >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : submitLabel}
            </button>
        </form>
    );
}