import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  description: String,
});

export default mongoose.model("ApiKey", apiKeySchema);
