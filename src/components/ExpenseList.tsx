import React from 'react';
import { Expense } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface ExpenseListProps {
  expenses: Expense[];
  darkMode: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, darkMode }) => {
  return (
    <div>
      <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
        <Table className="w-full">
          <TableHeader>
            <TableRow className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <TableHead className="p-2 text-left">Date</TableHead>
              <TableHead className="p-2 text-left">Category</TableHead>
              <TableHead className="p-2 text-left">Amount</TableHead>
              <TableHead className="p-2 text-left">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <TableCell className="p-2">{expense.date}</TableCell>
                <TableCell className="p-2">{expense.category}</TableCell>
                <TableCell className="p-2">${expense.amount.toFixed(2)}</TableCell>
                <TableCell className="p-2">{expense.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseList;