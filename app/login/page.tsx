"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "login" or "signup"
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setMode("signup");
    } else if (searchParams.get("mode") === "login") {
      setMode("login");
    }
  }, [searchParams]);

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Frontend validation
    if (!cleanEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "signup") {
      if (!cleanName) {
        setError("Please enter your full name.");
        return;
      }
      if (cleanName.length < 2) {
        setError("Name must be at least 2 characters.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Registration failed. Please try again.");
          return;
        }

        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.replace("/");
          router.refresh();
        }, 800);
      } else {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Invalid email or password.");
          return;
        }

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          if (data.redirect) {
            router.replace(data.redirect);
          } else {
            router.replace("/");
          }
          router.refresh();
        }, 600);
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] p-4 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[20%] left-[10%] w-[32rem] h-[32rem] rounded-full bg-[#1B4332]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[32rem] h-[32rem] rounded-full bg-[#E9A23B]/5 blur-[120px] pointer-events-none" />

      <div className="bg-white p-8 sm:p-10 rounded-3xl w-full max-w-md space-y-6 border border-[#E2EBE5] shadow-[0_12px_36px_-6px_rgba(27,67,50,0.08)] relative z-10">
        
        {/* Header / Emblem */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center mx-auto shadow-md shadow-[#1B4332]/20 mb-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
            {mode === "login" ? "Citizen Login" : "Create Account"}
          </h1>
          <p className="text-xs text-[#6B7280]">
            {mode === "login"
              ? "Access your citizen services and track your inquiries"
              : "Register as a citizen to access all ARCA assistance features"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F4F7F4] p-1 rounded-2xl border border-[#E2EBE5]">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === "login"
                ? "bg-white text-[#1B4332] shadow-xs"
                : "text-[#6B7280] hover:text-[#1B4332]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === "signup"
                ? "bg-white text-[#1B4332] shadow-xs"
                : "text-[#6B7280] hover:text-[#1B4332]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Ramesh Kumar"
                required
                autoComplete="name"
                className="w-full p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="citizen@example.com"
              required
              autoComplete="email"
              className="w-full p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1.5">
              Password {mode === "signup" && "(min 8 characters)"}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
              />
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3.5 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#2D6A4F] shadow-sm shadow-[#1B4332]/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading
              ? mode === "signup"
                ? "Creating Account..."
                : "Logging in..."
              : mode === "signup"
              ? "Create Citizen Account"
              : "Login"}
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div className="pt-2 border-t border-[#E2EBE5] flex flex-col items-center gap-2 text-xs">
          {mode === "login" ? (
            <p className="text-[#6B7280]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-bold text-[#1B4332] hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-[#6B7280]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-bold text-[#1B4332] hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          <div className="flex items-center gap-4 pt-1 text-[#6B7280]">
            <Link
              href="/admin/login"
              className="hover:text-[#1B4332] transition-colors font-medium"
            >
              Admin & Officer Portal →
            </Link>
            <span>•</span>
            <Link
              href="/"
              className="hover:text-[#1B4332] transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8]">
          <div className="w-8 h-8 border-3 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}

