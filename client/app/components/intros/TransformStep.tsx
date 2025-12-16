'use client';

import { useState } from 'react';
import { transformIntroApi } from '@/app/lib/transform-api';
import { Startup } from '@/app/types/startup';
import { Investor } from '@/app/types/investor';
import { TransformIntroDto, TransformIntroResponse, IntroFormat } from '@/app/types/transform';
import { getFounderId } from '@/app/lib/auth-utils';
import { Wand2, Zap } from 'lucide-react';

interface TransformStepProps {
    startup: Startup;
    investor: Investor;
    onSuccess: (query: string) => void;
}

export default function TransformStep({ startup, investor, onSuccess }: TransformStepProps) {
    const [isTransforming, setIsTransforming] = useState(false);

    const handleTransform = async () => {
        setIsTransforming(true);

        const founderId = getFounderId();
        if (!founderId) {
            alert('Authentication error: Founder ID could not be determined. Please log in again.');
            setIsTransforming(false);
            return;
        }

        const investorPreference = (investor.preferred_intro_format || 'email') as IntroFormat;

        const dto: TransformIntroDto = {
            startup_id: startup._id,
            startup_name: startup.name,
            startup_pitch_link: startup.pitchLink || '',
            blurb: startup.blurb,
            investor_id: investor._id,
            investor_name: investor.name,
            founder_id: founderId,
            investor_preference: investorPreference,
            intro_preferences_text: investor.intro_preferences_text || '',
        };

        try {
            const response: TransformIntroResponse = await transformIntroApi(dto);
            const generatedIntro = response.transformed_intro;

            const query = new URLSearchParams({
                startupId: dto.startup_id,
                startupName: dto.startup_name,
                investorId: dto.investor_id,
                investorName: dto.investor_name,
                founderId: dto.founder_id,
                preferredIntroFormat: dto.investor_preference,
                introPreferencesText: dto.intro_preferences_text,
                generatedIntro: generatedIntro,
            }).toString();

            onSuccess(query);
        } catch (error: any) {
            console.error('Transformation failed:', error);
            alert(`Transformation failed: ${error.message || 'An unknown error occurred.'}`);
        } finally {
            setIsTransforming(false);
        }
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-black">Final Step: Transform Introduction</h2>
            <p className="text-black">
                You are ready to generate a customized investor introduction based on the data you provided:
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-md border border-gray-100">
                <div>
                    <p className="font-semibold text-black">Startup:</p>
                    <p data-testid="transform-startup-name" className="text-black">{startup.name}</p>
                </div>
                <div>
                    <p className="font-semibold text-black">Investor:</p>
                    <p data-testid="transform-investor-name" className="text-black">{investor.name}</p>
                </div>
                <div>
                    <p className="font-semibold text-black">Startup blurb:</p>
                    <p data-testid="transform-startup-blurb" className="text-black">{startup.blurb}</p>
                </div>
                <div className="col-span-2">
                    <p className="font-semibold text-black">Investor Preference:</p>
                    <p data-testid="transform-investor-preference" className="text-black">{investor.preferred_intro_format || 'Default (Email)'}</p>
                </div>
            </div>

            <button
                data-testid="transform-generate-btn"
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-150 disabled:opacity-50"
            >
                {isTransforming ? (
                    <>
                        <Wand2 className="w-6 h-6 animate-bounce text-white" />
                        <span>Generating Intro...</span>
                    </>
                ) : (
                    <>
                        <Wand2 className="w-5 h-5 text-white" />
                        <span>Generate Customized Introduction</span>
                    </>
                )}
            </button>

            <p className="text-xs text-black text-center">
                This will call the transformation engine and redirect you to the review page.
            </p>
        </div>
    );
}
