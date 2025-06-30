import express from "express";
import Organization from "../models/Organization.js";
import { protect, authorize } from "../middleware/auth.js";
import { sendWelcomeEmail } from "../controllers/emailController.js";
import crypto from "crypto";

const router = express.Router();

// Create organization (company/hospital)
// Create organization (company_admin only, creates admin user if not exists)
router.post("/", protect, authorize("company_admin"), async (req, res) => {
  try {
    const {
      name,
      code,
      industry,
      address,
      contact,
      adminName,
      adminEmail,
      password,
    } = req.body;
    const User = (await import("../models/User.js")).default;
    let adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      return res
        .status(400)
        .json({ success: false, message: "Admin email already exists" });
    }
    const adminPassword =
      password || require("crypto").randomBytes(8).toString("base64");
    adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "company_admin",
      isActive: true,
      isEmailVerified: true,
    });
    const organization = await Organization.create({
      name,
      code,
      industry,
      adminId: adminUser._id,
      address,
      contact,
    });
    adminUser.organizationId = organization._id;
    await adminUser.save();
    // Send welcome email
    await sendWelcomeEmail(adminEmail, adminName, adminPassword, true);
    res.status(201).json({
      success: true,
      organization: {
        _id: organization._id,
        name: organization.name,
        code: organization.code,
        industry: organization.industry,
        address: organization.address,
        contact: organization.contact,
        adminName: adminUser.name,
        adminEmail: adminUser.email,
        employeeCount: 0,
        createdAt: organization.createdAt,
        isActive: true,
        // plan removed
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all organizations (super admin only)
// Get all organizations (super_admin only)
router.get("/", protect, authorize("super_admin"), async (req, res) => {
  const User = (await import("../models/User.js")).default;
  const orgs = await Organization.find();
  // Populate admin info and employee count for each org
  const organizations = await Promise.all(
    orgs.map(async (org) => {
      const adminUser = await User.findById(org.adminId);
      // Count employees for this org
      const Employee = (await import("../models/Employee.js")).default;
      const employeeCount = await Employee.countDocuments({
        organizationId: org._id,
      });
      return {
        _id: org._id,
        name: org.name,
        code: org.code,
        industry: org.industry,
        address: org.address,
        contact: org.contact,
        adminName: adminUser ? adminUser.name : "",
        adminEmail: adminUser ? adminUser.email : "",
        employeeCount,
        createdAt: org.createdAt,
        isActive: true,
        // plan removed
      };
    })
  );
  res.json({ success: true, organizations });
});

// Get single organization
router.get("/:id", protect, async (req, res) => {
  const org = await Organization.findById(req.params.id);
  if (!org)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, organization: org });
});

// Update organization (add branches, departments, etc.)
router.put(
  "/:id",
  protect,
  authorize("super_admin", "company_admin"),
  async (req, res) => {
    const org = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!org)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, organization: org });
  }
);

// Delete organization
router.delete("/:id", protect, authorize("super_admin"), async (req, res) => {
  await Organization.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Organization deleted" });
});

// Super Admin: Create organization with admin assignment
router.post("/create-with-admin", protect, async (req, res) => {
  try {
    // Only super_admin can access
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const {
      orgName,
      orgCode,
      industry,
      adminName,
      adminEmail,
      address,
      contact,
      plan,
      password,
    } = req.body;
    // Use provided password or generate one
    const adminPassword = password || crypto.randomBytes(8).toString("base64");
    // Check if org code or admin email already exists
    const existingOrg = await Organization.findOne({ code: orgCode });
    if (existingOrg) {
      return res
        .status(400)
        .json({ message: "Organization code already exists" });
    }
    const User = (await import("../models/User.js")).default;
    // Create organization first (so we have orgId for admin)
    // Create organization without plan and adminId first
    const organization = await Organization.create({
      name: orgName,
      code: orgCode,
      industry,
      address,
      contact,
    });
    // Now create admin user with organizationId
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      // Clean up org if admin already exists
      await Organization.findByIdAndDelete(organization._id);
      return res.status(400).json({ message: "Admin email already exists" });
    }
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "company_admin",
      isActive: true,
      isEmailVerified: true,
      organizationId: organization._id,
    });
    // Link admin to org
    organization.adminId = adminUser._id;
    // Only set plan if you have a valid ObjectId, otherwise skip
    if (organization.schema.path("plan") && plan && typeof plan !== "string") {
      organization.plan = plan;
    }
    await organization.save();
    // Send welcome email to admin
    await sendWelcomeEmail(adminEmail, adminName, adminPassword, true);
    res.status(201).json({
      success: true,
      organization: {
        _id: organization._id,
        name: organization.name,
        code: organization.code,
        industry: organization.industry,
        address: organization.address,
        contact: organization.contact,
        adminName: adminUser.name,
        adminEmail: adminUser.email,
        employeeCount: 0,
        createdAt: organization.createdAt,
        isActive: true,
        plan: organization.plan || "free",
      },
    });
  } catch (error) {
    console.error("Create org with admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
