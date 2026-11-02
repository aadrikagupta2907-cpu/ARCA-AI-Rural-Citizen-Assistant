"use client";

import React, { useState, useEffect } from "react";
async function askGemini(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await res.json();

  return data.reply;
}
// Inline type for chat messages
interface Message {
  sender: "user" | "arca";
  text: string;
  translatedText?: string;
  audioDuration?: string;
}

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"voice" | "complaint" | "document">("voice");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [chatLanguage, setChatLanguage] = useState("hi"); // 'hi', 'kn', 'ta'
  const [demoState, setDemoState] = useState<"idle" | "listening" | "processing" | "responding" | "done">("idle");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

const startListening = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Please use Google Chrome. Speech Recognition is not supported.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = chatLanguage === "hi" ? "hi-IN" : "kn-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.start();

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

    const responseText = await askGemini(userText);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "arca",
        text: responseText,
        audioDuration: "0:12",
      },
    ]);

    //speak(responseText);

    setDemoState("done");
  };

  recognition.onerror = () => {
    setDemoState("idle");
    alert("Microphone error.");
  };
};

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
    console.log("Button Clicked");
    if (demoState !== "idle") return;

    setDemoState("listening");
    setChatMessages([]);

    // 1. Listening to user voice input (2 seconds)
    setTimeout(() => {
      setDemoState("processing");
      const userText =
        chatLanguage === "hi"
          ? "🌾 मुझे पीएम किसान योजना के बारे में बताएं और मैं कैसे आवेदन कर सकता हूँ?"
          : chatLanguage === "kn"
            ? "🌾 ನನಗೆ ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ ಮತ್ತು ನಾನು ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?"
            : "🌾 ನನಗೆ ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ ಮತ್ತು ನಾನು ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?"; // Tamil/other placeholder

      setChatMessages([{ sender: "user", text: userText }]);

      // 2. Processing (1.5 seconds)
      setTimeout(() => {
        setDemoState("responding");
        setIsTyping(true);

        // 3. Responding (2.5 seconds)
        setTimeout(async () => {
          setIsTyping(false);
          setDemoState("done");
          setIsPlayingAudio(true);
          console.log("Calling Gemini...");
          const responseText =  await askGemini(userText);
          console.log("Gemini Response:", responseText);
            
          

          setChatMessages((prev) => [
  ...prev,
  {
    sender: "arca",
    text: responseText,
    audioDuration: "0:12",
  },
]);
        }, 2000);
      }, 1500);
    }, 2000);
  };

  const handleDraftComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    setDemoState("processing");
    setDraftedComplaint(null);

    setTimeout(() => {
      setDemoState("done");
      setDraftedComplaint({
        authority: "Electricity Distribution Department (State Board)",
        subject: "Urgent Grievance: Frequent Power Outages and Voltage Fluctuations in Village",
        body: `Respected Sir/Madam,

I am writing on behalf of the residents of Village Rampur. For the last 15 days, we are facing frequent electricity cuts exceeding 14 hours daily. The severe voltage fluctuations have caused damage to irrigation water pumps and farm equipment. 

We request you to kindly look into the transformer maintenance in our village and restore stable power supply.

Sincerely,
Ramesh Kumar (Villager, Rampur)
[Drafted automatically via ARCA in English and Hindi]`,
      });
    }, 1500);
  };

  const handleDocumentAnalyze = () => {
    setDemoState("processing");
    setDocSummary(null);

    setTimeout(() => {
      setDemoState("done");
      setDocSummary(`📄 Circular Title: "Pest Control Subsidy Allocation 2026"
📅 Key Deadline: Apply before July 30, 2026
💰 Benefit: 50% subsidy on organic fertilizers & pesticides for farms up to 2 hectares.
📝 Actions Required:
1. Obtain land ownership certificate (Khasra/Khatauni).
2. Visit local Panchayat office or click "Apply via ARCA Voice Assistant" above.`);
    }, 2000);
  };
const submitComplaint = async () => {
  if (!draftedComplaint) return;

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

    if (data.success) {
      alert("Complaint submitted successfully!");
      resetDemo();
    } else {
      alert("Failed to submit complaint.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};
  const resetDemo = () => {
    setDemoState("idle");
    setChatMessages([]);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setComplaintText("");
    setDraftedComplaint(null);
    setDocFileSelected(false);
    setDocSummary(null);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Decorative Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-[5%] right-[25%] w-[25rem] h-[25rem] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.25]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-8 text-left max-w-xl lg:max-w-none">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Bridging the Digital Divide with AI
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Empowering Rural Citizens through{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Voice AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-400 leading-relaxed">
              ARCA is a multilingual voice-first AI assistant designed for rural communities. Access government schemes, draft formal complaints, and translate official documents in seconds—all using your native language.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#portal"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                Try Voice Portal
              </a>
              <button
                onClick={() => {
                  setActiveTab("voice");
                  startVoiceDemo();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 active:scale-[0.98] transition-all"
              >
                Watch Interactive Demo
              </button>
            </div>

            {/* Benefits Checklist */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-slate-900 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>10+ Local Languages</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Offline Dialect Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Scheme Matching AI</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Official Grievance Format</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Simulator */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/20 relative group">
              {/* Outer Glow Ring on Hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Header / Tabs */}
              <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-slate-500 font-mono ml-2">ARCA Simulator v1.0</span>
                </div>
                {demoState !== "idle" && (
                  <button
                    onClick={resetDemo}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 bg-slate-950/20 p-2 gap-1">
                <button
                  onClick={() => {
                    setActiveTab("voice");
                    resetDemo();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${activeTab === "voice"
                      ? "bg-slate-800 text-emerald-400 shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Voice Assist
                </button>
                <button
                  onClick={() => {
                    setActiveTab("complaint");
                    resetDemo();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${activeTab === "complaint"
                      ? "bg-slate-800 text-emerald-400 shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Draft Grievance
                </button>
                <button
                  onClick={() => {
                    setActiveTab("document");
                    resetDemo();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${activeTab === "document"
                      ? "bg-slate-800 text-emerald-400 shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Scan Doc
                </button>
              </div>

              {/* Main Display Area */}
              <div className="p-5 h-[340px] flex flex-col justify-between overflow-y-auto">

                {/* 1. VOICE TAB CONTENT */}
                {activeTab === "voice" && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    {/* Dialect Selector */}
                    {demoState === "idle" && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                        <span className="text-xs text-slate-400">Select Dialect:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setChatLanguage("hi")}
                            className={`px-2 py-1 rounded text-xs font-semibold transition-all ${chatLanguage === "hi"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent"
                              }`}
                          >
                            Hindi (हिन्दी)
                          </button>
                          <button
                            onClick={() => setChatLanguage("kn")}
                            className={`px-2 py-1 rounded text-xs font-semibold transition-all ${chatLanguage === "kn"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent"
                              }`}
                          >
                            Kannada (ಕನ್ನಡ)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Chat Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto my-3 px-1 scrollbar-thin">
                      {chatMessages.length === 0 && demoState === "idle" && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 animate-bounce">
                            🎙️
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200">Tap below to speak to ARCA</p>
                            <p className="text-xs text-slate-500 mt-1">Simulates voice command input in selected language</p>
                          </div>
                        </div>
                      )}

                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === "user"
                                ? "bg-emerald-500 text-slate-950 rounded-tr-none font-medium"
                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60"
                              }`}
                          >
                            {msg.text}
                          </div>

                          {/* Audio Player for ARCA response */}
                          {msg.sender === "arca" && (
                            <div className="mt-2 w-full min-w-[200px] flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                              <button
                                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 hover:bg-emerald-400 transition-colors"
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

                              {/* Audio Soundwaves or progress */}
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                <div
                                  className="h-full bg-emerald-400 transition-all duration-100"
                                  style={{ width: `${isPlayingAudio ? audioProgress : 0}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {isPlayingAudio ? `0:${String(Math.floor(audioProgress * 0.12)).padStart(2, "0")}` : msg.audioDuration}
                              </span>
                            </div>
                          )}

                          {/* Translation block */}
                          {msg.translatedText && (
                            <span className="text-[10px] text-slate-400 mt-1 italic block max-w-full">
                              🌐 Translation: {msg.translatedText}
                            </span>
                          )}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3 mr-auto max-w-[80px]">
                          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>

                    {/* Footer / Controls */}
                    <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-center relative">
                      {demoState === "idle" && (
                        <button
                          onClick={startVoiceDemo}
                          className="flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-900 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-800"></span>
                          </span>
                          Tap to Talk
                        </button>
                      )}

                      {demoState === "listening" && (
                        <div className="flex flex-col items-center space-y-2">
                          {/* Animated Voice waveform */}
                          <div className="flex items-end gap-1 h-6">
                            {[1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                              <span
                                key={i}
                                className="w-1 bg-emerald-400 rounded-full animate-[pulse_1s_infinite]"
                                style={{
                                  height: `${h * 4}px`,
                                  animationDelay: `${i * 50}ms`,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-emerald-400 font-medium animate-pulse">Listening in {chatLanguage === "hi" ? "Hindi" : "Kannada"}...</span>
                        </div>
                      )}

                      {demoState === "processing" && (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="text-xs text-slate-400">Processing via Dialect translation...</span>
                        </div>
                      )}

                      {demoState === "responding" && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Typing out response...</span>
                        </div>
                      )}

                      {demoState === "done" && (
                        <button
                          onClick={resetDemo}
                          className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white transition-all border border-slate-700"
                        >
                          Clear Chat
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. COMPLAINT TAB CONTENT */}
                {activeTab === "complaint" && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    {demoState === "idle" && (
                      <form onSubmit={handleDraftComplaint} className="flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <label className="text-xs font-semibold text-slate-300 block">Describe the issue in your own words:</label>
                          <textarea
                            value={complaintText}
                            onChange={(e) => setComplaintText(e.target.value)}
                            placeholder="E.g., हमारे गाँव रामपुर में पिछले 15 दिनों से बिजली की बहुत कटौती हो रही है, जिससे खेती के पंप खराब हो रहे हैं।"
                            className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!complaintText.trim()}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all mt-4 flex items-center justify-center gap-2 ${complaintText.trim()
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/10 hover:scale-[1.01]"
                              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-900"
                            }`}
                        >
                          📝 Draft Official Complaint
                        </button>
                      </form>
                    )}

                    {demoState === "processing" && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">Analyzing speech/text parameters...</p>
                          <p className="text-xs text-slate-500 mt-1">Translating to formal English and mapping appropriate department</p>
                        </div>
                      </div>
                    )}

                    {demoState === "done" && draftedComplaint && (
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div className="flex-1 overflow-y-auto space-y-2 rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 font-mono text-[10px] text-slate-300 leading-normal scrollbar-thin">
                          <div className="border-b border-slate-800 pb-1.5 mb-1.5 text-emerald-400 font-bold">
                            TO: {draftedComplaint.authority}
                          </div>
                          <div className="font-bold text-slate-100">
                            SUBJECT: {draftedComplaint.subject}
                          </div>
                          <div className="whitespace-pre-line mt-2 text-slate-400">
                            {draftedComplaint.body}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800/80">
                          <button
                          
                            onClick={resetDemo}
                            className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700"
                          >
                            Draft New
                          </button>
                          <button
                           onClick={submitComplaint}
                            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-[1.02] transition-all"
                          >
                            Submit Grievance
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. DOCUMENT TAB CONTENT */}
                {activeTab === "document" && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    {demoState === "idle" && (
                      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                        {!docFileSelected ? (
                          <button
                            onClick={() => setDocFileSelected(true)}
                            className="w-full max-w-xs border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl py-10 flex flex-col items-center justify-center transition-all bg-slate-950/30 group/upload"
                          >
                            <span className="text-3xl mb-2 group-hover/upload:scale-110 transition-transform">📄</span>
                            <span className="text-xs font-bold text-slate-300">Select / Upload circular circular.pdf</span>
                            <span className="text-[10px] text-slate-500 mt-1">Simulates OCR scanner capability</span>
                          </button>
                        ) : (
                          <div className="w-full space-y-3 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">📄</span>
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-slate-300">fertilizer_subsidy_circular.pdf</p>
                                  <p className="text-[9px] text-slate-500">2.1 MB • Official State Document</p>
                                </div>
                              </div>
                              <button onClick={() => setDocFileSelected(false)} className="text-xs text-rose-400 hover:underline">
                                Remove
                              </button>
                            </div>
                            <button
                              onClick={handleDocumentAnalyze}
                              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/10 hover:scale-[1.01] transition-all"
                            >
                              🔍 Translate & Summarize
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {demoState === "processing" && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">Running OCR & Document Translation...</p>
                          <p className="text-xs text-slate-500 mt-1">Extracting core parameters (Deadlines, Benefit structures)</p>
                        </div>
                      </div>
                    )}

                    {demoState === "done" && docSummary && (
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div className="flex-1 overflow-y-auto space-y-2 rounded-xl bg-slate-950/80 border border-slate-800 p-4 font-mono text-[10px] text-slate-300 leading-relaxed scrollbar-thin">
                          <div className="border-b border-slate-800 pb-1.5 mb-1.5 text-emerald-400 font-bold flex items-center justify-between">
                            <span>SUMMARY & INSIGHTS</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px]">HINDI SUPPORTED</span>
                          </div>
                          <div className="whitespace-pre-line text-slate-300">
                            {docSummary}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800/80">
                          <button
                            onClick={resetDemo}
                            className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700"
                          >
                            Upload Another
                          </button>
                          <button
                            onClick={() => alert("Redirecting to crop welfare application form...")}
                            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-[1.02] transition-all"
                          >
                            Apply Scheme
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
