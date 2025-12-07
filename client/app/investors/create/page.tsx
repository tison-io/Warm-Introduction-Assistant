// app/investors/create/page.tsx
'use client';

import InvestorForm from '../../components/investors/InvestorForm';

const CreateInvestorPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/background-img.jpg')" }}
    >
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl text-white">
          <h1 className="text-4xl font-light text-white mb-2">Create New Investor</h1>
          <p className="text-white/70 mb-6">Enter the details for the new investor.</p>
          <InvestorForm isEdit={false} />
        </div>
      </div>
    </div>
  );
};

export default CreateInvestorPage;
