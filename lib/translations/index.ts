import { SiteTranslations } from "./types";
import { en } from "./en";
import { hi } from "./hi";
import { hinglish } from "./hinglish";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { ar } from "./ar";
import { bn, ta, te, mr, gu, pa, kn, ur, zh, ru, pt, ja, ko } from "./otherLanguages";

export * from "./types";
export { en, hi, hinglish, es, fr, de, ar };

const TRANSLATION_MAP: Record<string, SiteTranslations> = {
  en,
  hi,
  hinglish,
  es,
  fr,
  de,
  ar,
  bn,
  ta,
  te,
  mr,
  gu,
  pa,
  kn,
  ur,
  zh,
  ru,
  pt,
  ja,
  ko,
};

export function getDictionary(langCode: string): SiteTranslations {
  const code = langCode.toLowerCase();
  return TRANSLATION_MAP[code] || TRANSLATION_MAP[code.split("-")[0]] || en;
}

// Deep key retrieval with dot notation: t("hero.tag") or t("navbar.features")
export function translateKey(
  dict: SiteTranslations,
  key: string,
  params?: Record<string, string | number>
): string {
  const parts = key.split(".");
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      // Fallback to English dictionary
      let fallbackCurrent: any = en;
      for (const fallbackPart of parts) {
        if (fallbackCurrent && typeof fallbackCurrent === "object" && fallbackPart in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fallbackPart];
        } else {
          return key;
        }
      }
      current = fallbackCurrent;
      break;
    }
  }

  if (typeof current !== "string") {
    return key;
  }

  let text = current;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
    }
  }

  return text;
}

