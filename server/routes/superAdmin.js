import express from "express";
import Organization from "../models/Organization.js";
import Plan from "../models/Plan.js";
import Billing from "../models/Billing.js";
import ApiKey from "../models/ApiKey.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Add client company
router.post(
  "/organizations",
  protect,
  authorize("super_admin"),
  async (req, res) => {
    const org = await Organization.create(req.body);
    res.status(201).json({ success: true, organization: org });
  }
);

// Remove client company
router.delete(
  "/organizations/:id",
  protect,
  authorize("super_admin"),
  async (req, res) => {
    await Organization.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Organization deleted" });
  }
);

// Assign plan
router.put(
  "/organizations/:id/plan",
  protect,
  authorize("super_admin"),
  async (req, res) => {
    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { plan: req.body.planId },
      { new: true }
    );
    res.json({ success: true, organization: org });
  }
);

// Billing & invoice management
router.post("/billing", protect, authorize("super_admin"), async (req, res) => {
  const bill = await Billing.create(req.body);
  res.status(201).json({ success: true, billing: bill });
});
router.get("/billing", protect, authorize("super_admin"), async (req, res) => {
  const bills = await Billing.find();
  res.json({ success: true, billings: bills });
});

// Usage monitoring & analytics (dummy endpoint)
router.get("/usage", protect, authorize("super_admin"), async (req, res) => {
  // Implement real analytics as needed
  res.json({ success: true, usage: { activeUsers: 100, orgCount: 10 } });
});

// API key generation
router.post("/apikey", protect, authorize("super_admin"), async (req, res) => {
  const apiKey = await ApiKey.create(req.body);
  res.status(201).json({ success: true, apiKey });
});

export default router;
