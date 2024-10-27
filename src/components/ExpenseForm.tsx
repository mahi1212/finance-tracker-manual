import React, { useState } from 'react';
import { Expense, ExpenseCategory, Project, Employee, SalaryPayment } from '../types';

interface ExpenseFormProps {
  addExpense: (expense: Expense) => void;
  projects: Project[];
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  darkMode: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  addExpense,
  projects,
  employees,
  setEmployees,
  darkMode,
}) => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Salary');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [salaryMonth, setSalaryMonth] = useState('');
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && category && amount) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        date,
        category,
        amount: parseFloat(amount),
        description,
        projectId: projectId || undefined,
        employeeId: category === 'Salary' ? employeeId : undefined,
        salaryMonth: category === 'Salary' ? salaryMonth : undefined,
      };

      // Update employee salary history if this is a salary expense
      if (category === 'Salary' && employeeId) {
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee) {
          const salaryPayment: SalaryPayment = {
            month: salaryMonth,
            amount: parseFloat(amount),
            datePaid: date,
            expenseId: newExpense.id
          };

          setEmployees(employees.map(emp => {
            if (emp.id === employeeId) {
              return {
                ...emp,
                salaryHistory: [...(emp.salaryHistory || []), salaryPayment],
                paid: true
              };
            }
            return emp;
          }));
        }
      }

      addExpense(newExpense);
      setDate('');
      setCategory('Salary');
      setAmount('');
      setDescription('');
      setProjectId('');
      setEmployeeId('');
      setSalaryMonth('');
      setPaymentType('full');
    }
  };

  const handleEmployeeSelect = (selectedId: string) => {
    setEmployeeId(selectedId);
    const employee = employees.find(emp => emp.id === selectedId);
    if (employee) {
      if (employee.paymentType === 'monthly') {
        setAmount(employee.salary.toString());
        setPaymentType('full');
      } else {
        setPaymentType('partial');
        setAmount('');
      }
    }
  };

  const inputClass = `w-full p-2 rounded ${
    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
  }`;
  const buttonClass = `px-4 py-2 rounded ${
    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
  } text-white`;

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className={inputClass}
            required
          >
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Electricity">Electricity</option>
            <option value="Rent">Rent</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Marketing">Marketing</option>
            <option value="Travel">Travel</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {category === 'Salary' && (
          <>
            <div>
              <label className="block mb-2">Employee</label>
              <select
                value={employeeId}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - ${employee.salary} ({employee.paymentType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Salary Month</label>
              <input
                type="month"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            {employeeId && employees.find(emp => emp.id === employeeId)?.paymentType === 'project' && (
              <div>
                <label className="block mb-2">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => {
                    setPaymentType(e.target.value as 'full' | 'partial');
                    if (e.target.value === 'full') {
                      const employee = employees.find(emp => emp.id === employeeId);
                      if (employee) {
                        setAmount(employee.salary.toString());
                      }
                    } else {
                      setAmount('');
                    }
                  }}
                  className={inputClass}
                  required
                >
                  <option value="full">Full Payment</option>
                  <option value="partial">Partial Payment</option>
                </select>
              </div>
            )}
          </>
        )}

        <div>
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            required
            readOnly={category === 'Salary' && paymentType === 'full'}
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Project (Optional)</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className={`mt-4 ${buttonClass}`}>
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;