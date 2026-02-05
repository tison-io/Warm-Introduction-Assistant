// app/investors/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InvestorForm from '../../../components/investors/InvestorForm';
import { getInvestorById } from '../../../lib/investor-api';
import { Investor } from '../../../types/investor';
import { Loader2, AlertCircle } from 'lucide-react';

const EditInvestorPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchInvestor = async () => {
      try {
        setLoading(true);
        const data = await getInvestorById(id);
        setInvestor(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load investor details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0b1e]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-slate-400 font-medium">Retrieving investor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Load Failed</h1>
          <p className="text-slate-400 mb-6">{error || 'The investor record could not be found.'}</p>
          <button
            onClick={() => router.push('/investors')}
            className="w-full px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition duration-150 font-semibold"
          >
            Back to Pipeline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-slate-900 to-gray-950 pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <button 
                onClick={() => router.back()}
                className="text-slate-500 hover:text-white text-xl transition"
            >
              ← Back
            </button>
        </div>
        <div data-testid="page-investor-edit">
          <InvestorForm initialData={investor} isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditInvestorPage;