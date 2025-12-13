'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getStartupById, deleteStartup } from '../../lib/startup-api';
import { getInvestors as fetchInvestors } from '../../lib/investor-api';
import { transformIntroApi } from '../../lib/transform-api';
import { Startup } from '../../types/startup';
import { Investor } from '../../types/investor';
import { TransformIntroDto, TransformIntroResponse, IntroFormat } from '../../types/transform';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Edit,
    Trash2,
    ExternalLink,
    X,
    Search,
    Plus,
    ChevronDown,
    Wand2,
    Loader2
} from 'lucide-react';
import { getFounderId } from '@/app/lib/auth-utils';
import { useToast } from '../../components/Toast';

/* ======================================================
   Startup Detail Skeleton
====================================================== */

const StartupDetailSkeleton = () => {
    return (
        <div
            className="min-h-screen bg-cover bg-center pt-12 pb-12"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Back link */}
                <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-300 rounded animate-pulse" />
                    <div className="h-4 w-36 bg-gray-300 rounded animate-pulse" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full pr-4">
                            <div className="h-10 w-2/3 bg-gray-300 rounded animate-pulse" />
                        </div>
                        <div className="h-10 w-48 bg-gray-300 rounded-md animate-pulse" />
                    </div>

                    {/* Blurb */}
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Pitch link */}
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />

                    <hr className="border-gray-100" />

                    {/* Metadata */}
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <div className="h-10 w-36 bg-gray-300 rounded-md animate-pulse" />
                        <div className="h-10 w-36 bg-gray-300 rounded-md animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ======================================================
   Investor Dropdown
====================================================== */

interface InvestorDropdownProps {
    investors: Investor[];
    isLoading: boolean;
    onSelect: (investor: Investor) => void;
    onClose: () => void;
    isOpen: boolean;
}

const InvestorDropdown: React.FC<InvestorDropdownProps> = ({
    investors,
    isLoading,
    onSelect,
    onClose,
    isOpen
}) => {
    const [search, setSearch] = useState('');
    const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        else {
            setSearch('');
            setSelectedInvestor(null);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filteredInvestors = investors.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-20 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-3 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Select Investor</h3>
                <button onClick={onClose}>
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="p-3">
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search investors..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border rounded-md"
                    />
                </div>

                <Link href="/investors/create" onClick={onClose}>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-md mb-3">
                        <Plus className="inline w-4 h-4 mr-1" />
                        Add New Investor
                    </button>
                </Link>

                <div className="max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <Loader2 className="animate-spin mx-auto" />
                    ) : (
                        filteredInvestors.map(inv => (
                            <div
                                key={inv._id}
                                onClick={() => setSelectedInvestor(inv)}
                                className={`p-2 border rounded mb-1 cursor-pointer ${
                                    selectedInvestor?._id === inv._id
                                        ? 'bg-blue-50 border-blue-500'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {inv.name}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="p-3 border-t flex justify-end">
                <button
                    disabled={!selectedInvestor}
                    onClick={() => selectedInvestor && onSelect(selectedInvestor)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    Confirm Transform
                </button>
            </div>
        </div>
    );
};

/* ======================================================
   Page
====================================================== */

export default function SingleStartupPage() {
    const [startup, setStartup] = useState<Startup | null>(null);
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [investorLoading, setInvestorLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);

    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const id = params.id as string;

    const loadStartupAndInvestors = useCallback(async () => {
        try {
            const startupData = await getStartupById(id);
            setStartup(startupData);

            const investorsData = await fetchInvestors();
            setInvestors(investorsData);
        } catch (err) {
            console.error(err);
            showToast('Failed to load startup details.', 'error');
        } finally {
            setInvestorLoading(false);
        }
    }, [id, showToast]);

    useEffect(() => {
        loadStartupAndInvestors();
    }, [loadStartupAndInvestors]);

    const handleDelete = async () => {
        if (!startup) return;
        if (!confirm(`Are you sure you want to delete ${startup.name}?`)) return;

        try {
            await deleteStartup(id);
            showToast('Startup deleted successfully!', 'success');
            router.push('/startups');
        } catch {
            showToast('Failed to delete startup.', 'error');
        }
    };

    const handleTransform = async (investor: Investor) => {
        if (!startup) return;

        const founderId = getFounderId();
        if (!founderId) {
            showToast('Authentication error. Please log in again.', 'error');
            return;
        }

        const dto: TransformIntroDto = {
            startup_id: startup._id,
            startup_name: startup.name,
            startup_pitch_link: startup.pitchLink || '',
            blurb: startup.blurb,
            investor_id: investor._id,
            investor_name: investor.name,
            founder_id: founderId,
            investor_preference: investor.preferred_intro_format as IntroFormat,
            intro_preferences_text: investor.intro_preferences_text,
        };

        setIsDropdownOpen(false);
        setIsTransforming(true);

        try {
            const res: TransformIntroResponse = await transformIntroApi(dto);

            const query = new URLSearchParams({
                startupId: dto.startup_id,
                startupName: dto.startup_name,
                investorId: dto.investor_id,
                investorName: dto.investor_name,
                founderId: dto.founder_id,
                preferredIntroFormat: dto.investor_preference,
                introPreferencesText: dto.intro_preferences_text,
                generatedIntro: res.transformed_intro,
            }).toString();

            showToast(`Intro generated for ${investor.name}`, 'success');
            router.push(`/transform?${query}`);
        } catch (err: any) {
            showToast(`Transformation failed: ${err.message || 'Unknown error'}`, 'error');
        } finally {
            setIsTransforming(false);
        }
    };

    if (!startup) {
        return <StartupDetailSkeleton />;
    }

    return (
        <div
            data-testid="page-startup-single"
            className="min-h-screen bg-cover bg-center pt-12 pb-12"
            style={{ backgroundImage: "url('/background-img.jpg')" }}
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <Link href="/startups" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Startups</span>
                </Link>

                <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl font-extrabold text-gray-900 pr-4">
                            {startup.name}
                        </h1>

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(v => !v)}
                                disabled={isTransforming || investorLoading}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50"
                            >
                                {isTransforming ? (
                                    <Wand2 className="w-5 h-5 animate-bounce" />
                                ) : (
                                    <ChevronDown className={`w-4 h-4 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                )}
                                <span>{isTransforming ? 'Generating Intro...' : 'Transform for Investor'}</span>
                            </button>

                            <InvestorDropdown
                                investors={investors}
                                isOpen={isDropdownOpen}
                                onClose={() => setIsDropdownOpen(false)}
                                onSelect={handleTransform}
                                isLoading={investorLoading}
                            />
                        </div>
                    </div>

                    <p className="text-lg text-gray-700">{startup.blurb}</p>

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

                    <hr />

                    <p className="text-sm text-gray-500">
                        Startup Created At: {new Date(startup.createdAt).toLocaleString()}
                    </p>

                    <div className="flex gap-4 pt-4 border-t">
                        <Link
                            href={`/startups/${startup._id}/edit`}
                            className="flex items-center space-x-1 bg-gray-800 px-4 py-2 rounded-md text-white"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </Link>

                        <button
                            onClick={handleDelete}
                            className="flex items-center space-x-1 bg-red-600 px-4 py-2 rounded-md text-white"
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
