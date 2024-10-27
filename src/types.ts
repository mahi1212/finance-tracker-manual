export interface CompanyData {
  type: 'solo' | 'withEmployees';
}

export interface SalaryPayment {
  month: string;
  amount: number;
  datePaid: string;
  expenseId: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  projectId?: string;
  employeeId?: string;
  salaryMonth?: string;
}

export interface Income {
  id: string;
  date: string;
  source?: string;
  amount: number;
  description: string;
  projectId?: string;
}

export interface Employee {
  id: string;
  name: string;
  salary: number;
  paid: boolean;
  extraPayment: number;
  paymentType: 'monthly' | 'project';
  projects: ProjectEmployee[]; // Update this line
  salaryHistory?: SalaryPayment[];
  [key: string]: string | number | boolean | ProjectEmployee[] | SalaryPayment[] | undefined;
}

export type ExpenseCategory =
  | 'Salary'
  | 'Food'
  | 'Electricity'
  | 'Rent'
  | 'Office Supplies'
  | 'Marketing'
  | 'Travel'
  | 'Maintenance'
  | 'Other';

export interface ProjectEmployee {
  employeeId: string;
  projectSalary: number;
}

export interface ProjectPayment {
  id: string;
  date: string;
  amount: number;
  status: 'upcoming' | 'paid' | 'cancelled';
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  totalIncome: number;
  totalExpense: number;
  employees: ProjectEmployee[];
  payments: ProjectPayment[];
  salaryPayments?: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
}