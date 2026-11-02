import { NextResponse } from "next/server";

export const runtime = "nodejs";

function clearSession() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.delete("arca_admin_session");
  response.cookies.set("arca_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.delete("arca_user_session");
  response.cookies.set("arca_user_session", "", {
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
  return clearSession();
}

export async function GET() {
  return clearSession();
}
