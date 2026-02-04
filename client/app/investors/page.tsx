'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Search, Trash2, Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getInvestors, deleteInvestor } from '../lib/investor-api';
import { Investor } from '../types/investor';
import Link from 'next/link';
import { useToast } from '../components/Toast';

const InvestorListPage = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // New Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const fetchInvestorsData = useCallback(async (searchQuery: string, page: number) => {
    setLoading(true);
    try {
      const data = await getInvestors(searchQuery, undefined, page, 5); 
      setInvestors(data.investors);
      setTotalPages(data.meta.lastPage);
      setTotalItems(data.meta.total);
    } catch (error) {
      showToast('Failed to load investors.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1 && search !== '') {
        setCurrentPage(1);
      }
      fetchInvestorsData(search, currentPage);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, currentPage, fetchInvestorsData]);

  const handleDelete = async (investorId: string) => {
    if (!confirm('Are you sure you want to delete this investor?')) return;
    try {
      await deleteInvestor(investorId);
      showToast('Investor deleted successfully!', 'success');
      fetchInvestorsData(search, currentPage);
    } catch (error) {
      showToast('Failed to delete investor.', 'error');
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#0a0b1e]">
      <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Investors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#161930]/60 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
        </div>

        <div className="flex justify-end mb-8">
          <Link href="/investors/create">
            <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition">
              <Plus className="w-5 h-5" />
              <span>New Investor</span>
            </button>
          </Link>
        </div>

        <div className="bg-[#0f1120]/50 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="min-w-full">
            <thead className="border-b border-gray-800 bg-gray-900/50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">No.</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">Name</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">Tags</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-400">Preferred Format</th>
                <th className="px-6 py-5 text-right text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                investors.map((investor, index) => (
                  <tr key={investor._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-400">
                      {(currentPage - 1) * 5 + (index + 1)}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-white">{investor.name}</td>
                    <td className="px-6 py-5 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {investor.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-300">{investor.preferred_intro_format}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center space-x-4">
                        <Link href={`/investors/${investor._id}/edit`} className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-4">Edit</Link>
                        <button onClick={() => handleDelete(investor._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination UI */}
          <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing { }
              <span className="text-white font-medium">
                {investors.length > 0 ? (currentPage - 1) * 5 + 1 : 0}
              </span> 
              { } to { }
              <span className="text-white font-medium">
                {Math.min(currentPage * 5, totalItems)}
              </span> 
              { } of { }
              <span className="text-white font-medium">{totalItems}</span> investors
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center px-4">
                <span className="text-sm text-gray-400">Page <span className="text-white">{currentPage}</span> of {totalPages}</span>
              </div>

              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorListPage;