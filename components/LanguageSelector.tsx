"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSelectorProps {
  className?: string;
  variant?: "navbar" | "compact" | "drawer";
}

export default function LanguageSelector({
  className = "",
  variant = "navbar",
}: LanguageSelectorProps) {
  const { currentLang, currentLanguage, setLanguage, languages, t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [languages, searchQuery]);

  // Popular languages for quick tabs
  const popularCodes = ["en", "hi", "hinglish", "es", "ar", "bn", "ta", "te"];
  const popularLanguages = useMemo(
    () => languages.filter((l) => popularCodes.includes(l.code)),
    [languages]
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2EBE5] text-sm font-semibold text-[#1B4332] hover:bg-[#F4F7F4] hover:border-[#2D6A4F]/60 transition-all duration-200 shadow-[0_1px_4px_rgba(27,67,50,0.04)] group"
        title={t("navbar.selectLanguage")}
      >
        <span className="text-base group-hover:scale-110 transition-transform">
          {currentLanguage.flag || "🌐"}
        </span>
        <span className="max-w-[120px] truncate font-semibold text-xs sm:text-sm text-[#111827]">
          {currentLanguage.nativeName}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#1B4332] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Searchable Dropdown Modal / Popover */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-[#E2EBE5] shadow-[0_12px_28px_-4px_rgba(27,67,50,0.14)] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header & Search Bar */}
          <div className="space-y-2.5 pb-2.5 border-b border-[#E2EBE5]">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                {t("navbar.selectLanguage")}
              </span>
              <span className="text-[11px] text-[#2D6A4F] font-bold bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#D8F3DC]">
                {languages.length} Languages
              </span>
            </div>

            <div className="relative">
              <svg
                className={`w-4 h-4 text-[#6B7280] absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 -translate-y-1/2`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("navbar.searchLanguage")}
                className={`w-full ${
                  isRTL ? "pr-9 pl-3" : "pl-9 pr-3"
                } py-2 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] text-xs text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`absolute ${
                    isRTL ? "left-2.5" : "right-2.5"
                  } top-1/2 -translate-y-1/2 text-xs text-[#6B7280] hover:text-[#111827] p-0.5`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Popular Pills (when not searching) */}
            {!searchQuery && (
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
                {popularLanguages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setIsOpen(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                      currentLang.toLowerCase() === l.code.toLowerCase()
                        ? "bg-[#1B4332] text-white font-bold shadow-xs"
                        : "bg-[#F4F7F4] text-[#4B5563] hover:text-[#111827] hover:bg-[#EAEFEA] border border-[#E2EBE5]"
                    }`}
                  >
                    {l.flag} {l.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Languages List */}
          <div className="mt-2 max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#6B7280]">
                {t("navbar.noLanguagesFound")}
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = currentLang.toLowerCase() === lang.code.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      isSelected
                        ? "bg-[#E8F5E9] text-[#1B4332] border border-[#AEEECB] font-semibold"
                        : "text-[#374151] hover:text-[#111827] hover:bg-[#F4F7F4] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-base">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#111827]">{lang.nativeName}</span>
                        <span className="text-[10px] text-[#6B7280] font-normal">
                          {lang.name}
                          {lang.rtl ? " (RTL)" : ""}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
