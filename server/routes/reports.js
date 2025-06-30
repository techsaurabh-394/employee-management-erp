import express from "express";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import Payroll from "../models/Payroll.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Attendance report
router.get(
  "/attendance",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const data = await Attendance.find({
      organizationId: req.user.organizationId,
    });
    res.json({ success: true, data });
  }
);

// Leave report
router.get(
  "/leave",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const data = await Leave.find({ organizationId: req.user.organizationId });
    res.json({ success: true, data });
  }
);

// Payroll report
router.get(
  "/payroll",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const data = await Payroll.find({
      organizationId: req.user.organizationId,
    });
    res.json({ success: true, data });
  }
);

// Export to CSV (example for attendance)
router.get(
  "/attendance/export",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const data = await Attendance.find({
      organizationId: req.user.organizationId,
    });
    // Convert data to CSV (implement as needed)
    res.header("Content-Type", "text/csv");
    res.attachment("attendance.csv");
    res.send(
      "date,employeeId,punchIn,punchOut\n" +
        data
          .map((a) => `${a.date},${a.employeeId},${a.punchIn},${a.punchOut}`)
          .join("\n")
    );
  }
);

export default router;
