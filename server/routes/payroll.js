import express from "express";
import Payroll from "../models/Payroll.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Generate payroll
router.post(
  "/",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const payroll = await Payroll.create(req.body);
    res.status(201).json({ success: true, payroll });
  }
);

// Get payroll for employee
router.get("/", protect, async (req, res) => {
  const payrolls = await Payroll.find({ employeeId: req.user._id });
  res.json({ success: true, payrolls });
});

// Payslip download
router.get("/:id/payslip", protect, async (req, res) => {
  const payroll = await Payroll.findById(req.params.id);
  if (!payroll) return res.status(404).json({ success: false });
  // Implement file download logic
  res.json({ success: true, payslipUrl: payroll.payslipUrl });
});

export default router;
