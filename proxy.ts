import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && !pathname.startsWith("/admin/login"))
  ) {
    const sessionCookie = request.cookies.get("arca_admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
