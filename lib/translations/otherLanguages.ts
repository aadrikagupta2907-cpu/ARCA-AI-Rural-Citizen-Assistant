import { SiteTranslations } from "./types";
import { en } from "./en";

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// Helper to deep merge partial translations onto the master English dictionary
export function createLanguagePack(partial: DeepPartial<SiteTranslations>): SiteTranslations {
  return {
    navbar: { ...en.navbar, ...partial.navbar },
    hero: { ...en.hero, ...partial.hero },
    features: { ...en.features, ...partial.features },
    howItWorks: { ...en.howItWorks, ...partial.howItWorks },
    usp: { ...en.usp, ...partial.usp },
    impact: { ...en.impact, ...partial.impact },
    tech: { ...en.tech, ...partial.tech },
    faq: { ...en.faq, ...partial.faq },
    footer: { ...en.footer, ...partial.footer },
    common: { ...en.common, ...partial.common },
  };
}

// Bengali (বাংলা)
export const bn = createLanguagePack({
  navbar: {
    features: "বৈশিষ্ট্য",
    howItWorks: "এটি কীভাবে কাজ করে",
    impact: "প্রভাব",
    admin: "অ্যাডমিন",
    adminLogin: "অ্যাডমিন লগইন",
    launchPortal: "পোর্টাল শুরু করুন",
    searchLanguage: "ভাষা খুঁজুন...",
    selectLanguage: "ভাষা নির্বাচন করুন",
  },
  hero: {
    tag: "এআই দিয়ে ডিজিটাল ব্যবধান দূরীকরণ",
    headlinePart1: "ভয়েস এআইয়ের মাধ্যমে গ্রামীণ নাগরিকদের",
    headlineHighlight: "ক্ষমতায়ন",
    subheadline:
      "ARCA হলো গ্রামীণ জনগোষ্ঠীর জন্য নির্মিত বহুভাষিক ভয়েস-ফার্স্ট এআই সহকারী। আপনার মাতৃভাষায় সরকারি প্রকল্প খুঁজুন, অভিযোগ নথিভুক্ত করুন এবং সরকারি নথি অনুবাদ করুন।",
    tryVoicePortal: "ভয়েস পোর্টাল ব্যবহার করুন",
    watchInteractiveDemo: "ডেমো দেখুন",
    checkLanguages: "১০+ স্থানীয় ভাষা",
    checkDialects: "অফলাইন উপভাষা ইঞ্জিন",
    checkSchemes: "প্রকল্প মেলানো এআই",
    checkGrievance: "আনুষ্ঠানিক অভিযোগের ফরম্যাট",
    tabVoice: "ভয়েস সহায়তা",
    tabChat: "চ্যাট",
    tabComplaint: "অভিযোগ তৈরি করুন",
    tabDocument: "নথি স্ক্যান",
    tabTrack: "অভিযোগ ট্র্যাক করুন",
    tapToTalk: "কথা বলতে ট্যাপ করুন",
    listeningIn: "{{lang}} ভাষায় শুনছি...",
    chatTitle: "ARCA এআইকে জিজ্ঞাসা করুন",
    chatPlaceholder: "ARCA-কে যেকোনো প্রশ্ন করুন...",
    send: "পাঠান",
    readAloud: "পড়ে শোনান",
    stop: "থামান",
    draftButton: "আনুষ্ঠানিক অভিযোগ তৈরি করুন",
    trackButton: "অভিযোগ ট্র্যাক করুন",
  },
  footer: {
    copyright: "সর্বস্বত্ব সংরক্ষিত। গ্রামীণ ক্ষমতায়নে নিবেদিত।",
  },
});

// Tamil (தமிழ்)
export const ta = createLanguagePack({
  navbar: {
    features: "அம்சங்கள்",
    howItWorks: "எப்படி செயல்படுகிறது",
    impact: "தாக்கம்",
    admin: "நிர்வாகி",
    adminLogin: "நிர்வாகி உள்நுழைவு",
    launchPortal: "போர்ட்டலைத் தொடங்கு",
    searchLanguage: "மொழியைத் தேடுங்கள்...",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
  },
  hero: {
    tag: "AI மூலம் டிஜிட்டல் இடைவெளியைக் குறைத்தல்",
    headlinePart1: "குரல் AI மூலம் கிராமப்புற குடிமக்களுக்கு",
    headlineHighlight: "அதிகாரமளித்தல்",
    subheadline:
      "ARCA என்பது கிராமப்புற சமூகங்களுக்காக வடிவமைக்கப்பட்ட பலமொழி குரல் AI உதவியாளர். உங்கள் தாய்மொழியிலேயே அரசு நலத்திட்டங்களை அணுகலாம் மற்றும் அதிகாரப்பூர்வ ஆவணங்களை மொழிபெயர்க்கலாம்.",
    tryVoicePortal: "குரல் போர்ட்டலை முயற்சிக்கவும்",
    watchInteractiveDemo: "டெமோ பார்க்கவும்",
    checkLanguages: "10+ உள்ளூர் மொழிகள்",
    checkDialects: "ஆஃப்லைன் வட்டார வழக்கு எஞ்சின்",
    tabVoice: "குரல் உதவி",
    tabChat: "அரட்டை",
    tabComplaint: "புகார் எழுதுக",
    tabDocument: "ஆவண ஸ்கேன்",
    tabTrack: "புகாரைக் கண்காணிக்கவும்",
    tapToTalk: "பேச தட்டவும்",
    listeningIn: "{{lang}} மொழியில் கேட்கிறது...",
    chatTitle: "ARCA AI இடம் கேளுங்கள்",
    chatPlaceholder: "ARCA விடம் எதையும் கேளுங்கள்...",
    send: "அனுப்புக",
    readAloud: "சத்தமாக வாசிக்க",
    stop: "நிறுத்து",
    draftButton: "அதிகாரப்பூர்வ புகார் உருவாக்கவும்",
    trackButton: "புகாரைக் கண்காணிக்கவும்",
  },
  footer: {
    copyright: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. கிராமப்புற மேம்பாட்டிற்காக அர்ப்பணிக்கப்பட்டது.",
  },
});

// Telugu (తెలుగు)
export const te = createLanguagePack({
  navbar: {
    features: "ఫీచర్లు",
    howItWorks: "ఇది ఎలా పనిచేస్తుంది",
    impact: "ప్రభావం",
    admin: "అడ్మిన్",
    adminLogin: "అడ్మిన్ లాగిన్",
    launchPortal: "పోర్టల్‌ని ప్రారంభించండి",
    searchLanguage: "భాషను శోధించండి...",
    selectLanguage: "భాషను ఎంచుకోండి",
  },
  hero: {
    tag: "AIతో డిజిటల్ అంతరాన్ని తగ్గించడం",
    headlinePart1: "వాయిస్ AI ద్వారా గ్రామీణ పౌరులకు",
    headlineHighlight: "సాధికారత",
    subheadline:
      "ARCA అనేది గ్రామీణ ప్రజల కోసం రూపొందించబడిన బహుభాషా వాయిస్ AI సహాయకుడు. మీ మాతృభాషలోనే ప్రభుత్వ సంక్షేమ పథకాలను తెలుసుకోండి మరియు అధికారిక పత్రాలను అనువదించండి.",
    tryVoicePortal: "వాయిస్ పోర్టల్‌ని ప్రయత్నించండి",
    watchInteractiveDemo: "డెమో చూడండి",
    tabVoice: "వాయిస్ సహాయం",
    tabChat: "చాట్",
    tabComplaint: "ఫిర్యాదు రాయండి",
    tabDocument: "పత్రం స్కాన్",
    tabTrack: "ఫిర్యాదు ట్రాక్ చేయండి",
    tapToTalk: "మాట్లాడటానికి నొక్కండి",
    listeningIn: "{{lang}} లో వింటోంది...",
    chatTitle: "ARCA AIని అడగండి",
    chatPlaceholder: "ARCAని ఏదైనా అడగండి...",
    send: "పంపండి",
    readAloud: "బిగ్గరగా చదవండి",
    stop: "ఆపండి",
    draftButton: "అధికారిక ఫిర్యాదు తయారుచేయండి",
    trackButton: "ఫిర్యాదును ట్రాక్ చేయండి",
  },
  footer: {
    copyright: "సర్వ హక్కులు ప్రత్యేకించబడ్డాయి. గ్రామీణ సాధికారతకు అంకితం.",
  },
});

// Marathi (मराठी)
export const mr = createLanguagePack({
  navbar: {
    features: "वैशिष्ट्ये",
    howItWorks: "हे कसे कार्य करते",
    impact: "आमचा प्रभाव",
    admin: "अ‍ॅडमिन",
    adminLogin: "अ‍ॅडमिन लॉगिन",
    launchPortal: "पोर्टल सुरू करा",
    searchLanguage: "भाषा शोधा...",
    selectLanguage: "भाषा निवडा",
  },
  hero: {
    tag: "एआयच्या मदतीने डिजिटल दरी मिटवणे",
    headlinePart1: "व्हॉइस एआयच्या माध्यमातून ग्रामीण नागरिकांचे",
    headlineHighlight: "सक्षमीकरण",
    subheadline:
      "ARCA हा ग्रामीण भागासाठी तयार केलेला बहुभाषिक व्हॉइस एआय सहाय्यक आहे. आपल्या मातृभाषेत शासकीय योजना शोधा, तक्रार नोंदवा आणि अधिकृत कागदपत्रांचे भाषांतर करा.",
    tryVoicePortal: "व्हॉइस पोर्टल वापरा",
    watchInteractiveDemo: "डेमो पहा",
    tabVoice: "व्हॉइस मदत",
    tabChat: "चॅट",
    tabComplaint: "तक्रार नोंदवा",
    tabDocument: "कागदपत्र स्कॅन",
    tabTrack: "तक्रार ट्रॅक करा",
    tapToTalk: "बोलण्यासाठी टॅप करा",
    listeningIn: "{{lang}} मध्ये ऐकत आहे...",
    chatTitle: "ARCA AI ला विचारा",
    chatPlaceholder: "ARCA ला काहीही विचारा...",
    send: "पाठवा",
    readAloud: "मोठ्याने वाचा",
    stop: "थांबवा",
    draftButton: "अधिकृत तक्रार तयार करा",
    trackButton: "तक्रार तपासा",
  },
  footer: {
    copyright: "सर्व हक्क सुरक्षित. ग्रामीण सक्षमीकरणासाठी समर्पित.",
  },
});

// Gujarati (ગુજરાતી)
export const gu = createLanguagePack({
  navbar: {
    features: "વિશેષતાઓ",
    howItWorks: "આ કેવી રીતે કાર્ય કરે છે",
    impact: "અમારો પ્રભાવ",
    admin: "એડમિન",
    adminLogin: "એડમિન લૉગિન",
    launchPortal: "પોર્ટલ શરૂ કરો",
    searchLanguage: "ભાષા શોધો...",
    selectLanguage: "ભાષા પસંદ કરો",
  },
  hero: {
    tag: "AI સાથે ડિજિટલ અંતર દૂર કરવું",
    headlinePart1: "વૉઇસ AI દ્વારા ગ્રામીણ નાગરિકોનું",
    headlineHighlight: "સશક્તિકરણ",
    subheadline:
      "ARCA એ ગ્રામીણ સમુદાયો માટે બનાવેલ બહુભાષી વૉઇસ AI સહાયક છે. તમારી માતૃભાષામાં સરકારી યોજનાઓ મેળવો, ફરિયાદ નોંધાવો અને સત્તાવાર દસ્તાવેજો સમજો.",
    tryVoicePortal: "વૉઇસ પોર્ટલ અજમાવો",
    watchInteractiveDemo: "ડેમો જુઓ",
    tabVoice: "વૉઇસ સહાય",
    tabChat: "ચેટ",
    tabComplaint: "ફરિયાદ તૈયાર કરો",
    tabDocument: "દસ્તાવેજ સ્કેન",
    tabTrack: "ફરિયાદ ટ્રૅક કરો",
    tapToTalk: "બોલવા માટે ટૅપ કરો",
    listeningIn: "{{lang}} માં સાંભળી રહ્યું છે...",
    chatTitle: "ARCA AI ને પૂછો",
    chatPlaceholder: "ARCA ને કંઈ પણ પૂછો...",
    send: "મોકલો",
    readAloud: "વાંચીને સાંભળો",
    stop: "રોકો",
    draftButton: "સત્તાવાર ફરિયાદ તૈયાર કરો",
    trackButton: "ફરિયાદ ટ્રૅક કરો",
  },
  footer: {
    copyright: "સર્વાધિકાર સુરક્ષિત. ગ્રામીણ સશક્તિકરણને સમર્પિત.",
  },
});

// Punjabi (ਪੰਜਾਬੀ)
export const pa = createLanguagePack({
  navbar: {
    features: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
    howItWorks: "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    impact: "ਪ੍ਰਭਾਵ",
    admin: "ਐਡਮਿਨ",
    adminLogin: "ਐਡਮਿਨ ਲੌਗਇਨ",
    launchPortal: "ਪੋਰਟਲ ਸ਼ੁਰੂ ਕਰੋ",
    searchLanguage: "ਭਾਸ਼ਾ ਖੋਜੋ...",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
  },
  hero: {
    tag: "AI ਨਾਲ ਡਿਜੀਟਲ ਦੂਰੀ ਮਿਟਾਉਣਾ",
    headlinePart1: "ਵਾਇਸ AI ਰਾਹੀਂ ਪੇਂਡੂ ਨਾਗਰਿਕਾਂ ਦਾ",
    headlineHighlight: "ਸਸ਼ਕਤੀਕਰਨ",
    subheadline:
      "ARCA ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਬਹੁਭਾਸ਼ਾਈ ਵਾਇਸ AI ਸਹਾਇਕ ਹੈ। ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਜਾਣਕਾਰੀ ਲਵੋ ਅਤੇ ਸ਼ਿਕਾਇਤਾਂ ਦਰਜ ਕਰੋ।",
    tryVoicePortal: "ਵਾਇਸ ਪੋਰਟਲ ਅਜ਼ਮਾਓ",
    watchInteractiveDemo: "ਡੈਮੋ ਵੇਖੋ",
    tabVoice: "ਵਾਇਸ ਮਦਦ",
    tabChat: "ਗੱਲਬਾਤ",
    tabComplaint: "ਸ਼ਿਕਾਇਤ ਲਿਖੋ",
    tabDocument: "ਦਸਤਾਵੇਜ਼ ਸਕੈਨ",
    tabTrack: "ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ",
    tapToTalk: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
    listeningIn: "{{lang}} ਵਿੱਚ ਸੁਣ ਰਿਹਾ ਹੈ...",
    chatTitle: "ARCA AI ਨੂੰ ਪੁੱਛੋ",
    chatPlaceholder: "ARCA ਤੋਂ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
    send: "ਭੇਜੋ",
    readAloud: "ਬੋਲ ਕੇ ਸੁਣੋ",
    stop: "ਰੋਕੋ",
    draftButton: "ਸਰਕਾਰੀ ਸ਼ਿਕਾਇਤ ਤਿਆਰ ਕਰੋ",
    trackButton: "ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ",
  },
  footer: {
    copyright: "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ। ਪੇਂਡੂ ਵਿਕਾਸ ਲਈ ਸਮਰਪਿਤ।",
  },
});

// Kannada (ಕನ್ನಡ)
export const kn = createLanguagePack({
  navbar: {
    features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    howItWorks: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    impact: "ಪರಿಣಾಮ",
    admin: "ನಿರ್ವಾಹಕ",
    adminLogin: "ನಿರ್ವಾಹಕ ಲಾಗಿನ್",
    launchPortal: "ಪೋರ್ಟಲ್ ಪ್ರಾರಂಭಿಸಿ",
    searchLanguage: "ಭಾಷೆಯನ್ನು ಹುಡುಕಿ...",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  },
  hero: {
    tag: "AI ಮೂಲಕ ಡಿಜಿಟಲ್ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು",
    headlinePart1: "ಧ್ವನಿ AI ಮೂಲಕ ಗ್ರಾಮೀಣ ನಾಗರಿಕರನ್ನು",
    headlineHighlight: "ಸಶಕ್ತಗೊಳಿಸುವುದು",
    subheadline:
      "ARCA ಗ್ರಾಮೀಣ ಸಮುದಾಯಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಬಹುಭಾಷಾ ಧ್ವನಿ AI ಸಹಾಯಕವಾಗಿದೆ. ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲೇ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಿರಿ ಮತ್ತು ಅಧಿಕೃತ ದೂರುಗಳನ್ನು ದಾಖಲಿಸಿ.",
    tryVoicePortal: "ಧ್ವನಿ ಪೋರ್ಟಲ್ ಪ್ರಯತ್ನಿಸಿ",
    watchInteractiveDemo: "ಡೆಮೊ ವೀಕ್ಷಿಸಿ",
    tabVoice: "ಧ್ವನಿ ನೆರವು",
    tabChat: "ಚಾಟ್",
    tabComplaint: "ದೂರು ಬರೆಯಿರಿ",
    tabDocument: "ದಾಖಲೆ ಸ್ಕ್ಯಾನ್",
    tabTrack: "ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    tapToTalk: "ಮಾತನಾಡಲು ಸ್ಪರ್ಶಿಸಿ",
    listeningIn: "{{lang}} ನಲ್ಲಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    chatTitle: "ARCA AI ಅನ್ನು ಕೇಳಿ",
    chatPlaceholder: "ARCA ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
    send: "ಕಳುಹಿಸಿ",
    readAloud: "ಗಟ್ಟಿಯಾಗಿ ಓದಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    draftButton: "ಅಧಿಕೃತ ದೂರು ಸಿದ್ಧಪಡಿಸಿ",
    trackButton: "ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
  },
  footer: {
    copyright: "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಗ್ರಾಮೀಣ ಸಬಲೀಕರಣಕ್ಕೆ ಸಮರ್ಪಿಸಲಾಗಿದೆ.",
  },
});

// Urdu (اردو - RTL)
export const ur = createLanguagePack({
  navbar: {
    features: "خصوصیات",
    howItWorks: "یہ کیسے کام کرتا ہے",
    impact: "ہمارا اثر",
    admin: "ایڈمن",
    adminLogin: "ایڈمن لاگ ان",
    launchPortal: "پورٹل شروع کریں",
    searchLanguage: "زبان تلاش کریں...",
    selectLanguage: "زبان منتخب کریں",
  },
  hero: {
    tag: "AI کے ذریعے ڈیجیٹل فاصلوں کو ختم کرنا",
    headlinePart1: "صوتی AI کے ذریعے دیہی شہریوں کو",
    headlineHighlight: "بااختیار بنانا",
    subheadline:
      "ARCA دیہی علاقوں کے لیے بنایا گیا ایک کثیر لسانی وائس فرسٹ AI معاون ہے۔ اپنی مادری زبان میں سرکاری اسکیموں تک رسائی حاصل کریں، باضابطہ شکایات درج کریں اور دستاویزات کا ترجمہ کریں۔",
    tryVoicePortal: "وائس پورٹل آزمائیں",
    watchInteractiveDemo: "ڈیمو دیکھیں",
    tabVoice: "وائس مدد",
    tabChat: "چیٹ",
    tabComplaint: "شکایت درج کریں",
    tabDocument: "دستاویز اسکین",
    tabTrack: "شکایت ٹریک کریں",
    tapToTalk: "بولنے کے لیے ٹیپ کریں",
    listeningIn: "{{lang}} میں سن رہا ہے...",
    chatTitle: "ARCA AI سے پوچھیں",
    chatPlaceholder: "ARCA سے کچھ بھی پوچھیں...",
    send: "ارسال کریں",
    readAloud: "بلند آواز میں سنیں",
    stop: "روکیں",
    draftButton: "سرکاری شکایت تیار کریں",
    trackButton: "شکایت ٹریک کریں",
  },
  footer: {
    copyright: "جملہ حقوق محفوظ ہیں۔ دیہی خود مختاری کے لیے وقف۔",
  },
});

// Chinese (中文)
export const zh = createLanguagePack({
  navbar: {
    features: "功能特性",
    howItWorks: "工作原理",
    impact: "实际影响",
    admin: "管理后台",
    adminLogin: "管理员登录",
    launchPortal: "启动门户",
    searchLanguage: "搜索语言...",
    selectLanguage: "选择语言",
  },
  hero: {
    tag: "利用人工智能消除数字鸿沟",
    headlinePart1: "通过语音人工智能赋能",
    headlineHighlight: "乡村居民",
    subheadline:
      "ARCA 是一款专为乡村社区打造的多语言语音优先 AI 助手。用您的母语随时获取政府福利、草拟正式投诉并翻译官方文件。",
    tryVoicePortal: "体验语音门户",
    watchInteractiveDemo: "观看交互式演示",
    tabVoice: "语音助手",
    tabChat: "智能对话",
    tabComplaint: "草拟申诉",
    tabDocument: "文档扫描",
    tabTrack: "申诉追踪",
    tapToTalk: "点击说话",
    listeningIn: "正在倾听 {{lang}}...",
    chatTitle: "咨询 ARCA AI",
    chatPlaceholder: "向 ARCA 询问任何问题...",
    send: "发送",
    readAloud: "大声朗读",
    stop: "停止",
    draftButton: "生成正式申诉书",
    trackButton: "追踪申诉进度",
  },
  footer: {
    copyright: "版权所有。致力于乡村数字化赋能。",
  },
});

// Russian (Русский)
export const ru = createLanguagePack({
  navbar: {
    features: "Возможности",
    howItWorks: "Как это работает",
    impact: "Результаты",
    admin: "Админ",
    adminLogin: "Вход администратора",
    launchPortal: "Открыть портал",
    searchLanguage: "Поиск языка...",
    selectLanguage: "Выберите язык",
  },
  hero: {
    tag: "Преодолевая цифровой разрыв с помощью ИИ",
    headlinePart1: "Поддержка жителей сельских районов через",
    headlineHighlight: "Голосовой ИИ",
    subheadline:
      "ARCA — многоязычный голосовой ИИ-помощник для сельских сообществ. Доступ к госпрограммам, оформление жалоб и перевод документов на вашем родном языке.",
    tryVoicePortal: "Попробовать Голосовой Портал",
    watchInteractiveDemo: "Смотреть демо",
    tabVoice: "Голосовой помощник",
    tabChat: "Чат",
    tabComplaint: "Составить жалобу",
    tabDocument: "Сканировать документ",
    tabTrack: "Отследить жалобу",
    tapToTalk: "Нажмите, чтобы говорить",
    listeningIn: "Слушаю на {{lang}}...",
    chatTitle: "Спросите ARCA AI",
    chatPlaceholder: "Задайте любой вопрос ARCA...",
    send: "Отправить",
    readAloud: "Прочитать вслух",
    stop: "Остановить",
    draftButton: "Сформировать официальную жалобу",
    trackButton: "Отследить статус",
  },
  footer: {
    copyright: "Все права защищены. Создано для поддержки сельских жителей.",
  },
});

// Portuguese (Português)
export const pt = createLanguagePack({
  navbar: {
    features: "Recursos",
    howItWorks: "Como Funciona",
    impact: "Impacto",
    admin: "Admin",
    adminLogin: "Login do Administrador",
    launchPortal: "Abrir Portal",
    searchLanguage: "Buscar idioma...",
    selectLanguage: "Selecionar Idioma",
  },
  hero: {
    tag: "Superando a exclusão digital com IA",
    headlinePart1: "Capacitando cidadãos rurais por meio de",
    headlineHighlight: "IA por Voz",
    subheadline:
      "ARCA é um assistente de IA multilíngue por voz projetado para comunidades rurais. Acesse programas sociais, elabore reclamações e traduza documentos no seu idioma nativo.",
    tryVoicePortal: "Experimentar Portal de Voz",
    watchInteractiveDemo: "Assistir Demonstração",
    tabVoice: "Assistente de Voz",
    tabChat: "Chat",
    tabComplaint: "Redigir Reclamação",
    tabDocument: "Escanear Documento",
    tabTrack: "Acompanhar Protocolo",
    tapToTalk: "Toque para Falar",
    listeningIn: "Ouvindo em {{lang}}...",
    chatTitle: "Pergunte à ARCA AI",
    chatPlaceholder: "Pergunte qualquer coisa à ARCA...",
    send: "Enviar",
    readAloud: "Ouvir em Voz Alta",
    stop: "Parar",
    draftButton: "Gerar Reclamação Oficial",
    trackButton: "Rastrear Protocolo",
  },
  footer: {
    copyright: "Todos os direitos reservados. Dedicado ao empoderamento rural.",
  },
});

// Japanese (日本語)
export const ja = createLanguagePack({
  navbar: {
    features: "機能紹介",
    howItWorks: "仕組み",
    impact: "実績と効果",
    admin: "管理者",
    adminLogin: "管理者ログイン",
    launchPortal: "ポータルを開く",
    searchLanguage: "言語を検索...",
    selectLanguage: "言語を選択",
  },
  hero: {
    tag: "AIでデジタル格差を解消する",
    headlinePart1: "音声AIを通じて農村の市民を",
    headlineHighlight: "エンパワーメント",
    subheadline:
      "ARCAは農村コミュニティ向けに設計された多言語対応の音声AIアシスタントです。母国語で福祉制度の申請、陳情書の作成、公的文書の翻訳が瞬時に行えます。",
    tryVoicePortal: "音声ポータルを試す",
    watchInteractiveDemo: "デモを見る",
    tabVoice: "音声アシスタント",
    tabChat: "チャット",
    tabComplaint: "陳情書を作成",
    tabDocument: "書類スキャン",
    tabTrack: "進捗を確認",
    tapToTalk: "話すにはタップ",
    listeningIn: "{{lang}}で聞き取り中...",
    chatTitle: "ARCA AIに質問",
    chatPlaceholder: "ARCAに何でも質問してください...",
    send: "送信",
    readAloud: "読み上げ",
    stop: "停止",
    draftButton: "公式な申し立てを作成",
    trackButton: "進捗を追跡",
  },
  footer: {
    copyright: "無断転載を禁じます。農村地域の支援に捧ぐ。",
  },
});

// Korean (한국어)
export const ko = createLanguagePack({
  navbar: {
    features: "주요 기능",
    howItWorks: "이용 방법",
    impact: "성과 및 영향",
    admin: "관리자",
    adminLogin: "관리자 로그인",
    launchPortal: "포털 시작하기",
    searchLanguage: "언어 검색...",
    selectLanguage: "언어 선택",
  },
  hero: {
    tag: "AI로 디지털 격차를 해소합니다",
    headlinePart1: "음성 AI를 통해 농촌 시민을",
    headlineHighlight: "지원합니다",
    subheadline:
      "ARCA는 농촌 지역사회를 위해 설계된 다국어 음성 기반 AI 비서입니다. 모국어로 정부 복지 제도를 확인하고 민원을 공식 문서로 작성하세요.",
    tryVoicePortal: "음성 포털 체험",
    watchInteractiveDemo: "데모 보기",
    tabVoice: "음성 지원",
    tabChat: "챗봇",
    tabComplaint: "민원 작성",
    tabDocument: "문서 스캔",
    tabTrack: "민원 추적",
    tapToTalk: "탭하여 말하기",
    listeningIn: "{{lang}} 듣는 중...",
    chatTitle: "ARCA AI에게 질문하기",
    chatPlaceholder: "ARCA에게 무엇이든 물어보세요...",
    send: "전송",
    readAloud: "소리내어 읽기",
    stop: "중지",
    draftButton: "공식 민원서 생성",
    trackButton: "민원 상태 확인",
  },
  footer: {
    copyright: "All rights reserved. 농촌 지역사회 역량 강화를 위해 헌신합니다.",
  },
});

