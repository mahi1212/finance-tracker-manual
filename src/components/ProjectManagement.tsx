import React, { useState } from 'react';
import { Project, Employee, Expense, Income, ProjectEmployee, ProjectPayment, SalaryPayment } from '../types';
import { MoveRight, Plus, Users } from 'lucide-react';

interface ProjectManagementProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  darkMode: boolean;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({
  projects,
  setProjects,
  expenses,
  setExpenses,
  incomes,
  setIncomes,
  employees,
  setEmployees,
  darkMode
}) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');
  const [showAddEmployeePopup, setShowAddEmployeePopup] = useState(false);
  const [showProjectDetailsPopup, setShowProjectDetailsPopup] = useState(false);
  const [showAddPaymentPopup, setShowAddPaymentPopup] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [projectSalary, setProjectSalary] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'upcoming' | 'cancelled' | 'paid'>('upcoming');
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [showAddProjectSection, setShowAddProjectSection] = useState<boolean>(false);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && startDate && endDate) {
      const newProject: Project = {
        id: Date.now().toString(),
        name,
        startDate,
        endDate,
        status,
        totalIncome: 0,
        totalExpense: 0,
        employees: [],
        payments: [],
        salaryPayments: {}
      };
      setProjects([...projects, newProject]);
      setName('');
      setStartDate('');
      setEndDate('');
      setStatus('upcoming');
    }
  };

  const handleEditProjectDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            name,
            startDate,
            endDate,
            status
          };
        }
        return project;
      }));
      setShowProjectDetailsPopup(false);
    }
  };

  const handleAddEmployeeToProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId && selectedEmployeeId) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      const salary = employee?.salaryType === 'monthly' ? employee.salary : parseFloat(projectSalary);

      const projectEmployee: ProjectEmployee = {
        employeeId: selectedEmployeeId,
        projectSalary: salary
      };

      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            employees: [...project.employees, projectEmployee]
          };
        }
        return project;
      }));

      setEmployees(employees.map(employee => {
        if (employee.id === selectedEmployeeId) {
          return {
            ...employee,
            projects: [...employee.projects, { employeeId: selectedProjectId, projectSalary: salary }]
          };
        }
        return employee;
      }));

      setSelectedEmployeeId('');
      setProjectSalary('');
      setShowAddEmployeePopup(false);
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId && paymentAmount && paymentDate) {
      const newPayment: ProjectPayment = {
        id: Date.now().toString(),
        amount: parseFloat(paymentAmount),
        status: paymentStatus,
        date: paymentDate
      };

      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          const updatedProject = {
            ...project,
            payments: [...project.payments, newPayment]
          };

          if (paymentStatus === 'paid') {
            updatedProject.totalIncome += newPayment.amount;
          }

          return updatedProject;
        }
        return project;
      }));

      setPaymentAmount('');
      setPaymentDate('');
      setPaymentStatus('upcoming');
      setShowAddPaymentPopup(false);
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    if (selectedProjectId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            payments: project.payments.filter(payment => payment.id !== paymentId)
          };
        }
        return project;
      }));
    }
  };

  const handleEditPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId && editingPaymentId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          let incomeAdjustment = 0;

          const updatedPayments = project.payments.map(payment => {
            if (payment.id === editingPaymentId) {
              if (payment.status !== 'paid' && paymentStatus === 'paid') {
                incomeAdjustment += parseFloat(paymentAmount);
              } else if (payment.status === 'paid' && paymentStatus !== 'paid') {
                incomeAdjustment -= payment.amount;
              }

              return { ...payment, amount: parseFloat(paymentAmount), status: paymentStatus, date: paymentDate };
            }
            return payment;
          });

          return {
            ...project,
            payments: updatedPayments,
            totalIncome: project.totalIncome + incomeAdjustment
          };
        }
        return project;
      }));

      setEditingPaymentId(null);
      setPaymentAmount('');
      setPaymentDate('');
      setPaymentStatus('upcoming');
      setShowAddPaymentPopup(false);
    }
  };

  const getAvailableEmployees = () => {
    if (!selectedProjectId) return [];
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return [];

    return employees.filter(employee =>
      !project.employees.some(pe => pe.employeeId === employee.id)
    );
  };

  const handlePaySalary = (employeeId: string, month: string, amount: number) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      category: 'Salary',
      amount,
      description: `Salary payment for ${employeeId}`,
      employeeId,
      salaryMonth: month
    };

    setExpenses([...expenses, newExpense]);

    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        const salaryPayment: SalaryPayment = {
          month,
          amount,
          datePaid: new Date().toISOString().slice(0, 10),
          expenseId: newExpense.id
        };
        return {
          ...emp,
          salaryHistory: [...(emp.salaryHistory || []), salaryPayment]
        };
      }
      return emp;
    }));
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (selectedProjectId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            employees: project.employees.filter(pe => pe.employeeId !== employeeId)
          };
        }
        return project;
      }));

      setEmployees(employees.map(employee => {
        if (employee.id === employeeId) {
          return {
            ...employee,
            projects: employee.projects.filter(pe => pe.employeeId !== selectedProjectId)
          };
        }
        return employee;
      }));
    }
  };

  const inputClass = `w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
    }`;

  const buttonClass = `px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
    } text-white`;

  const cardClass = `p-4 rounded shadow ${darkMode ? 'bg-gray-800' : 'bg-white'
    }`;

  const popupClass = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  const popupContentClass = `${darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-lg shadow-lg max-w-md w-full`;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <button
          onClick={() => {
            setShowAddProjectSection(true)
            setName('');
            setStartDate('');
            setEndDate('');
            setStatus('upcoming');
            setShowAddEmployeePopup(false);
            setShowProjectDetailsPopup(false);
            setShowAddPaymentPopup(false);
          }}
          className={`${buttonClass} flex items-center`}
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </button>
      </div>
      {
        showAddProjectSection &&
        <form onSubmit={handleAddProject} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'upcoming' | 'ongoing' | 'completed' | 'cancelled')}
                className={inputClass}
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <button type="submit" className={`${buttonClass} mt-4`}>
            Confirm Project
            <MoveRight size={16} className="inline mr-2" />
          </button>
        </form>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className={cardClass}>
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <div className="mb-2">
              <span className={`px-2 py-1 rounded text-sm ${project.status === 'ongoing' ? 'bg-green-500' :
                project.status === 'completed' ? 'bg-blue-500' :
                  project.status === 'cancelled' ? 'bg-red-500' :
                    'bg-yellow-500'
                } text-white`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            <div className="text-sm opacity-75 mb-4">
              <div>Start: {project.startDate}</div>
              <div>End: {project.endDate}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold">Income: ${project.totalIncome.toFixed(2)}</div>
              <div className="font-semibold">Expenses: ${project.totalExpense.toFixed(2)}</div>
              <div className="font-bold mt-1">
                Net: ${(project.totalIncome - project.totalExpense).toFixed(2)}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Team Members ({project.employees.length})</h4>
              {project.employees.map(pe => {
                const employee = employees.find(e => e.id === pe.employeeId);
                return employee ? (
                  <div key={pe.employeeId} className="text-sm flex justify-between items-center">
                    <span>{employee.name} - ${pe.projectSalary}/month</span>
                    <div>
                      <button
                        onClick={() => handleDeleteEmployee(pe.employeeId)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setName(project.name);
                  setStartDate(project.startDate);
                  setEndDate(project.endDate);
                  setStatus(project.status);
                  setShowProjectDetailsPopup(true);
                }}
                className={buttonClass}
              >
                Details
              </button>
              <button
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setShowAddPaymentPopup(true);
                }}
                className={buttonClass}
              >
                Client Payment
              </button>
              <button
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setShowAddEmployeePopup(true);
                }}
                className={`${buttonClass} flex items-center`}
              >
                <Users size={16} className="mr-2" />
                Add Team
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddEmployeePopup && selectedProjectId && (
        <div className={popupClass}>
          <div className={popupContentClass}>
            <h3 className="text-xl font-bold mb-4">Add Team Member</h3>
            <form onSubmit={handleAddEmployeeToProject}>
              <div className="mb-4">
                <label className="block mb-2">Employee</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => {
                    setSelectedEmployeeId(e.target.value);
                    const employee = employees.find(emp => emp.id === e.target.value);
                    if (employee?.salaryType === 'monthly') {
                      setProjectSalary(employee.salary.toString());
                    } else {
                      setProjectSalary('');
                    }
                  }}
                  className={inputClass}
                  required
                >
                  <option value="">Select an employee</option>
                  {getAvailableEmployees().map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - Base: ${employee.salary}/month
                    </option>
                  ))}
                </select>
              </div>
              {employees.find(emp => emp.id === selectedEmployeeId)?.salaryType !== 'monthly' && (
                <div className="mb-4">
                  <label className="block mb-2">Project Salary</label>
                  <input
                    type="number"
                    value={projectSalary}
                    onChange={(e) => setProjectSalary(e.target.value)}
                    className={inputClass}
                    required
                    placeholder="Monthly salary for this project"
                  />
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeePopup(false)}
                  className={`${buttonClass} bg-gray-500 hover:bg-gray-600 mr-2`}
                >
                  Cancel
                </button>
                <button type="submit" className={buttonClass}>
                  Add to Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectDetailsPopup && selectedProjectId && (
        <div className={popupClass}>
          <div className={popupContentClass}>
            <h3 className="text-xl font-bold mb-4">Edit Project Details</h3>
            <form onSubmit={handleEditProjectDetails}>
              <div className="mb-4">
                <label className="block mb-2">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'upcoming' | 'ongoing' | 'completed' | 'cancelled')}
                  className={inputClass}
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowProjectDetailsPopup(false)}
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

      {showAddPaymentPopup && selectedProjectId && (
        <div className={popupClass}>
          <div className={popupContentClass}>
            <h3 className="text-xl font-bold mb-4">Client Payments</h3>
            {projects.find(p => p.id === selectedProjectId)?.payments.map(payment => (
              <div key={payment.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <span>${payment.amount} - {payment.date} - {payment.status}</span>
                  <div>
                    <button
                      onClick={() => {
                        setEditingPaymentId(payment.id);
                        setPaymentAmount(payment.amount.toString());
                        setPaymentDate(payment.date);
                        setPaymentStatus(payment.status);
                      }}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <form onSubmit={editingPaymentId ? handleEditPayment : handleAddPayment}>
              <div className="mb-4">
                <label className="block mb-2">Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className={inputClass}
                  required
                  placeholder="Payment amount"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'upcoming' | 'cancelled' | 'paid')}
                  className={inputClass}
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentPopup(false)}
                  className={`${buttonClass} bg-gray-500 hover:bg-gray-600 mr-2`}
                >
                  Cancel
                </button>
                <button type="submit" className={buttonClass}>
                  {editingPaymentId ? 'Save Changes' : 'Add Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;