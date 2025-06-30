import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  amount: Number,
  invoiceNumber: String,
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  issuedAt: { type: Date, default: Date.now },
  paidAt: Date,
  details: mongoose.Schema.Types.Mixed,
});

export default mongoose.model("Billing", billingSchema);
