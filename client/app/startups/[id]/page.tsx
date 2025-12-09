'use client';

import { useEffect, useState } from 'react';
import { getStartupById, deleteStartup } from '../../lib/startup-api';
import { getInvestors as fetchInvestors } from '../../lib/investor-api';
import { transformIntroApi } from '../../lib/transform-api';
import { Startup } from '../../types/startup';
import { Investor } from '../../types/investor';
import { TransformIntroDto } from '../../types/transform';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, ExternalLink, RefreshCw, X } from 'lucide-react';
import { getFounderId } from '@/app/lib/auth-utils';

// --- Modal Component ---
interface InvestorModalProps {
  investors: Investor[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (investor: Investor) => void;
  isLoading: boolean;
}

const InvestorModal: React.FC<InvestorModalProps> = ({ investors, isOpen, onClose, onConfirm, isLoading }) => {
  // Hooks must be declared unconditionally at the top level
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  // This Hook is now called every render, fixing the error.
  useEffect(() => {
    // Logic to reset state when the modal closes
    if (!isOpen) {
      setSelectedInvestor(null);
    }
  }, [isOpen]); 

  // Conditional return must come after all Hooks
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedInvestor) {
      onConfirm(selectedInvestor);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Select Investor to Intro</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Investor List */}
        <div className="p-4 max-h-80 overflow-y-auto min-h-36">
          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Loading investors...</p>
          ) : investors.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No investors found. Add an investor first.</p>
          ) : (
            <ul className="space-y-2">
              {investors.map((investor) => (
                <li
                  key={investor._id}
                  className={`p-3 rounded-lg border cursor-pointer transition duration-150 ${
                    selectedInvestor?._id === investor._id
                      ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedInvestor(investor)}
                >
                  <p className="font-semibold text-gray-800">{investor.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!selectedInvestor || isLoading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition duration-150 disabled:opacity-50"
          >
            Confirm Transform
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SingleStartupPage() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [investorLoading, setInvestorLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    getStartupById(id).then(setStartup).catch(console.error);
    
    const loadInvestors = async () => {
        try {
            const data = await fetchInvestors();
            setInvestors(data);
        } catch (error) {
            console.error('Failed to load investors:', error);
            alert('Failed to load investor list.');
        } finally {
            setInvestorLoading(false);
        }
    }
    loadInvestors();
  }, [id]);

  async function handleDelete() {
    const confirmed = confirm(`Are you sure you want to delete ${startup?.name}?`);
    if (!confirmed) return;

    try {
      await deleteStartup(id);
      router.push('/startups');
    } catch (error) {
      console.error(error);
      alert('Failed to delete startup.');
    }
  }

  const handleTransform = async (investor: Investor) => {
      if (!startup) return;

      const founderId = getFounderId(); 
      const preferredIntroFormat = 'standard';
      const introPreferencesText = '';

      if (!founderId) {
        alert('Authentication error: Founder ID could not be determined. Please log in again.');
        return;
      }
      const dto = {
          startup_id: startup._id,
          startup_name: startup.name,
          startup_pitch_link: startup.pitchLink || '',
          startup_blurb: startup.blurb, 
          investor_id: investor._id, 
          investor_name: investor.name,
          founder_id: founderId, 
          preferred_intro_format: preferredIntroFormat,
          intro_preferences_text: introPreferencesText,
      };

      setIsModalOpen(false);
      setIsTransforming(true);
      
      try {
          const response = await transformIntroApi(dto); 

          const generatedIntro = response.dummyTransformedIntro; 

          const query = new URLSearchParams({
              startupId: dto.startup_id,
              startupName: dto.startup_name,
              investorId: dto.investor_id,
              investorName: dto.investor_name,
              founderId: dto.founder_id,
              preferredIntroFormat: dto.preferred_intro_format,
              introPreferencesText: dto.intro_preferences_text,
              generatedIntro: generatedIntro,
          }).toString();
          
          router.push(`/transform?${query}`);
          console.log('Transform API Response:', response);
      } catch (error: any) {
          console.error('Transformation failed:', error);
          alert(`Transformation failed: ${error.message || 'An unknown error occurred.'}`);
      } finally {
          setIsTransforming(false);
      }
  };

  if (!startup) return <p className="p-6 text-gray-300">Loading startup details...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-12 pb-12"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link href="/startups" className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-150">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Startups</span>
        </Link>

        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900">{startup.name}</h1>
            <p className="text-lg text-gray-700 leading-relaxed">{startup.blurb}</p>

            {startup.pitchLink && (
              <a
                href={startup.pitchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:underline"
              >
                <span>View Pitch Deck</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <hr className="border-gray-100" />

            <div className="text-sm text-gray-500">
                <div className="flex space-x-10">
                    <div>
                        <p className="font-medium uppercase tracking-wider">Intros Created</p>
                        <p className="text-2xl font-bold text-gray-900">*To do</p>
                    </div>
                </div>
                
                <p className="mt-4 text-xs">Startup Created At: {new Date(startup.createdAt).toLocaleString()}</p>
            </div>

            {/* Action Buttons: Added Transform Button */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                {/* TRANSFORM BUTTON */}
                <button
                    onClick={() => {
                        if (investors.length > 0) {
                            setIsModalOpen(true)
                        } else {
                            alert("Please add investors before transforming an introduction.")
                        }
                    }}
                    disabled={isTransforming || investorLoading}
                    className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition duration-150 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isTransforming ? 'animate-spin' : ''}`} />
                    <span>{isTransforming ? 'Generating Intro...' : 'Transform for Investor'}</span>
                </button>
                
                <Link
                    href={`/startups/${startup._id}/edit`}
                    className="flex items-center space-x-1 bg-[#5A5C7F] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#6e7099] transition duration-150"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                </Link>

                <button
                    onClick={handleDelete}
                    className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition duration-150"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Startup</span>
                </button>
            </div>
        </div>
      </div>
      
      {/* Investor Selection Modal */}
      <InvestorModal
        investors={investors}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleTransform}
        isLoading={investorLoading}
      />
    </div>
  );
}