// app/investors/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InvestorForm from '../../../components/investors/InvestorForm';
import { getInvestors } from '../../../lib/investor-api';
import { Investor } from '../../../types/investor';
import { Loader2 } from 'lucide-react';

const EditInvestorPage = () => {
  const router = useRouter();
  const params = useParams(); // Next.js App Router hook
  const id = params?.id;

  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchInvestor = async () => {
      setLoading(true);
      try {
        const allInvestors = await getInvestors();
        const found = allInvestors.find(inv => inv._id === id);
        if (!found) throw new Error('Investor not found');
        setInvestor(found);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load investor');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
          <p className="text-white text-xl font-medium">Loading investor details...</p>
        </div>
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div
        className="min-h-screen bg-cover bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 pt-20 pb-12"
      >
        <div className="bg-red-900/50 backdrop-blur-md rounded-xl p-6 text-white max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p>{error || `Could not find investor with ID: ${id}`}</p>
          <button
            onClick={() => router.push('/investors')}
            className="mt-4 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-150"
          >
            Back to Investors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 pt-20 pb-12"
    >
      <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div data-testid="page-investor-edit">
          <InvestorForm initialData={investor} isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditInvestorPage;
