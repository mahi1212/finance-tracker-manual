import React, { useState } from 'react';
import { Employee, Project, Expense, SalaryPayment } from '../types';
import { Plus, Edit, DollarSign, Calendar, XCircle } from 'lucide-react';

interface EmployeeManagementProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  projects: Project[];
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  darkMode: boolean;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  setEmployees,
  projects,
  expenses,
  setExpenses,
  darkMode,
}) => {
  const [showAddEmployeePopup, setShowAddEmployeePopup] = useState(false);
  const [showSalaryHistoryPopup, setShowSalaryHistoryPopup] = useState(false);
  const [showPaySalaryPopup, setShowPaySalaryPopup] = useState(false);
  const [showEditEmployeePopup, setShowEditEmployeePopup] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [paymentType, setPaymentType] = useState<'monthly' | 'project'>('monthly');
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && salary) {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name,
        salary: parseFloat(salary),
        paid: false,
        extraPayment: 0,
        paymentType,
        projects: [],
        salaryHistory: [],
        active: true // New property to track active status
      };
      setEmployees([...employees, newEmployee]);
      setName('');
      setSalary('');
      setPaymentType('monthly');
      setShowAddEmployeePopup(false);
    }
  };

  const handlePaySalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployeeId && salaryMonth && salaryAmount) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      if (employee) {
        const newExpense: Expense = {
          id: Date.now().toString(),
          date: new Date().toISOString().slice(0, 10),
          category: 'Salary',
          amount: parseFloat(salaryAmount),
          description: `Paid for a project`,
          employeeId: employee.id,
          salaryMonth
        };

        const salaryPayment: SalaryPayment = {
          month: salaryMonth,
          amount: parseFloat(salaryAmount),
          datePaid: new Date().toISOString().slice(0, 10),
          expenseId: newExpense.id
        };

        const updatedEmployees = employees.map(emp => {
          if (emp.id === selectedEmployeeId) {
            return {
              ...emp,
              salaryHistory: [...(emp.salaryHistory || []), salaryPayment]
            };
          }
          return emp;
        });

        setExpenses([...expenses, newExpense]);
        setEmployees(updatedEmployees);
        setShowPaySalaryPopup(false);
        setSalaryMonth('');
        setSalaryAmount('');
      }
    }
  };

  const handleEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEmployee) {
      const updatedEmployees = employees.map(emp =>
        emp.id === editEmployee.id ? editEmployee : emp
      );
      setEmployees(updatedEmployees);
      setShowEditEmployeePopup(false);
      setEditEmployee(null);
    }
  };

  const handleToggleActiveStatus = (employeeId: string) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, active: !emp.active } : emp
    );
    setEmployees(updatedEmployees);
  };

  const getMonthsSalaryStatus = (employee: Employee) => {
    return employee.salaryHistory?.map(payment => {
      const relatedExpense = expenses.find(exp => exp.id === payment.expenseId);
      return {
        month: payment.month,
        paid: true,
        amount: payment.amount,
        datePaid: payment.datePaid,
        paymentType: employee.paymentType,
        description: relatedExpense ? relatedExpense.description : 'No description'
      };
    }) || [];
  };

  // const calculateRemainingSalary = (employee: Employee, currentMonth: string) => {
  //   const totalPaid = employee.salaryHistory
  //     ?.filter(payment => payment.month === currentMonth)
  //     .reduce((sum, payment) => sum + payment.amount, 0) || 0;
  //   return employee.salary - totalPaid;
  // };

  const inputClass = `w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
    }`;

  const buttonClass = `px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
    } text-white`;

  const popupClass = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ';

  const popupContentClass = `${darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-lg shadow-lg max-w-lg w-full`;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <button
          onClick={() => setShowAddEmployeePopup(true)}
          className={`${buttonClass} flex items-center`}
        >
          <Plus size={16} className="mr-2" />
          Add Employee
        </button>
      </div>

      <div className="overflow-x-auto mb-8">
        <h3 className="text-xl font-bold mb-2">Active Employees</h3>
        <table className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Salary</th>
              <th className="p-2 text-left">Payment Type</th>
              <th className="p-2 text-left">Projects</th>
              {/* <th className="p-2 text-left">Due Amount</th> */}
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.filter(emp => emp.active).map((employee) => (
              <tr key={employee.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <td className="p-2">{employee.name}</td>
                <td className="p-2">${employee.salary.toFixed(2)}</td>
                <td className="p-2">{employee.paymentType}</td>
                <td className="p-2">
                  {projects
                    .filter(project => project.employees.some(emp => emp.employeeId === employee.id))
                    .map(project => project.name)
                    .join(', ')}
                </td>
                {/* <td className="p-2">
                  ${calculateRemainingSalary(employee, new Date().toISOString().slice(0, 7)).toFixed(2)}
                </td> */}
                <td className="p-2 space-x-2 flex">
                  <button
                    onClick={() => {
                      setSelectedEmployeeId(employee.id);
                      setShowSalaryHistoryPopup(true);
                    }}
                    className={`${buttonClass} flex items-center`}
                  >
                    <DollarSign size={16} className="mr-2" />
                    History
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployeeId(employee.id);
                      setSalaryAmount(employee.salary.toString());
                      setShowPaySalaryPopup(true);
                    }}
                    className={`${buttonClass} flex items-center ml-2`}
                  >
                    <Calendar size={16} className="mr-2" />
                    Pay Salary
                  </button>
                  <button
                    onClick={() => {
                      setEditEmployee(employee);
                      setShowEditEmployeePopup(true);
                    }}
                    className={`${buttonClass} flex items-center ml-2`}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActiveStatus(employee.id)}
                    className={`${buttonClass} flex items-center ml-2 bg-red-500 hover:bg-red-600`}
                  >
                    <XCircle size={16} className="mr-2" />
                    Abandon
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-xl font-bold mb-2">Abandoned Employees</h3>
        <table className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Salary</th>
              <th className="p-2 text-left">Payment Type</th>
              <th className="p-2 text-left">Projects</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.filter(emp => !emp.active).map((employee) => (
              <tr key={employee.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <td className="p-2">{employee.name}</td>
                <td className="p-2">${employee.salary.toFixed(2)}</td>
                <td className="p-2">{employee.paymentType}</td>
                <td className="p-2">
                  {projects
                    .filter(project => project.employees.some(emp => emp.employeeId === employee.id))
                    .map(project => project.name)
                    .join(', ')}
                </td>
                <td className="p-2 space-x-2 flex">
                  <button
                    onClick={() => {
                      setSelectedEmployeeId(employee.id);
                      setShowSalaryHistoryPopup(true);
                    }}
                    className={`${buttonClass} flex items-center`}
                  >
                    <DollarSign size={16} className="mr-2" />
                    History
                  </button>
                  <button
                    onClick={() => handleToggleActiveStatus(employee.id)}
                    className={`${buttonClass} flex items-center ml-2 bg-green-500 hover:bg-green-600`}
                  >
                    <XCircle size={16} className="mr-2" />
                    Reactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddEmployeePopup && (
        <div className={popupClass}>
          <div className={popupContentClass}>
            <h3 className="text-xl font-bold mb-4">Add New Employee</h3>
            <form onSubmit={handleAddEmployee}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Salary</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as 'monthly' | 'project')}
                  className={inputClass}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="project">Project-based</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeePopup(false)}
                  className={`${buttonClass} bg-gray-500 hover:bg-gray-600 mr-2`}
                >
                  Cancel
                </button>
                <button type="submit" className={buttonClass}>
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaySalaryPopup && selectedEmployeeId && (
        <div className={popupClass}>
          <div className={popupContentClass}>
            <h3 className="text-xl font-bold mb-4">Pay Salary</h3>
            <form onSubmit={handlePaySalary}>
              <div className="mb-4">
                <label className="block mb-2">Month</label>
                <input
                  type="month"
                  value={salaryMonth}
                  onChange={(e) => setSalaryMonth(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Amount</label>
                <input
                  type="number"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaySalaryPopup(false)}
                  className={`${buttonClass} bg-gray-500 hover:bg-gray-600 mr-2`}
                >
                  Cancel
                </button>
                <button type="submit" className={buttonClass}>
                  Pay Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditEmployeePopup && editEmployee && (
        <div className={popupClass}>
          <div className={popupContentClass}>
            <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
            <form onSubmit={handleEditEmployee}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Salary</label>
                <input
                  type="number"
                  value={editEmployee.salary}
                  onChange={(e) => setEditEmployee({ ...editEmployee, salary: parseFloat(e.target.value) })}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment Type</label>
                <select
                  value={editEmployee.paymentType}
                  onChange={(e) => setEditEmployee({ ...editEmployee, paymentType: e.target.value as 'monthly' | 'project' })}
                  className={inputClass}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="project">Project-based</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditEmployeePopup(false)}
                  className={`${buttonClass} bg-gray-500 hover:bg-gray-600 mr-2`}
                >
                  Cancel
                </button>
                <button type="submit" className={buttonClass}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSalaryHistoryPopup && selectedEmployeeId && (
        <div className={popupClass}>
          <div className={popupContentClass}>
            <h3 className="text-xl font-bold mb-4">Salary History</h3>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-nowrap">Month</th>
                    <th className="p-2 text-left text-nowrap">Status</th>
                    <th className="p-2 text-left text-nowrap">Amount</th>
                    <th className="p-2 text-left text-nowrap">Date</th>
                    <th className="p-2 text-left text-nowrap">Payment Type</th>
                  </tr>
                </thead>
                <tbody>
                  {getMonthsSalaryStatus(employees.find(e => e.id === selectedEmployeeId)!).map(({ month, paid, amount, datePaid, paymentType, description }) => (
                    <tr key={month}>
                      <td className="p-2 text-nowrap">{month}</td>
                      <td className="p-2 text-nowrap">
                        <span className={`px-2 py-1 text-nowrap rounded ${paid ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                          {paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="p-2 text-nowrap">{paid ? `$${amount.toFixed(2)}` : '-'}</td>
                      <td className="p-2 text-nowrap">{paid ? datePaid : '-'}</td>
                      <td className="p-2 text-nowrap">{paymentType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSalaryHistoryPopup(false)}
                className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;