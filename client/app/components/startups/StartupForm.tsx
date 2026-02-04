'use client';

import { useState, KeyboardEvent } from "react";
import { CreateStartupDto, Startup } from "../../types/startup";
import { useToast } from "../Toast";
import { Loader2, Plus, X } from "lucide-react";

interface Props {
    initialData?: Startup;
    onSubmit: (data: CreateStartupDto) => Promise<void>;
    submitLabel: string;
}

export default function StartupForm({ initialData, onSubmit, submitLabel }: Props) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        blurb: initialData?.blurb || "",
        pitchLink: initialData?.pitchLink || "",
    });

    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            addTag();
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({ ...formData, tags: tags });
            showToast("Startup saved successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to save startup.", "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputClasses = "w-full p-3 bg-[#161930] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-500";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

    return (
        <form 
            onSubmit={handleSubmit} 
            className="space-y-6 bg-[#0f1120]/80 p-8 rounded-2xl border border-gray-800 shadow-2xl"
        >
            <div>
                <label className={labelClasses}>Startup Name*</label>
                <input name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Your Startup Name" />
            </div>

            <div>
                <label className={labelClasses}>Blurb*</label>
                <textarea name="blurb" value={formData.blurb} onChange={handleChange} required rows={3} className={inputClasses} placeholder="What does your startup do?" />
            </div>

            <div>
                <label className={labelClasses}>Pitch Link*</label>
                <input name="pitchLink" value={formData.pitchLink} onChange={handleChange} required className={inputClasses} placeholder="https://your-pitch/..." />
            </div>

            {/* Tags Field with Conditional Plus Button */}
            <div>
                <label className={labelClasses}>Industry Tags</label>
                <div className="relative flex items-center">
                    <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={inputClasses}
                        placeholder="Add a tag (e.g. Tech)"
                    />
                    
                    {/* Conditional Plus Button: only shows if tagInput has text */}
                    {tagInput.trim().length > 0 && (
                        <button
                            type="button"
                            onClick={addTag}
                            className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-md transition-all animate-in fade-in zoom-in duration-200"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3 min-h-8">
                    {tags.map((tag) => (
                        <span 
                            key={tag}
                            className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-sm animate-in fade-in zoom-in duration-200"
                        >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {tags.length === 0 && <span className="text-gray-600 text-xs italic">No tags added yet.</span>}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex justify-center items-center gap-2"
            >
                {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
                {submitLabel}
            </button>
        </form>
    );
}