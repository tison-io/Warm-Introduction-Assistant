'use client';

import InvestorForm from '../../components/investors/InvestorForm';

const CreateInvestorPage = () => {
 return (
  <div
    data-testid="page-investor-create"
    className="min-h-screen bg-cover bg-center pt-20 pb-12"
    style={{ backgroundImage: "url('/background-img.jpg')" }}
  >
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-white mb-8">
        <h1 className="text-3xl font-bold">Create New Investor Profile</h1>
        <p className="text-gray-300 mt-1">Enter the details for the new investor, including their preferences.</p>
      </div>
      <InvestorForm isEdit={false} />
    </div>
  </div>
  );
};

export default CreateInvestorPage;