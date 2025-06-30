import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import EmployeeForm from "./EmployeeForm";

const EmployeeList = () => {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    const response = await axios.get("/api/v1/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmployees(response.data.employees);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/v1/employees/${id}`);
    fetchEmployees();
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  const handleFormSubmit = async (employeeData) => {
    if (editingEmployee) {
      await axios.put(`/api/v1/employees/${editingEmployee._id}`, employeeData);
    } else {
      await axios.post("/api/v1/employees", employeeData);
    }
    setEditingEmployee(null);
    fetchEmployees();
  };

  return (
    <div>
      <h1>Employee List</h1>
      <button onClick={() => setEditingEmployee({})}>Add Employee</button>
      <ul>
        {employees.map((employee) => (
          <li key={employee._id}>
            {employee.name} - {employee.email}
            <button onClick={() => handleEdit(employee)}>Edit</button>
            <button onClick={() => handleDelete(employee._id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingEmployee && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
