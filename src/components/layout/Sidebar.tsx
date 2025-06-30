import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  FileText,
  Settings,
  Building,
  DollarSign,
  TrendingUp,
  MessageSquare,
  BookOpen,
  UserCheck,
  Bell,
  Receipt
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Organizations',
    href: '/organizations',
    icon: Building,
    roles: ['super_admin']
  },
  {
    name: 'Employees',
    href: '/employees',
    icon: Users,
    roles: ['super_admin', 'company_admin', 'hr', 'manager']
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: Clock,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Leave Management',
    href: '/leaves',
    icon: Calendar,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Payroll',
    href: '/payroll',
    icon: DollarSign,
    roles: ['super_admin', 'company_admin', 'hr']
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: TrendingUp,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Recruitment',
    href: '/recruitment',
    icon: UserCheck,
    roles: ['super_admin', 'company_admin', 'hr']
  },
  {
    name: 'Training',
    href: '/training',
    icon: BookOpen,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: Receipt,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['super_admin', 'company_admin', 'hr', 'manager', 'employee']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['super_admin', 'company_admin', 'hr']
  }
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user } = useSelector((state: RootState) => state.auth)
  const { currentOrganization } = useSelector((state: RootState) => state.organization)

  if (!user) return null

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  )

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 w-64">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {currentOrganization?.name || 'EMS Platform'}
          </span>
          <span className="text-xs text-gray-500">
            {user.role.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'h-5 w-5',
                isActive ? 'text-blue-700' : 'text-gray-400'
              )} />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar