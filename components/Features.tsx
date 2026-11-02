"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Features() {
  const { t } = useLanguage();

  const coreCapabilities = [
    {
      title: t("features.feat1Title") || "AI Chat Assistant",
      desc: t("features.feat1Desc") || "Ask questions regarding government welfare schemes, eligibility criteria, required documents, and public procedures in plain language.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      iconBg: "bg-[#D8F3DC] text-[#1B4332]",
      actionLabel: "Open Assistant",
      targetId: "#portal",
    },
    {
      title: t("features.feat2Title") || "Multilingual Voice",
      desc: t("features.feat2Desc") || "Speak naturally in your preferred local language. Voice recognition and speech synthesis ensure complete barrier-free communication.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      iconBg: "bg-[#FEF08A] text-[#854D0E]",
      actionLabel: "Try Voice Mode",
      targetId: "#portal",
    },
    {
      title: t("features.feat3Title") || "Document OCR & Summary",
      desc: t("features.feat3Desc") || "Upload photos or scans of official certificates, notices, or forms to receive instant vernacular summaries and actionable guidance.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      iconBg: "bg-[#E8F5E9] text-[#2D6A4F]",
      actionLabel: "Scan Document",
      targetId: "#portal",
    },
    {
      title: t("features.feat4Title") || "Complaint Registration",
      desc: t("features.feat4Desc") || "File formal complaints and grievances directly to designated public offices with step-by-step assisted intake and auto-categorization.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      iconBg: "bg-[#F3F4F6] text-[#1B4332]",
      actionLabel: "File Complaint",
      targetId: "#portal",
    },
    {
      title: t("features.feat5Title") || "Complaint Tracking",
      desc: t("features.feat5Desc") || "Check real-time status and departmental action logs on previously registered grievances using your unique reference ID anytime.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      iconBg: "bg-[#E0E7FF] text-[#3730A3]",
      actionLabel: "Track Status",
      targetId: "#portal",
    },
    {
      title: t("features.feat6Title") || "Panchayat & CSC Support",
      desc: t("features.feat6Desc") || "Optimized for Common Service Centers and Gram Panchayat kiosks for community-assisted digital governance.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      iconBg: "bg-white/20 text-[#AEEECB]",
      isHighlight: true,
      actionLabel: "Access CSC Mode",
      targetId: "#portal",
    },
  ];

  return (
    <div id="features" className="space-y-0">
      {/* 1. ABOUT ARCA SECTION (2-Column split matching Stitch) */}
      <section className="w-full py-20 bg-white border-t border-[#E2EBE5]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left 5 Cols: Cinematic Photo + Overlay Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 lg:aspect-4/5 border border-[#E2EBE5]">
                <img
                  src="/about-farmer.png"
                  alt="Rural citizens reading information"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/85 via-[#1B4332]/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg text-[#1B4332]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                      Accessible Technology
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#111827]">
                    Designed specifically for zero digital literacy barriers across rural India.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Narrative Copy + 4 Pillars Grid */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left rtl:text-right">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC]">
                  {t("features.tag") || "About ARCA"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight mt-4 leading-tight">
                  {t("features.headline") || "Designed specifically for rural citizen accessibility"}
                </h2>
                <p className="text-[#4B5563] text-base leading-relaxed mt-4">
                  {t("features.subtitle") || "ARCA simplifies complex administrative processes into effortless conversations. Whether you speak your regional dialect or need help understanding official paperwork, ARCA provides verified guidance without intermediaries."}
                </p>
              </div>

              {/* 4 Pillars Grid (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Pillar 1 */}
                <div className="flex items-start gap-3.5 bg-[#F8FAF8] p-4 rounded-2xl border border-[#E2EBE5]">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center shrink-0 mt-0.5 border border-[#D8F3DC]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B4332]">Vernacular AI</h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">Speaks and understands regional languages intuitively.</p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex items-start gap-3.5 bg-[#F8FAF8] p-4 rounded-2xl border border-[#E2EBE5]">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center shrink-0 mt-0.5 border border-[#D8F3DC]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B4332]">Document OCR & Parsing</h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">Reads voter cards, land records, and welfare circulars.</p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex items-start gap-3.5 bg-[#F8FAF8] p-4 rounded-2xl border border-[#E2EBE5]">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center shrink-0 mt-0.5 border border-[#D8F3DC]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B4332]">Transparent Grievances</h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">Direct routing to relevant administrative departments.</p>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="flex items-start gap-3.5 bg-[#F8FAF8] p-4 rounded-2xl border border-[#E2EBE5]">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center shrink-0 mt-0.5 border border-[#D8F3DC]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B4332]">Secure & Privacy-First</h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">Strict public data compliance with zero commercial usage.</p>
                  </div>
                </div>

              </div>

              {/* Action Link */}
              <div className="pt-2">
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 bg-[#1B4332] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#2D6A4F] transition-all shadow-md active:scale-95 group"
                >
                  <span>Learn How It Works</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES GRID (3x2 Grid matching Stitch lines 204-327) */}
      <section className="w-full py-20 bg-[#F4F7F4]/60 border-t border-[#E2EBE5]" id="core-features">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC] mb-3">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
              Everything You Need for Citizen Assistance
            </h2>
            <p className="text-[#4B5563] text-base mt-3 leading-relaxed">
              Powered by intelligent AI to serve rural communities effectively with clarity and transparency.
            </p>
          </div>

          {/* Cards Grid (6 cards in 3x2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((item, idx) => (
              <div
                key={idx}
                className={`p-7 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                  item.isHighlight
                    ? "bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white shadow-xl"
                    : "bg-white border border-[#E2EBE5] shadow-[0_4px_16px_-2px_rgba(27,67,50,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(27,67,50,0.08)] hover:border-[#2D6A4F]/60"
                }`}
              >
                <div>
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-5 ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-2.5 ${item.isHighlight ? "text-white" : "text-[#111827]"}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${item.isHighlight ? "text-[#D8F3DC]" : "text-[#4B5563]"}`}>
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href={item.targetId}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors group ${
                      item.isHighlight
                        ? "text-[#FEF08A] hover:underline"
                        : "text-[#2D6A4F] hover:text-[#1B4332]"
                    }`}
                  >
                    <span>{item.actionLabel}</span>
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
