'use client'

import React, { useState } from 'react'
import { Employee, Project, Expense, SalaryPayment } from '../types'
import { Plus, Edit, DollarSign, Calendar, ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EmployeeManagementProps {
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  projects: Project[]
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
}

export default function EmployeeManagement({
  employees,
  setEmployees,
  projects,
  expenses,
  setExpenses,
}: EmployeeManagementProps) {
  const [showAddEmployeePopup, setShowAddEmployeePopup] = useState(false)
  const [showSalaryHistoryPopup, setShowSalaryHistoryPopup] = useState(false)
  const [showPaySalaryPopup, setShowPaySalaryPopup] = useState(false)
  const [showEditEmployeePopup, setShowEditEmployeePopup] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [salary, setSalary] = useState('')
  const [paymentType, setPaymentType] = useState<'monthly' | 'project'>('monthly')
  const [salaryMonth, setSalaryMonth] = useState('')
  const [salaryAmount, setSalaryAmount] = useState('')
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault()
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
        active: true
      }
      setEmployees([...employees, newEmployee])
      setName('')
      setSalary('')
      setPaymentType('monthly')
      setShowAddEmployeePopup(false)
    }
  }

  const handlePaySalary = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEmployeeId && salaryMonth && salaryAmount) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId)
      if (employee) {
        const newExpense: Expense = {
          id: Date.now().toString(),
          date: new Date().toISOString().slice(0, 10),
          category: 'Salary',
          amount: parseFloat(salaryAmount),
          description: `Paid for a project`,
          employeeId: employee.id,
          salaryMonth
        }

        const salaryPayment: SalaryPayment = {
          month: salaryMonth,
          amount: parseFloat(salaryAmount),
          datePaid: new Date().toISOString().slice(0, 10),
          expenseId: newExpense.id
        }

        const updatedEmployees = employees.map(emp => {
          if (emp.id === selectedEmployeeId) {
            return {
              ...emp,
              salaryHistory: [...(emp.salaryHistory || []), salaryPayment]
            }
          }
          return emp
        })

        setExpenses([...expenses, newExpense])
        setEmployees(updatedEmployees)
        setShowPaySalaryPopup(false)
        setSalaryMonth('')
        setSalaryAmount('')
      }
    }
  }

  const handleEditEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (editEmployee) {
      const updatedEmployees = employees.map(emp =>
        emp.id === editEmployee.id ? editEmployee : emp
      )
      setEmployees(updatedEmployees)
      setShowEditEmployeePopup(false)
      setEditEmployee(null)
    }
  }

  const handleToggleActiveStatus = (employeeId: string) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, active: !emp.active } : emp
    )
    setEmployees(updatedEmployees)
  }

  const getMonthsSalaryStatus = (employee: Employee) => {
    return employee.salaryHistory?.map(payment => {
      const relatedExpense = expenses.find(exp => exp.id === payment.expenseId)
      return {
        month: payment.month,
        paid: true,
        amount: payment.amount,
        datePaid: payment.datePaid,
        paymentType: employee.paymentType,
        description: relatedExpense ? relatedExpense.description : 'No description'
      }
    }) || []
  }

  const EmployeeTable = ({ activeEmployees }: { activeEmployees: boolean }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{activeEmployees ? 'Active Employees' : 'Abandoned Employees'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.filter(emp => emp.active === activeEmployees).map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>${employee.salary.toFixed(2)}</TableCell>
                <TableCell>{employee.paymentType}</TableCell>
                <TableCell>
                  {projects
                    .filter(project => project.employees.some(emp => emp.employeeId === employee.id))
                    .map(project => project.name)
                    .join(', ')}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                    setSelectedEmployeeId(employee.id)
                    setShowSalaryHistoryPopup(true)
                  }}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    History
                  </Button>
                  {activeEmployees && (
                    <>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                        setSelectedEmployeeId(employee.id)
                        setSalaryAmount(employee.salary.toString())
                        setShowPaySalaryPopup(true)
                      }}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Pay Salary
                      </Button>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                        setEditEmployee(employee)
                        setShowEditEmployeePopup(true)
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </>
                  )}
                  <Button variant={activeEmployees ? "destructive" : "default"} size="sm" onClick={() => handleToggleActiveStatus(employee.id)}>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {activeEmployees ? 'Abandon' : 'Reactivate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto relative">
      <div className="flex justify-between items-center absolute -top-24 right-0">
        <Dialog open={showAddEmployeePopup} onOpenChange={setShowAddEmployeePopup}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block mb-2">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Salary</label>
                <Input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Payment Type</label>
                <Select value={paymentType} onValueChange={(value: 'monthly' | 'project') => setPaymentType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="project">Project-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddEmployeePopup(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <EmployeeTable activeEmployees={true} />
      <EmployeeTable activeEmployees={false} />

      <Dialog open={showPaySalaryPopup} onOpenChange={setShowPaySalaryPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Salary</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePaySalary} className="space-y-4">
            <div>
              <label className="block mb-2">Month</label>
              <Input
                type="month"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Amount</label>
              <Input
                type="number"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowPaySalaryPopup(false)}>
                Cancel
              </Button>
              <Button type="submit">Pay Salary</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditEmployeePopup} onOpenChange={setShowEditEmployeePopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editEmployee && (
            <form onSubmit={handleEditEmployee} className="space-y-4">
              <div>
                <label className="block mb-2">Name</label>
                <Input
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Salary</label>
                <Input
                  type="number"
                  value={editEmployee.salary}
                  onChange={(e) => setEditEmployee({ ...editEmployee, salary: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Payment Type</label>
                <Select 
                  value={editEmployee.paymentType} 
                  onValueChange={(value: 'monthly' | 'project') => setEditEmployee({ ...editEmployee, paymentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="project">Project-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowEditEmployeePopup(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showSalaryHistoryPopup} onOpenChange={setShowSalaryHistoryPopup}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Salary History</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEmployeeId && getMonthsSalaryStatus(employees.find(e => e.id === selectedEmployeeId)!).map(({ month, paid, amount, datePaid, paymentType }) => (
                  <TableRow key={month}>
                    <TableCell>{month}</TableCell>
                    <TableCell>
                      <Badge variant={paid ? "outline" : "destructive"}>
                        {paid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </TableCell>
                    <TableCell>{paid ? `$${amount.toFixed(2)}` : '-'}</TableCell>
                    <TableCell>{paid ? datePaid :   '-'}</TableCell>
                    <TableCell>{paymentType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}