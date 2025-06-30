import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  punchIn: Date,
  punchOut: Date,
  geoLocation: String,
  ipAddress: String,
  manualOverride: {
    type: Boolean,
    default: false,
  },
  overrideBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  biometricData: String, // For FaceID/Biometric hooks
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
