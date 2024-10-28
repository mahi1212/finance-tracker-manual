
import React, { useState } from 'react'
import { CompanyData, Expense, Income, Employee, Project } from '../types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import FinancialOverview from './FinancialOverview'
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'
import EmployeeManagement from './EmployeeManagement'
import ProjectManagement from './ProjectManagement'

interface DashboardProps {
  companyData: CompanyData
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
  incomes: Income[]
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  darkMode: boolean
}

export default function Dashboard({
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
}: DashboardProps) {
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [isAddingIncome, setIsAddingIncome] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          {companyData.type === 'withEmployees' && (
            <TabsTrigger value="employees">Employees</TabsTrigger>
          )}
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Your company's financial summary</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialOverview
                expenses={expenses}
                incomes={incomes}
                employees={employees}
                projects={projects}
                darkMode={darkMode}
                setIncomes={setIncomes}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription className='flex justify-between items-start'>
                Manage your company expenses
                <Button onClick={() => setIsAddingExpense(true)} className='-mt-2'>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingExpense && (
                <ExpenseForm
                  addExpense={(expense) => {
                    setExpenses([...expenses, expense])
                    setIsAddingExpense(false)
                  }}
                  projects={projects}
                  employees={employees}
                  setEmployees={setEmployees}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income</CardTitle>
              <CardDescription className='flex justify-between items-start'>
                Track your company income
                <Button onClick={() => setIsAddingIncome(true)} className='-mt-2'>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Income
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingIncome && (
                <IncomeForm
                  addIncome={(income) => {
                    setIncomes([...incomes, income])
                    setIsAddingIncome(false)
                  }}
                  projects={projects}
                  darkMode={darkMode}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {companyData.type === 'withEmployees' && (
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Manage your company's workforce</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeManagement
                  employees={employees}
                  setEmployees={setEmployees}
                  projects={projects}
                  expenses={expenses}
                  setExpenses={setExpenses}
                  // darkMode={darkMode}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Oversee your company's projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectManagement
                projects={projects}
                setProjects={setProjects}
                expenses={expenses}
                setExpenses={setExpenses}
                incomes={incomes}
                setIncomes={setIncomes}
                employees={employees}
                setEmployees={setEmployees}
                // darkMode={darkMode}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  )
}