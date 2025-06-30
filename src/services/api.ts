const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('token')
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  removeToken() {
    this.token = null
    localStorage.removeItem('token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getMe() {
    return this.request('/auth/me')
  }

  async updateProfile(data: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Organization endpoints
  async getOrganizations() {
    return this.request('/organizations')
  }

  async createOrganization(data: any) {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateOrganization(id: string, data: any) {
    return this.request(`/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Employee endpoints
  async getEmployees(organizationId?: string) {
    const query = organizationId ? `?organizationId=${organizationId}` : ''
    return this.request(`/employees${query}`)
  }

  async createEmployee(data: any) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEmployee(id: string, data: any) {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEmployee(id: string) {
    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    })
  }

  // Attendance endpoints
  async getAttendance(employeeId?: string, date?: string) {
    const params = new URLSearchParams()
    if (employeeId) params.append('employeeId', employeeId)
    if (date) params.append('date', date)
    
    return this.request(`/attendance?${params.toString()}`)
  }

  async clockIn(data: any) {
    return this.request('/attendance/clock-in', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async clockOut(data: any) {
    return this.request('/attendance/clock-out', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Leave endpoints
  async getLeaves(employeeId?: string) {
    const query = employeeId ? `?employeeId=${employeeId}` : ''
    return this.request(`/leaves${query}`)
  }

  async applyLeave(data: any) {
    return this.request('/leaves', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateLeaveStatus(id: string, status: string, comments?: string) {
    return this.request(`/leaves/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comments }),
    })
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/notifications')
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    })
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT',
    })
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats')
  }
}

export const apiService = new ApiService()
export default apiService