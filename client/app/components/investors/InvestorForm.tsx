'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { CreateInvestorDto, Investor } from '../../types/investor';
import { createInvestor, updateInvestor } from '../../lib/investor-api';

type Props = {
  initialData?: Investor;
  isEdit: boolean;
};

const InvestorForm: React.FC<Props> = ({ initialData, isEdit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateInvestorDto>({
    name: initialData?.name || '',
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

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && initialData) {
        await updateInvestor(initialData._id, formData);
        alert('Investor updated successfully!');
      } else {
        await createInvestor(formData);
        alert('Investor created successfully!');
      }

      router.push('/investors');
      router.refresh();
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(error.message || `Failed to ${isEdit ? 'update' : 'create'} investor.`);
    } finally {
      setLoading(false);
    }
  };

  const formatOptions = ['3-Bullet', 'Email'];
  const introPreferenceOptions = [
    'Prefers bullet points',
    'Prefers long-form',
    'No specific preference'
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black/80 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-400 text-white placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 border-none"
          />
        </div>

        {/* Preferred Intro Format */}
        <div>
          <label htmlFor="preferred_intro_format" className="block text-sm font-medium text-black/80 mb-2">
            Preferred Format
          </label>
          <select
            id="preferred_intro_format"
            name="preferred_intro_format"
            required
            value={formData.preferred_intro_format}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 border-none appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-gray-200 text-black/70">Select a format</option>
            {formatOptions.map(option => (
              <option key={option} value={option} className="bg-gray-200 text-black">
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Intro Preferences Text */}
        <div className="md:col-span-2">
          <label htmlFor="intro_preferences_text" className="block text-sm font-medium text-black/80 mb-2">
            Intro Preferences
          </label>
          <textarea
            id="intro_preferences_text"
            name="intro_preferences_text"
            rows={3}
            value={formData.intro_preferences_text}
            onChange={handleChange}
            placeholder="Optional notes about how this investor prefers to receive intros"
            className="w-full px-4 py-3 bg-gray-400 text-white placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 border-none resize-none"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {introPreferenceOptions.map((option, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, intro_preferences_text: option })}
                className={`px-3 py-1 rounded-full text-white text-xs bg-blue-500 hover:bg-blue-600 transition duration-150 ${
                  formData.intro_preferences_text === option ? 'ring-2 ring-white' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label htmlFor="tagInput" className="block text-sm font-medium text-black/80 mb-2">
            Tags (Press Enter to add)
          </label>
          <input
            id="tagInput"
            name="tagInput"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="e.g., Early Stage, B2B, Fintech"
            className="w-full px-4 py-3 bg-gray-400 text-white placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 border-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition duration-150"
                onClick={() => removeTag(tag)}
              >
                {tag} <span className="ml-1 text-xs font-bold">×</span>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-black/80 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-400 text-white placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 border-none resize-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-4 border-t border-white/20 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-black/40 text-black/80 rounded-lg hover:bg-black/10 transition duration-150 font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEdit ? 'Update Investor' : 'Create Investor'}
        </button>
      </div>
    </form>
  );
};

export default InvestorForm;
