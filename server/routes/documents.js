import express from "express";
import Document from "../models/Document.js";
import { protect, authorize } from "../middleware/auth.js";
// import { summarizeDocument } from "../utils/ai.js"; // Implement AI summary if needed

const router = express.Router();

// Upload document
router.post(
  "/",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const doc = await Document.create({
      ...req.body,
      uploadedBy: req.user._id,
      organizationId: req.user.organizationId,
      // summary: await summarizeDocument(req.body.url), // Optional AI summary
    });
    res.status(201).json({ success: true, document: doc });
  }
);

// List documents
router.get("/", protect, async (req, res) => {
  const docs = await Document.find({ organizationId: req.user.organizationId });
  res.json({ success: true, documents: docs });
});

// Delete document
router.delete(
  "/:id",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Document deleted" });
  }
);

// Auto-expiry alert (to be run as a cron job or on fetch)
router.get(
  "/expiring-soon",
  protect,
  authorize("company_admin", "hr"),
  async (req, res) => {
    const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Next 7 days
    const docs = await Document.find({
      organizationId: req.user.organizationId,
      expiresAt: { $lte: soon, $gte: new Date() },
    });
    res.json({ success: true, documents: docs });
  }
);

export default router;
