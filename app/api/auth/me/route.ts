import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/userAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name || session.email.split("@")[0],
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}

