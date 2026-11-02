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
  validateName,
  validateEmail,
  validatePassword,
} from "@/lib/security";
import { createSessionToken } from "@/lib/userAuth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `register:${ip}`;

    // Rate limit registration to 10 attempts per hour per IP
    const rateCheck = checkRateLimit(rateLimitKey, 10, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many registration attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
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

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    // 1. Strict input validation and sanitization
    const nameCheck = validateName(body.name);
    if (!nameCheck.valid) {
      return NextResponse.json(
        { success: false, message: nameCheck.error || "Invalid name." },
        { status: 400 }
      );
    }

    const emailCheck = validateEmail(body.email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { success: false, message: emailCheck.error || "Invalid email." },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(body.password, 8);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.error || "Invalid password." },
        { status: 400 }
      );
    }

    await connectDB();

    const email = emailCheck.email;

    // 2. Prevent duplicate registrations across users and administrators
    const [existingUser, existingAdmin] = await Promise.all([
      User.findOne({ email }),
      Admin.findOne({ email }),
    ]);

    if (existingUser || existingAdmin) {
      recordFailedAttempt(rateLimitKey, 60 * 60 * 1000);
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email address already exists.",
        },
        { status: 409 }
      );
    }

    // 3. Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(body.password, 12);

    // 4. Force "user" role: public users can NEVER assign themselves admin or officer roles
    const newUser = await User.create({
      name: nameCheck.name,
      email,
      passwordHash,
      role: "user",
    });

    resetRateLimit(rateLimitKey);

    // 5. Create secure session token
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8; // 8 hours
    const token = createSessionToken(
      {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: "user",
        exp,
      },
      SESSION_SECRET
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Account registered successfully.",
        user: {
          name: newUser.name,
          email: newUser.email,
          role: "user",
        },
      },
      { status: 201 }
    );

    // 6. Set secure HttpOnly cookie
    response.cookies.set("arca_user_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}

