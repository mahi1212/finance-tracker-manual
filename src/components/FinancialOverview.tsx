import React, { useState } from 'react';
import { Expense, Income, Employee, Project } from '../types'; //ProjectPayment
import ExpenseList from './ExpenseList';
// import IncomeTable from './IncomeList';
import IncomeList from './IncomeList';

interface FinancialOverviewProps {
  expenses: Expense[];
  incomes: Income[];
  employees: Employee[];
  projects: Project[];
  darkMode: boolean;
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>; // Ensure this type is correct
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ expenses, incomes, employees, projects, darkMode }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  // const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  // const [editDate, setEditDate] = useState(''); //setIncomes removed from props
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [editAmount, setEditAmount] = useState('');
  // const [editDescription, setEditDescription] = useState('');

  const filteredExpenses = expenses.filter(expense => expense.date.startsWith(selectedMonth));
  const filteredIncomes = incomes.filter(income => income.date.startsWith(selectedMonth));

  const paidPayments = projects.flatMap(project =>
    project.payments.filter(payment => payment.status === 'paid' && payment.date.startsWith(selectedMonth))
  );

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncomes = [...filteredIncomes, ...paidPayments].reduce((sum, income) => sum + income.amount, 0);
  const totalSalaries = employees.reduce((sum, employee) => sum + employee.salary + employee.extraPayment, 0);

  const getProjectName = (projectId: string | undefined) => {
    if (!projectId) return 'N/A';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '';
  };

  // const getEmployeeDetails = (expense: Expense) => {
  //   if (expense.category === 'Salary' && expense.employeeId) {
  //     const employee = employees.find(emp => emp.id === expense.employeeId);
  //     return employee ? ` - ${employee.name} (${expense.salaryMonth})` : '';
  //   }
  //   return '';
  // };

  // const handleEditClick = (incomeOrPayment: Income | ProjectPayment) => {
  //   setEditingIncome(incomeOrPayment as Income);
  //   setEditAmount(incomeOrPayment.amount.toString());
  //   setEditDate(incomeOrPayment.date);
  //   setEditDescription(incomeOrPayment.description ? incomeOrPayment.description : 'Payment received');
  //   setIsEditModalOpen(true);
  // };

  // const handleSaveEdit = () => {
  //   if (editingIncome) {
  //     const updatedIncomes = incomes.map(income =>
  //       income.id === editingIncome.id
  //         ? {
  //           ...income,
  //           amount: parseFloat(editAmount),
  //           date: editDate,
  //           description: editDescription // Ensure this updates the description
  //         }
  //         : income
  //     );
  //     setIncomes(updatedIncomes); // Update the incomes state with the new data
  //     setIsEditModalOpen(false); // Close the modal
  //     setEditingIncome(null); // Reset the editing income
  //   }
  // };

  const cardClass = `p-4 rounded shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`;
  // const tableClass = `w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
      <div className="mb-4">
        <label className="block mb-2">Select Month</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-2">Total Income</h3>
          <p className="text-2xl font-semibold text-green-500">${totalIncomes.toFixed(2)}</p>
        </div>
        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-2">Total Expenses</h3>
          <p className="text-2xl font-semibold text-red-500">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-2">Net Profit</h3>
          <p className={`text-2xl font-semibold ${totalIncomes - totalExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${(totalIncomes - totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>
      <div className={`${cardClass} mb-8`}>
        <h3 className="text-xl font-bold mb-2">Employee Salaries</h3>
        <p className="text-2xl font-semibold">${totalSalaries.toFixed(2)}</p>
      </div>


      <div className={`${cardClass} mb-8`}>
        <h3 className="text-xl font-bold mb-4">Expense List</h3>
        <ExpenseList expenses={filteredExpenses} darkMode={darkMode} />
      </div>




      <div className={`${cardClass} mb-8`}>
        <h3 className="text-xl font-bold mb-4">Income List</h3>
        <IncomeList
          incomes={[...filteredIncomes, ...paidPayments]}
          darkMode={darkMode}
          getProjectName={getProjectName}
        />
      </div>

    </div>
  );
};

export default FinancialOverview;