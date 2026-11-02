
import mongoose, { Schema, models, model } from "mongoose";

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: "General",
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "officer"],
      default: "officer",
    },
  },
  { timestamps: true }
);

const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;
