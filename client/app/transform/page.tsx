'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw, ArrowLeft, Copy } from 'lucide-react';
import { QueueIntroDto } from '../types/transform'; 
import { queueIntroApi } from '../lib/transform-api'; 

// Interface to type the raw data coming from the query string (mostly strings)
interface TransformResultData {
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    founderId: string;
    preferredIntroFormat: string;
    introPreferencesText: string;
    generatedIntro: string; // The AI's draft
}

// Function to safely parse query parameters
function parseQueryData(params: URLSearchParams): TransformResultData | null {
    const requiredKeys = ['startupId', 'startupName', 'investorId', 'investorName', 'founderId', 'preferredIntroFormat', 'generatedIntro'];
    
    // Check if all required keys are present
    const data: Partial<TransformResultData> = {};
    for (const key of requiredKeys) {
        const value = params.get(key);
        if (!value) return null; 
        data[key as keyof TransformResultData] = value;
    }
    
    // Handle optional field
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
        setEditedIntro(parsedData.generatedIntro);
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
        
        // Reset copy button status after a short delay
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
            generatedIntro: editedIntro, // The user-edited content
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
        // This state is hit while data is loading or if it was invalid and we're redirecting.
        return <p className="p-6 text-gray-300">Loading intro details...</p>;
    }

    const introType = data.preferredIntroFormat === '3-bullet' ? '3-Bullet' : 'Email';
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
                    <p className="text-gray-700">Review and customize your investor introductions before saving to your queue.  </p>
                    
                    {/* Intro Draft Card (Based on the image design) */}
                    <div className="border border-gray-200 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900">{investorDisplayName}</h2>
                        <p className="text-sm text-gray-500 mb-4">{introType}</p>
                        
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
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition duration-150"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !editedIntro.trim()}
                            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition duration-150 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                            <span>{isSaving ? 'Saving to Queue...' : 'Save'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}