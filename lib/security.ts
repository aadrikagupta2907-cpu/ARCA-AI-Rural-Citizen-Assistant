/**
 * Security utilities: in-memory sliding-window rate limiting,
 * input sanitization, and strict validation.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory rate limit store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired rate limit entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * Checks if an action key is rate limited.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    return {
      allowed: true,
      remaining: maxAttempts,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  const remaining = Math.max(0, maxAttempts - record.count);
  const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  return {
    allowed: record.count < maxAttempts,
    remaining,
    resetInSeconds,
  };
}

/**
 * Records a failed attempt for rate limiting.
 */
export function recordFailedAttempt(
  key: string,
  windowMs: number = 15 * 60 * 1000
): void {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
  } else {
    record.count += 1;
  }
}

/**
 * Resets rate limit for a key upon successful authentication.
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Extracts client IP from headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Sanitizes generic string input by removing HTML tags and trimming.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, "") // strip control characters
    .trim();
}

/**
 * Validates email with strict formatting checks.
 */
export function validateEmail(input: unknown): {
  valid: boolean;
  email: string;
  error?: string;
} {
  const email = sanitizeText(input).toLowerCase();
  if (!email) {
    return { valid: false, email: "", error: "Email address is required." };
  }
  if (email.length > 100) {
    return { valid: false, email, error: "Email address is too long." };
  }
  // Standard email validation pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, email, error: "Please enter a valid email address." };
  }
  return { valid: true, email };
}

/**
 * Validates password length and format.
 */
export function validatePassword(
  input: unknown,
  minLength: number = 8
): { valid: boolean; error?: string } {
  if (typeof input !== "string" || !input) {
    return { valid: false, error: "Password is required." };
  }
  if (input.length < minLength) {
    return {
      valid: false,
      error: `Password must be at least ${minLength} characters long.`,
    };
  }
  if (input.length > 128) {
    return { valid: false, error: "Password cannot exceed 128 characters." };
  }
  return { valid: true };
}

/**
 * Validates user full name.
 */
export function validateName(input: unknown): {
  valid: boolean;
  name: string;
  error?: string;
} {
  const name = sanitizeText(input);
  if (!name) {
    return { valid: false, name: "", error: "Full name is required." };
  }
  if (name.length < 2) {
    return { valid: false, name, error: "Name must be at least 2 characters." };
  }
  if (name.length > 70) {
    return { valid: false, name, error: "Name cannot exceed 70 characters." };
  }
  // Allow letters, numbers, spaces, hyphens, apostrophes, and standard accents/scripts
  const nameRegex = /^[\p{L}\p{M}\p{N}\s.'-]+$/u;
  if (!nameRegex.test(name)) {
    return {
      valid: false,
      name,
      error: "Name contains invalid characters.",
    };
  }
  return { valid: true, name };
}

