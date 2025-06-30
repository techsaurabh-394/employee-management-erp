import express from "express";
import Attendance from "../models/Attendance.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Punch in/out
router.post("/punch", protect, async (req, res) => {
  const { date, punchType, geoLocation, ipAddress, biometricData } = req.body;
  const employeeId = req.user._id;
  let attendance = await Attendance.findOne({ employeeId, date });
  if (!attendance) attendance = new Attendance({ employeeId, date });
  if (punchType === "in") attendance.punchIn = new Date();
  if (punchType === "out") attendance.punchOut = new Date();
  attendance.geoLocation = geoLocation;
  attendance.ipAddress = ipAddress;
  attendance.biometricData = biometricData;
  await attendance.save();
  res.json({ success: true, attendance });
});

// Manual override by admin
router.post(
  "/override/:id",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { ...req.body, manualOverride: true, overrideBy: req.user._id },
      { new: true }
    );
    res.json({ success: true, attendance });
  }
);

// Export attendance report (CSV)
router.get(
  "/export",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    // Implement CSV export logic here
    res.json({ success: true, message: "Export not implemented" });
  }
);

export default router;
