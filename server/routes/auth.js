import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Example: Only super_admin can access this route
router.get(
  "/super-admin-only",
  protect,
  authorize("super_admin"),
  (req, res) => {
    res.json({ success: true, message: "Super admin content" });
  }
);

// Example: Only company_admin and hr can access this route
router.get(
  "/admin-or-hr",
  protect,
  authorize("company_admin", "hr"),
  (req, res) => {
    res.json({ success: true, message: "Company admin or HR content" });
  }
);

export default router;
