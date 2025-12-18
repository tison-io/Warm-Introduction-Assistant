'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { getInvestors, deleteInvestor } from '../lib/investor-api';
import { Investor } from '../types/investor';
import Link from 'next/link';
import { useToast } from '../components/Toast';

const revalidatePath = (path: string) => {
  console.log(`Simulating revalidation for path: ${path}`);
};

// Mask email like: ash*****@gmail.com
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
  const router = useRouter();
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
      showToast('Investor deleted successfully!', 'success');
      startTransition(() => {
        setInvestors(prev => prev.filter(inv => inv._id !== investorId));
        revalidatePath('/investors');
      });
    } catch (error) {
      console.error('Error deleting investor:', error);
      showToast('Failed to delete investor.', 'error');
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-6">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
    </div>
  );

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
            <button
              data-testid="add-investor-btn"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 whitespace-nowrap">
              + Add Investor
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-6 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
            <input
              type="text"
              placeholder="Search investors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white text-black placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 border-none"
            />
          </div>
        </div>

        {/* Investor Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-400">
          <table className="min-w-full divide-y divide-white/20">
            
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Preferred Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading || isPending ? (
                <tr>
                  <td colSpan={6}>
                    <LoadingSpinner />
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
                  <tr 
                    data-testid="investor-row"
                    key={investor._id}
                    className="transition duration-150 bg-white"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {investor.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-2">
                        {investor.tags.map((tag, i) => (
                          <span 
                            key={i}
                            className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {investor.preferred_intro_format}
                    </td>

                    {/* EMAIL COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <span 
                        title={investor.email} 
                        className="cursor-help"
                      >
                        {maskEmail(investor.email)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link href={`/investors/${investor._id}/edit`} passHref>
                          <button data-testid="edit-investor-btn" 
                            title="Edit"
                            className="text-black hover:text-gray-600 transition duration-150">
                            <Pencil className="h-5 w-5" />
                          </button>
                        </Link>

                        <button
                          data-testid="delete-investor-btn"
                          onClick={() => handleDelete(investor._id)}
                          title="Delete"
                          className="text-red-400 hover:text-red-500 transition duration-150"
                        >
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
