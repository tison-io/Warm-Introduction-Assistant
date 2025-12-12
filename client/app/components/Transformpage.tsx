'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft, Copy } from 'lucide-react';
import { QueueIntroDto } from '../types/transform'; 
import { queueIntroApi } from '../lib/transform-api'; 

interface TransformResultData {
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    founderId: string;
    preferredIntroFormat: string;
    introPreferencesText: string;
    generatedIntro: string; // The generated content
}

// Function to safely parse query parameters and ensure all required fields are present
function parseQueryData(params: URLSearchParams): TransformResultData | null {
    const requiredKeys = [
        'startupId', 
        'startupName', 
        'investorId', 
        'investorName', 
        'founderId', 
        'preferredIntroFormat', 
        'generatedIntro'
    ];
    
    const data: Partial<TransformResultData> = {};
    for (const key of requiredKeys) {
        const value = params.get(key);
        if (!value) return null; // Abort if any required data is missing
        data[key as keyof TransformResultData] = value;
    }
    
    // Handle optional field gracefully
    data.introPreferencesText = params.get('introPreferencesText') || '';

    return data as TransformResultData;
}


export default function GeneratedIntroPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState<TransformResultData | null>(null);
    const [editedIntro, setEditedIntro] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [copyStatus, setCopyStatus] = useState<'Copy' | 'Copied!' | 'Failed'>('Copy');

    useEffect(() => {
        const parsedData = parseQueryData(searchParams);
        if (!parsedData) {
            alert('Missing data. Please start the transformation process again.');
            router.push('/startups'); // Redirect if data is incomplete
            return;
        }
        setData(parsedData);

        // REGEX FOR LINE BREAKS AND QUOTE TRIMMING ---
        // 1. Handle escaped characters: Replace '\n' and '\t' with real newlines/tabs
        let formattedIntro = parsedData.generatedIntro.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

        // 2. Trim the outer quotes and any surrounding whitespace
        formattedIntro = formattedIntro.trim();
        
        // Check if the string is wrapped in double quotes and remove them
        if (formattedIntro.startsWith('"') && formattedIntro.endsWith('"')) {
            formattedIntro = formattedIntro.slice(1, -1);
        }

        formattedIntro = formattedIntro.trim();

        setEditedIntro(formattedIntro); // Initialize the textarea with the formatted generated intro
    }, [searchParams, router]);

    const handleCopy = async () => {
        if (!editedIntro) return;

        try {
            await navigator.clipboard.writeText(editedIntro);
            setCopyStatus('Copied!');
        } catch (err) {
            console.error('Failed to copy text:', err);
            setCopyStatus('Failed');
        }
        
        setTimeout(() => {
            setCopyStatus('Copy');
        }, 2000);
    };

    const handleSave = async () => {
        if (!data || !editedIntro.trim()) {
            alert('Cannot save an empty introduction.');
            return;
        }

        setIsSaving(true);
        
        const queueDto: QueueIntroDto = {
            startupId: data.startupId,
            startupName: data.startupName,
            investorId: data.investorId,
            investorName: data.investorName,
            founderId: data.founderId,
            preferredIntroFormat: data.preferredIntroFormat,
            introPreferencesText: data.introPreferencesText,
            generatedIntro: editedIntro, // Send the user-edited content
        };

        try {
            await queueIntroApi(queueDto);
            alert(`Intro for ${data.investorName} successfully saved to the queue!`);
            router.push('/intro-queue'); // Redirect to the queue page
        } catch (error: any) {
            console.error('Error saving intro:', error);
            alert(`Error saving intro: ${error.message || 'An unknown error occurred.'}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!data) {
        return <p className="p-6 text-gray-300">Loading intro details...</p>;
    }

    let introType: string;
    if (data.preferredIntroFormat === '3-bullet-lines') {
        introType = '3-Bullet Point Summary'; 
    } else if (data.preferredIntroFormat === 'email') {
        introType = 'Full Email Draft';
    } else {
        // This fallback catches unexpected/unspecified formats
        introType = `Unspecified Format (${data.preferredIntroFormat})`; 
    }

    const investorDisplayName = data.investorName || 'Investor';

    return (
        <div
            className="min-h-screen bg-cover bg-center pt-12 pb-12"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-150"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Startup</span>
                </button>

                <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">Generated Intro Drafts</h1>
                    <p className="text-gray-700">Review and customize your investor introductions before saving to your queue.  </p>
                    
                    <div className="border border-gray-200 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900">{investorDisplayName}</h2>
                        <p className="text-sm text-gray-500 mb-4">Preffered Intro Format: {introType}</p>
                        
                        <textarea
                            value={editedIntro}
                            onChange={(e) => setEditedIntro(e.target.value)}
                            rows={10}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 font-mono text-sm resize-y"
                            placeholder="Your generated introduction draft goes here. You can edit it!"
                        />

                        <div className="flex space-x-3 mt-4">
                            <button 
                                onClick={handleCopy}
                                className={`flex items-center space-x-1 transition duration-200 ${
                                    copyStatus === 'Copied!' 
                                        ? 'text-green-600 font-bold' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                disabled={!editedIntro}
                            >
                                <Copy className="w-4 h-4" />
                                <span className="text-sm">{copyStatus}</span> 
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 cursor-pointer border border-gray-300 rounded-md font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition duration-150"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !editedIntro.trim()}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-150 disabled:opacity-50"
                        >
                            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                            <span>{isSaving ? 'Saving to Queue...' : 'Save'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}