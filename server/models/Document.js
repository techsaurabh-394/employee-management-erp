import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String }, // e.g., "HR Policy", "Offer Letter"
    expiresAt: { type: Date },
    summary: { type: String }, // For AI-powered summary
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
