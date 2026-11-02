import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Admin from "@/lib/models/Admin";
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

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const emailCheck = validateEmail(body.email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { success: false, message: emailCheck.error || "Invalid email address." },
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
    const rateLimitKey = `login:${ip}:${email}`;

    // Rate limit: 5 attempts per 15 minutes per IP + email
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

    const { SESSION_SECRET } = process.env;
    if (!SESSION_SECRET) {
      return NextResponse.json(
        { success: false, message: "Server authentication is not configured." },
        { status: 500 }
      );
    }

    await connectDB();

    // 1. Check Citizen User collection
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(body.password, user.passwordHash);
      if (!isMatch) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json(
          { success: false, message: "Invalid email or password." },
          { status: 401 }
        );
      }

      resetRateLimit(rateLimitKey);

      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8; // 8 hours
      const token = createSessionToken(
        {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "user",
          exp,
        },
        SESSION_SECRET
      );

      const response = NextResponse.json({
        success: true,
        message: "Login successful.",
        user: {
          name: user.name,
          email: user.email,
          role: "user",
        },
      });

      response.cookies.set("arca_user_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    // 2. Check Admin / Officer collection
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isMatch = await bcrypt.compare(body.password, admin.passwordHash);
      if (!isMatch) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json(
          { success: false, message: "Invalid email or password." },
          { status: 401 }
        );
      }

      resetRateLimit(rateLimitKey);

      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
      const adminToken = createSessionToken(
        {
          email: admin.email,
          role: admin.role,
          exp,
        },
        SESSION_SECRET
      );

      const userToken = createSessionToken(
        {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
          exp,
        },
        SESSION_SECRET
      );

      const response = NextResponse.json({
        success: true,
        message: "Login successful.",
        user: {
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        redirect: "/admin",
      });

      // Set admin session cookie
      response.cookies.set("arca_admin_session", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      // Set user session cookie for frontend state
      response.cookies.set("arca_user_session", userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    // Neither user nor admin matched
    recordFailedAttempt(rateLimitKey);
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}

