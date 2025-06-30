import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import OrganizationList from "./components/OrganizationList";
import AddOrganization from "./components/AddOrganization";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import AttendancePage from "./components/AttendancePage";
import LeavePage from "./components/LeavePage";
import PayrollPage from "./components/PayrollPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        {/* Dashboards */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute roles={["super_admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["company_admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={["employee", "manager", "hr"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        {/* Organization */}
        <Route
          path="/organizations"
          element={
            <ProtectedRoute roles={["super_admin", "company_admin"]}>
              <OrganizationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizations/add"
          element={
            <ProtectedRoute roles={["super_admin", "company_admin"]}>
              <AddOrganization />
            </ProtectedRoute>
          }
        />
        {/* Employee Management */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute roles={["company_admin", "hr"]}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/add"
          element={
            <ProtectedRoute roles={["company_admin", "hr"]}>
              <EmployeeForm />
            </ProtectedRoute>
          }
        />
        {/* Attendance */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        {/* Leave */}
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <LeavePage />
            </ProtectedRoute>
          }
        />
        {/* Payroll */}
        <Route
          path="/payroll"
          element={
            <ProtectedRoute roles={["company_admin", "hr", "employee"]}>
              <PayrollPage />
            </ProtectedRoute>
          }
        />
        {/* ...other modules... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
