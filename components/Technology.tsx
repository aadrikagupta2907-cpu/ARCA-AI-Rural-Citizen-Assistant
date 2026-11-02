"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TechNode {
  titleKey: string;
  category: string;
  descKey: string;
  specs: string[];
  metricLabel: string;
  metricValue: string;
}

export default function Technology() {
  const { t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const techStack: TechNode[] = [
    {
      titleKey: "tech.tech1Title",
      category: "Speech Processing",
      descKey: "tech.tech1Desc",
      specs: ["Whisper-Finetuned Dialect Adaptor", "Low-Latency Speech Synthesizer", "Acoustic Noise Filter"],
      metricLabel: "DIALECT COVERAGE",
      metricValue: "27+ Accents",
    },
    {
      titleKey: "tech.tech2Title",
      category: "LLM Core",
      descKey: "tech.tech2Desc",
      specs: ["Contextual Scheme RAG Pipelines", "Standardized Policy Lexicon Mapping", "Bi-directional Translation Layer"],
      metricLabel: "COMPATIBILITY",
      metricValue: "99.4% Match",
    },
    {
      titleKey: "tech.tech3Title",
      category: "Computer Vision",
      descKey: "tech.tech3Desc",
      specs: ["Custom Layout Analysis Engine", "Handwriting Digitization Model", "Subtle Stamp & Seal Segmenter"],
      metricLabel: "SCAN ACCURACY",
      metricValue: "97.8% OCR",
    },
    {
      titleKey: "tech.tech4Title",
      category: "Infrastructure",
      descKey: "tech.tech4Desc",
      specs: ["SQLite Local Storage Adapter", "Adaptive Compression Gzip", "Automatic SMS Failover Gateway"],
      metricLabel: "OFFLINE LATENCY",
      metricValue: "0 ms Caching",
    },
  ];

  return (
    <section id="technology" className="relative py-20 bg-white border-t border-[#E2EBE5]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC] mb-3">
            {t("tech.tag") || "Under The Hood"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
            {t("tech.headline") || "Engineered for Resilient Rural Performance"}
          </h2>
          <p className="text-[#4B5563] text-base mt-3 leading-relaxed">
            {t("tech.subtitle") || "State-of-the-art multilingual AI optimized for edge devices and low-bandwidth connections."}
          </p>
        </div>

        {/* Tech Nodes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techStack.map((tech, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-7 rounded-3xl border transition-all duration-300 relative group flex flex-col justify-between ${
                  isHovered
                    ? "border-[#2D6A4F] bg-white shadow-[0_12px_28px_-4px_rgba(27,67,50,0.08)] -translate-y-1"
                    : "border-[#E2EBE5] bg-[#F8FAF8] shadow-[0_4px_16px_-2px_rgba(27,67,50,0.04)]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#D8F3DC]">
                      {tech.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#6B7280]">SYSTEM NODE {idx + 1}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111827] group-hover:text-[#1B4332] transition-colors">
                    {t(tech.titleKey)}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {t(tech.descKey)}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {tech.specs.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-medium text-[#374151] bg-white border border-[#E2EBE5] px-2.5 py-1 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2EBE5] flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#6B7280] font-bold uppercase">{tech.metricLabel}</span>
                  <span className="font-mono text-xs font-bold text-[#2D6A4F]">{tech.metricValue}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
