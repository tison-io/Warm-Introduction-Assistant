'use client';

import { useState } from 'react';
import StartupForm from '@/app/components/startups/StartupForm';
import InvestorForm from '@/app/components/investors/InvestorForm';
import TransformStep from '../components/intros/TransformStep';

import { createStartup } from '@/app/lib/startup-api';
import { createInvestor } from '@/app/lib/investor-api';
import { CreateStartupDto, Startup } from '@/app/types/startup';
import { CreateInvestorDto, Investor } from '@/app/types/investor';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';

interface WizardState {
    startup: (Startup & { isNew: true }) | null;
    investor: (Investor & { isNew: true }) | null;
}

const steps = [
    { key: 'startup', name: '1. Startup Details' },
    { key: 'investor', name: '2. Investor Details' },
    { key: 'transform', name: '3. Transform Intro' },
];

export default function NewIntroWizardPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [wizardData, setWizardData] = useState<WizardState>({
        startup: null,
        investor: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    async function handleStartupSubmit(data: CreateStartupDto) {
        setIsLoading(true);
        try {
            const newStartup: Startup = await createStartup(data);
            setWizardData(prev => ({
                ...prev,
                startup: { ...newStartup, isNew: true },
            }));
            setCurrentStep(1);
        } catch (error) {
            console.error('Failed to create startup:', error);
            alert('Error creating startup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleInvestorSubmit(data: CreateInvestorDto) {
        setIsLoading(true);
        try {
            const newInvestor: Investor = await createInvestor(data);
            setWizardData(prev => ({
                ...prev,
                investor: { ...newInvestor, isNew: true },
            }));
            setCurrentStep(2);
        } catch (error) {
            console.error('Failed to create investor:', error);
            alert('Error creating investor. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    function handleTransformSuccess(query: string) {
        router.push(`/transform?${query}`);
    }

    const renderTabs = () => (
        <div data-testid="wizard-tabs-container" className="flex border-b border-gray-200">
            {steps.map((step, index) => (
                <button
                    data-testid={`tab-${step.key}`}
                    key={step.key}
                    onClick={() => {
                        if (index < currentStep) setCurrentStep(index);
                    }}
                    disabled={index > currentStep || isLoading}
                    className={`
                        py-3 px-6 text-sm font-medium border-b-2 transition duration-200 ease-in-out
                        ${index === currentStep
                            ? 'border-blue-500 text-black font-semibold'
                            : index < currentStep
                            ? 'border-transparent text-black hover:text-black cursor-pointer'
                            : 'border-transparent text-black cursor-not-allowed'
                        }
                    `}
                >
                    {step.name}
                </button>
            ))}
        </div>
    );

    return (
        <div
            data-testid="page-new-intro-wizard"
            className="min-h-screen bg-cover bg-center pt-12 pb-12"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <button
                    onClick={() => router.push('/startups')}
                    className="flex items-center space-x-2 text-white hover:text-gray-100 transition duration-150 mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Startups</span>
                </button>

                <div className="text-white mb-8">
                    <h1 className="text-3xl font-bold text-white">New Investor Introduction Wizard</h1>
                    <p className="text-white mt-1">
                        A simple, three-step process to generate a customized intro.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    {renderTabs()}

                    <div className="p-8">
                        {isLoading && (
                            <div className="flex items-center justify-center space-x-2 py-8 text-black">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <p className="font-semibold text-black">Processing step, please wait...</p>
                            </div>
                        )}

                        {currentStep === 0 && !isLoading && (
                            <StartupForm
                                onSubmit={handleStartupSubmit}
                                submitLabel={"Register Startup & Continue"}
                            />
                        )}

                        {currentStep === 1 && !isLoading && (
                            <InvestorForm
                                onSubmit={handleInvestorSubmit}
                                submitLabel={"Register Investor & Continue"}
                                isEdit={false}
                            />
                        )}

                        {currentStep === 2 && wizardData.startup && wizardData.investor && !isLoading && (
                            <div data-testid="step-transform-container">
                                <TransformStep
                                    startup={wizardData.startup}
                                    investor={wizardData.investor}
                                    onSuccess={handleTransformSuccess}
                                />
                            </div>
                        )}

                        {currentStep === 2 && (!wizardData.startup || !wizardData.investor) && !isLoading && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-black font-medium">
                                    Error: Missing startup or investor data to proceed with transformation. 
                                    Please use the tabs to go back and complete the forms.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
