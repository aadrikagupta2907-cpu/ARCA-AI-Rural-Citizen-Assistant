
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

type AdminSession = {
  email: string;
  role: "admin" | "officer";
  exp: number;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return null;

    const cookieStore = await cookies();
    const token = cookieStore.get("arca_admin_session")?.value;
    if (!token) return null;

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

    if (
      typeof data.email !== "string" ||
      !["admin", "officer"].includes(data.role) ||
      typeof data.exp !== "number" ||
      data.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      email: data.email,
      role: data.role,
      exp: data.exp,
    };
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

export async function isAdministrator(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.role === "admin";
}
