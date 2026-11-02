import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/db";
import Admin from "../../../../lib/models/Admin";
import User from "@/models/User";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getClientIp,
  validateEmail,
  validatePassword,
} from "@/lib/security";
import { createSessionToken } from "@/lib/userAuth";

export const runtime = "nodejs";

function safeCompare(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  return (
    first.length === second.length &&
    timingSafeEqual(first, second)
  );
}

function createSession(
  email: string,
  role: string,
  secret: string
) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    })
  ).toString("base64url");

  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const {
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      SESSION_SECRET,
    } = process.env;

    if (!SESSION_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Server authentication is not configured." },
        { status: 500 }
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

    // 1. Validate inputs
    const emailCheck = validateEmail(body.email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { success: false, message: emailCheck.error || "Valid email is required." },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(body.password, 1);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    const email = emailCheck.email;
    const password = body.password;
    const rateLimitKey = `admin_login:${ip}:${email}`;

    // 2. Enforce login rate limiting (5 attempts per 15 min)
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many failed login attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    await connectDB();

    // 3. Strict role-based protection: Normal users CANNOT access the admin portal
    const citizenUser = await User.findOne({ email });
    if (citizenUser) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Citizen accounts are not authorized to access the Admin Dashboard.",
        },
        { status: 403 }
      );
    }

    let admin = await Admin.findOne({ email });

    // 4. Create the initial admin from environment credentials if not yet in DB
    if (
      !admin &&
      safeCompare(email, ADMIN_EMAIL.trim().toLowerCase()) &&
      safeCompare(password, ADMIN_PASSWORD)
    ) {
      admin = await Admin.create({
        name: "ARCA Administrator",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        department: "Administration",
        role: "admin",
      });
    }

    if (!admin) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Reset rate limit upon successful authentication
    resetRateLimit(rateLimitKey);

    const token = createSession(email, admin.role, SESSION_SECRET);

    const userToken = createSessionToken(
      {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      },
      SESSION_SECRET
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      role: admin.role,
    });

    // Set secure admin session cookie
    response.cookies.set("arca_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    // Also set user session cookie for unified navbar recognition
    response.cookies.set("arca_user_session", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
