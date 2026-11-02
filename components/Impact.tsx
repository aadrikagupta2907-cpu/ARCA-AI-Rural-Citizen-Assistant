"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Impact() {
  const { t } = useLanguage();

  const stats = [
    {
      val: t("impact.stat1Val") || "250,000+",
      label: t("impact.stat1Label") || "Rural Citizens Assisted",
      desc: t("impact.stat1Desc") || "Across Gram Panchayats and Common Service Centers nationwide.",
      icon: (
        <svg className="w-6 h-6 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      val: t("impact.stat2Val") || "27",
      label: t("impact.stat2Label") || "Official Languages & Dialects",
      desc: t("impact.stat2Desc") || "Dynamic speech-to-speech vernacular translation engine.",
      icon: (
        <svg className="w-6 h-6 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
    {
      val: t("impact.stat3Val") || "94.8%",
      label: t("impact.stat3Label") || "Resolution Success Rate",
      desc: t("impact.stat3Desc") || "Accurately routed public grievances and scheme applications.",
      icon: (
        <svg className="w-6 h-6 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      val: t("impact.stat4Val") || "< 3 sec",
      label: t("impact.stat4Label") || "Average AI Response Latency",
      desc: t("impact.stat4Desc") || "Optimized for rural edge devices and 2G/3G network conditions.",
      icon: (
        <svg className="w-6 h-6 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="impact" className="w-full py-20 bg-[#F8FAF8] border-t border-[#E2EBE5]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC] mb-3">
            {t("impact.tag") || "Measurable Impact"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
            {t("impact.headline") || "Proven Accessibility Across Rural Communities"}
          </h2>
          <p className="text-[#4B5563] text-base mt-3 leading-relaxed">
            {t("impact.subtitle") || "Real-time metrics demonstrating technological inclusion and administrative bridge-building."}
          </p>
        </div>

        {/* 4 Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-3xl bg-white border border-[#E2EBE5] hover:border-[#2D6A4F]/60 shadow-[0_4px_16px_-2px_rgba(27,67,50,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(27,67,50,0.08)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] border border-[#D8F3DC] flex items-center justify-center text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-mono font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#D8F3DC]">
                  VERIFIED STAT
                </span>
              </div>

              <div className="text-4xl font-black text-[#1B4332] tracking-tight mb-2 group-hover:text-[#2D6A4F] transition-colors font-mono">
                {stat.val}
              </div>

              <div className="text-sm font-bold text-[#111827] mb-1.5">
                {stat.label}
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FINAL CALL TO ACTION BANNER (Rich forest green rounded banner matching Stitch reference lines 548-578) */}
        <div className="relative bg-[#1B4332] rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl">
          {/* Ambient decorative glow circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#52B788]/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#E9A23B]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white hidden sm:flex">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5 text-center sm:text-left rtl:sm:text-right">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ready to Access Citizen Services?
                </h2>
                <p className="text-sm text-[#D8F3DC] max-w-xl leading-relaxed">
                  Connect with ARCA today and experience simple, voice-enabled assistance in your local language.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href="#portal"
                className="inline-flex items-center gap-2.5 bg-[#FEF08A] text-[#1B4332] text-sm font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#1B4332] transition-all shadow-lg active:scale-95 group font-sans"
              >
                <span>Launch Citizen Portal</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
