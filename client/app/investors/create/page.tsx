'use client';

import { useRouter } from 'next/navigation';
import InvestorForm from '../../components/investors/InvestorForm';

const CreateInvestorPage = () => {
  const router = useRouter();
 return (
  <div
    data-testid="page-investor-create"
    className="min-h-screen bg-cover bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 pt-20 pb-12"
  >
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
            <button 
                onClick={() => router.back()}
                className="text-slate-500 hover:text-white text-xl transition"
            >
              ← Back
            </button>
        </div>
      <InvestorForm isEdit={false} />
    </div>
  </div>
  );
};

export default CreateInvestorPage;