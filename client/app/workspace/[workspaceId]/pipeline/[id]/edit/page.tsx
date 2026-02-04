'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InvestorForm from '../../../../../components/investors/InvestorForm';
import { getInvestors } from '../../../../../lib/investor-api';
import { Investor } from '../../../../../types/investor';
import { Loader2 } from 'lucide-react';

const WorkspaceEditInvestorPage = () => {
  const router = useRouter();
  const { id, workspaceId } = useParams();

  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const workspaceInvestors = await getInvestors(undefined, workspaceId as string);
        const found = workspaceInvestors.find(inv => inv._id === id);
        
        if (!found) throw new Error('Investor not found in this workspace');
        setInvestor(found);
      } catch (err) {
        console.error(err);
        router.push(`/workspace/${workspaceId}/pipeline`);
      } finally {
        setLoading(false);
      }
    };

    if (id && workspaceId) fetchInvestor();
  }, [id, workspaceId, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950">
        <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <InvestorForm 
          initialData={investor!} 
          isEdit={true} 
          workspaceId={workspaceId as string} 
        />
      </div>
    </div>
  );
};

export default WorkspaceEditInvestorPage;