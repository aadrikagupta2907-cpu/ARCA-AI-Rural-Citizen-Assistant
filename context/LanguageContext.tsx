"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { ALL_LANGUAGES, DEFAULT_LANGUAGE, LanguageInfo, getLanguageInfo } from "@/lib/languages";
import { SiteTranslations, getDictionary, translateKey } from "@/lib/translations";

interface LanguageContextType {
  currentLang: string;
  currentLanguage: LanguageInfo;
  isRTL: boolean;
  setLanguage: (code: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dict: SiteTranslations;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "arca_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLangState] = useState<string>(DEFAULT_LANGUAGE);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved language on mount, with browser detection fallback
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ALL_LANGUAGES.some((l) => l.code.toLowerCase() === saved.toLowerCase())) {
        setCurrentLangState(saved);
        applyDocumentAttributes(saved);
      } else {
        // Auto-detect from browser locale if available
        let detected = DEFAULT_LANGUAGE;
        if (typeof navigator !== "undefined" && navigator.language) {
          const navLang = navigator.language.split("-")[0].toLowerCase();
          const match = ALL_LANGUAGES.find((l) => l.code.toLowerCase() === navLang);
          if (match) {
            detected = match.code;
          }
        }
        setCurrentLangState(detected);
        applyDocumentAttributes(detected);
      }
    } catch {
      applyDocumentAttributes(DEFAULT_LANGUAGE);
    }
  }, []);

  const applyDocumentAttributes = (langCode: string) => {
    if (typeof document === "undefined") return;
    const info = getLanguageInfo(langCode);
    const html = document.documentElement;
    html.lang = langCode === "hinglish" ? "hi-Latn" : langCode;
    html.dir = info.rtl ? "rtl" : "ltr";
    if (info.rtl) {
      html.classList.add("rtl");
    } else {
      html.classList.remove("rtl");
    }
  };

  const setLanguage = useCallback((code: string) => {
    const valid = ALL_LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
    const targetCode = valid ? valid.code : DEFAULT_LANGUAGE;

    setCurrentLangState(targetCode);
    applyDocumentAttributes(targetCode);

    try {
      localStorage.setItem(STORAGE_KEY, targetCode);
    } catch {}

    // Dispatch global event for listeners outside React tree
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("arca_language_change", { detail: { language: targetCode } })
      );
    }
  }, []);

  // Listen to cross-tab or storage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setLanguage(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setLanguage]);

  const currentLanguage = useMemo(() => getLanguageInfo(currentLang), [currentLang]);
  const isRTL = Boolean(currentLanguage.rtl);

  const dict = useMemo(() => getDictionary(currentLang), [currentLang]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translateKey(dict, key, params);
    },
    [dict]
  );

  const value = useMemo(
    () => ({
      currentLang,
      currentLanguage,
      isRTL,
      setLanguage,
      t,
      dict,
      languages: ALL_LANGUAGES,
    }),
    [currentLang, currentLanguage, isRTL, setLanguage, t, dict]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
