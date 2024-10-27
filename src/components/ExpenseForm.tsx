import React, { useState } from 'react'
import { Expense, ExpenseCategory, Project, Employee, SalaryPayment } from '../types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ExpenseFormProps {
  addExpense: (expense: Expense) => void
  projects: Project[]
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
}

export default function ExpenseForm({
  addExpense,
  projects,
  employees,
  setEmployees,
}: ExpenseFormProps) {
  const [date, setDate] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Salary')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [salaryMonth, setSalaryMonth] = useState('')
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
      }

      if (category === 'Salary' && employeeId) {
        const employee = employees.find(emp => emp.id === employeeId)
        if (employee) {
          const salaryPayment: SalaryPayment = {
            month: salaryMonth,
            amount: parseFloat(amount),
            datePaid: date,
            expenseId: newExpense.id
          }

          setEmployees(employees.map(emp => {
            if (emp.id === employeeId) {
              return {
                ...emp,
                salaryHistory: [...(emp.salaryHistory || []), salaryPayment],
                paid: true
              }
            }
            return emp
          }))
        }
      }

      addExpense(newExpense)
      setDate('')
      setCategory('Salary')
      setAmount('')
      setDescription('')
      setProjectId('')
      setEmployeeId('')
      setSalaryMonth('')
      setPaymentType('full')
    }
  }

  const handleEmployeeSelect = (selectedId: string) => {
    setEmployeeId(selectedId)
    const employee = employees.find(emp => emp.id === selectedId)
    if (employee) {
      if (employee.paymentType === 'monthly') {
        setAmount(employee.salary.toString())
        setPaymentType('full')
      } else {
        setPaymentType('partial')
        setAmount('')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {category === 'Salary' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select value={employeeId} onValueChange={handleEmployeeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - ${employee.salary} ({employee.paymentType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMonth">Salary Month</Label>
                  <Input
                    id="salaryMonth"
                    type="month"
                    value={salaryMonth}
                    onChange={(e) => setSalaryMonth(e.target.value)}
                    required
                  />
                </div>
                {employeeId && employees.find(emp => emp.id === employeeId)?.paymentType === 'project' && (
                  <div className="space-y-2">
                    <Label>Payment Type</Label>
                    <RadioGroup value={paymentType} onValueChange={(value) => {
                      setPaymentType(value as 'full' | 'partial')
                      if (value === 'full') {
                        const employee = employees.find(emp => emp.id === employeeId)
                        if (employee) {
                          setAmount(employee.salary.toString())
                        }
                      } else {
                        setAmount('')
                      }
                    }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full">Full Payment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partial" id="partial" />
                        <Label htmlFor="partial">Partial Payment</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                readOnly={category === 'Salary' && paymentType === 'full'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project (Optional)</Label>

              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                {
                  projects.length > 0 ? <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent> :
                    <SelectContent>
                      <p>No project created yet!</p>
                    </SelectContent>
                }

              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Confirm Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}