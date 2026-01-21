'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { CreateInvestorDto, Investor } from '../../types/investor';
import { IntroFormat } from '@/app/types/transform';
import { createInvestor, updateInvestor } from '../../lib/investor-api';
import { Loader2, Plus, X, ChevronDown } from 'lucide-react';
import { useToast } from '../Toast';

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

  interface InvestorFormData extends Omit<CreateInvestorDto, 'preferred_intro_format'> {
    preferred_intro_format: string;
  }

  const [formData, setFormData] = useState<InvestorFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',  
    tags: initialData?.tags || [],
    preferred_intro_format: initialData?.preferred_intro_format || '',
    intro_preferences_text: initialData?.intro_preferences_text || '',
    notes: initialData?.notes || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: CreateInvestorDto = {
      ...formData,
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

  const inputClasses = "w-full p-3 bg-[#161930] border border-gray-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-500 appearance-none";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

  const introPreferenceOptions = [
    'Prefers short emails',
    'Prefers detailed emails',
    'Prefers warm intros only',
    'No specific preference',
  ];

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-3xl mx-auto space-y-6 bg-[#0f1120]/80 p-8 rounded-2xl border border-gray-800 shadow-2xl mt-8"
    >
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isEdit ? 'Update Investor Profile' : 'Create New Investor Profile'}
        </h1>
        <p className="text-gray-400">Enter the details for the investors, including their preferences.</p>
      </header>

      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Investor Name*</label>
          <input name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Investor name" />
        </div>
        <div>
          <label className={labelClasses}>Email Address*</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="investor@example.com" />
        </div>
      </div>

      {/* Preferred Format Select */}
      <div className="relative">
        <label className={labelClasses}>Preferred Format*</label>
        <div className="relative">
          <select 
            name="preferred_intro_format" 
            value={formData.preferred_intro_format} 
            onChange={handleChange} 
            required 
            className={inputClasses}
          >
            <option value="" disabled>Select a format</option>
            <option value="3-bullet-lines">3-Bullet Lines</option>
            <option value="email">Email</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Intro Preferences Textarea */}
      <div>
        <label className={labelClasses}>Intro Preferences</label>
        <textarea 
          name="intro_preferences_text" 
          value={formData.intro_preferences_text} 
          onChange={handleChange} 
          rows={4} 
          className={inputClasses} 
          placeholder="Optional notes about intro preferences..."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {introPreferenceOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setFormData({ ...formData, intro_preferences_text: option })}
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all border ${
                formData.intro_preferences_text === option 
                ? 'bg-indigo-600 border-indigo-500 text-white' 
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tags Field */}
      <div>
        <label className={labelClasses}>Tags</label>
        <div className="relative flex items-center">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className={inputClasses}
            placeholder="e.g., Tech"
          />
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
          {formData.tags.map((tag) => (
            <span 
              key={tag}
              className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold animate-in fade-in zoom-in duration-200"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Notes Area */}
      <div>
        <label className={labelClasses}>Notes (Optional)</label>
        <textarea 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange} 
          rows={3} 
          className={inputClasses} 
          placeholder="Internal notes about the investor..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading || disabled}
          className="flex-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin h-5 w-5" />}
          {submitLabel || (isEdit ? 'Update Investor' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
}