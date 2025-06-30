import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Fixed env var
    console.log("Connected to MongoDB");

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      email: "saurabhpathak394@gmail.com",
    });

    if (existingSuperAdmin) {
      console.log("Super admin already exists");
      process.exit(0);
    }

    // Create super admin
    const superAdmin = await User.create({
      email: "saurabhpathak394@gmail.com",
      password: "Saurabh@1",
      name: "Saurabh Pathak",
      role: "super_admin",
      isActive: true,
      isEmailVerified: true,
      organizationId: undefined, // Add this line to satisfy required field
    });

    console.log("Super admin created successfully:", superAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding super admin:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
