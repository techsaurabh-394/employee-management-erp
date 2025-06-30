import React, { useState } from "react";
import axios from "axios";

const AddOrganization = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    // other fields...
  });

  const { name, code, address } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/organizations", formData);
      console.log("Organization added:", response.data);
      // handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error adding organization:", error);
      // handle error (e.g., show an error message)
    }
  };

  return (
    <div>
      <h1>Add New Organization</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Code</label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleChange}
            required
          />
        </div>
        {/* other form fields... */}
        <button type="submit">Add Organization</button>
      </form>
    </div>
  );
};

export default AddOrganization;
