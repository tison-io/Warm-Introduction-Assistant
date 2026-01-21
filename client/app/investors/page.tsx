'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { getInvestors, deleteInvestor } from '../lib/investor-api';
import { Investor } from '../types/investor';
import Link from 'next/link';
import { useToast } from '../components/Toast';

const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const starting = name.slice(0, 3);
  return `${starting}${'*'.repeat(5)}@${domain}`;
};

const InvestorListPage = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const fetchInvestors = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await getInvestors(searchQuery); 
      setInvestors(data);
    } catch (error) {
      console.error('Error fetching investors:', error);
      showToast('Failed to load investors.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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
      showToast('Investor deleted successfully!', 'success');
      startTransition(() => {
        setInvestors(prev => prev.filter(inv => inv._id !== investorId));
      });
    } catch (error) {
      showToast('Failed to delete investor.', 'error');
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(180deg, #0a0b1e 0%, #05050a 100%)" }}
    >
      <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        
        {/* Full Width Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Investors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#161930]/60 border border-gray-800 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition duration-150"
          />
        </div>

        {/* Header Section */}
        <div className="flex justify-end mb-8">
          <Link href="/investors/create">
            <button
              data-testid="add-investor-btn"
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-5 h-5" />
              <span>New Investor</span>
            </button>
          </Link>
        </div>

        {/* Investor Table Container */}
        <div className="bg-[#0f1120]/50 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="min-w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">No.</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">Name</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">Tags</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">Preferred Format</th>
                <th className="px-6 py-5 text-right text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading || isPending ? (
                <tr>
                  <td colSpan={5} className="py-20">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                      <p className="text-gray-500 text-sm">Loading investors...</p>
                    </div>
                  </td>
                </tr>
              ) : investors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">
                    No investors found matching your search.
                  </td>
                </tr>
              ) : (
                investors.map((investor, index) => (
                  <tr 
                    key={investor._id}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-6 py-5 text-sm text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-white">
                      {investor.name}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {investor.tags.map((tag, i) => (
                          <span 
                            key={i}
                            className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-300">
                      {investor.preferred_intro_format}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center space-x-4">
                        <Link href={`/investors/${investor._id}/edit`}>
                          <button className="text-indigo-400 hover:text-indigo-300 font-medium text-sm underline underline-offset-4 decoration-indigo-500/30">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(investor._id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
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