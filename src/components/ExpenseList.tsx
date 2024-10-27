import React from 'react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  darkMode: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, darkMode }) => {
  return (
    <div>
      <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <td className="p-2">{expense.date}</td>
                <td className="p-2">{expense.category}</td>
                <td className="p-2">${expense.amount.toFixed(2)}</td>
                <td className="p-2">{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;