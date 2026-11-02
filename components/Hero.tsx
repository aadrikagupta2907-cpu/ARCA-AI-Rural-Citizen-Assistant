"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getLanguageInfo } from "@/lib/languages";

// Unicode script detector for all supported Indian and regional scripts
const detectScriptLanguage = (text: string): string | null => {
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN"; // Devanagari (Hindi, Marathi)
  if (/[\u0980-\u09FF]/.test(text)) return "bn-IN"; // Bengali, Assamese
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa-IN"; // Gurmukhi (Punjabi)
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu-IN"; // Gujarati
  if (/[\u0B00-\u0B7F]/.test(text)) return "or-IN"; // Odia
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN"; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN"; // Telugu
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN"; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml-IN"; // Malayalam
  if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) return "ar-SA"; // Arabic / Urdu
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh-CN"; // Chinese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return "ja-JP"; // Japanese
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko-KR"; // Korean
  if (/[\u0400-\u04FF]/.test(text)) return "ru-RU"; // Cyrillic (Russian)
  return null;
};

async function askGemini(message: string, language?: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      language: language || "en",
    }),
  });

  const data = await res.json();
  return data.reply;
}

interface Message {
  sender: "user" | "arca";
  text: string;
  translatedText?: string;
  audioDuration?: string;
}

export default function Hero() {
  const { currentLang, currentLanguage, setLanguage, t, languages } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    "voice" | "complaint" | "document" | "track" | "chat"
  >("voice");

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [demoState, setDemoState] = useState<"idle" | "listening" | "processing" | "responding" | "done">("idle");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [speakingChatIndex, setSpeakingChatIndex] = useState<number | null>(null);

  // For Complaint mode
  const [complaintText, setComplaintText] = useState("");
  const [draftedComplaint, setDraftedComplaint] = useState<{
    subject: string;
    body: string;
    authority: string;
  } | null>(null);

  // For Document mode
  const [docFileSelected, setDocFileSelected] = useState(false);
  const [docSummary, setDocSummary] = useState<string | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [englishSummary, setEnglishSummary] = useState<string | null>(null);
  const [hindiSummary, setHindiSummary] = useState<string | null>(null);
  const [summaryLanguage, setSummaryLanguage] = useState<"original" | "english" | "hindi">("original");

  // For Complaint Tracking & My Complaints
  const [trackComplaintId, setTrackComplaintId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState<any>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [citizenUser, setCitizenUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [myComplaints, setMyComplaints] = useState<any[]>([]);
  const [loadingMyComplaints, setLoadingMyComplaints] = useState(false);
  const [copiedComplaintId, setCopiedComplaintId] = useState<string | null>(null);

  const speak = (
    text: string,
    langOverride?: string,
    onEnd?: () => void
  ) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Voice output is not supported in this browser.");
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("speechSynthesis cancel error:", e);
    }

    // Clean up Markdown and special characters for natural TTS speech
    const cleanText = text
      .replace(/[*#`_~>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const activeLang = langOverride || currentLang;
    const langInfo = getLanguageInfo(activeLang);
    let chosenLanguage = langInfo.bcp47 || "en-IN";

    const detectedScriptBcp47 = detectScriptLanguage(cleanText);

    // If English was selected but text is in a distinct Indic/foreign script, adapt
    if (activeLang === "en" && detectedScriptBcp47) {
      chosenLanguage = detectedScriptBcp47;
    }

    utterance.lang = chosenLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Gracefully select matching voice if available in browser
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langLower = chosenLanguage.toLowerCase();
        const prefix = chosenLanguage.split("-")[0].toLowerCase();
        const match =
          voices.find((v) => v.lang.toLowerCase() === langLower) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
        if (match) {
          utterance.voice = match;
        }
      }
    } catch {}

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("TTS error:", e);
      onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      onEnd?.();
    }
  };

  const handleToggleReadAloud = (index: number, text: string) => {
    if (speakingChatIndex === index) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingChatIndex(null);
    } else {
      setSpeakingChatIndex(index);
      speak(text, currentLang, () => {
        setSpeakingChatIndex(null);
      });
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Please use Google Chrome. Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = currentLanguage.bcp47 || "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    try {
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition start error:", e);
    }

    setDemoState("listening");

    recognition.onresult = async (event: any) => {
      const userText = event.results[0][0].transcript;

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: userText,
        },
      ]);

      setDemoState("processing");
      const responseText = await askGemini(userText, currentLang);

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "arca",
          text: responseText,
          audioDuration: "0:12",
        },
      ]);

      speak(responseText, currentLang);
      setDemoState("done");
    };

    recognition.onerror = (event: any) => {
      setDemoState("idle");
      if (event?.error === "no-speech") {
        return;
      }
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        alert("Microphone permission was denied. Please allow microphone access in your browser.");
        return;
      }
      console.warn("Microphone error:", event?.error);
    };

    recognition.onend = () => {
      if (demoState === "listening") {
        setDemoState("idle");
      }
    };
  };

  // Audio wave animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Demo sequence simulation
  const startVoiceDemo = () => {
    if (demoState !== "idle") return;

    setDemoState("listening");
    setChatMessages([]);

    const sampleQueries: Record<string, string> = {
      hi: "🌾 मुझे पीएम किसान योजना के बारे में बताएं और मैं कैसे आवेदन कर सकता हूँ?",
      hinglish: "🌾 Mujhe PM Kisan yojana ke baare mein batayein aur main kaise apply kar sakta hoon?",
      kn: "🌾 ನನಗೆ ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ ಮತ್ತು ನಾನು ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?",
      ta: "🌾 பிரதம மந்திரி கிசான் திட்டம் பற்றி சொல்லுங்கள். நான் எப்படி விண்ணப்பிப்பது?",
      mr: "🌾 मला पीएम किसान योजनेबद्दल सांगा आणि मी अर्ज कसा करू शकतो?",
      bn: "🌾 আমাকে পিএম কিষাণ প্রকল্প সম্পর্কে বলুন এবং আমি কীভাবে আবেদন করতে পারি?",
      gu: "🌾 મને પીએમ કિસાન યોજના વિશે જણાવો અને હું કેવી રીતે અરજી કરી શકું?",
      pa: "🌾 ਮੈਨੂੰ ਪੀਐਮ ਕਿਸਾਨ ਯੋਜਨਾ ਬਾਰੇ ਦੱਸੋ ਅਤੇ ਮੈਂ ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇ ਸਕਦਾ ਹਾਂ?",
      te: "🌾 నాకు పీఎం కిసాన్ పథకం గురించి చెప్పండి. నేను ఎలా దరఖాస్తు చేసుకోవాలి?",
      ml: "🌾 പിഎം കിസാൻ പദ്ധതിയെക്കുറിച്ച് പറയൂ. എനിക്ക് എങ്ങനെ അപേക്ഷിക്കാം?",
      or: "🌾 ପିଏମ୍ କିଷାନ ଯୋଜନା ବିଷୟରେ କୁହନ୍ତୁ ଏବଂ ମୁଁ କିପରି ଆବେଦନ କରିବି?",
      as: "🌾 মোক পিএম কিষাণ আঁচনিৰ বিষয়ে কওক আৰু মই কেনেকৈ আবেদন কৰিব পাৰোঁ?",
      ur: "🌾 مجھے پی ایم کسان اسکیم کے بارے میں بتائیں اور میں درخواست کیسے دے سکتا ہوں؟",
      es: "🌾 Cuéntame sobre el plan de bienestar agrícola y cómo puedo solicitarlo.",
      fr: "🌾 Parlez-moi du programme de soutien agricole et de la façon dont je peux postuler.",
      de: "🌾 Erzählen Sie mir von den Agrarförderungen und wie ich einen Antrag stellen kann.",
      ar: "🌾 أخبرني عن برنامج الدعم الزراعي وكيف يمكنني التقديم عليه.",
      zh: "🌾 请向我介绍农业福利计划以及我该如何申请。",
      ja: "🌾 農業支援制度について教えてください。申請方法はどうすればよいですか？",
      ko: "🌾 농업 지원 제도와 신청 방법에 대해 알려주세요.",
      pt: "🌾 Conte-me sobre o programa de apoio agrícola e como posso me inscrever.",
      ru: "🌾 Расскажите мне о программе поддержки фермеров и о том, как я могу подать заявку.",
      it: "🌾 Parlami del programma di sostegno agricolo e di come fare domanda.",
      tr: "🌾 Tarımsal destek planı hakkında bilgi verin ve nasıl başvurabilirim?",
      id: "🌾 Beritahu saya tentang program bantuan pertanian dan cara mendaftar.",
      vi: "🌾 Hãy cho tôi biết về chương trình phúc lợi nông nghiệp và cách thức nộp đơn.",
    };

    const userText =
      sampleQueries[currentLang.toLowerCase()] ||
      sampleQueries.en ||
      "🌾 Tell me about the PM Kisan scheme and how I can apply.";

    // 1. Listening to user voice input (2 seconds)
    setTimeout(() => {
      setDemoState("processing");
      setChatMessages([{ sender: "user", text: userText }]);

      // 2. Processing (1.5 seconds)
      setTimeout(() => {
        setDemoState("responding");
        setIsTyping(true);

        // 3. Responding
        setTimeout(async () => {
          setIsTyping(false);
          setDemoState("done");
          setIsPlayingAudio(true);

          const responseText = await askGemini(userText, currentLang);

          setChatMessages((prev) => [
            ...prev,
            {
              sender: "arca",
              text: responseText,
              audioDuration: "0:12",
            },
          ]);

          speak(responseText, currentLang);
        }, 1800);
      }, 1200);
    }, 1500);
  };

  const handleDraftComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!complaintText.trim()) {
      alert("Please describe your complaint first.");
      return;
    }

    setDemoState("processing");
    setDraftedComplaint(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "complaint",
          message: complaintText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Complaint API request failed");
      }

      if (!data.authority || !data.subject || !data.body) {
        throw new Error("Complaint response is missing required fields");
      }

      setDraftedComplaint({
        authority: data.authority,
        subject: data.subject,
        body: data.body,
      });

      setDemoState("done");
    } catch (error) {
      console.error("Complaint drafting error:", error);
      setDemoState("idle");
      alert("Complaint draft could not be generated. Please try again.");
    }
  };

  const handleDocumentAnalyze = async () => {
    if (!docFile) {
      alert("Please select a document first.");
      return;
    }

    setDemoState("processing");
    setDocSummary(null);

    try {
      const formData = new FormData();
      formData.append("file", docFile);

      const res = await fetch("/api/document", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Document analysis failed");
      }
      setDocSummary(data.originalSummary || data.summary || "");
      setOriginalLanguage(data.originalLanguage || "Original");
      setEnglishSummary(data.englishSummary || "");
      setHindiSummary(data.hindiSummary || "");
      setSummaryLanguage("original");
      setDemoState("done");
    } catch (error) {
      console.error("Document analysis error:", error);
      setDocSummary("Document analysis failed. Please check your API setup and try again.");
      setDemoState("done");
    }
  };

  const handleTrackComplaint = async () => {
    if (!trackComplaintId.trim()) return;

    setDemoState("processing");
    setTrackedComplaint(null);
    setTrackError(null);

    try {
      const res = await fetch(`/api/complaints/${trackComplaintId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "API request failed");
      }

      if (
        !data.success ||
        !data.complaint ||
        !data.complaint.authority ||
        !data.complaint.subject ||
        !data.complaint.body
      ) {
        throw new Error(data.message || "Complaint details could not be loaded");
      }

      setTrackedComplaint(data.complaint);
      setDemoState("done");
    } catch (error) {
      console.error(error);
      setTrackError(
        "Something went wrong while fetching your complaint. Please try again in a moment."
      );
      setDemoState("idle");
    }
  };

  const fetchMyComplaints = async () => {
    try {
      setLoadingMyComplaints(true);
      const res = await fetch("/api/complaints/user");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.complaints)) {
          setMyComplaints(data.complaints);
        }
      }
    } catch (err) {
      console.warn("Could not load user complaints:", err);
    } finally {
      setLoadingMyComplaints(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadCitizen() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setCitizenUser(data.user);
          }
        }
      } catch {
        // ignore
      }
    }
    loadCitizen();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (citizenUser) {
      fetchMyComplaints();
    }
  }, [citizenUser, activeTab]);

  const handleCopyComplaintId = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedComplaintId(id);
      setTimeout(() => setCopiedComplaintId(null), 2000);
    }
  };

  const handleTrackSpecificComplaint = async (id: string) => {
    setTrackComplaintId(id);
    setDemoState("processing");
    setTrackedComplaint(null);
    setTrackError(null);

    try {
      const res = await fetch(`/api/complaints/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "API request failed");
      }

      if (
        !data.success ||
        !data.complaint ||
        !data.complaint.authority ||
        !data.complaint.subject ||
        !data.complaint.body
      ) {
        throw new Error(data.message || "Complaint details could not be loaded");
      }

      setTrackedComplaint(data.complaint);
      setDemoState("done");
    } catch (error) {
      console.error(error);
      setTrackError(
        "Something went wrong while fetching your complaint. Please try again in a moment."
      );
      setDemoState("idle");
    }
  };

  const resetDemo = () => {
    setDemoState("idle");
    setChatMessages([]);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setSpeakingChatIndex(null);
    setComplaintText("");
    setDraftedComplaint(null);
    setDocFileSelected(false);
    setDocSummary(null);
    setTrackComplaintId("");
    setTrackedComplaint(null);
    setTrackError(null);
  };

  return (
    <>
      {/* 1. HERO SECTION (Matching Stitch 7-col + 5-col layout) */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F8FAF8] via-[#F4F7F4]/60 to-[#F8FAF8] pt-28 pb-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Content (Left 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5 z-10 text-left">
              {/* Tag Pill */}
              <div className="inline-flex items-center gap-2 self-start bg-[#E8F5E9] text-[#1B4332] px-4 py-1.5 rounded-full border border-[#D8F3DC] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                  {t("hero.tag")}
                </span>
              </div>

              {/* Main Heading */}
              <div className="flex flex-col gap-1.5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B4332] tracking-tight leading-[1.12]">
                  {t("hero.headlinePart1")}{" "}
                  <span className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#40916C] bg-clip-text text-transparent">
                    {t("hero.headlineHighlight")}
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-[#2D6A4F]">
                  {t("hero.subheadline")}
                </p>
              </div>

              {/* Description */}
              <p className="text-base text-[#4B5563] max-w-2xl leading-relaxed">
                Empowering rural citizens with direct access to government schemes, voice-enabled vernacular assistance, instant document verification, and transparent grievance resolution — accessible to everyone, anywhere.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#portal"
                  className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-[#2D6A4F] transition-all shadow-md shadow-[#1B4332]/20 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span>{t("hero.tryVoicePortal")}</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                <a
                  href="#core-features"
                  className="inline-flex items-center gap-2 bg-white text-[#1B4332] font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-[#F4F7F4] border border-[#E2EBE5] transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{t("navbar.features")}</span>
                </a>
              </div>

              {/* Live Trust Micro-note */}
              <div className="flex items-center gap-2 pt-1 text-[#4B5563] text-xs font-medium">
                <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Direct, official public portal guidance • 100% Free Public Utility</span>
              </div>
            </div>

            {/* Hero Image (Right 5 cols) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#E8F5E9] aspect-[4/3] lg:aspect-[5/4] group border border-[#E2EBE5]">
                {/* Image */}
                <img
                  alt="Rural citizen viewing government schemes on smartphone in natural sunlit agricultural setting"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="/hero-farmer.png"
                  onError={(e) => {
                    // Fallback to high-res agricultural reference if local image fails
                    (e.target as HTMLImageElement).src =
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsTK2nF5gQdbnLO2rF4kp4rCy3Sf_N3D8ZQ-1xeBSYGtjpaErcm716voYey_bPLCyoE2uJFi0mynhO0LvI5NjDf72Lcivlejk1qyWTClkhPv3X72zDMD851trxm9BqaoTfTtOYAdI8D8zMEvzhrXVgQ1klqwACXmmae_mx1_qKJ5vWhXIADUVCJ19t5z-2iV_TYn1VLyN7x_4rk0m9TMxFkpdyHDhete03Ym9YkgU";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/75 via-[#1B4332]/15 to-transparent pointer-events-none" />

                {/* Floating Pill Badge Top Right */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-[#E2EBE5]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] animate-pulse" />
                  <span className="text-[11px] text-[#1B4332] font-bold">
                    Live AI Vernacular Engine
                  </span>
                </div>

                {/* Floating Card at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-[#E2EBE5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#1B4332] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-[#111827] font-bold">Voice & Regional Languages</p>
                      <p className="text-[10px] text-[#6B7280]">Instant Document OCR & Translation</p>
                    </div>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2D6A4F] font-bold text-xs">
                    ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE HIGHLIGHT STRIP (4-card metric/capability bar overlapping hero) */}
      <section className="w-full -mt-6 z-20 relative">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white rounded-2xl p-3 shadow-lg border border-[#E2EBE5]">
            {/* Item 1 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0 text-[#1B4332]">
                <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-[#1B4332] font-bold">Multilingual</span>
                <span className="text-xs text-[#6B7280]">Vernacular Voice Support</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0 text-[#B45309]">
                <svg className="w-6 h-6 text-[#B45309]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-[#1B4332] font-bold">Instant AI</span>
                <span className="text-xs text-[#6B7280]">Document OCR Analysis</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center shrink-0 text-[#1B4332]">
                <svg className="w-6 h-6 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-[#1B4332] font-bold">Direct Grievance</span>
                <span className="text-xs text-[#6B7280]">Assisted Registration</span>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center shrink-0 text-[#0369A1]">
                <svg className="w-6 h-6 text-[#0369A1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 2 6-2v14l-6 2-6-2z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-[#1B4332] font-bold">Real-Time</span>
                <span className="text-xs text-[#6B7280]">Live Complaint Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CITIZEN PORTAL / SIMULATOR (Stitch Citizen Portal Bento Box) */}
      <section id="portal" className="w-full py-16 bg-[#F8FAF8]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Welcome Bento Card matching Stitch Dashboard header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBE5] shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative overflow-hidden">
            <div className="flex items-start sm:items-center gap-4 relative z-10 text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-md shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="bg-[#E8F5E9] text-[#2D6A4F] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#D8F3DC]">
                    Verified Rural Citizen
                  </span>
                  <span className="bg-[#F4F7F4] text-[#4B5563] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    Kisan ID: KSN-7729-UP
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
                  नमस्ते, नागरिक जी (Welcome to ARCA)
                </h2>
                <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5 font-medium">
                  <span>Panchayat Node • 27 Regional & Global Languages Supported</span>
                </p>
              </div>
            </div>

            {/* Active Language Mode & Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
              <div className="bg-[#F8FAF8] px-4 py-2.5 rounded-2xl border border-[#E2EBE5] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg shadow-xs">
                  {currentLanguage.flag || "🌐"}
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">
                    सक्रिय भाषा / Active Mode
                  </span>
                  <span className="text-xs font-bold text-[#1B4332] block">
                    {currentLanguage.nativeName} ({currentLanguage.name})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Core Box */}
          <div className="bg-white border border-[#E2EBE5] rounded-3xl overflow-hidden shadow-xl">
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#E2EBE5] bg-[#F4F7F4]/80 p-2 gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => {
                  setActiveTab("voice");
                  resetDemo();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "voice"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#4B5563] hover:text-[#111827] hover:bg-white/80"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>{t("hero.tabVoice")}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("chat");
                  resetDemo();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "chat"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#4B5563] hover:text-[#111827] hover:bg-white/80"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8m-8 4h5m-9 6 1.8-4.8A8 8 0 1 1 20 15.5L12 20H4Z" />
                </svg>
                <span>{t("hero.tabChat")}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("complaint");
                  resetDemo();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "complaint"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#4B5563] hover:text-[#111827] hover:bg-white/80"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{t("hero.tabComplaint")}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("document");
                  resetDemo();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "document"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#4B5563] hover:text-[#111827] hover:bg-white/80"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t("hero.tabDocument")}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("track");
                  resetDemo();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "track"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#4B5563] hover:text-[#111827] hover:bg-white/80"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 2 6-2v14l-6 2-6-2z" />
                </svg>
                <span>{t("hero.tabTrack")}</span>
              </button>
            </div>

            {/* Display / Workspace Area */}
            <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
              {/* CHAT TAB CONTENT */}
              {activeTab === "chat" && (
                <div className="flex flex-col h-full gap-4 max-w-3xl mx-auto w-full">
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] text-xs">
                    <div className="flex items-center gap-2 text-[#4B5563]">
                      <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="font-semibold text-[#111827]">{t("hero.chatLanguage")}</span>
                    </div>
                    <select
                      value={currentLang}
                      onChange={(e) => setLanguage(e.target.value)}
                      aria-label="Select Chat Language"
                      className="bg-white text-[#1B4332] border border-[#E2EBE5] rounded-xl px-3 py-1 text-xs font-bold outline-none focus:border-[#2D6A4F] cursor-pointer shadow-xs"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-white text-[#111827]">
                          {lang.flag} {lang.nativeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[280px]">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-10">
                        <div className="text-[#1B4332] text-xl font-bold">
                          {t("hero.chatTitle")}
                        </div>
                        <p className="text-sm text-[#6B7280] mt-2 max-w-md mx-auto">
                          {t("hero.chatSubtitle")}
                        </p>
                      </div>
                    )}

                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex flex-col ${
                          message.sender === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                            message.sender === "user"
                              ? "bg-[#1B4332] text-white font-medium rounded-tr-none shadow-xs"
                              : "bg-[#F4F7F4] text-[#111827] border border-[#E2EBE5] rounded-tl-none"
                          }`}
                        >
                          {message.text}
                        </div>

                        {message.sender === "arca" && (
                          <button
                            type="button"
                            onClick={() => handleToggleReadAloud(index, message.text)}
                            className={`mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                              speakingChatIndex === index
                                ? "bg-[#E8F5E9] text-[#1B4332] border border-[#AEEECB]"
                                : "bg-white text-[#4B5563] hover:text-[#1B4332] border border-[#E2EBE5] hover:bg-[#F4F7F4]"
                            }`}
                            title={speakingChatIndex === index ? t("hero.stop") : t("hero.readAloud")}
                          >
                            {speakingChatIndex === index ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse" />
                                <span>{t("hero.stop")}</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-3.5 h-3.5 text-[#2D6A4F]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                  />
                                </svg>
                                <span>{t("hero.readAloud")}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <p className="text-xs text-[#2D6A4F] font-semibold animate-pulse">{t("hero.thinking")}</p>
                    )}
                  </div>

                  <form
                    className="flex gap-2 border-t border-[#E2EBE5] pt-3.5"
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const form = e.currentTarget;
                      const input = form.elements.namedItem("chatMessage") as HTMLInputElement;
                      const message = input.value.trim();

                      if (!message || isTyping) return;

                      setChatMessages((prev) => [
                        ...prev,
                        { sender: "user", text: message },
                      ]);
                      input.value = "";
                      setIsTyping(true);

                      try {
                        const reply = await askGemini(message, currentLang);

                        setChatMessages((prev) => [
                          ...prev,
                          {
                            sender: "arca",
                            text: reply || "Sorry, I couldn't generate a reply.",
                          },
                        ]);
                      } catch (error) {
                        setChatMessages((prev) => [
                          ...prev,
                          {
                            sender: "arca",
                            text: "Sorry, something went wrong. Please try again.",
                          },
                        ]);
                      } finally {
                        setIsTyping(false);
                      }
                    }}
                  >
                    <input
                      name="chatMessage"
                      type="text"
                      placeholder={t("hero.chatPlaceholder")}
                      autoComplete="off"
                      className="min-w-0 flex-1 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
                      disabled={isTyping}
                    />

                    <button
                      type="submit"
                      disabled={isTyping}
                      className="rounded-2xl bg-[#1B4332] px-6 py-3 text-sm font-bold text-white hover:bg-[#2D6A4F] transition-all disabled:opacity-50 shadow-xs"
                    >
                      {t("hero.send")}
                    </button>
                  </form>
                </div>
              )}

              {/* 1. VOICE TAB CONTENT */}
              {activeTab === "voice" && (
                <div className="flex-1 flex flex-col justify-between h-full max-w-3xl mx-auto w-full">
                  {/* Dialect Selector */}
                  {demoState === "idle" && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5]">
                      <span className="text-xs text-[#4B5563] font-bold">
                        {t("hero.selectDialect")}
                      </span>
                      <select
                        value={currentLang}
                        onChange={(e) => setLanguage(e.target.value)}
                        aria-label="Select Voice Language"
                        className="bg-white text-[#1B4332] border border-[#E2EBE5] rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-[#2D6A4F] cursor-pointer shadow-xs"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code} className="bg-white text-[#111827]">
                            {lang.flag} {lang.nativeName} ({lang.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Messages Area */}
                  <div className="flex-1 space-y-4 overflow-y-auto my-4 px-1 max-h-[260px] scrollbar-thin">
                    {chatMessages.length === 0 && demoState === "idle" && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
                        <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] flex items-center justify-center text-[#1B4332] border border-[#D8F3DC] text-3xl shadow-sm">
                          🎙️
                        </div>
                        <div>
                          <p className="text-base font-bold text-[#111827]">
                            {t("hero.tapToSpeak")}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1 max-w-md mx-auto">
                            {t("hero.simulatesVoice")}
                          </p>
                        </div>
                      </div>
                    )}

                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-[#1B4332] text-white rounded-tr-none font-medium shadow-xs"
                              : "bg-[#F4F7F4] text-[#111827] rounded-tl-none border border-[#E2EBE5]"
                          }`}
                        >
                          {msg.text}
                        </div>

                        {/* Audio Player for ARCA response */}
                        {msg.sender === "arca" && (
                          <div className="mt-2 w-full min-w-[220px] flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5]">
                            <button
                              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                              className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center text-white hover:bg-[#2D6A4F] transition-colors shadow-xs"
                            >
                              {isPlayingAudio ? (
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              )}
                            </button>

                            <div className="flex-1 h-2 bg-[#E2EBE5] rounded-full overflow-hidden relative">
                              <div
                                className="h-full bg-[#2D6A4F] transition-all duration-100"
                                style={{ width: `${isPlayingAudio ? audioProgress : 0}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-[#6B7280] font-mono font-bold">
                              {isPlayingAudio
                                ? `0:${String(Math.floor(audioProgress * 0.12)).padStart(2, "0")}`
                                : msg.audioDuration}
                            </span>
                          </div>
                        )}

                        {msg.translatedText && (
                          <span className="text-[10px] text-[#4B5563] mt-1 italic block max-w-full">
                            🌐 {t("hero.translation")}: {msg.translatedText}
                          </span>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center gap-2 bg-[#F4F7F4] border border-[#E2EBE5] rounded-2xl rounded-tl-none px-4 py-3 mr-auto max-w-[90px]">
                        <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </div>

                  {/* Voice Controls / Mic Button */}
                  <div className="mt-auto pt-4 border-t border-[#E2EBE5] flex items-center justify-center relative">
                    {demoState === "idle" && (
                      <button
                        onClick={startListening}
                        className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#1B4332] text-white font-bold hover:bg-[#2D6A4F] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-[#1B4332]/25"
                      >
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AEEECB] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#52B788]"></span>
                        </span>
                        <span>{t("hero.tapToTalk")}</span>
                      </button>
                    )}

                    {demoState === "listening" && (
                      <div className="flex flex-col items-center space-y-2.5">
                        <div className="flex items-end gap-1.5 h-8">
                          {[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((h, i) => (
                            <span
                              key={i}
                              className="w-1.5 bg-[#2D6A4F] rounded-full animate-[pulse_1s_infinite]"
                              style={{
                                height: `${h * 5}px`,
                                animationDelay: `${i * 45}ms`,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#2D6A4F] font-bold animate-pulse">
                          {t("hero.listeningIn", { lang: currentLanguage.nativeName })}
                        </span>
                      </div>
                    )}

                    {demoState === "processing" && (
                      <div className="flex items-center gap-2.5">
                        <svg className="animate-spin h-5 w-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-xs text-[#4B5563] font-bold">{t("hero.processingVoice")}</span>
                      </div>
                    )}

                    {demoState === "responding" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#4B5563] font-bold">{t("hero.typingResponse")}</span>
                      </div>
                    )}

                    {demoState === "done" && (
                      <button
                        onClick={resetDemo}
                        className="px-5 py-2 rounded-xl bg-white text-xs text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F7F4] transition-all border border-[#E2EBE5] font-bold shadow-xs"
                      >
                        {t("hero.clearChat")}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 2. COMPLAINT TAB CONTENT */}
              {activeTab === "complaint" && (
                <div className="flex-1 flex flex-col justify-between h-full max-w-3xl mx-auto w-full">
                  {demoState === "idle" && (
                    <form onSubmit={handleDraftComplaint} className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#111827] block text-left">
                          {t("hero.complaintLabel")}
                        </label>
                        <textarea
                          value={complaintText}
                          onChange={(e) => setComplaintText(e.target.value)}
                          placeholder={t("hero.complaintPlaceholder")}
                          className="w-full h-36 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] p-4 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!complaintText.trim()}
                        className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all mt-4 flex items-center justify-center gap-2 ${
                          complaintText.trim()
                            ? "bg-[#1B4332] text-white shadow-md shadow-[#1B4332]/20 hover:bg-[#2D6A4F] hover:scale-[1.01]"
                            : "bg-[#F4F7F4] text-[#9CA3AF] cursor-not-allowed border border-[#E2EBE5]"
                        }`}
                      >
                        📝 {t("hero.draftButton")}
                      </button>
                    </form>
                  )}

                  {demoState === "processing" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                      <svg className="animate-spin h-9 w-9 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <div>
                        <p className="text-sm font-bold text-[#111827]">{t("hero.analyzingComplaint")}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{t("hero.translatingFormal")}</p>
                      </div>
                    </div>
                  )}

                  {demoState === "done" && draftedComplaint && (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div className="flex-1 overflow-y-auto space-y-2 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] p-5 font-mono text-xs text-[#111827] leading-relaxed max-h-[260px] scrollbar-thin text-left">
                        <div className="border-b border-[#E2EBE5] pb-2 mb-2 text-[#1B4332] font-bold">
                          {t("hero.to")}: {draftedComplaint.authority}
                        </div>
                        <div className="font-bold text-[#111827]">
                          {t("hero.subject")}: {draftedComplaint.subject}
                        </div>
                        <div className="whitespace-pre-line mt-2 text-[#4B5563]">
                          {draftedComplaint.body}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4 pt-3 border-t border-[#E2EBE5]">
                        <button
                          onClick={resetDemo}
                          className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#F4F7F4] text-xs font-bold text-[#4B5563] hover:text-[#111827] transition-all border border-[#E2EBE5]"
                        >
                          {t("hero.draftNew")}
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/complaints", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  authority: draftedComplaint.authority,
                                  subject: draftedComplaint.subject,
                                  body: draftedComplaint.body,
                                  userInput: complaintText,
                                }),
                              });

                              const data = await res.json();

                              if (!res.ok || !data.success) {
                                alert(data.message || data.error || "Complaint could not be saved.");
                                return;
                              }

                              fetchMyComplaints();
                              alert(`Complaint saved successfully! ID: ${data.complaint.complaintId}`);
                            } catch (error) {
                              console.error("Complaint submission failed:", error);
                              alert("Error submitting complaint. Please try again.");
                            }
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-xs hover:bg-[#2D6A4F] hover:scale-[1.01] transition-all shadow-sm"
                        >
                          {t("hero.submitGrievance")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. DOCUMENT TAB CONTENT */}
              {activeTab === "document" && (
                <div className="flex-1 flex flex-col justify-between h-full max-w-3xl mx-auto w-full">
                  {demoState === "idle" && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-6">
                      {!docFileSelected ? (
                        <label
                          htmlFor="document-upload"
                          className="w-full max-w-md border-2 border-dashed border-[#C1D3C7] hover:border-[#2D6A4F] rounded-3xl py-12 px-6 flex flex-col items-center justify-center transition-all bg-[#F8FAF8] group/upload cursor-pointer"
                        >
                          <span className="text-4xl mb-3 group-hover/upload:scale-110 transition-transform">📄</span>
                          <span className="text-sm font-bold text-[#1B4332]">{t("hero.selectUploadDoc")}</span>
                          <span className="text-xs text-[#6B7280] mt-1">{t("hero.docFormats")}</span>
                          <input
                            id="document-upload"
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setDocFile(file);
                                setDocFileSelected(true);
                              }
                            }}
                          />
                        </label>
                      ) : (
                        <div className="w-full space-y-4 bg-[#F8FAF8] p-5 border border-[#E2EBE5] rounded-2xl text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">📄</span>
                              <div>
                                <p className="text-xs font-bold text-[#111827]">{docFile?.name || "Document"}</p>
                                <p className="text-[10px] text-[#6B7280]">2.1 MB • {t("hero.fileSelected")}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setDocFile(null);
                                setDocFileSelected(false);
                                setDocSummary(null);
                              }}
                              className="text-xs text-rose-600 font-bold hover:underline"
                            >
                              {t("hero.remove")}
                            </button>
                          </div>
                          <button
                            onClick={handleDocumentAnalyze}
                            className="w-full py-3.5 rounded-2xl text-xs font-bold bg-[#1B4332] text-white shadow-md shadow-[#1B4332]/20 hover:bg-[#2D6A4F] hover:scale-[1.01] transition-all"
                          >
                            🔍 {t("hero.translateSummarize")}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {demoState === "processing" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                      <svg className="animate-spin h-9 w-9 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <div>
                        <p className="text-sm font-bold text-[#111827]">{t("hero.runningOcr")}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{t("hero.extractingParams")}</p>
                      </div>
                    </div>
                  )}

                  {demoState === "done" && docSummary && (
                    <div className="flex-1 flex flex-col justify-between h-full text-left">
                      <div className="flex-1 overflow-y-auto space-y-3 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] p-5 font-mono text-xs text-[#111827] leading-relaxed max-h-[260px] scrollbar-thin">
                        <div className="border-b border-[#E2EBE5] pb-2 mb-2 text-[#1B4332] font-bold flex items-center justify-between">
                          <span>{t("hero.summaryInsights")}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2D6A4F] text-[10px] font-bold border border-[#D8F3DC]">{t("hero.supportedBadge")}</span>
                        </div>

                        <div className="flex gap-2 flex-wrap mb-3 font-sans">
                          <button
                            onClick={() => setSummaryLanguage("original")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              summaryLanguage === "original"
                                ? "bg-[#1B4332] text-white shadow-xs"
                                : "bg-white border border-[#E2EBE5] text-[#4B5563] hover:bg-[#F4F7F4]"
                            }`}
                          >
                            {t("hero.original")} ({originalLanguage})
                          </button>

                          <button
                            onClick={() => setSummaryLanguage("english")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              summaryLanguage === "english"
                                ? "bg-[#1B4332] text-white shadow-xs"
                                : "bg-white border border-[#E2EBE5] text-[#4B5563] hover:bg-[#F4F7F4]"
                            }`}
                          >
                            {t("hero.english")}
                          </button>

                          <button
                            onClick={() => setSummaryLanguage("hindi")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              summaryLanguage === "hindi"
                                ? "bg-[#1B4332] text-white shadow-xs"
                                : "bg-white border border-[#E2EBE5] text-[#4B5563] hover:bg-[#F4F7F4]"
                            }`}
                          >
                            {t("hero.hindi")}
                          </button>
                        </div>

                        <div className="whitespace-pre-line text-[#374151]">
                          {summaryLanguage === "english"
                            ? englishSummary
                            : summaryLanguage === "hindi"
                            ? hindiSummary
                            : docSummary}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4 pt-3 border-t border-[#E2EBE5]">
                        <button
                          onClick={resetDemo}
                          className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#F4F7F4] text-xs font-bold text-[#4B5563] hover:text-[#111827] transition-all border border-[#E2EBE5]"
                        >
                          {t("hero.uploadAnother")}
                        </button>
                        <button
                          onClick={() => alert("Redirecting to application form...")}
                          className="flex-1 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-xs hover:bg-[#2D6A4F] hover:scale-[1.01] transition-all shadow-xs"
                        >
                          {t("hero.applyScheme")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. TRACK COMPLAINT TAB CONTENT */}
              {activeTab === "track" && (
                <div className="flex-1 flex flex-col justify-between h-full max-w-3xl mx-auto w-full text-left">
                  {demoState === "idle" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#111827] block">
                          {t("hero.trackLabel")}
                        </label>

                        <input
                          type="text"
                          value={trackComplaintId}
                          onChange={(e) => setTrackComplaintId(e.target.value)}
                          placeholder={t("hero.trackPlaceholder")}
                          className="w-full rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] p-3.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
                        />
                      </div>

                      {trackError && (
                        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2">
                          <span className="text-rose-500 text-sm leading-none mt-0.5">⚠️</span>
                          <p className="text-xs text-rose-700 leading-relaxed font-semibold">{trackError}</p>
                        </div>
                      )}

                      <button
                        onClick={handleTrackComplaint}
                        disabled={!trackComplaintId.trim()}
                        className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          trackComplaintId.trim()
                            ? "bg-[#1B4332] text-white shadow-md shadow-[#1B4332]/20 hover:bg-[#2D6A4F] hover:scale-[1.01]"
                            : "bg-[#F4F7F4] text-[#9CA3AF] cursor-not-allowed border border-[#E2EBE5]"
                        }`}
                      >
                        📍 {t("hero.trackButton")}
                      </button>

                      {/* MY COMPLAINTS SECTION */}
                      <div className="pt-6 border-t border-[#E2EBE5] space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#111827]">
                              My Complaints
                            </span>
                            {citizenUser && (
                              <span className="text-[11px] font-bold text-[#2D6A4F] bg-[#E8F5E9] border border-[#D8F3DC] px-2.5 py-0.5 rounded-full font-mono">
                                {myComplaints.length} Total
                              </span>
                            )}
                          </div>

                          {citizenUser && (
                            <button
                              type="button"
                              onClick={fetchMyComplaints}
                              disabled={loadingMyComplaints}
                              className="text-xs font-semibold text-[#2D6A4F] hover:underline flex items-center gap-1 disabled:opacity-50"
                              title="Refresh complaints list"
                            >
                              <span className={loadingMyComplaints ? "animate-spin" : ""}>🔄</span>
                              <span>Refresh</span>
                            </button>
                          )}
                        </div>

                        {citizenUser ? (
                          loadingMyComplaints && myComplaints.length === 0 ? (
                            <div className="p-6 text-center rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5]">
                              <div className="w-5 h-5 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-xs text-[#6B7280]">Loading your complaints...</p>
                            </div>
                          ) : myComplaints.length === 0 ? (
                            <div className="p-6 text-center rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5]">
                              <p className="text-xs text-[#6B7280]">You haven&apos;t submitted any complaints yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                              {myComplaints.map((item) => (
                                <div
                                  key={item.complaintId}
                                  className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] hover:border-[#2D6A4F]/50 transition-all space-y-2.5 shadow-2xs"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-xs font-bold text-[#1B4332] bg-white px-2 py-0.5 rounded-lg border border-[#E2EBE5]">
                                      {item.complaintId}
                                    </span>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                        item.status === "Resolved"
                                          ? "bg-[#E8F5E9] text-[#2D6A4F] border-[#AEEECB]"
                                          : item.status === "Under Review"
                                          ? "bg-sky-50 text-sky-700 border-sky-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                  </div>

                                  <div>
                                    <p className="text-sm font-bold text-[#111827] line-clamp-1">
                                      {item.subject}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B7280]">
                                      <span>📁 {item.category || "General"}</span>
                                      <span>•</span>
                                      <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-[#E2EBE5] flex items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleCopyComplaintId(item.complaintId)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1B4332] bg-white hover:bg-[#E8F5E9] border border-[#E2EBE5] transition-all"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                      <span>{copiedComplaintId === item.complaintId ? "Copied!" : "Copy Complaint ID"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleTrackSpecificComplaint(item.complaintId)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1B4332] hover:bg-[#2D6A4F] transition-all shadow-xs"
                                    >
                                      <span>Track Complaint</span>
                                      <span>→</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] text-center space-y-2">
                            <p className="text-xs text-[#6B7280]">
                              Log in to view all complaints submitted by your account and track their live resolution status.
                            </p>
                            <a
                              href="/login"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] hover:underline"
                            >
                              Sign In to View My Complaints →
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {demoState === "processing" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                      <svg className="animate-spin h-9 w-9 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-sm font-bold text-[#111827]">{t("hero.fetchingStatus")}</p>
                    </div>
                  )}

                  {demoState === "done" && trackedComplaint && (
                    <div className="space-y-4 rounded-2xl bg-[#F8FAF8] border border-[#E2EBE5] p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">{t("hero.complaintId")}</p>
                          <p className="text-base font-mono font-bold text-[#1B4332]">
                            {trackedComplaint.complaintId}
                          </p>
                        </div>

                        <span
                          className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                            trackedComplaint.status === "Resolved"
                              ? "bg-[#E8F5E9] text-[#2D6A4F] border-[#AEEECB]"
                              : trackedComplaint.status === "Under Review"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {trackedComplaint.status}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {/* Progress Stepper */}
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#1B4332] flex items-center justify-center text-xs text-white font-bold">
                            ✓
                          </div>
                          <div className="flex-1 h-1 bg-[#E2EBE5] rounded-full"></div>
                          <span className="text-xs text-[#1B4332] font-bold">
                            {t("hero.submitted")}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              trackedComplaint.status === "Under Review" ||
                              trackedComplaint.status === "Resolved"
                                ? "bg-sky-600 text-white"
                                : "bg-[#E2EBE5] text-[#6B7280]"
                            }`}
                          >
                            2
                          </div>
                          <div className="flex-1 h-1 bg-[#E2EBE5] rounded-full"></div>
                          <span
                            className={`text-xs font-bold ${
                              trackedComplaint.status === "Under Review" ||
                              trackedComplaint.status === "Resolved"
                                ? "text-sky-700"
                                : "text-[#9CA3AF]"
                            }`}
                          >
                            {t("hero.underReview")}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              trackedComplaint.status === "Resolved"
                                ? "bg-[#1B4332] text-white"
                                : "bg-[#E2EBE5] text-[#6B7280]"
                            }`}
                          >
                            3
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              trackedComplaint.status === "Resolved"
                                ? "text-[#1B4332]"
                                : "text-[#9CA3AF]"
                            }`}
                          >
                            {t("hero.resolved")}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs max-h-[160px] overflow-y-auto pr-1 scrollbar-thin mt-3 pt-3 border-t border-[#E2EBE5]">
                        <div>
                          <p className="text-[#6B7280] font-semibold">{t("hero.authority")}</p>
                          <p className="text-[#111827] font-bold">{trackedComplaint.authority}</p>
                        </div>

                        <div>
                          <p className="text-[#6B7280] font-semibold">{t("hero.subject")}</p>
                          <p className="text-[#374151]">{trackedComplaint.subject}</p>
                        </div>

                        <div>
                          <p className="text-[#6B7280] font-semibold">{t("hero.body")}</p>
                          <p className="text-[#374151] whitespace-pre-line">{trackedComplaint.body}</p>
                        </div>

                        <div>
                          <p className="text-[#6B7280] font-semibold">{t("hero.createdDate")}</p>
                          <p className="text-[#6B7280]">
                            {new Date(trackedComplaint.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E2EBE5]">
                        <button
                          onClick={() => {
                            setTrackComplaintId("");
                            setTrackedComplaint(null);
                            setTrackError(null);
                            setDemoState("idle");
                          }}
                          className="w-full py-2.5 rounded-xl bg-white hover:bg-[#F4F7F4] text-xs font-bold text-[#4B5563] hover:text-[#111827] transition-all border border-[#E2EBE5]"
                        >
                          {t("hero.trackAnother")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
