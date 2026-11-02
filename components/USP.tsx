"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function USP() {
  const { t } = useLanguage();

  const services = [
    {
      title: "Welfare Scheme Guidance",
      desc: "Instant eligibility check and application steps for central and state welfare initiatives and agricultural subsidies.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjhc8u6vNEcCTqD4gsbvvtQHcNEZBA2covnEsrKvVhVSo2SpUv-mJ2atnCps-8R14YoG2RqFmSghQlHjhQuioAmWk44-OFAS2EntwqSRSVmWbfSfzf1G_NPc-zTsokgf5fCVhcu70FQZywH9CGx5uAW3IDfS5CGGD1bqWRAgy1D1P32f3yDyOQfpuA17HojFGk8KbbZRm8sX8g5afR3ZIKmcE3oWCPDU8sxU4DSCE",
      actionLabel: "Check Eligibility",
      icon: (
        <svg className="w-5 h-5 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Vernacular Document Assistance",
      desc: "Plain-language translation and extraction of key dates, fees, and requirements from official government notices.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC8P64Qt5nAzbXEN32M-xNnlsUq7mGQa0pK0hdPyHYHMRGvbHfYA0cgG2FggAfJb2RCLIBGWjRxTrbp28N00B7oPiZ-lnqQXA_dWA3OTAqmDKtHsg2FAmBMSUrWO6M7vKtc84DOcTzq1DDPegKAnXetCosR6kDvprc06JRzYYKB0q1M-dd-AA9_iskn7cHTpFKKyoDyKOQ8yD3PeleJbfeHXOKG8iUzVq8dKKx0K0",
      actionLabel: "Analyze Notice",
      icon: (
        <svg className="w-5 h-5 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Public Grievance Redressal",
      desc: "Transparent reporting of local infrastructure, irrigation supply, utility repairs, and administrative delays.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlKyx6YuUaXT6JBYfkrTgHTOmOnKsiy73HQl2P7KJq6Jzs_c26MA4DwN197yghjwPHzgMcqsvJjZhpsgx_cZq6oKIubW3XWQOcF1bYJWwZTiUrOQGs8AKSpVp1e9CxNW6k2UmPq0UGTYZClGG9-5byr9NUotbFau7CySzmQLze-_dYBiIzpIPKUL5adW9SOqptYWUedKNPn1qm2wXddqQ_C0ry88zpAqV6xnKWUlw",
      actionLabel: "Register Grievance",
      icon: (
        <svg className="w-5 h-5 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: "Citizen Support",
      desc: "Guided walkthroughs for senior citizens, self-help groups, and first-time smartphone users.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDw2gvsaWNh_bcg59HqRaDCm1-0QzzsRzX4nzMUaSZQWmp22CJoN8hp8FfVXGQPswDXm881_Gm-ONCTGeyK-zKJeANYFuHV8BPHhCz6jUJkjs0xNeJoQIuImLp9L60BYQOfvkCVq6NmrMztnG6P795pj8bNAockEJciYreXTCdO7KD0h2fQ4K5ri3ynxGp1Ch-QHFYXcAm9H7kUduGwM2NkJyigtr4mHos9Irb0nns",
      actionLabel: "Start Assisted Flow",
      icon: (
        <svg className="w-5 h-5 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
    },
  ];

  const reliabilityPillars = [
    {
      title: "Low-Bandwidth Optimized",
      desc: "Engineered to operate smoothly on 2G/3G mobile networks in remote geographical regions.",
      icon: (
        <svg className="w-7 h-7 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Vernacular Speech First",
      desc: "Designed specifically for citizens who prefer natural voice conversation over keyboard typing.",
      icon: (
        <svg className="w-7 h-7 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: "Zero Intermediary Exploitation",
      desc: "Direct, transparent connection between the citizen and verified public protocols with zero middlemen.",
      icon: (
        <svg className="w-7 h-7 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Dignified Experience",
      desc: "Patient, respectful, and crystal-clear guidance every step of the journey without bureaucratic frustration.",
      icon: (
        <svg className="w-7 h-7 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div id="services" className="space-y-0">
      {/* 1. CITIZEN SERVICES SHOWCASE (Image cards matching Stitch reference lines 388-499) */}
      <section className="w-full py-20 bg-[#F4F7F4]/60 border-t border-[#E2EBE5]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC] mb-3">
              Citizen Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
              Empowering Rural Daily Life
            </h2>
            <p className="text-[#4B5563] text-base mt-3 leading-relaxed">
              Dedicated digital support across vital citizen needs and government programs.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-[#E2EBE5] shadow-[0_4px_16px_-2px_rgba(27,67,50,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(27,67,50,0.08)] hover:border-[#2D6A4F]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Photo Preview Container */}
                <div className="relative h-44 overflow-hidden bg-[#E2EBE5]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-2 rounded-xl text-[#1B4332] shadow-sm">
                    {item.icon}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-base font-bold text-[#111827] mb-2 group-hover:text-[#1B4332] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-5">
                    <a
                      href="#portal"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] transition-colors group/link"
                    >
                      <span>{item.actionLabel}</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. INSTITUTIONAL RELIABILITY / TRUST & ACCESSIBILITY (Matching Stitch lines 500-547) */}
      <section className="w-full py-20 bg-white border-t border-[#E2EBE5]" id="trust">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F8FAF8] rounded-3xl p-8 sm:p-12 border border-[#E2EBE5] shadow-[0_4px_16px_-2px_rgba(27,67,50,0.04)]">
            
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#D8F3DC] mb-3">
                Institutional Reliability
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] tracking-tight">
                Built for Inclusion and Absolute Transparency
              </h2>
              <p className="text-[#4B5563] text-base mt-3 leading-relaxed">
                Every feature is architected to protect citizen dignity and eliminate barriers to essential rights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reliabilityPillars.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-[#E2EBE5] flex flex-col gap-3 shadow-xs hover:border-[#2D6A4F]/50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] border border-[#D8F3DC] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#1B4332]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
