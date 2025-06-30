import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const designationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true }, // e.g., "18:00"
  days: [String], // e.g., ["Monday", "Tuesday"]
});

const policySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  details: mongoose.Schema.Types.Mixed,
});

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branches: [branchSchema],
    departments: [departmentSchema],
    designations: [designationSchema],
    shifts: [shiftSchema],
    policies: [policySchema],
    address: String,
    contactEmail: String,
    contactPhone: String,
    logo: String,
    createdAt: { type: Date, default: Date.now },
    // plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" }, // Removed plan field, not needed
    branding: {
      logo: String,
      primaryColor: String,
      secondaryColor: String,
      theme: String, // e.g., "light", "dark", or custom
    },
    emailTemplates: [
      {
        name: String,
        subject: String,
        body: String,
      },
    ],
    smsTemplates: [
      {
        name: String,
        body: String,
      },
    ],
  },
  { timestamps: true }
);

// Update employee count when employees are added/removed
organizationSchema.methods.updateEmployeeCount = async function () {
  const Employee = mongoose.model("Employee");
  const count = await Employee.countDocuments({
    organizationId: this._id,
    isActive: true,
  });
  this.employeeCount = count;
  await this.save();
};

export default mongoose.model("Organization", organizationSchema);
