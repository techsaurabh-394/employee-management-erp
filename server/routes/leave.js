import express from "express";
import Leave from "../models/Leave.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Apply for leave
router.post("/", protect, async (req, res) => {
  const leave = await Leave.create({ ...req.body, employeeId: req.user._id });
  res.status(201).json({ success: true, leave });
});

// Approve/reject leave
router.put(
  "/:id/approve",
  protect,
  authorize("manager", "hr", "company_admin"),
  async (req, res) => {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, approver: req.user._id },
      { new: true }
    );
    res.json({ success: true, leave });
  }
);

// List leaves
router.get("/", protect, async (req, res) => {
  const leaves = await Leave.find({ employeeId: req.user._id });
  res.json({ success: true, leaves });
});

export default router;
