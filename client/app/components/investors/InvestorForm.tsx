'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { CreateInvestorDto, Investor } from '../../types/investor';
import { IntroFormat } from '@/app/types/transform';
import { createInvestor, updateInvestor } from '../../lib/investor-api';

type Props = {
  initialData?: Investor;
  isEdit: boolean;
  submitLabel?: string;
  disabled?: boolean;
  onSubmit?: (data: CreateInvestorDto) => Promise<void>;
};

const FormField: React.FC<{
  label: string;
  name: keyof CreateInvestorDto | 'tagInput';
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  required?: boolean;
  isTextArea?: boolean;
  isSelect?: boolean;
  selectOptions?: string[];
  helpText?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({
  label,
  name,
  value,
  onChange,
  required,
  isTextArea,
  isSelect,
  selectOptions,
  helpText,
  onKeyDown,
}) => {
  const baseClass =
    'w-full p-3 text-base bg-white text-black rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 border-none';

  return (
    <div className="space-y-1">
      <label htmlFor={name as string} className="block text-black font-medium">
        {label}
        {required && <span className="text-black">*</span>}
      </label>

      {isSelect ? (
        <select
          id={name as string}
          name={name as string}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseClass} appearance-none cursor-pointer`}
        >
          <option value="" disabled className="bg-gray-100 text-black">
            Select a format
          </option>
          {selectOptions?.map(option => (
            <option key={option} value={option} className="bg-white text-black">
              {option === '3-bullet-lines' ? '3-Bullet Lines' : 'Email'}
            </option>
          ))}
        </select>
      ) : isTextArea ? (
        <textarea
          id={name as string}
          name={name as string}
          value={value}
          onChange={onChange}
          rows={3}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          id={name as string}
          name={name as string}
          value={value}
          onChange={onChange}
          required={required}
          onKeyDown={onKeyDown}
          type="text"
          className={baseClass}
        />
      )}

      {helpText && <p className="text-xs text-black mt-1">{helpText}</p>}
    </div>
  );
};

const InvestorForm: React.FC<Props> = ({ initialData, isEdit, onSubmit: wizardOnSubmit, submitLabel, disabled = false }) => {
  const router = useRouter();

  interface InvestorFormData
    extends Omit<CreateInvestorDto, 'preferred_intro_format'> {
    preferred_intro_format: string;
  }

  const [formData, setFormData] = useState<InvestorFormData>({
    name: initialData?.name || '',
    tags: initialData?.tags || [],
    preferred_intro_format: initialData?.preferred_intro_format || '',
    intro_preferences_text: initialData?.intro_preferences_text || '',
    notes: initialData?.notes || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
    };

    if (!isEdit && wizardOnSubmit) {
        try {
            await wizardOnSubmit(payload);
        } catch (error) {
            console.error('Wizard submission failed:', error);
            alert('Failed to submit investor details to the wizard. Check console.');
        } finally {
            setLoading(false);
        }
        return; // Exit here, let the parent handle navigation
    }

    try {
      if (isEdit && initialData) {
        await updateInvestor(initialData._id, payload);
        alert('Investor updated successfully!');
      } else {
        await createInvestor(payload);
        alert('Investor created successfully!');
      }

      router.push('/investors');
      router.refresh();
    } catch (error: any) {
      alert(
        error.message ||
          `Failed to ${isEdit ? 'update' : 'create'} investor.`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatOptions: IntroFormat[] = ['3-bullet-lines', 'email'];

  const introPreferenceOptions = [
    'Prefers bullet points',
    'Prefers email',
    'No specific preference',
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 shadow-2xl space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Name"
          name="name"
          value={formData.name ?? ''}
          onChange={handleChange}
          required
        />

        <FormField
          label="Preferred Format"
          name="preferred_intro_format"
          value={formData.preferred_intro_format ?? ''}
          onChange={handleChange}
          required
          isSelect
          selectOptions={formatOptions as string[]}
        />

        <div className="md:col-span-2">
          <FormField
            label="Intro Preferences"
            name="intro_preferences_text"
            value={formData.intro_preferences_text ?? ''}
            onChange={handleChange}
            isTextArea
            helpText="Optional notes about how this investor prefers to receive introductions."
          />

          <div className="mt-2 flex flex-wrap gap-2">
            {introPreferenceOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    intro_preferences_text: option,
                  })
                }
                className={`px-3 py-1 rounded-full text-black text-xs bg-blue-600 hover:bg-blue-700 transition ${
                  formData.intro_preferences_text === option
                    ? 'ring-2 ring-blue-900 shadow-lg'
                    : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Tags (Press Enter to add)"
            name="tagInput"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            helpText="e.g., Early Stage, B2B, Fintech"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                onClick={() => removeTag(tag)}
                className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500 text-black cursor-pointer hover:bg-red-500 transition"
              >
                {tag} <span className="ml-1 font-bold">x</span>
              </span>
            ))}
          </div>
        </div>

        <FormField
          label="Notes (Optional)"
          name="notes"
          value={formData.notes ?? ''}
          onChange={handleChange}
          isTextArea
          helpText="Internal notes about the investor, their team, or past investments."
        />
      </div>

      <div className="pt-4 flex justify-between items-center space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || disabled} 
          className="w-full ml-4 bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg shadow-xl hover:bg-blue-800 disabled:opacity-50"
        >
          {loading || disabled
            ? 'Processing...'
            : submitLabel
            ? submitLabel
            : isEdit
            ? 'Update Investor'
            : 'Create Investor'}
        </button>
      </div>
    </form>
  );
};

export default InvestorForm;
