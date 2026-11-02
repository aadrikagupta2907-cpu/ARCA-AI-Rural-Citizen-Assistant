"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Server has set the session cookie.
      // Do not use localStorage as proof of authentication.
      router.replace("/admin");
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

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 sm:p-10 rounded-3xl w-full max-w-md space-y-6 border border-[#E2EBE5] shadow-[0_12px_36px_-6px_rgba(27,67,50,0.08)] relative z-10"
      >
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
            Admin Login
          </h1>
          <p className="text-xs text-[#6B7280]">
            Secure administrative access for ARCA governance
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@panchayat.gov.in"
              autoComplete="username"
              required
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
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3.5 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#2D6A4F] shadow-sm shadow-[#1B4332]/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center pt-2 space-y-2">
          <div>
            <a
              href="/login"
              className="text-xs font-semibold text-[#1B4332] hover:underline"
            >
              Citizen Login &amp; Sign Up →
            </a>
          </div>
          <div>
            <a
              href="/"
              className="text-xs font-semibold text-[#4B5563] hover:text-[#1B4332] transition-colors"
            >
              ← Back to ARCA Website
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
