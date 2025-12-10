'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getStartupById, deleteStartup } from '../../lib/startup-api';
import { getInvestors as fetchInvestors } from '../../lib/investor-api';
import { transformIntroApi } from '../../lib/transform-api';
import { Startup } from '../../types/startup';
import { Investor } from '../../types/investor';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, ExternalLink, X, Search, Plus, ChevronDown } from 'lucide-react';
import { getFounderId } from '@/app/lib/auth-utils';

interface InvestorDropdownProps {
  investors: Investor[];
  isLoading: boolean;
  onSelect: (investor: Investor) => void;
  onClose: () => void;
  isOpen: boolean;
}

const InvestorDropdown: React.FC<InvestorDropdownProps> = ({ investors, isLoading, onSelect, onClose, isOpen }) => {
  const [search, setSearch] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter investors based on search input
  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      // Reset state when closing
      setSearch('');
      setSelectedInvestor(null);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-20 border border-gray-200" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Select Investor</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-150"
          />
        </div>
        
        <Link href="/investors/create" onClick={onClose} passHref>
          <button className="flex items-center justify-center w-full space-x-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-md font-semibold hover:bg-blue-700 transition duration-150 mb-3">
            <Plus className="w-4 h-4" />
            <span>Add New Investor</span>
          </button>
        </Link>
        
        <div className="max-h-60 overflow-y-auto min-h-16">
          {isLoading ? (
            <p className="text-gray-500 text-center py-4 text-sm">Loading investors...</p>
          ) : filteredInvestors.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">
              {investors.length === 0 ? 'No investors found.' : 'No matches found.'}
            </p>
          ) : (
            <ul className="space-y-1">
              {filteredInvestors.map((investor) => (
                <li
                  key={investor._id}
                  className={`p-2 rounded-md border cursor-pointer text-sm transition duration-150 flex justify-between items-center ${
                    selectedInvestor?._id === investor._id
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedInvestor(investor)}
                >
                  <span className="font-medium text-gray-800">{investor.name}</span>
                  <div className="flex space-x-2">
                    {investor.tags && investor.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Confirmation Action */}
      <div className="p-3 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => selectedInvestor && onSelect(selectedInvestor)}
          disabled={!selectedInvestor || isLoading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-150 disabled:opacity-50 text-sm"
        >
          Confirm Transform
        </button>
      </div>
    </div>
  );
};


export default function SingleStartupPage() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [investorLoading, setInvestorLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const loadStartupAndInvestors = useCallback(() => {
    // Load Startup
    getStartupById(id)
      .then(setStartup)
      .catch(error => {
        console.error('Failed to load startup:', error);
        alert('Failed to load startup details.');
      });
    
    // Load Investors
    const loadInvestors = async () => {
        setInvestorLoading(true);
        try {
            const data = await fetchInvestors();
            setInvestors(data);
        } catch (error) {
            console.error('Failed to load investors:', error);
        } finally {
            setInvestorLoading(false);
        }
    }
    loadInvestors();
  }, [id]);

  useEffect(() => {
    loadStartupAndInvestors();
  }, [loadStartupAndInvestors]);

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

      setIsDropdownOpen(false); // Close dropdown
      setIsTransforming(true);
      
      try {
          const response = await transformIntroApi(dto); 

          const generatedIntro = response.dummyTransformedIntro; 

          // Build query string for the transform page
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

        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 relative"> {/* Added relative for button positioning */}
            
            {/* STARTUP NAME AND PRIMARY ACTION BUTTON */}
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-extrabold text-gray-900 pr-4">{startup.name}</h1>
              
              {/* TRANSFORM BUTTON/DROPDOWN TRIGGER (New Position) */}
              <div className="relative flex-shrink-0"> 
                <button
                    onClick={() => {
                        if (investors.length > 0) {
                            setIsDropdownOpen(prev => !prev);
                        } else {
                            alert("Please add investors before transforming an introduction. You can add one via the dropdown.")
                            setIsDropdownOpen(prev => !prev);
                        }
                    }}
                    disabled={isTransforming || investorLoading}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-150 disabled:opacity-50 whitespace-nowrap"
                >
                    <ChevronDown className={`w-4 h-4 ${isTransforming ? 'animate-spin' : ''}`} />
                    <span>{isTransforming ? 'Generating Intro...' : 'Transform for Investor'}</span>
                </button>
                
                {/* Investor Selection Dropdown */}
                <InvestorDropdown
                    investors={investors}
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    onSelect={handleTransform}
                    isLoading={investorLoading}
                />
              </div>
            </div>

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
                <p className="mt-4 text-lg">Startup Created At: {new Date(startup.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                
                <Link
                    href={`/startups/${startup._id}/edit`}
                    className="flex items-center space-x-1 bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 text-white transition duration-150"
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
    </div>
  );
}