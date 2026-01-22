'use client';

import { useParams } from 'next/navigation';
import InvestorForm from '../../../../components/investors/InvestorForm';

const WorkspaceCreateInvestorPage = () => {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 pt-20 pb-12">
      <div className="max-w-xl mx-auto px-4">
        <InvestorForm 
          isEdit={false} 
          workspaceId={workspaceId} 
          submitLabel="Add to Pipeline" 
        />
      </div>
    </div>
  );
};

export default WorkspaceCreateInvestorPage;