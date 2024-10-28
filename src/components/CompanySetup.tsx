import React, { useState } from 'react';
import { CompanyData } from '../types';
import { Building, User } from 'lucide-react';

interface CompanySetupProps {
  setCompanyData: (data: CompanyData) => void;
  companyData: CompanyData | null;
  darkMode: boolean;
}

const CompanySetup: React.FC<CompanySetupProps> = ({ setCompanyData, companyData, darkMode }) => {
  const [companyType, setCompanyType] = useState<'solo' | 'withEmployees'>(
    companyData?.type || 'solo'
  );

  const handleSetup = () => {
    if (companyType) {
      setCompanyData({ type: companyType });
    }
  };

  const buttonClass = `px-4 py-2 rounded ${
    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
  } text-white`;

  const cardClass = `p-6 rounded-lg ${
    darkMode ? 'bg-gray-800' : 'bg-white'
  } shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer`;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Select a mood</h2>
      <p className="mb-6 text-center">We offer both comapany and solo mood. You can switch anytime you want</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className={`${cardClass} ${
            companyType === 'solo'
              ? 'ring-2 ring-blue-500'
              : ''
          }`}
          onClick={() => setCompanyType('solo')}
        >
          <div className="flex flex-col items-center">
            <User size={48} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h3 className="text-xl font-semibold mb-2">Solo Owner</h3>
            <p className="text-center text-sm opacity-75">
              Perfect for freelancers and individual business owners
            </p>
          </div>
        </div>
        <div
          className={`${cardClass} ${
            companyType === 'withEmployees'
              ? 'ring-2 ring-blue-500'
              : ''
          }`}
          onClick={() => setCompanyType('withEmployees')}
        >
          <div className="flex flex-col items-center">
            <Building size={48} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h3 className="text-xl font-semibold mb-2">With Employees</h3>
            <p className="text-center text-sm opacity-75">
              For businesses with team members and employees
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className={`${buttonClass} px-8 py-3 text-lg ${
            !companyType ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSetup}
          disabled={!companyType}
        >
          {companyData ? 'Switch Mood' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default CompanySetup;