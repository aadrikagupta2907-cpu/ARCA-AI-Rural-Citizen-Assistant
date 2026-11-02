import mongoose, { Schema, models, model } from "mongoose";

const ComplaintSchema = new Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      index: true,
      trim: true,
      lowercase: true,
    },
    authority: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userInput: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Resolved"],
      default: "Pending",
    },
    priority: {
      type: String,
      default: "Medium",
    },
    category: {
      type: String,
      default: "General",
    },
    estimatedResolution: {
      type: String,
      default: "3-5 Days",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Complaint ||
  model("Complaint", ComplaintSchema);
