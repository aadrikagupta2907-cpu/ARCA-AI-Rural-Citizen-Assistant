import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export type UserSession = {
  id?: string;
  name?: string;
  email: string;
  role: "user" | "officer" | "admin";
  exp: number;
};

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export function createSessionToken(
  payloadObj: Record<string, unknown>,
  secret: string
): string {
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

/**
 * Verifies and parses a signed session token.
 */
export function verifySessionToken<T = Record<string, unknown>>(
  token: string,
  secret: string
): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    const expectedSignature = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const actual = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      return null;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (typeof data !== "object" || data === null) {
      return null;
    }

    if (typeof data.exp === "number" && data.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return data as T;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently active user session from cookies.
 * Checks both arca_user_session and arca_admin_session.
 */
export async function getUserSession(): Promise<UserSession | null> {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return null;

    const cookieStore = await cookies();

    // Check citizen user session first
    const userToken = cookieStore.get("arca_user_session")?.value;
    if (userToken) {
      const data = verifySessionToken<UserSession>(userToken, secret);
      if (
        data &&
        typeof data.email === "string" &&
        ["user", "officer", "admin"].includes(data.role)
      ) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          exp: data.exp,
        };
      }
    }

    // Also check admin session for seamless navbar display if logged in as admin
    const adminToken = cookieStore.get("arca_admin_session")?.value;
    if (adminToken) {
      const data = verifySessionToken<{ email: string; role: "admin" | "officer"; exp: number }>(
        adminToken,
        secret
      );
      if (
        data &&
        typeof data.email === "string" &&
        ["admin", "officer"].includes(data.role)
      ) {
        return {
          email: data.email,
          role: data.role,
          exp: data.exp,
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if any user is currently authenticated.
 */
export async function isUserAuthenticated(): Promise<boolean> {
  const session = await getUserSession();
  return session !== null;
}

