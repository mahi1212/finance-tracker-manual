import React from 'react';

interface Income {
  id: string;
  date: string;
  source?: string;
  projectId?: string;
  amount: number;
  description?: string;
}

interface IncomeListProps {
  incomes: Income[];
  darkMode: boolean;
  getProjectName: (projectId: string) => string;
}

const IncomeList: React.FC<IncomeListProps> = ({ incomes, darkMode, getProjectName }) => {
  return (
    <div>
      <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Source</th>
              <th className="p-2 text-left">Project</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <td className="p-2">{income.date}</td>
                <td className="p-2">{income.source || 'Client Payment'}</td>
                <td className="p-2">{getProjectName(income.projectId || '')}</td>
                <td className="p-2">${income.amount.toFixed(2)}</td>
                <td className="p-2">{income.description || 'Payment received'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeList;