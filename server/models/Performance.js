import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewCycle: { type: mongoose.Schema.Types.ObjectId, ref: "ReviewCycle" },
  feedback: String,
  aiInsights: String, // For AI-powered feedback insights
  createdAt: { type: Date, default: Date.now },
});

const kpiSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  title: String,
  description: String,
  target: Number,
  achieved: Number,
  period: String, // e.g., "Q1 2024"
});

const okrSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  objective: String,
  keyResults: [{ type: String }],
  progress: Number,
  period: String,
});

const reviewCycleSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
});

const performanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  kpis: [kpiSchema],
  okrs: [okrSchema],
  reviewCycles: [reviewCycleSchema],
  feedbacks: [feedbackSchema],
});

export default mongoose.model("Performance", performanceSchema);
