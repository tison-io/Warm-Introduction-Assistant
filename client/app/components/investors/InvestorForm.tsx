'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { CreateInvestorDto, Investor } from '../../types/investor';
import { IntroFormat } from '@/app/types/transform';
import { createInvestor, updateInvestor } from '../../lib/investor-api';
import { Loader2, Check, ChevronDown } from 'lucide-react';
import { useToast } from '../Toast';
import { VALID_TAGS } from "../../types/startup";

type Props = {
  initialData?: Investor;
  isEdit: boolean;
  workspaceId?: string;
  submitLabel?: string;
  disabled?: boolean;
  onSubmit?: (data: CreateInvestorDto) => Promise<void>;
};

export default function InvestorForm({ initialData, workspaceId, isEdit, onSubmit: wizardOnSubmit, submitLabel, disabled = false }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',  
    preferred_intro_format: initialData?.preferred_intro_format || '',
    intro_preferences_text: initialData?.intro_preferences_text || '',
    notes: initialData?.notes || '',
  });

  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      if (prev.length >= 5) {
        showToast("Maximum 5 tags allowed", "error");
        return prev;
      }
      return [...prev, tag];
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTags.length < 2) {
      showToast("Please select at least 2 tags", "error");
      return;
    }

    setLoading(true);

    const payload: CreateInvestorDto = {
      ...formData,
      tags: selectedTags,
      preferred_intro_format: formData.preferred_intro_format as IntroFormat,
      workspaceId: workspaceId || initialData?.workspaceId,
    };

    try {
      if (!isEdit && wizardOnSubmit) {
        await wizardOnSubmit(payload);
        showToast('Investor details captured!', 'success');
      } else if (isEdit && initialData) {
        await updateInvestor(initialData._id, payload);
        showToast('Investor updated successfully!', 'success');
        router.push(workspaceId ? `/workspace/${workspaceId}/pipeline` : '/investors');
      } else {
        await createInvestor(payload, workspaceId);
        showToast('Investor created successfully!', 'success');
        router.push(workspaceId ? `/workspace/${workspaceId}/pipeline` : '/investors');
      }
      router.refresh();
    } catch (error: any) {
      showToast(error.message || "Something went wrong", 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full p-3 bg-[#1c212c] border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 appearance-none";
  const labelClasses = "block text-sm font-semibold text-gray-400 mb-2";

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-3xl mx-auto space-y-6 bg-[#0f1120]/80 p-8 rounded-2xl border border-gray-800 shadow-2xl mt-8"
    >
      <header className="mb-8 border-b border-gray-800/50 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isEdit ? 'Update Investor Profile' : 'Create New Investor Profile'}
        </h1>
        <p className="text-gray-400">Enter the details for the investor</p>
      </header>

      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Investor Name*</label>
          <input name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Full name" />
        </div>
        <div>
          <label className={labelClasses}>Email Address*</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="investor@firm.com" />
        </div>
      </div>

      {/* Preferred Format Select */}
      <div>
        <label className={labelClasses}>Preferred Format*</label>
        <div className="relative">
          <select 
            name="preferred_intro_format" 
            value={formData.preferred_intro_format} 
            onChange={handleChange} 
            required 
            className={inputClasses}
          >
            <option value="" disabled className="bg-[#1c212c]">Select a format</option>
            <option value="3-bullet-lines" className="bg-[#1c212c]">3-Bullet Lines</option>
            <option value="email" className="bg-[#1c212c]">Full Email</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Tag Selection */}
      <div>
        <label className={labelClasses}>Focus Sectors (Select 2-5)*</label>
        <div className="flex flex-wrap gap-2 p-4 bg-[#1c212c]/30 rounded-xl border border-gray-800/50">
          {VALID_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedTags.includes(tag)
                  ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10"
                  : "bg-[#1c212c] border-gray-800 text-gray-400 hover:border-blue-500/50"
              }`}
            >
              {selectedTags.includes(tag) && <Check className="w-3 h-3" />}
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Intro Preferences */}
      <div>
        <label className={labelClasses}>Intro Preferences & Notes</label>
        <textarea 
          name="intro_preferences_text" 
          value={formData.intro_preferences_text} 
          onChange={handleChange} 
          rows={3} 
          className={inputClasses} 
          placeholder="e.g. Needs a blurb, prefers warm intros..."
          required
        />
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-gray-800/50">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading || disabled || selectedTags.length < 2}
          className="flex-2 bg-linear-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 disabled:shadow-none"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (submitLabel || (isEdit ? 'Update Investor' : 'Save Investor'))}
        </button>
      </div>
    </form>
  );
}