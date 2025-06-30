import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store'
import { useAuth } from './hooks/useAuth'
import { getCurrentUser } from './store/slices/authSlice'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import PWAInstallPrompt from './components/common/PWAInstallPrompt'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Organizations from './pages/Organizations'
import './index.css'

const AppRoutes: React.FC = () => {
  const { isAuthenticated, token } = useAuth()

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }

    // Get current user if token exists
    if (token && !isAuthenticated) {
      store.dispatch(getCurrentUser())
    }
  }, [token, isAuthenticated])

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="organizations" element={
          <ProtectedRoute requiredRoles={['super_admin']}>
            <Organizations />
          </ProtectedRoute>
        } />
        
        <Route path="employees" element={
          <ProtectedRoute requiredRoles={['super_admin', 'company_admin', 'hr', 'manager']}>
            <Employees />
          </ProtectedRoute>
        } />
        
        <Route path="attendance" element={<Attendance />} />
        
        <Route path="leaves" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <p className="text-gray-600">Manage employee leave requests</p>
          </div>
        } />
        
        <Route path="payroll" element={
          <ProtectedRoute requiredRoles={['super_admin', 'company_admin', 'hr']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold">Payroll</h1>
              <p className="text-gray-600">Manage employee payroll and salaries</p>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="performance" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Performance Management</h1>
            <p className="text-gray-600">Track and manage employee performance</p>
          </div>
        } />
        
        <Route path="documents" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-gray-600">Manage employee documents and files</p>
          </div>
        } />
        
        <Route path="recruitment" element={
          <ProtectedRoute requiredRoles={['super_admin', 'company_admin', 'hr']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold">Recruitment</h1>
              <p className="text-gray-600">Manage job postings and applications</p>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="training" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Training & Development</h1>
            <p className="text-gray-600">Manage training programs and courses</p>
          </div>
        } />
        
        <Route path="expenses" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Expense Management</h1>
            <p className="text-gray-600">Track and approve employee expenses</p>
          </div>
        } />
        
        <Route path="messages" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-gray-600">Internal communication and chat</p>
          </div>
        } />
        
        <Route path="notifications" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-600">View all notifications and alerts</p>
          </div>
        } />
        
        <Route path="settings" element={
          <ProtectedRoute requiredRoles={['super_admin', 'company_admin', 'hr']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-gray-600">Configure system settings and preferences</p>
            </div>
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
        <PWAInstallPrompt />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </Provider>
  )
}

export default App