import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now },
});

const kycSchema = new mongoose.Schema({
  pan: String,
  aadhaar: String,
  passport: String,
  addressProof: String,
  verified: { type: Boolean, default: false },
});

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      dateOfBirth: Date,
      address: String,
      profilePicture: String,
    },
    workInfo: {
      role: {
        type: String,
        enum: ["hr", "manager", "employee"],
        required: true,
      },
      department: String,
      designation: String,
      shift: String,
      joiningDate: Date,
      salary: {
        total: Number,
        breakdown: Object,
      },
    },
    documents: [documentSchema],
    kyc: kycSchema,
    contactDetails: {
      emergencyContact: String,
      alternatePhone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
