import { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { TransformIntroDto, TransformIntroResponse, IntroFormat } from '@/app/types/transform';
import { Startup } from '@/app/types/startup';
import { Investor } from '@/app/types/investor';
import { transformIntroApi } from '@/app/lib/transform-api';
import { getFounderId } from '@/app/lib/auth-utils';

interface TransformStepProps {
    startup: Startup;
    investor: Investor;
    onSuccess: (query: string) => void;
}

export default function TransformStep({ startup, investor, onSuccess }: TransformStepProps) {
    const [isTransforming, setIsTransforming] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const messages = [
        "Generating intro...",
        "This may take a while.",
        "Please be patient."
    ];

    const handleTransform = async () => {
        if (!investor.email) {
            alert('Error: This investor does not have an email address assigned.');
            return;
        }

        setIsTransforming(true);
        setMessageIndex(0);
        setFade(true);

        // Stepwise message cycle
        const cycleMessages = async () => {
            for (let i = 0; i < messages.length; i++) {
                setMessageIndex(i);
                setFade(true);
                await new Promise(r => setTimeout(r, 1500)); // show message
                setFade(false);
                await new Promise(r => setTimeout(r, 500)); // fade out
            }
        };

        cycleMessages();

        const founderId = getFounderId();
        if (!founderId) {
            alert('Authentication error: Founder ID could not be determined. Please log in again.');
            setIsTransforming(false);
            return;
        }

        const dto: TransformIntroDto = {
            startup_id: startup._id,
            startup_name: startup.name,
            startup_pitch_link: startup.pitchLink || '',
            blurb: startup.blurb,
            investor_id: investor._id,
            investor_name: investor.name,
            investor_email: investor.email,
            founder_id: founderId,
            investor_preference: (investor.preferred_intro_format || 'email') as IntroFormat,
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
                investorEmail: dto.investor_email,
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
            {/* Header */}
            <h2 className="text-xl font-bold text-black">Final Step: Transform Introduction</h2>
            <p className="text-black">
                Review the information before generating a customized investor introduction:
            </p>

            {/* Info Panel */}
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
                    <p className="font-semibold text-black">Startup Blurb:</p>
                    <p data-testid="transform-startup-blurb" className="text-black">{startup.blurb}</p>
                </div>
                <div>
                    <p className="font-semibold text-black">Investor Email:</p>
                    <p data-testid="transform-investor-email" className="text-black">{investor.email}</p>
                </div>
                <div className="col-span-2">
                    <p className="font-semibold text-black">Investor Preference:</p>
                    <p data-testid="transform-investor-preference" className="text-black">{investor.preferred_intro_format || 'Default (Email)'}</p>
                </div>
            </div>

            {/* Generate Button with Animated Messages */}
            <button
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full flex flex-col items-center justify-center space-y-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-150 disabled:opacity-50"
            >
                <Wand2 className={`w-5 h-5 ${isTransforming ? 'animate-bounce' : ''}`} />
                {isTransforming ? (
                    <div className="h-6 relative w-full text-center">
                        <p
                            key={messageIndex}
                            className={`absolute inset-0 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {messages[messageIndex]}
                        </p>
                    </div>
                ) : (
                    <span>Generate Customized Introduction</span>
                )}
            </button>

            <p className="text-xs text-black text-center">
                This will call the transformation engine and redirect you to the review page.
            </p>
        </div>
    );
}
