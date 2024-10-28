
import { useState, useEffect } from 'react'
import { Settings, ArrowLeftRight } from 'lucide-react'
import CompanySetup from './components/CompanySetup'
import Dashboard from './components/Dashboard'
import { CompanyData, Expense, Income, Employee, Project } from './types'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Switch } from './components/ui/switch'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showSetup, setShowSetup] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedData = localStorage.getItem('companyData')
    if (savedData) {
      setCompanyData(JSON.parse(savedData))
    }
    const savedExpenses = localStorage.getItem('expenses')
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
    const savedIncomes = localStorage.getItem('incomes')
    if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes))
    }
    const savedEmployees = localStorage.getItem('employees')
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    }
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('companyData', JSON.stringify(companyData))
    localStorage.setItem('expenses', JSON.stringify(expenses))
    localStorage.setItem('incomes', JSON.stringify(incomes))
    localStorage.setItem('employees', JSON.stringify(employees))
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [companyData, expenses, incomes, employees, projects])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleCompanySetup = (data: CompanyData) => {
    setCompanyData(data)
    setShowSetup(false)
    // Clear employees if switching to solo mode
    if (data.type === 'solo') {
      setEmployees([])
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Toaster />
      <div className="container mx-auto py-8 max-w-7xl">
        <Card className="mb-4 shadow-none border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 mx-4">
            <CardTitle className="text-3xl font-bold">Finance Tracker : {companyData?.type == 'solo' ? 'Solo' : 'Company'}</CardTitle>
            <div className="flex items-center space-x-4">
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newType = companyData?.type === 'solo' ? 'withEmployees' : 'solo'
                  setCompanyData({ ...companyData, type: newType })
                  toast({
                    title: `Switched to ${newType === 'solo' ? 'SOLO' : 'COMPANY'} mode`,
                    description: newType === 'solo' ? "No employees to manage!" : "Manage your employees",
                  })
                }}
                title="Toggle Company Mode"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSetup(true)}
                title="Company Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>

            </div>
          </CardHeader>
        </Card>
        <CardContent>
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
        </CardContent>
      </div>
    </div>
  )
}

export default App