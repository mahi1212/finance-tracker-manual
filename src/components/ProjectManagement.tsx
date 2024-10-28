import React, { useState } from 'react'
import { Project, Employee, Expense, Income, ProjectEmployee, ProjectPayment } from '../types' //SalaryPayment
import { MoveRight, Plus, Users, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ProjectManagementProps {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
  incomes: Income[]
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
}

export default function ProjectManagement({
  projects,
  setProjects,
  // expenses,
  // setExpenses,
  // incomes,
  // setIncomes,
  employees,
  setEmployees,
}: ProjectManagementProps) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming')
  const [showAddEmployeePopup, setShowAddEmployeePopup] = useState(false)
  const [showProjectDetailsPopup, setShowProjectDetailsPopup] = useState(false)
  const [showAddPaymentPopup, setShowAddPaymentPopup] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [projectSalary, setProjectSalary] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  console.log(showAddEmployeePopup, showProjectDetailsPopup, showAddPaymentPopup)

  const [paymentStatus, setPaymentStatus] = useState<'upcoming' | 'cancelled' | 'paid'>('upcoming')
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
  const [showAddProjectSection, setShowAddProjectSection] = useState<boolean>(false)

  const handleAddProject = (data: { name: string; startDate: string; endDate: string; status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      totalIncome: 0,
      totalExpense: 0,
      employees: [],
      payments: [],
      salaryPayments: {}
    }
    setProjects([...projects, newProject])
    setName('')
    setStartDate('')
    setEndDate('')
    setStatus('upcoming')
    setShowAddProjectSection(false)
  }

  const handleEditProjectDetails = (data: { name: string; startDate: string; endDate: string; status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' }) => {
    if (selectedProjectId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status
          }
        }
        return project
      }))
      setShowProjectDetailsPopup(false)
    }
  }

  const handleAddEmployeeToProject = (data: { employeeId: string; projectSalary: string }) => {
    if (selectedProjectId && data.employeeId) {
      const employee = employees.find(emp => emp.id === data.employeeId)
      const salary = employee?.salaryType === 'monthly' ? employee.salary : parseFloat(data.projectSalary)

      const projectEmployee: ProjectEmployee = {
        employeeId: data.employeeId,
        projectSalary: salary
      }

      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            employees: [...project.employees, projectEmployee]
          }
        }
        return project
      }))

      setEmployees(employees.map(employee => {
        if (employee.id === data.employeeId) {
          return {
            ...employee,
            projects: [...employee.projects, { employeeId: selectedProjectId, projectSalary: salary }]
          }
        }
        return employee
      }))

      setSelectedEmployeeId('')
      setProjectSalary('')
      setShowAddEmployeePopup(false)
    }
  }

  const handleAddPayment = (data: { amount: string; date: string; status: 'upcoming' | 'cancelled' | 'paid' }) => {
    if (selectedProjectId && data.amount && data.date) {
      const newPayment: ProjectPayment = {
        id: Date.now().toString(),
        amount: parseFloat(data.amount),
        status: data.status,
        date: data.date
      }

      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          const updatedProject = {
            ...project,
            payments: [...project.payments, newPayment]
          }

          if (data.status === 'paid') {
            updatedProject.totalIncome += newPayment.amount
          }

          return updatedProject
        }
        return project
      }))

      setPaymentAmount('')
      setPaymentDate('')
      setPaymentStatus('upcoming')
      setShowAddPaymentPopup(false)
    }
  }

  const handleDeletePayment = (paymentId: string) => {
    if (selectedProjectId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            payments: project.payments.filter(payment => payment.id !== paymentId)
          }
        }
        return project
      }))
    }
  }

  const handleEditPayment = (data: { amount: string; date: string; status: 'upcoming' | 'cancelled' | 'paid' }) => {
    if (selectedProjectId && editingPaymentId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          let incomeAdjustment = 0

          const updatedPayments = project.payments.map(payment => {
            if (payment.id === editingPaymentId) {
              if (payment.status !== 'paid' && data.status === 'paid') {
                incomeAdjustment += parseFloat(data.amount)
              } else if (payment.status === 'paid' && data.status !== 'paid') {
                incomeAdjustment -= payment.amount
              }

              return { ...payment, amount: parseFloat(data.amount), status: data.status, date: data.date }
            }
            return payment
          })

          return {
            ...project,
            payments: updatedPayments,
            totalIncome: project.totalIncome + incomeAdjustment
          }
        }
        return project
      }))

      setEditingPaymentId(null)
      setPaymentAmount('')
      setPaymentDate('')
      setPaymentStatus('upcoming')
      setShowAddPaymentPopup(false)
    }
  }

  const getAvailableEmployees = () => {
    if (!selectedProjectId) return []
    const project = projects.find(p => p.id === selectedProjectId)
    if (!project) return []

    return employees.filter(employee =>
      !project.employees.some(pe => pe.employeeId === employee.id)
    )
  }

  // const handlePaySalary = (employeeId: string, month: string, amount: number) => {
  //   const newExpense: Expense = {
  //     id: Date.now().toString(),
  //     date: new Date().toISOString().slice(0, 10),
  //     category: 'Salary',
  //     amount,
  //     description: `Salary payment for ${employeeId}`,
  //     employeeId,
  //     salaryMonth: month
  //   }

  //   setExpenses([...expenses, newExpense])

  //   setEmployees(employees.map(emp => {
  //     if (emp.id === employeeId) {
  //       const salaryPayment: SalaryPayment = {
  //         month,
  //         amount,
  //         datePaid: new Date().toISOString().slice(0, 10),
  //         expenseId: newExpense.id
  //       }
  //       return {
  //         ...emp,
  //         salaryHistory: [...(emp.salaryHistory || []), salaryPayment]
  //       }
  //     }
  //     return emp
  //   }))
  // }

  const handleDeleteEmployee = (employeeId: string) => {
    if (selectedProjectId) {
      setProjects(projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            employees: project.employees.filter(pe => pe.employeeId !== employeeId)
          }
        }
        return project
      }))

      setEmployees(employees.map(employee => {
        if (employee.id === employeeId) {
          return {
            ...employee,
            projects: employee.projects.filter(pe => pe.employeeId !== selectedProjectId)
          }
        }
        return employee
      }))
    }
  }

  return (
    <div className="container mx-auto relative ">
      <div className="flex justify-between items-center absolute -top-16 right-0 ">
        <Button onClick={() => setShowAddProjectSection(!showAddProjectSection)}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {showAddProjectSection && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleAddProject({ name, startDate, endDate, status })
            }} className="space-y-4">
              <div>
                <label className="block mb-2">Project Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Status</label>
                <Select value={status} onValueChange={(value: 'upcoming' | 'ongoing' | 'completed' | 'cancelled') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">
                Confirm Project <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <Badge variant={
                project.status === 'ongoing' ? "default" :
                  project.status === 'completed' ? "secondary" :
                    project.status === 'cancelled' ? "destructive" :
                      "outline"
              }>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Start: {project.startDate}</p>
                <p className="text-sm">End: {project.endDate}</p>
                <p className="font-semibold">Income: ${project.totalIncome.toFixed(2)}</p>
                <p className="font-semibold">Expenses: ${project.totalExpense.toFixed(2)}</p>
                <p className="font-bold">Net: ${(project.totalIncome - project.totalExpense).toFixed(2)}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Team Members ({project.employees.length})</h4>
                {project.employees.map(pe => {
                  const employee = employees.find(e => e.id === pe.employeeId)
                  return employee ? (
                    <div key={pe.employeeId} className="flex justify-between items-center text-sm">
                      <span>{employee.name} - ${pe.projectSalary}/month</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(pe.employeeId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => {
                    setSelectedProjectId(project.id)
                    setName(project.name)
                    setStartDate(project.startDate)
                    setEndDate(project.endDate)
                    setStatus(project.status)
                  }}>
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Project Details</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleEditProjectDetails({ name, startDate, endDate, status })
                  }} className="space-y-4">
                    <div>
                      <label className="block mb-2">Project Name</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">End Date</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Status</label>
                      <Select value={status} onValueChange={(value: 'upcoming' | 'ongoing' | 'completed' | 'cancelled') => setStatus(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => {
                    setSelectedProjectId(project.id)
                    setShowAddPaymentPopup(true)
                  }}>
                    Client Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Client Payments</DialogTitle>
                  </DialogHeader>
                  {project.payments.map(payment => (
                    <div key={payment.id} className="flex justify-between items-center mb-2">
                      <span>${payment.amount} - {payment.date} - {payment.status}</span>
                      <div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingPaymentId(payment.id)
                          setPaymentAmount(payment.amount.toString())
                          setPaymentDate(payment.date)
                          setPaymentStatus(payment.status)
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePayment(payment.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    if (editingPaymentId) {
                      handleEditPayment({ amount: paymentAmount, date: paymentDate, status: paymentStatus })
                    } else {
                      handleAddPayment({ amount: paymentAmount, date: paymentDate, status: paymentStatus })
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block mb-2">Amount</label>
                      <Input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                        placeholder="Payment amount"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Date</label>
                      <Input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Status</label>
                      <Select value={paymentStatus} onValueChange={(value: 'upcoming' | 'cancelled' | 'paid') => setPaymentStatus(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit">{editingPaymentId ? 'Save Changes' : 'Add Payment'}</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => {
                    setSelectedProjectId(project.id)
                    setShowAddEmployeePopup(true)
                  }}>
                    <Users className="mr-2 h-4 w-4" />
                    Add Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleAddEmployeeToProject({ employeeId: selectedEmployeeId, projectSalary })
                  }} className="space-y-4">
                    <div>
                      <label className="block mb-2">Employee</label>
                      <Select
                        value={selectedEmployeeId}
                        onValueChange={(value) => {
                          setSelectedEmployeeId(value)
                          const employee = employees.find(emp => emp.id === value)
                          if (employee?.salaryType === 'monthly') {
                            setProjectSalary(employee.salary.toString())
                          } else {
                            setProjectSalary('')
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableEmployees().map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} - Base: ${employee.salary}/month
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {employees.find(emp => emp.id === selectedEmployeeId)?.salaryType !== 'monthly' && (
                      <div>
                        <label className="block mb-2">Project Salary</label>
                        <Input
                          type="number"
                          value={projectSalary}
                          onChange={(e) => setProjectSalary(e.target.value)}
                          required
                          placeholder="Monthly salary for this project"
                        />
                      </div>
                    )}
                    <Button type="submit">Add to Project</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}