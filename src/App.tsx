import React, { useState, useEffect } from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import CompanySetup from './components/CompanySetup';
import Dashboard from './components/Dashboard';
import { CompanyData, Expense, Income, Employee, Project } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('companyData');
    if (savedData) {
      setCompanyData(JSON.parse(savedData));
    }
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    const savedIncomes = localStorage.getItem('incomes');
    if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes));
    }
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('companyData', JSON.stringify(companyData));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('incomes', JSON.stringify(incomes));
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [companyData, expenses, incomes, employees, projects]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCompanySetup = (data: CompanyData) => {
    setCompanyData(data);
    setShowSetup(false);
    // Clear employees if switching to solo mode
    if (data.type === 'solo') {
      setEmployees([]);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Company Finance Manager</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSetup(true)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
              } transition-colors duration-200`}
              title="Company Settings"
            >
              <Settings size={24} />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'
              }`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </header>
        {(showSetup || !companyData) ? (
          <CompanySetup 
            setCompanyData={handleCompanySetup} 
            companyData={companyData}
            darkMode={darkMode} 
          />
        ) : (
          <Dashboard
            companyData={companyData}
            expenses={expenses}
            setExpenses={setExpenses}
            incomes={incomes}
            setIncomes={setIncomes}
            employees={employees}
            setEmployees={setEmployees}
            projects={projects}
            setProjects={setProjects}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;