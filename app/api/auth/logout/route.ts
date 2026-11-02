import { NextResponse } from "next/server";

export const runtime = "nodejs";

function clearAllSessions() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  // Clear citizen session cookie
  response.cookies.delete("arca_user_session");
  response.cookies.set("arca_user_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  // Clear admin session cookie
  response.cookies.delete("arca_admin_session");
  response.cookies.set("arca_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

export async function POST() {
  return clearAllSessions();
}

export async function GET() {
  return clearAllSessions();
}

