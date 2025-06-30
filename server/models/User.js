import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "company_admin", "hr", "manager", "employee"],
      default: "employee",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: function () {
        return this.role !== "super_admin";
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    permissions: [
      {
        type: String,
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user permissions based on role
userSchema.methods.getPermissions = function () {
  const rolePermissions = {
    super_admin: ["*"], // All permissions
    company_admin: [
      "organization:read",
      "organization:write",
      "employee:read",
      "employee:write",
      "employee:delete",
      "attendance:read",
      "attendance:write",
      "leave:read",
      "leave:write",
      "leave:approve",
      "payroll:read",
      "payroll:write",
      "report:read",
      "report:export",
    ],
    hr: [
      "employee:read",
      "employee:write",
      "attendance:read",
      "attendance:write",
      "leave:read",
      "leave:write",
      "leave:approve",
      "payroll:read",
      "payroll:write",
      "document:read",
      "document:write",
      "recruitment:read",
      "recruitment:write",
    ],
    manager: [
      "employee:read",
      "attendance:read",
      "leave:read",
      "leave:approve",
      "performance:read",
      "performance:write",
      "report:read",
    ],
    employee: [
      "profile:read",
      "profile:write",
      "attendance:read",
      "leave:read",
      "leave:write",
      "document:read",
      "expense:read",
      "expense:write",
    ],
  };

  return rolePermissions[this.role] || [];
};
export default mongoose.model("User", userSchema);
