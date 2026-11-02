"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="w-full bg-[#1B4332] text-white pt-20 pb-12 border-t border-[#2D6A4F]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#2D6A4F]/60">
          
          {/* Brand Info (Cols 1-2) */}
          <div className="lg:col-span-2 flex flex-col gap-4 pr-0 lg:pr-8 text-left rtl:text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#1B4332] flex items-center justify-center font-black text-xl shadow-md">
                A
              </div>
              <span className="text-2xl font-black tracking-tight text-white">ARCA</span>
            </div>
            <p className="text-sm text-[#D8F3DC] leading-relaxed max-w-sm">
              {t("footer.desc") || "AI Rural Citizen Assistant — Empowering rural citizens with seamless digital access, multilingual voice support, document analysis, and grievance redressal."}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[#AEEECB]">
              <svg className="w-4 h-4 text-[#AEEECB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Official Public Service Technology Platform</span>
            </div>
          </div>

          {/* Quick Links (Col 3) */}
          <div className="flex flex-col gap-3 text-left rtl:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FEF08A] mb-1 font-mono">
              Quick Links
            </span>
            <a href="#" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">{t("footer.platform") || "Home"}</a>
            <a href="#features" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">{t("footer.features") || "Features"}</a>
            <a href="#how-it-works" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">{t("footer.workflow") || "How It Works"}</a>
            <a href="#services" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">{t("footer.usps") || "Services"}</a>
            <a href="#portal" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">{t("navbar.launchPortal") || "Launch Portal"}</a>
          </div>

          {/* Core Features (Col 4) */}
          <div className="flex flex-col gap-3 text-left rtl:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FEF08A] mb-1 font-mono">
              Core Features
            </span>
            <a href="#portal" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">AI Chat Assistant</a>
            <a href="#portal" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">Multilingual Voice</a>
            <a href="#portal" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">Document OCR & Summary</a>
            <a href="#portal" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">Complaint Registration</a>
            <a href="#portal" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">Complaint Tracking</a>
          </div>

          {/* Citizen Assistance (Col 5) */}
          <div className="flex flex-col gap-3 text-left rtl:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FEF08A] mb-1 font-mono">
              Citizen Assistance
            </span>
            <a href="#trust" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">Language Support</a>
            <a href="#trust" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">Accessibility Guidelines</a>
            <Link href="/admin/login" className="text-xs text-[#FEF08A] hover:underline font-semibold flex items-center gap-1.5">
              <span>Admin Portal</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
            <a href="#portal" className="text-xs text-[#D8F3DC] hover:text-white transition-colors">Grievance Help</a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left rtl:md:text-right">
          <p className="text-xs text-[#86AF99]">
            © {new Date().getFullYear()} ARCA — AI Rural Citizen Assistant. All rights reserved. Empowering Citizens through Inclusive Technology.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-[#AEEECB] bg-[#143225] border border-[#2D6A4F] px-3 py-1 rounded-full">
              ISO 27001 Certified Security
            </span>
            <span className="text-[11px] font-mono font-bold text-[#FEF08A] bg-[#143225] border border-[#2D6A4F] px-3 py-1 rounded-full">
              27 Languages Active
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
