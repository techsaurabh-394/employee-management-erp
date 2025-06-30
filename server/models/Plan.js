import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Free", "Basic", "Pro", "Enterprise"],
    required: true,
  },
  price: { type: Number, required: true },
  features: [String],
  maxUsers: Number,
  maxStorage: Number,
});

export default mongoose.model("Plan", planSchema);
