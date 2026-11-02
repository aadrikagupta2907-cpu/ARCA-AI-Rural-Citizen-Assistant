"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      step: "Step 1",
      title: t("howItWorks.step1Title") || "Select Language",
      desc: t("howItWorks.step1Desc") || "Choose your preferred language and select either voice speech or standard text interaction.",
      bg: "bg-[#1B4332]",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
    {
      step: "Step 2",
      title: t("howItWorks.step2Title") || "Ask or Upload",
      desc: t("howItWorks.step2Desc") || "State your inquiry verbally, describe your problem, or upload a photo of your administrative document.",
      bg: "bg-[#2D6A4F]",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      step: "Step 3",
      title: t("howItWorks.step3Title") || "AI Guidance",
      desc: t("howItWorks.step3Desc") || "Get instant verified information, summarized documents, or an automatically drafted grievance form.",
      bg: "bg-[#E9A23B]",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      step: "Step 4",
      title: t("howItWorks.step4Title") || "Submit & Track",
      desc: t("howItWorks.step4Desc") || "Complete your submission and receive a direct tracking reference code with live status updates.",
      bg: "bg-[#143225]",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-20 bg-white border-t border-[#E2EBE5]" id="how-it-works">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC] mb-3">
            {t("howItWorks.tag") || "How It Works"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
            {t("howItWorks.headline") || "Simple Steps to Access Citizen Services"}
          </h2>
          <p className="text-[#4B5563] text-base mt-3 leading-relaxed">
            {t("howItWorks.subtitle") || "Effortless, dignified assistance in four intuitive steps designed for all literacy levels."}
          </p>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAF8] p-7 rounded-3xl border border-[#E2EBE5] flex flex-col items-center text-center relative group hover:shadow-lg hover:border-[#2D6A4F]/50 hover:bg-white transition-all duration-300"
            >
              {/* Circular Step Icon */}
              <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center mb-5 shadow-md shadow-[#1B4332]/10 transition-transform group-hover:scale-110 duration-300`}>
                {item.icon}
              </div>

              <span className="text-xs uppercase font-bold text-[#2D6A4F] tracking-widest mb-1.5 font-mono">
                {item.step}
              </span>
              <h3 className="text-lg font-bold text-[#111827] mb-2 group-hover:text-[#1B4332] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
