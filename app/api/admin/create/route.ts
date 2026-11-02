import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Admin from "../../../../lib/models/Admin";
import User from "@/models/User";
import { isAdministrator } from "../../../../lib/adminAuth";
import {
  validateName,
  validateEmail,
  validatePassword,
  sanitizeText,
} from "@/lib/security";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // 1. Strict server-side role check: Only full administrators can create officer accounts
    if (!(await isAdministrator())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator privileges required." },
        { status: 403 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const nameCheck = validateName(body.name);
    if (!nameCheck.valid) {
      return NextResponse.json(
        { success: false, message: nameCheck.error || "Valid name is required." },
        { status: 400 }
      );
    }

    const emailCheck = validateEmail(body.email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { success: false, message: emailCheck.error || "Valid email is required." },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(body.password, 12);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.error || "Password must be at least 12 characters." },
        { status: 400 }
      );
    }

    const department = sanitizeText(body.department) || "General";
    const email = emailCheck.email;

    await connectDB();

    // Check duplicate email in both collections
    const [existingAdmin, existingUser] = await Promise.all([
      Admin.findOne({ email }),
      User.findOne({ email }),
    ]);

    if (existingAdmin || existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    await Admin.create({
      name: nameCheck.name,
      email,
      passwordHash,
      department,
      role: "officer",
    });

    return NextResponse.json({
      success: true,
      message: "Officer account created successfully.",
    });
  } catch (error) {
    console.error("Admin account creation error:", error);

    return NextResponse.json(
      { success: false, message: "Could not create account." },
      { status: 500 }
    );
  }
}
