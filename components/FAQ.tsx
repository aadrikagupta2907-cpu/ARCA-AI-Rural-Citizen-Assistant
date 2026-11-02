"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  qKey: string;
  aKey: string;
}

export default function FAQ() {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    { qKey: "faq.q1", aKey: "faq.a1" },
    { qKey: "faq.q2", aKey: "faq.a2" },
    { qKey: "faq.q3", aKey: "faq.a3" },
    { qKey: "faq.q4", aKey: "faq.a4" },
    { qKey: "faq.q5", aKey: "faq.a5" },
  ];

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full py-20 bg-[#F4F7F4]/50 border-t border-[#E2EBE5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC]">
            {t("faq.tag") || "Frequently Asked Questions"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
            {t("faq.headline") || "Common Questions About ARCA"}
          </h2>
          <p className="text-[#4B5563] text-sm sm:text-base max-w-xl mx-auto">
            {t("faq.subtitle") || "Answers to frequently asked questions about citizen rights, voice features, and grievance processes."}
          </p>
        </div>

        {/* FAQ Accordion list */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-[#2D6A4F] shadow-[0_8px_20px_-2px_rgba(27,67,50,0.06)]" : "border-[#E2EBE5] hover:border-[#2D6A4F]/50 shadow-xs"
                }`}
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left rtl:text-right focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-[#111827] group-hover:text-[#1B4332] transition-colors pr-4 rtl:pr-0 rtl:pl-4">
                    {t(faq.qKey)}
                  </span>
                  <div className={`w-8 h-8 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] flex items-center justify-center text-[#2D6A4F] transition-all duration-300 shrink-0 ${
                    isOpen ? "border-[#AEEECB] bg-[#E8F5E9] text-[#1B4332] rotate-180" : ""
                  }`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Animated collapse content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-[#E2EBE5] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="p-6 text-sm text-[#4B5563] leading-relaxed bg-[#F8FAF8]/50 text-left rtl:text-right font-medium">
                    {t(faq.aKey)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
