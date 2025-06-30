import express from "express";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/auth.js";
import { sendWelcomeEmail } from "../controllers/emailController.js";
import crypto from "crypto";

const router = express.Router();

// Get all employees (company_admin only, returns employees for their org)
router.get("/", protect, authorize("company_admin"), async (req, res) => {
  try {
    const employees = await Employee.find({
      organizationId: req.user.organizationId,
    });
    res.json({ success: true, employees });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add employee (company admin only)
router.post("/", protect, authorize("company_admin"), async (req, res) => {
  try {
    // Generate a secure random password
    const password = crypto.randomBytes(8).toString("base64");
    const { email, name, role } = req.body.user;
    const user = await User.create({
      email,
      password,
      name,
      role,
      organizationId: req.user.organizationId,
    });

    // Create Employee
    const employee = await Employee.create({
      userId: user._id,
      organizationId: req.user.organizationId,
      ...req.body.employee,
    });

    // Send welcome email to employee with generated password
    await sendWelcomeEmail(email, name, password, false);

    res.status(201).json({ success: true, employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Edit employee
router.put("/:id", protect, authorize("company_admin"), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete employee
router.delete("/:id", protect, authorize("company_admin"), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (employee) {
      await User.findByIdAndDelete(employee.userId);
    }
    res.json({ success: true, message: "Employee deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Upload document
router.post(
  "/:id/documents",
  protect,
  authorize("company_admin"),
  async (req, res) => {
    try {
      const { name, url } = req.body;
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { $push: { documents: { name, url } } },
        { new: true }
      );
      res.json({ success: true, employee });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// Assign role, department, shift
router.put(
  "/:id/assign",
  protect,
  authorize("company_admin"),
  async (req, res) => {
    try {
      const { role, department, shift } = req.body;
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        {
          "workInfo.role": role,
          "workInfo.department": department,
          "workInfo.shift": shift,
        },
        { new: true }
      );
      res.json({ success: true, employee });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

export default router;
