export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
  rtl?: boolean;
  flag: string;
}

export const ALL_LANGUAGES: LanguageInfo[] = [
  // Primary Indian Languages & Hinglish
  { code: "en", name: "English", nativeName: "English", bcp47: "en-IN", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", bcp47: "hi-IN", flag: "🇮🇳" },
  { code: "hinglish", name: "Hinglish", nativeName: "Hinglish", bcp47: "hi-IN", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", bcp47: "bn-IN", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", bcp47: "ta-IN", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", bcp47: "te-IN", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", bcp47: "mr-IN", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", bcp47: "gu-IN", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", bcp47: "pa-IN", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", bcp47: "kn-IN", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", bcp47: "ml-IN", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", bcp47: "or-IN", flag: "🇮🇳" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", bcp47: "as-IN", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", bcp47: "ur-PK", rtl: true, flag: "🇵🇰" },

  // Major World Languages
  { code: "es", name: "Spanish", nativeName: "Español", bcp47: "es-ES", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", bcp47: "fr-FR", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", bcp47: "de-DE", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", nativeName: "العربية", bcp47: "ar-SA", rtl: true, flag: "🇸🇦" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文 (简体)", bcp47: "zh-CN", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", bcp47: "ja-JP", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", bcp47: "ko-KR", flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", nativeName: "Português", bcp47: "pt-BR", flag: "🇧🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", bcp47: "ru-RU", flag: "🇷🇺" },
  { code: "it", name: "Italian", nativeName: "Italiano", bcp47: "it-IT", flag: "🇮🇹" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", bcp47: "tr-TR", flag: "🇹🇷" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", bcp47: "id-ID", flag: "🇮🇩" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", bcp47: "vi-VN", flag: "🇻🇳" },
];

export const DEFAULT_LANGUAGE = "en";

export function getLanguageInfo(code: string): LanguageInfo {
  return (
    ALL_LANGUAGES.find((lang) => lang.code.toLowerCase() === code.toLowerCase()) ||
    ALL_LANGUAGES[0]
  );
}

