import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { 
  Plus, 
  Search, 
  Building, 
  Users, 
  Calendar,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDate, getInitials } from '../lib/utils'

interface Organization {
  id: string
  name: string
  code: string
  industry: string
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  employeeCount: number
  adminName: string
  adminEmail: string
  createdAt: Date
  isActive: boolean
}

const Organizations: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  // Add Organization form state
  const [orgName, setOrgName] = useState('')
  const [orgIndustry, setOrgIndustry] = useState('')
  const [orgAdminEmail, setOrgAdminEmail] = useState('')
  // Optionally, add more fields as needed

  // TODO: Fetch organizations from backend API here
  // useEffect(() => {
  //   fetchOrganizations();
  // }, []);

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'secondary'
      case 'basic': return 'info'
      case 'pro': return 'warning'
      case 'enterprise': return 'success'
      default: return 'secondary'
    }
  }

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'technology': return '💻'
      case 'healthcare': return '🏥'
      case 'education': return '🎓'
      case 'finance': return '💰'
      case 'manufacturing': return '🏭'
      case 'retail': return '🛍️'
      default: return '🏢'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Add Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCreateModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add Organization</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                // Add to organizations list (mock, replace with API call for real app)
                setOrganizations(prev => [
                  ...prev,
                  {
                    id: (prev.length + 1).toString(),
                    name: orgName,
                    code: orgName.replace(/\s+/g, '').toUpperCase().slice(0, 6) + (prev.length + 1),
                    industry: orgIndustry,
                    plan: 'free',
                    employeeCount: 0,
                    adminName: '',
                    adminEmail: orgAdminEmail,
                    createdAt: new Date(),
                    isActive: true
                  }
                ]);
                setOrgName('');
                setOrgIndustry('');
                setOrgAdminEmail('');
                setShowCreateModal(false);
              }}
            >
              <input
                className="border p-2 w-full mb-3"
                placeholder="Organization Name"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                required
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Industry"
                value={orgIndustry}
                onChange={e => setOrgIndustry(e.target.value)}
                required
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Admin Email"
                type="email"
                value={orgAdminEmail}
                onChange={e => setOrgAdminEmail(e.target.value)}
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </form>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">
            Manage client organizations and their subscriptions
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Industries</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Organizations</p>
                <p className="text-xl font-bold">{organizations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-xl font-bold">
                  {organizations.reduce((sum, org) => sum + org.employeeCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-xl font-bold">
                  {organizations.filter(org => org.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Enterprise Plans</p>
                <p className="text-xl font-bold">
                  {organizations.filter(org => org.plan === 'enterprise').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                      {getIndustryIcon(org.industry)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <p className="text-sm text-gray-600">{org.code}</p>
                    </div>
                  </div>
                  <Badge variant={getPlanColor(org.plan) as any}>
                    {org.plan.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-medium capitalize">{org.industry}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Employees:</span>
                    <span className="font-medium">{org.employeeCount}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar
                      fallback={getInitials(org.adminName)}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {org.adminName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {org.adminEmail}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(org.createdAt)}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredOrganizations.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No organizations found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Organizations