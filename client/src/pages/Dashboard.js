import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/v1/organizations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrganizations(res.data.organizations || []));
    axios
      .get("/api/v1/employees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data.employees || []));
  }, [token]);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate("/organizations/add")}>
          Add Organization
        </button>
        <button onClick={() => navigate("/employees/add")}>Add Employee</button>
      </div>
      <section>
        <h2>Organizations</h2>
        {organizations.length === 0 ? (
          <div>No organizations found. Please add your company.</div>
        ) : (
          organizations.map((org) => (
            <div
              key={org._id}
              style={{
                marginBottom: 16,
                border: "1px solid #eee",
                padding: 12,
              }}
            >
              <h3>{org.name}</h3>
              <div>Code: {org.code}</div>
              <div>Admin: {org.adminId?.name || org.adminId}</div>
              {/* ...other org info... */}
            </div>
          ))
        )}
      </section>
      <section>
        <h2>Employees</h2>
        {employees.length === 0 ? (
          <div>No employees found. Please add employees.</div>
        ) : (
          employees.map((emp) => (
            <div
              key={emp._id}
              style={{
                marginBottom: 16,
                border: "1px solid #eee",
                padding: 12,
              }}
            >
              <h3>
                {emp.personalInfo?.firstName} {emp.personalInfo?.lastName}
              </h3>
              <div>Email: {emp.personalInfo?.email}</div>
              <div>Role: {emp.workInfo?.role}</div>
              {/* ...other employee info... */}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
