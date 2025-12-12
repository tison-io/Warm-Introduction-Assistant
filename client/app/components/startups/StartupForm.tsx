'use client';

import { useState } from "react";
import { CreateStartupDto, Startup } from "../../types/startup";
import { useToast } from "../Toast";
import { Loader2 } from "lucide-react";

interface Props {
    initialData?: Startup;
    onSubmit: (data: CreateStartupDto) => Promise<void>;
    submitLabel: string;
}

const FormField: React.FC<{
    label: string;
    name: keyof CreateStartupDto;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    isTextArea?: boolean;
    helpText?: string;
}> = ({ label, name, value, onChange, required, isTextArea, helpText }) => {
    const InputComponent = isTextArea ? "textarea" : "input";
    const inputProps = isTextArea ? { rows: 2 } : { type: 'text' }; 

    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-black font-medium">
                {label}{required && <span className="text-red-400">*</span>}
            </label>

            <InputComponent
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                {...inputProps}
                className="w-full p-2 text-base bg-white text-gray-900 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            {helpText && (
                <p className="text-xs text-gray-300 mt-1">{helpText}</p>
            )}
        </div>
    );
};

export default function StartupForm({ initialData, onSubmit, submitLabel }: Props) {
    const [form, setForm] = useState<CreateStartupDto>({
        name: initialData?.name || "",
        blurb: initialData?.blurb || "",
        pitchLink: initialData?.pitchLink || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(form);
            showToast("Startup saved successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to save startup.", "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4"> 
            <FormField
                label="Startup Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
            />

            <FormField
                label="Blurb"
                name="blurb"
                value={form.blurb}
                onChange={handleChange}
                isTextArea
                required
                helpText="This will be used to generate personalized investor introductions."
            />

            <FormField 
                label="Pitch Link" 
                name="pitchLink"
                value={form.pitchLink}
                onChange={handleChange}
                required
            />

            <button 
                type="submit" 
                className={`w-full bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg mt-6 shadow-xl hover:bg-blue-800 transition duration-150 flex justify-center items-center space-x-2`}
                disabled={isSubmitting}
            >
                {isSubmitting && <Loader2 className="animate-spin h-5 w-5 text-white" />}
                <span>{submitLabel}</span>
            </button>
        </form>
    );
}
