import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeForm = ({ match, history }) => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    shift: "",
    profilePicture: null,
    kyc: null,
    contactDetails: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      const { id } = match.params;
      if (id) {
        const response = await axios.get(`/api/v1/employees/${id}`);
        setEmployee(response.data);
        setIsEdit(true);
      }
    };
    fetchEmployee();
  }, [match.params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEmployee({ ...employee, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id } = match.params;
    const url = isEdit ? `/api/v1/employees/${id}` : "/api/v1/employees";
    const method = isEdit ? "put" : "post";

    // Prepare form data for submission
    const formData = new FormData();
    for (const key in employee) {
      formData.append(key, employee[key]);
    }

    await axios[method](url, formData);
    history.push("/employees");
  };

  return (
    <div>
      <h2>{isEdit ? "Edit" : "Add"} Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={employee.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select
            name="role"
            value={employee.role}
            onChange={handleChange}
            required
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="hr">HR</option>
            <option value="company_admin">Company Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div>
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={employee.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Shift</label>
          <input
            type="text"
            name="shift"
            value={employee.shift}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>KYC Document</label>
          <input type="file" name="kyc" onChange={handleFileChange} />
        </div>
        <div>
          <label>Contact Details</label>
          <input
            type="text"
            name="contactDetails"
            value={employee.contactDetails}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isEdit ? "Update" : "Add"} Employee</button>
      </form>
    </div>
  );
};

export default EmployeeForm;

// Fields: name, email, password, role, department, shift, profile picture, KYC, contact details
// On submit: POST or PUT to /api/v1/employees or /api/v1/employees/:id
// For document upload: POST to /api/v1/employees/:id/documents
