import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: { type: String, required: true }, // e.g., "2024-06"
  salaryTemplate: {
    basic: Number,
    hra: Number,
    bonus: Number,
    deductions: {
      pf: Number,
      esi: Number,
      tds: Number,
      other: Number,
    },
    gross: Number,
    net: Number,
  },
  payslipUrl: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  paymentDate: Date,
  history: [
    {
      date: Date,
      action: String,
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

payrollSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export default mongoose.model("Payroll", payrollSchema);
