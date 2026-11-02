"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

interface UserInfo {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth session
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // ignore network error
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E2EBE5] shadow-[0_2px_12px_rgba(27,67,50,0.04)]"
          : "bg-[#F8FAF8]/85 backdrop-blur-sm border-b border-[#E2EBE5]/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-md shadow-[#1B4332]/20 relative overflow-hidden group-hover:bg-[#2D6A4F] transition-colors duration-300">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#1B4332]">
              ARCA
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            <div className="flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-semibold text-[#4B5563] hover:text-[#1B4332] transition-colors duration-200"
              >
                {t("navbar.features")}
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-semibold text-[#4B5563] hover:text-[#1B4332] transition-colors duration-200"
              >
                {t("navbar.howItWorks")}
              </a>
              <a
                href="#impact"
                className="text-sm font-semibold text-[#4B5563] hover:text-[#1B4332] transition-colors duration-200"
              >
                {t("navbar.impact")}
              </a>
            </div>

            <div className="h-5 w-px bg-[#E2EBE5]" />

            {/* Dynamic Searchable Language Selector */}
            <LanguageSelector />

            {/* User Account / Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1B4332] bg-[#E8F5E9] border border-[#D8F3DC]">
                  <svg
                    className="w-3.5 h-3.5 text-[#2D6A4F]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-[#1B4332] hover:text-[#0E2E20] hover:bg-[#E8F5E9] border border-[#E2EBE5] transition-all duration-200"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Sign In</span>
              </a>
            )}

            {/* Admin Login */}
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-[#1B4332] hover:text-[#0E2E20] hover:bg-[#E8F5E9] border border-[#E2EBE5] transition-all duration-200"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>{t("navbar.admin")}</span>
            </a>

            {/* Launch CTA */}
            <a
              href="#portal"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold bg-[#1B4332] text-white hover:bg-[#2D6A4F] shadow-sm shadow-[#1B4332]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {t("navbar.launchPortal")}
            </a>
          </div>

          {/* Mobile Actions Header */}
          <div className="md:hidden flex items-center gap-2.5">
            {/* Mobile Language Selector */}
            <LanguageSelector variant="compact" />

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-[#4B5563] hover:text-[#1B4332] hover:bg-[#F4F7F4] border border-[#E2EBE5] transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-96 opacity-100 border-b border-[#E2EBE5] bg-white/95 backdrop-blur-xl shadow-lg"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-3">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-[#4B5563] hover:text-[#1B4332] hover:bg-[#F4F7F4] transition-colors"
          >
            {t("navbar.features")}
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-[#4B5563] hover:text-[#1B4332] hover:bg-[#F4F7F4] transition-colors"
          >
            {t("navbar.howItWorks")}
          </a>
          <a
            href="#impact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-[#4B5563] hover:text-[#1B4332] hover:bg-[#F4F7F4] transition-colors"
          >
            {t("navbar.impact")}
          </a>

          {/* User auth state in mobile */}
          {user ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#E8F5E9] border border-[#D8F3DC]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#2D6A4F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-bold text-[#1B4332] truncate">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#1B4332] hover:bg-[#E8F5E9] border border-[#E2EBE5] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Sign In / Register</span>
            </a>
          )}

          <a
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#1B4332] hover:bg-[#E8F5E9] border border-[#E2EBE5] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            {t("navbar.adminLogin")}
          </a>

          <div className="pt-2">
            <a
              href="#portal"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[#1B4332] text-white hover:bg-[#2D6A4F] shadow-sm shadow-[#1B4332]/20"
            >
              {t("navbar.launchPortal")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
