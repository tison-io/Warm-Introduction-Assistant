"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, Plus, Loader2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { getInvestors, deleteInvestor } from '../lib/investor-api';
import { Investor } from '../types/investor';
import Link from 'next/link';
import { useToast } from '../components/Toast';

const InvestorListPage = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const { showToast } = useToast();

  const fetchInvestorsData = useCallback(async (searchQuery: string, page: number) => {
    setLoading(true);
    try {
      const data = await getInvestors(searchQuery, undefined, page, 5); 
      setInvestors(data.investors);
      setTotalPages(data.meta.lastPage || 1);
      setTotalItems(data.meta.total || 0);
    } catch (error) {
      showToast('Failed to load investors.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
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
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 text-slate-200 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Investor Connections
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Manage your investor network here.
          </p>
        </div>

        {/* Search and Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or tags..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-800 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          <Link href="/investors/create" className="shrink-0">
            <button className="w-full h-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              <Plus className="w-5 h-5" />
              <span>Add Investor</span>
            </button>
          </Link>
        </div>

        {/* Table / List Container */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">

          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-[900px] w-full">
              <thead className="border-b border-slate-800 bg-slate-950/50">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-500">No.</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Investor</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Tags</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Format</th>
                  <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto" />
                      <p className="mt-4 text-slate-500 font-medium">Fetching connections...</p>
                    </td>
                  </tr>
                ) : investors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-slate-800/50 p-6 rounded-3xl mb-4 border border-slate-700">
                          <Users className="h-6 w-6 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No investors found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-8">
                          {search ? `No results for "${search}". Try a different name or tag.` : "You haven't added any investors yet. Start building your network today."}
                        </p>
                        {!search && (
                          <Link href="/investors/create">
                            <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-all border border-slate-700">
                              Add new investor
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  investors.map((investor, index) => (
                    <tr key={investor._id} className="hover:bg-blue-500/5 transition-colors group">
                      <td className="px-6 py-5 text-sm text-slate-500 font-mono">
                        {String((currentPage - 1) * 5 + (index + 1)).padStart(2, '0')}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {investor.name}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {investor.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-black px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-tighter">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400">{investor.preferred_intro_format}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end items-center space-x-4">
                          <Link href={`/investors/${investor._id}/edit`} className="text-slate-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest transition-colors">Edit</Link>
                          <button onClick={() => handleDelete(investor._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
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

          {/* Pagination UI - Only show if data exists */}
          {investors.length > 0 && (
            <div className="px-6 py-6 bg-slate-950/30 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Showing <span className="text-white font-bold">{(currentPage - 1) * 5 + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * 5, totalItems)}</span> of <span className="text-white font-bold">{totalItems}</span> members
              </p>
              
              <div className="flex items-center space-x-3">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                  <span className="text-sm font-bold text-blue-500">{currentPage} <span className="text-slate-600 mx-1">/</span> {totalPages}</span>
                </div>

                <button
                  disabled={currentPage === totalPages || loading}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorListPage;