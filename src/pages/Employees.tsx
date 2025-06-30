import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import EmployeeCard from '../components/employees/EmployeeCard'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Search, Plus, Filter, Download } from 'lucide-react'

const Employees: React.FC = () => {
  // Add Employee modal state
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [empFirstName, setEmpFirstName] = useState('')
  const [empLastName, setEmpLastName] = useState('')
  const [empEmail, setEmpEmail] = useState('')
  const [empPhone, setEmpPhone] = useState('')
  const [empDepartment, setEmpDepartment] = useState('dept1')
  const [empDesignation, setEmpDesignation] = useState('')
  const [empJoiningDate, setEmpJoiningDate] = useState('')
  const [empSalary, setEmpSalary] = useState('')
  const [empWorkLocation, setEmpWorkLocation] = useState('office')
  const [empPassword, setEmpPassword] = useState('')
  // Optionally, add more fields as needed
  const { employees, isLoading } = useSelector((state: RootState) => state.employee)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')

  // Fetch employees from backend API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const api = (await import('../services/api')).default || (await import('../services/api'));
        const res = await api.getEmployees();
        // If your API returns { employees: [...] }
        if (res && typeof res === 'object' && 'employees' in res) {
          // If using Redux, dispatch(fetchEmployeesSuccess((res as { employees: any[] }).employees));
          // Otherwise, set local state if you use it
        }
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = !filterDepartment || employee.workInfo.departmentId === filterDepartment

    return matchesSearch && matchesDepartment
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">
            Manage your organization's workforce
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddEmployeeModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddEmployeeModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                try {
                  const api = (await import('../services/api')).default || (await import('../services/api'));
                  await api.createEmployee({
                    user: {
                      email: empEmail,
                      password: empPassword || Math.random().toString(36).slice(-8),
                      name: empFirstName + ' ' + empLastName,
                      role: 'employee',
                    },
                    employee: {
                      personalInfo: {
                        firstName: empFirstName,
                        lastName: empLastName,
                        email: empEmail,
                        phone: empPhone,
                        joiningDate: empJoiningDate,
                        // address: {}, // Optionally add address fields
                      },
                      workInfo: {
                        department: empDepartment,
                        designation: empDesignation,
                        joiningDate: empJoiningDate,
                        salary: empSalary ? Number(empSalary) : undefined,
                        workLocation: empWorkLocation,
                      },
                    }
                  });
                  setShowAddEmployeeModal(false);
                  setEmpFirstName('');
                  setEmpLastName('');
                  setEmpEmail('');
                  setEmpPhone('');
                  setEmpDepartment('dept1');
                  setEmpDesignation('');
                  setEmpJoiningDate('');
                  setEmpSalary('');
                  setEmpWorkLocation('office');
                  setEmpPassword('');
                  // Refresh list
                  await api.getEmployees();
                  // If using Redux, dispatch(fetchEmployeesSuccess(res.employees));
                  // Otherwise, set local state if you use it
                } catch (err) {
                  alert('Failed to add employee.');
                  console.error(err);
                }
              }}
            >
              <input
                className="border p-2 w-full mb-3"
                placeholder="First Name"
                value={empFirstName}
                onChange={e => setEmpFirstName(e.target.value)}
                required
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Last Name"
                value={empLastName}
                onChange={e => setEmpLastName(e.target.value)}
                required
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Email"
                type="email"
                value={empEmail}
                onChange={e => setEmpEmail(e.target.value)}
                required
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Phone"
                value={empPhone}
                onChange={e => setEmpPhone(e.target.value)}
                required
              />
              <select
                className="border p-2 w-full mb-3"
                value={empDepartment}
                onChange={e => setEmpDepartment(e.target.value)}
                required
              >
                <option value="dept1">Engineering</option>
                <option value="dept2">Product</option>
                <option value="dept3">Marketing</option>
                <option value="dept4">Sales</option>
              </select>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Designation"
                value={empDesignation}
                onChange={e => setEmpDesignation(e.target.value)}
                required
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Joining Date"
                type="date"
                value={empJoiningDate}
                onChange={e => setEmpJoiningDate(e.target.value)}
                required
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Salary"
                type="number"
                value={empSalary}
                onChange={e => setEmpSalary(e.target.value)}
                required
              />
              <select
                className="border p-2 w-full mb-3"
                value={empWorkLocation}
                onChange={e => setEmpWorkLocation(e.target.value)}
                required
              >
                <option value="office">Office</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Password (optional)"
                type="password"
                value={empPassword}
                onChange={e => setEmpPassword(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            <option value="dept1">Engineering</option>
            <option value="dept2">Product</option>
            <option value="dept3">Marketing</option>
            <option value="dept4">Sales</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{employees.length}</div>
          <div className="text-sm text-gray-600">Total Employees</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {employees.filter(emp => emp.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {employees.filter(emp => !emp.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {employees.filter(emp => emp.workInfo.workLocation === 'remote').length}
          </div>
          <div className="text-sm text-gray-600">Remote Workers</div>
        </div>
      </div>

      {/* Employee Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onView={(emp) => console.log('View', emp)}
              onEdit={(emp) => console.log('Edit', emp)}
              onDelete={(emp) => console.log('Delete', emp)}
            />
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Employees