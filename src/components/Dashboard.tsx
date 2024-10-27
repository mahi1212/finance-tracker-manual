import React, { useState } from 'react';
import { CompanyData, Expense, Income, Employee, Project } from '../types';
import FinancialOverview from './FinancialOverview';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import EmployeeManagement from './EmployeeManagement';
import ProjectManagement from './ProjectManagement';

interface DashboardProps {
  companyData: CompanyData;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  companyData,
  expenses,
  setExpenses,
  incomes,
  setIncomes,
  employees,
  setEmployees,
  projects,
  setProjects,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabClass = (tab: string) => `
    px-4 py-2 font-medium
    ${activeTab === tab
      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
      : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
    }
    transition-colors duration-200
  `;
  console.log(incomes)
  
  return (
    <div>
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button className={tabClass('overview')} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={tabClass('expenses')} onClick={() => setActiveTab('expenses')}>
          Expenses
        </button>
        <button className={tabClass('income')} onClick={() => setActiveTab('income')}>
          Income
        </button>
        {companyData.type === 'withEmployees' && (
          <button className={tabClass('employees')} onClick={() => setActiveTab('employees')}>
            Employees
          </button>
        )}
        <button className={tabClass('projects')} onClick={() => setActiveTab('projects')}>
          Projects
        </button>
      </div>

      {activeTab === 'overview' && (
        <FinancialOverview
          expenses={expenses}
          incomes={incomes}
          employees={employees}
          projects={projects}
          darkMode={darkMode}
          setIncomes={setIncomes} // Ensure this is correctly passed
        />
      )}
      {activeTab === 'expenses' && (
        <ExpenseForm
          addExpense={(expense) => setExpenses([...expenses, expense])}
          projects={projects}
          employees={employees}
          setEmployees={setEmployees}
          darkMode={darkMode}
        />
      )}
      {activeTab === 'income' && (
        <IncomeForm
          addIncome={(income) => setIncomes([...incomes, income])}
          projects={projects}
          darkMode={darkMode}
        />
      )}
      {activeTab === 'employees' && companyData.type === 'withEmployees' && (
        <EmployeeManagement
          employees={employees}
          setEmployees={setEmployees}
          projects={projects}
          expenses={expenses}
          setExpenses={setExpenses}
          darkMode={darkMode}
        />
      )}
      {activeTab === 'projects' && (
        <ProjectManagement
          projects={projects}
          setProjects={setProjects}
          expenses={expenses}
          setExpenses={setExpenses}
          incomes={incomes}
          setIncomes={setIncomes}
          employees={employees}
          setEmployees={setEmployees}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Dashboard;