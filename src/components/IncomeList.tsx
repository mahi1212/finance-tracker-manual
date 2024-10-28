import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

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
        <Table className="w-full">
          <TableHeader>
            <TableRow className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <TableHead className="p-2 text-left">Date</TableHead>
              <TableHead className="p-2 text-left">Source</TableHead>
              <TableHead className="p-2 text-left">Project</TableHead>
              <TableHead className="p-2 text-left">Amount</TableHead>
              <TableHead className="p-2 text-left">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <TableCell className="p-2">{income.date}</TableCell>
                <TableCell className="p-2">{income.source || 'Client Payment'}</TableCell>
                <TableCell className="p-2">{getProjectName(income.projectId || '')}</TableCell>
                <TableCell className="p-2">${income.amount.toFixed(2)}</TableCell>
                <TableCell className="p-2">{income.description || 'Payment received'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IncomeList;