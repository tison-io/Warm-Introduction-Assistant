'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { getInvestors, deleteInvestor } from '../lib/investor-api';
import { Investor } from '../types/investor';
import Link from 'next/link';

const revalidatePath = (path: string) => {
  console.log(`Simulating revalidation for path: ${path}`);
};

const InvestorListPage = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchInvestors = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await getInvestors(searchQuery);
      setInvestors(data);
    } catch (error) {
      console.error('Error fetching investors:', error);
      alert('Failed to load investors.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvestors(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchInvestors]);

  const handleDelete = async (investorId: string) => {
    if (!confirm('Are you sure you want to delete this investor?')) return;

    try {
      await deleteInvestor(investorId);
      alert('Investor deleted successfully!');
      startTransition(() => {
        setInvestors(prev => prev.filter(inv => inv._id !== investorId));
        revalidatePath('/investors'); 
      });
    } catch (error) {
      console.error('Error deleting investor:', error);
      alert('Failed to delete investor.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-4xl font-light mb-1">Investors</h1>
            <p className="text-white/70">Manage your investor list</p>
          </div>
          <Link href="/investors/create" passHref>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 whitespace-nowrap">
              + Add Investor
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-6 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search investors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-400 text-white placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 border-none"
            />
          </div>
        </div>

        {/* Investor Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-400">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Preferred Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Intro Prefs</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading || isPending ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-white/70">
                    Loading investors...
                  </td>
                </tr>
              ) : investors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-white/70">
                    No investors found.
                  </td>
                </tr>
              ) : (
                investors.map((investor, index) => (
                  <tr key={investor._id} className="hover:bg-white/5 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{investor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-2">
                        {investor.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500 text-white">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{investor.preferred_intro_format}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{investor.intro_preferences_text}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link href={`/investors/${investor._id}/edit`} passHref>
                          <button title="Edit" className="text-black hover:text-white transition duration-150">
                            <Pencil className="h-5 w-5" />
                          </button>
                        </Link>
                        <button onClick={() => handleDelete(investor._id)} title="Delete" className="text-red-400 hover:text-red-500 transition duration-150">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestorListPage;
