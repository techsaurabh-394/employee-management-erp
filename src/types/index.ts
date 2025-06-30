export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'company_admin' | 'hr' | 'manager' | 'employee'
  organizationId?: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  logo?: string
  industry: string
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  settings: OrganizationSettings
  createdAt: Date
  isActive: boolean
}

export interface OrganizationSettings {
  branding: {
    primaryColor: string
    secondaryColor: string
    logo?: string
  }
  workingHours: {
    start: string
    end: string
    daysOfWeek: number[]
  }
  leaveTypes: LeaveType[]
  notifications: NotificationSettings
}

export interface Employee {
  id: string
  employeeId: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar?: string
    dateOfBirth: Date
    address: Address
  }
  workInfo: {
    organizationId: string
    departmentId: string
    designation: string
    joiningDate: Date
    salary: number
    workLocation: 'office' | 'remote' | 'hybrid'
    managerId?: string
    shift: string
  }
  documents: Document[]
  leaves: Leave[]
  attendance: AttendanceRecord[]
  isActive: boolean
  createdAt: Date
}

export interface Department {
  id: string
  name: string
  organizationId: string
  managerId?: string
  employees: Employee[]
  isActive: boolean
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: Date
  checkIn?: Date
  checkOut?: Date
  status: 'present' | 'absent' | 'half_day' | 'late' | 'holiday'
  workingHours?: number
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  notes?: string
  approvedBy?: string
}

export interface Leave {
  id: string
  employeeId: string
  type: string
  startDate: Date
  endDate: Date
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  appliedAt: Date
  approvedBy?: string
  approvedAt?: Date
  comments?: string
}

export interface LeaveType {
  id: string
  name: string
  daysAllocated: number
  carryForward: boolean
  encashable: boolean
}

export interface Document {
  id: string
  employeeId: string
  type: string
  name: string
  url: string
  uploadedAt: Date
  expiryDate?: Date
  isVerified: boolean
}

export interface Notification {
  id: string
  userId: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
}

export interface DashboardStats {
  totalEmployees: number
  presentToday: number
  onLeave: number
  newHires: number
  pendingLeaves: number
  upcomingBirthdays: number
}

export interface PayrollRecord {
  id: string
  employeeId: string
  month: number
  year: number
  basicSalary: number
  allowances: Record<string, number>
  deductions: Record<string, number>
  netSalary: number
  status: 'draft' | 'processed' | 'paid'
  generatedAt: Date
  paidAt?: Date
}