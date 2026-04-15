"use client";

import { useState, useCallback, useRef, useEffect } from "react";
// Import your Header component here (adjust the path as needed)
import Header from "../_components/Header";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SoilResult {
  crop?: string;
  confidence?: number;
  health?: string;
  tips?: string[];
  raw?: string;
}

interface LangConfig {
  label: string;
  font: string;
  script: string;
}

// ── All UI text in 10 Indian languages + English ──────────────────────────────
const LANGS: Record<string, LangConfig> = {
  en: { label: "English",   font: "'Yeseva One', serif",            script: "latin"      },
  hi: { label: "हिंदी",     font: "'Tiro Devanagari Hindi', serif",   script: "devanagari" },
  pa: { label: "ਪੰਜਾਬੀ",    font: "'Gurbani Akhar', serif",           script: "gurmukhi"   },
  bn: { label: "বাংলা",     font: "'Hind Siliguri', sans-serif",      script: "bengali"    },
  te: { label: "తెలుగు",    font: "'Hind Guntur', sans-serif",        script: "telugu"     },
  mr: { label: "मराठी",     font: "'Tiro Devanagari Marathi', serif", script: "devanagari" },
  gu: { label: "ગુજરાતી",   font: "'Hind Vadodara', sans-serif",      script: "gujarati"   },
  kn: { label: "ಕನ್ನಡ",     font: "'Hind Mysuru', sans-serif",        script: "kannada"    },
  ml: { label: "മലയാളം",    font: "'Manjari', sans-serif",            script: "malayalam"  },
  ta: { label: "தமிழ்",     font: "'Hind Madurai', sans-serif",       script: "tamil"      },
  or: { label: "ଓଡ଼ିଆ",     font: "'Baloo Bhaina 2', cursive",        script: "odia"       },
};

const T: Record<string, Record<string, string>> = {
  title: {
    en: "AI Soil Health Analyzer", hi: "मिट्टी स्वास्थ्य विश्लेषक", pa: "ਮਿੱਟੀ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਕ",
    bn: "মাটির স্বাস্থ্য বিশ্লেষক", te: "మట్టి ఆరోగ్య విశ్లేషకుడు", mr: "माती आरोग्य विश्लेषक",
    gu: "જમીન આરોગ્ય વિશ્લેષક", kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಕ", ml: "മണ്ണ് ആരോഗ്യ വിശകലനം",
    ta: "மண் ஆரோக்கிய பகுப்பாய்வி", or: "ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ବିଶ୍ଳେଷଣ",
  },
  subtitle: {
    en: "Enter your soil data — get crop & health advice instantly",
    hi: "अपनी मिट्टी की जानकारी दें — तुरंत फसल सलाह पाएं",
    pa: "ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ ਦਿਓ — ਤੁਰੰਤ ਫ਼ਸਲ ਸਲਾਹ ਪਾਓ",
    bn: "আপনার মাটির তথ্য দিন — তাৎক্ষণিক ফসলের পরামর্শ পান",
    te: "మీ నేల సమాచారం నమోదు చేయండి — వెంటనే పంట సలహా పొందండి",
    mr: "तुमची माती माहिती द्या — त्वरित पीक सल्ला मिळवा",
    gu: "તમારી જમીનની માહિતી આપો — તરત પાક સલાહ મેળવો",
    kn: "ನಿಮ್ಮ ಮಣ್ಣಿನ ಮಾಹಿತಿ ನೀಡಿ — ತಕ್ಷಣ ಬೆಳೆ ಸಲಹೆ ಪಡೆಯಿರಿ",
    ml: "നിങ്ങളുടെ മണ്ണ് ഡേറ്റ നൽകൂ — ഉടനടി വിള ഉപദേശം നേടൂ",
    ta: "உங்கள் மண் தரவை உள்ளிடுங்கள் — உடனடி பயிர் ஆலோசனை பெறுங்கள்",
    or: "ଆପଣଙ୍କ ମାଟି ତଥ୍ୟ ଦିଅନ୍ତୁ — ତୁରନ୍ତ ଫସଲ ପରାମର୍ଶ ପାଆନ୍ତୁ",
  },
  nitrogen:   { en: "Nitrogen (N)",    hi: "नाइट्रोजन (N)",  pa: "ਨਾਈਟ੍ਰੋਜਨ (N)", bn: "নাইট্রোজেন (N)",  te: "నైట్రోజన్ (N)",  mr: "नायट्रोजन (N)",  gu: "નાઇટ્રોજન (N)", kn: "ನೈಟ್ರೋಜನ್ (N)", ml: "നൈട്രജൻ (N)",   ta: "நைட்ரஜன் (N)",  or: "ନାଇଟ୍ରୋଜନ (N)"  },
  phosphorus: { en: "Phosphorus (P)",  hi: "फास्फोरस (P)",   pa: "ਫਾਸਫੋਰਸ (P)",   bn: "ফসফরাস (P)",     te: "ఫాస్ఫరస్ (P)",   mr: "फॉस्फरस (P)",   gu: "ફોસ્ફરસ (P)",  kn: "ಫಾಸ್ಫರಸ್ (P)",  ml: "ഫോസ്ഫറസ് (P)", ta: "பாஸ்பரஸ் (P)",  or: "ଫସ୍ଫରସ (P)"    },
  potassium:  { en: "Potassium (K)",   hi: "पोटैशियम (K)",   pa: "ਪੋਟਾਸ਼ੀਅਮ (K)",  bn: "পটাসিয়াম (K)",   te: "పొటాషియం (K)",   mr: "पोटॅशियम (K)",  gu: "પોટેશિયમ (K)", kn: "ಪೊಟ್ಯಾಶಿಯಮ್ (K)", ml: "പൊട്ടാസ്യം (K)", ta: "பொட்டாசியம் (K)", or: "ପୋଟାସିୟମ (K)" },
  ph:         { en: "Soil pH",         hi: "मिट्टी pH",      pa: "ਮਿੱਟੀ pH",       bn: "মাটির pH",        te: "నేల pH",         mr: "माती pH",        gu: "જમીન pH",      kn: "ಮಣ್ಣಿನ pH",     ml: "മണ്ണ് pH",       ta: "மண் pH",        or: "ମାଟି pH"        },
  temperature:{ en: "Temperature (°C)",hi: "तापमान (°C)",    pa: "ਤਾਪਮਾਨ (°C)",   bn: "তাপমাত্রা (°C)",  te: "ఉష్ణోగ్రత (°C)", mr: "तापमान (°C)",   gu: "તાપમાન (°C)",  kn: "ತಾಪಮಾನ (°C)",   ml: "താപനില (°C)",  ta: "வெப்பநிலை (°C)",or: "ତାପମାତ୍ରା (°C)"},
  humidity:   { en: "Humidity (%)",    hi: "आर्द्रता (%)",   pa: "ਨਮੀ (%)",        bn: "আর্দ্রতা (%)",    te: "తేమ (%)",        mr: "आर्द्रता (%)",   gu: "ભેજ (%)",      kn: "ಆರ್ದ್ರತೆ (%)",  ml: "ഈർപ്പം (%)",   ta: "ஈரப்பதம் (%)",  or: "ଆର୍ଦ୍ରତା (%)"  },
  rainfall:   { en: "Rainfall (mm)",   hi: "वर्षा (mm)",     pa: "ਵਰਖਾ (mm)",      bn: "বৃষ্টিপাত (mm)",  te: "వర్షపాతం (mm)",  mr: "पाऊस (mm)",      gu: "વરસાદ (mm)",   kn: "ಮಳೆ (mm)",      ml: "മഴ (mm)",       ta: "மழையளவு (mm)",  or: "ବର୍ଷା (mm)"    },
  analyze:    { en: "Run AI Analysis", hi: "AI विश्लेषण करें",pa: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",bn: "AI বিশ্লেষণ করুন",te: "AI విశ్లేషణ నడపండి",mr: "AI विश्लेषण करा", gu: "AI વિશ્લેષણ ચલાવો",kn: "AI ವಿಶ್ಲೇಷಣೆ ರನ್ ಮಾಡಿ",ml: "AI വിശകലനം നടത്തുക",ta: "AI பகுப்பாய்வு இயக்கு",or: "AI ବିଶ୍ଳେଷଣ ଚଲାନ୍ତୁ" },
  analyzing:  { en: "AI is analyzing your soil…", hi: "AI आपकी मिट्टी का विश्लेषण कर रहा है…", pa: "AI ਤੁਹਾਡੀ ਮਿੱਟੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ…", bn: "AI আপনার মাটি বিশ্লেষণ করছে…", te: "AI మీ నేలను విశ్లేషిస్తోంది…", mr: "AI तुमच्या मातीचे विश्लेषण करत आहे…", gu: "AI તમારી જમીનનું વિશ્લેષણ કરી રહ્યું છે…", kn: "AI ನಿಮ್ಮ ಮಣ್ಣನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ…", ml: "AI നിങ്ങളുടെ മണ്ണ് വിശകലനം ചെയ്യുന്നു…", ta: "AI உங்கள் மண்ணை பகுப்பாய்கிறது…", or: "AI ଆପଣଙ୍କ ମାଟି ବିଶ୍ଳେଷଣ କରୁଛି…" },
  crop:       { en: "Recommended Crop",    hi: "अनुशंसित फसल",     pa: "ਸਿਫ਼ਾਰਸ਼ੀ ਫ਼ਸਲ",  bn: "প্রস্তাবিত ফসল",   te: "సిఫారసు పంట",     mr: "शिफारस केलेले पीक",gu: "ભલામણ કરેલ પાક",kn: "ಶಿಫಾರಸು ಬೆಳೆ",     ml: "ശുപാർശ ചെയ്ത വിള",ta: "பரிந்துரைக்கப்பட்ட பயிர்",or: "ଅନୁଶଂସିତ ଫସଲ"  },
  confidence: { en: "AI Confidence",       hi: "AI विश्वास",        pa: "AI ਭਰੋਸਾ",        bn: "AI আস্থা",        te: "AI విశ్వాసం",     mr: "AI विश्वास",        gu: "AI વિશ્વાસ",    kn: "AI ನಂಬಿಕೆ",        ml: "AI വിശ്വസ്തത",   ta: "AI நம்பகத்தன்மை",  or: "AI ବିଶ୍ୱାସ"     },
  health:     { en: "Soil Health",         hi: "मिट्टी स्वास्थ्य", pa: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ", bn: "মাটির স্বাস্থ্য", te: "నేల ఆరోగ్యం",     mr: "माती आरोग्य",       gu: "જમીનનું આરોગ્ય",kn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",   ml: "മണ്ണ് ആരോഗ്യം",   ta: "மண் ஆரோக்கியம்",   or: "ମାଟି ସ୍ୱାସ୍ଥ்ய"  },
  tips:       { en: "Farming Tips",        hi: "खेती के सुझाव",    pa: "ਖੇਤੀ ਸੁਝਾਅ",     bn: "চাষের পরামর্শ",   te: "వ్యవసాయ చిట్కాలు",mr: "शेती टिप्स",        gu: "ખેતી ટિપ્સ",    kn: "ಕೃಷಿ ಸಲಹೆಗಳು",    ml: "കൃഷി നുറുങ്ങുകൾ", ta: "விவசாய குறிப்புகள்",or: "ଚାଷ ଟିପ୍ସ"       },
  reset:      { en: "Analyze Again",       hi: "फिर से विश्लेषण करें",pa: "ਫਿਰ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",bn: "আবার বিশ্লেষণ করুন",te: "మళ్ళీ విశ్లేషించండి",mr: "पुन्हा विश्लेषण करा",gu: "ફरीथी विश्लेषण करो",kn: "ಮತ್ತೆ ವಿಶ್ಲೇಷಿಸಿ",ml: "വീണ്ടും വിശകലനം", ta: "மீண்டும் பகுப்பாய்வு",or: "ପୁଣି ବିଶ୍ଳେଷଣ"   },
  kvk:        { en: "Consult KVK (Krishi Vigyan Kendra) for local crop advice.", hi: "स्थानीय फसल सलाह के लिए KVK (कृषि विज्ञान केंद्र) से संपर्क करें।", pa: "ਸਥਾਨਕ ਫ਼ਸਲ ਸਲਾਹ ਲਈ KVK ਨਾਲ ਸੰਪਰਕ ਕਰੋ।", bn: "স্থানীয় ফসলের পরামর্শের জন্য KVK-তে যোগাযোগ করুন।", te: "స్థానిక పంట సలహా కోసం KVK ని సంప్రదించండి.", mr: "स्थानिक पीक सल्ल्यासाठी KVK शी संपर्क करा.", gu: "સ્થાનિક પાક સलाह માટૅ KVK નો સંપર્ક કરો.", kn: "ಸ್ಥಳೀಯ ಬೆಳೆ ಸಲಹೆಗಾಗಿ KVK ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.", ml: "പ്രാദേശിക വിള ഉപദേശത്തിന് KVK ഉമായി ബന്ധപ്പെടുക.", ta: "உள்ளூர் பயிர் ஆலோசனைக்கு KVK ஐ அணுகுங்கள்.", or: "ସ୍ଥାନୀୟ ଫସଲ ପରାମର୍ଶ ପାଇଁ KVK ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।" },
  choose_lang:{ en: "Language:",hi: "भाषा:",  pa: "ਭਾਸ਼ਾ:",  bn: "ভাষা:",te: "భాష:",mr: "भाषा:",   gu: "ભાષા:",kn: "ಭಾಷೆ:",ml: "ഭാഷ:",ta: "மொழி:",or: "ଭାଷା:" },
};

const t = (key: string, lang: string): string =>
  T[key]?.[lang] ?? T[key]?.["en"] ?? key;

const FIELDS = [
  "nitrogen", "phosphorus", "potassium", "ph", "temperature", "humidity", "rainfall",
] as const;
type FieldKey = (typeof FIELDS)[number];

const FIELD_ICONS: Record<FieldKey, string> = {
  nitrogen: "🌿", phosphorus: "🔥", potassium: "💧",
  ph: "⚗️", temperature: "🌡️", humidity: "☁️", rainfall: "🌧️",
};

const FIELD_UNITS: Record<FieldKey, string> = {
  nitrogen: "kg/ha", phosphorus: "kg/ha", potassium: "kg/ha",
  ph: "", temperature: "°C", humidity: "%", rainfall: "mm",
};

// ── Inline styles object (avoids <style> tag in JSX) ─────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Yeseva+One&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&family=Tiro+Devanagari+Hindi&family=Tiro+Devanagari+Marathi&family=Hind+Siliguri:wght@400;500;600&family=Hind+Guntur:wght@400;500;600&family=Hind+Madurai:wght@400;500;600&family=Hind+Vadodara:wght@400;500;600&family=Hind+Mysuru:wght@400;500;600&family=Manjari:wght@400;700&family=Baloo+Bhaina+2:wght@400;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
  --soil:#2c1a0e;--soil2:#3d2410;--clay:#5c3317;--clay2:#7a4520;
  --terra:#b85c38;--terra2:#d4714a;--cream:#fdf4e7;--cream2:#f7e8cc;
  --wheat:#e8c77a;--wheat2:#f0d898;--emerald:#2d7a4f;--emerald2:#3a9c64;
  --sky:#2d5f8a;--amber:#d97706;--red:#c0392b;
  --text:#1a0e06;--text2:#5a3825;--text3:#9c7255;
  --border:rgba(92,51,23,0.15);--border2:rgba(92,51,23,0.28);
  --shadow:0 8px 40px rgba(44,26,14,0.18);--shadow-lg:0 20px 60px rgba(44,26,14,0.25);
}

html,body{background:var(--cream);min-height:100%;}

.soil-page{
  min-height:100vh;background:var(--cream);
  background-image:
    radial-gradient(ellipse 70% 50% at 10% 0%,rgba(184,92,56,0.12) 0%,transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 100%,rgba(45,122,79,0.10) 0%,transparent 60%);
  font-family:'DM Sans',sans-serif;color:var(--text);padding-bottom:80px;
  overflow-x: hidden;
}

.soil-wrap{max-width:880px;margin:0 auto;padding:0 20px;}

.soil-controls-top {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 24px 0 0;
}
.soil-lang-picker{position:relative; display: flex; align-items: center; gap: 10px;}
.soil-lang-label{font-family:'DM Mono',monospace;font-size:12px;letter-spacing:1px;color:var(--text2); font-weight: 500;}

.soil-lang-trigger{
  display:flex;align-items:center;gap:8px;
  background:#fff;border:1.5px solid var(--border2);
  border-radius:10px;padding:8px 14px;color:var(--text);
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;transition:all 0.2s;min-width:140px;justify-content:space-between;
}
.soil-lang-trigger:hover{background:var(--cream2); border-color: var(--terra);}
.soil-lang-arrow{opacity:0.6;transition:transform 0.2s;display:inline-block; color:var(--text3);}
.soil-lang-arrow.open{transform:rotate(180deg);}

.soil-lang-menu{
  position:absolute;top:calc(100% + 6px);right:0; z-index: 50;
  background:#fff;border:1px solid var(--border2);
  border-radius:14px;padding:6px;min-width:200px;max-height:320px;overflow-y:auto;
  box-shadow:var(--shadow-lg);
  display:grid;grid-template-columns:1fr 1fr;gap:4px;
  animation:soil-menuIn 0.18s ease;
}
@keyframes soil-menuIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.soil-lang-opt{
  padding:9px 12px;border-radius:9px;
  color:var(--text2);font-size:14px;font-weight:500;
  cursor:pointer;transition:all 0.15s;text-align:center;
  border:1px solid transparent;
}
.soil-lang-opt:hover{background:var(--cream2);color:var(--text);}
.soil-lang-opt.active{background:var(--terra);color:#fff;border-color:var(--terra2);}

.soil-hdr{padding:24px 0 36px;text-align:center;animation:soil-fadeDown 0.6s ease both;}
.soil-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--clay);color:var(--wheat2);
  border-radius:999px;padding:6px 18px;
  font-family:'DM Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;
  margin-bottom:18px;box-shadow:0 4px 16px rgba(92,51,23,0.25);
}
.soil-pulse{width:7px;height:7px;border-radius:50%;background:var(--wheat);animation:soil-blink 2s infinite;}
@keyframes soil-blink{0%,100%{opacity:1}50%{opacity:0.2}}
.soil-hdr h1{
  font-family:'Yeseva One',serif;
  font-size:clamp(30px,6vw,52px);font-weight:400;
  line-height:1.05;letter-spacing:-0.5px;
  color:var(--soil);margin-bottom:12px;
}
.soil-hdr p{font-size:15px;color:var(--text2);max-width:540px;margin:0 auto;line-height:1.6;}
@keyframes soil-fadeDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
@keyframes soil-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

.soil-card{
  background:#fff;border:1px solid var(--border);
  border-radius:24px;padding:28px 28px 24px;
  box-shadow:var(--shadow);margin-bottom:18px;
  position:relative;overflow:hidden;
  animation:soil-fadeUp 0.5s ease both;
}
.soil-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,var(--clay),var(--terra),var(--wheat));
}
.soil-card-label{
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;
  color:var(--text3);margin-bottom:22px;display:flex;align-items:center;gap:10px;
}
.soil-card-label::after{content:'';flex:1;height:1px;background:var(--border);}

.soil-field-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;}
.soil-field-wrap{display:flex;flex-direction:column;gap:6px;}
.soil-field-label{font-size:12px;font-weight:600;color:var(--text2);display:flex;align-items:center;gap:6px;}
.soil-field-icon{font-size:16px;}
.soil-field-inner{position:relative;}
.soil-field-input{
  width:100%;padding:13px 44px 13px 14px;
  border:1.5px solid var(--border2);border-radius:12px;
  background:var(--cream);font-family:'DM Mono',monospace;font-size:15px;font-weight:500;
  color:var(--text);transition:all 0.2s;outline:none;
  -moz-appearance:textfield;
}
.soil-field-input::-webkit-outer-spin-button,
.soil-field-input::-webkit-inner-spin-button{-webkit-appearance:none;}
.soil-field-input:focus{border-color:var(--terra);background:#fff;box-shadow:0 0 0 3px rgba(184,92,56,0.12);}
.soil-field-unit{
  position:absolute;right:12px;top:50%;transform:translateY(-50%);
  font-family:'DM Mono',monospace;font-size:11px;color:var(--text3);pointer-events:none;
}

.soil-submit-row{display:flex;justify-content:center;margin-top:8px;}
.soil-submit-btn{
  display:flex;align-items:center;gap:10px;
  background:linear-gradient(135deg,var(--clay) 0%,var(--terra) 100%);
  color:#fff;border:none;border-radius:999px;padding:16px 44px;
  font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;
  cursor:pointer;transition:all 0.25s;
  box-shadow:0 6px 24px rgba(184,92,56,0.35);
  position:relative;overflow:hidden;
}
.soil-submit-btn::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
  opacity:0;transition:opacity 0.2s;
}
.soil-submit-btn:hover{transform:translateY(-3px);box-shadow:0 10px 36px rgba(184,92,56,0.5);}
.soil-submit-btn:hover::after{opacity:1;}
.soil-submit-btn:active{transform:translateY(-1px);}

.soil-loading-wrap{text-align:center;padding:40px 20px;}
.soil-spinner{
  width:72px;height:72px;border-radius:50%;margin:0 auto 20px;
  border:4px solid var(--cream2);border-top-color:var(--terra);border-right-color:var(--clay);
  animation:soil-spin 1s linear infinite;position:relative;
}
.soil-spinner::after{
  content:'🌱';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-size:26px;animation:soil-counter-spin 1s linear infinite;
}
@keyframes soil-spin{to{transform:rotate(360deg)}}
@keyframes soil-counter-spin{to{transform:rotate(-360deg)}}
.soil-loading-txt{font-size:17px;font-weight:600;color:var(--clay);}
.soil-loading-bar{height:3px;background:var(--cream2);border-radius:999px;margin:16px auto 0;max-width:220px;overflow:hidden;}
.soil-loading-fill{height:100%;width:40%;background:linear-gradient(90deg,var(--clay),var(--terra));border-radius:999px;animation:soil-sweep 1.5s ease-in-out infinite;}
@keyframes soil-sweep{0%{transform:translateX(-250%)}100%{transform:translateX(550%)}}

.soil-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px;}

.soil-res-card{
  border-radius:20px;padding:22px 20px;border:1.5px solid;
  position:relative;overflow:hidden;animation:soil-fadeUp 0.4s ease both;
}
.soil-res-card::after{
  content:'';position:absolute;top:-30px;right:-30px;
  width:100px;height:100px;border-radius:50%;opacity:0.08;
}
.soil-res-card.crop  {background:#f0faf4;border-color:rgba(45,122,79,0.25);}
.soil-res-card.crop::after {background:var(--emerald);}
.soil-res-card.conf  {background:#fdf6ed;border-color:rgba(217,119,6,0.25);}
.soil-res-card.conf::after {background:var(--amber);}
.soil-res-card.health{background:#fdf4ee;border-color:rgba(184,92,56,0.25);}
.soil-res-card.health::after{background:var(--terra);}

.soil-res-icon{font-size:28px;margin-bottom:10px;display:block;}
.soil-res-label{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.soil-res-value{font-family:'Yeseva One',serif;font-size:22px;font-weight:400;line-height:1.2;}
.soil-res-card.crop  .soil-res-value{color:var(--emerald);}
.soil-res-card.conf  .soil-res-value{color:var(--amber);}
.soil-conf-bar{height:6px;background:var(--cream2);border-radius:999px;margin-top:10px;overflow:hidden;}
.soil-conf-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--clay),var(--terra));transition:width 0.8s ease;}

.soil-tips-card{background:var(--soil);border-radius:20px;padding:24px;margin-bottom:18px;animation:soil-fadeUp 0.4s 0.1s ease both;}
.soil-tips-title{font-family:'Yeseva One',serif;font-size:20px;color:var(--wheat);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.soil-tips-list{display:flex;flex-direction:column;gap:10px;}
.soil-tip-item{
  display:flex;gap:12px;align-items:flex-start;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);
  border-radius:12px;padding:12px 14px;
}
.soil-tip-num{
  width:24px;height:24px;border-radius:50%;flex-shrink:0;
  background:var(--terra);color:#fff;
  font-family:'DM Mono',monospace;font-size:12px;font-weight:500;
  display:flex;align-items:center;justify-content:center;margin-top:1px;
}
.soil-tip-text{font-size:14px;color:rgba(255,255,255,0.75);line-height:1.6;}

.soil-kvk-notice{
  display:flex;gap:12px;align-items:flex-start;
  background:rgba(45,122,79,0.08);border:1px solid rgba(45,122,79,0.2);
  border-radius:14px;padding:14px 18px;margin-bottom:18px;
  animation:soil-fadeUp 0.4s 0.15s ease both;
}
.soil-kvk-ico{font-size:22px;flex-shrink:0;}
.soil-kvk-text{font-size:13px;color:var(--emerald);line-height:1.6;}

.soil-raw-block{
  white-space:pre-wrap;font-family:'DM Mono',monospace;font-size:13px;color:var(--text2);
  background:var(--cream2);border-radius:14px;padding:18px;
  border:1px solid var(--border);line-height:1.8;
}

.soil-cta{
  width:100%;padding:16px;background:transparent;
  border:2px solid var(--border2);border-radius:16px;color:var(--clay);
  font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;
  cursor:pointer;transition:all 0.25s;
  display:flex;align-items:center;justify-content:center;gap:10px;
  animation:soil-fadeUp 0.4s 0.2s ease both;
}
.soil-cta:hover{border-color:var(--terra);color:var(--terra);background:rgba(184,92,56,0.04);transform:translateY(-2px);}

.soil-res-card:nth-child(1){animation-delay:0.05s}
.soil-res-card:nth-child(2){animation-delay:0.10s}
.soil-res-card:nth-child(3){animation-delay:0.15s}
.soil-tip-item:nth-child(1){animation-delay:0.05s}
.soil-tip-item:nth-child(2){animation-delay:0.10s}
.soil-tip-item:nth-child(3){animation-delay:0.15s}

.soil-lang-menu::-webkit-scrollbar{width:4px;}
.soil-lang-menu::-webkit-scrollbar-track{background:transparent;}
.soil-lang-menu::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:99px;}

/* ── Mobile Responsvie Adjustments ── */
@media(max-width: 768px){
  .soil-card { padding: 24px 20px 20px; }
  .soil-field-grid { grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); }
}
@media(max-width: 560px){
  .soil-result-grid { grid-template-columns: 1fr; }
  .soil-submit-btn { width: 100%; justify-content: center; }
  .soil-lang-menu { right: -10px; } /* Prevents overflow if aligned far right */
}
@media(max-width: 400px){
  .soil-field-grid { grid-template-columns: 1fr; }
}
`;

// ── Health color helper ───────────────────────────────────────────────────────
function healthColor(h: string | undefined): string {
  const low = h?.toLowerCase() ?? "";
  if (
    low.includes("excellent") || low.includes("good") ||
    low.includes("उत्तम") || low.includes("अच्छ")
  ) return "var(--emerald)";
  if (
    low.includes("poor") || low.includes("bad") ||
    low.includes("खराब") || low.includes("निम्न")
  ) return "var(--red)";
  return "var(--amber)";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SoilHealthPage() {
  const [lang, setLang]         = useState<string>("en");
  const [form, setForm]         = useState<Partial<Record<FieldKey, string>>>({});
  const [result, setResult]     = useState<SoilResult | null>(null);
  const [loading, setLoading]   = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close lang menu on outside click
  useEffect(() => {
    if (!showLangMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLangMenu]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const analyzeSoil = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/soil-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: lang }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: SoilResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Soil analysis failed:", err);
      setResult({ raw: "Analysis failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }, [form, lang]);

  const reset = useCallback(() => {
    setResult(null);
    setForm({});
  }, []);

  const langInfo = LANGS[lang] ?? LANGS["en"];
  const confidence = typeof result?.confidence === "number" ? result.confidence : 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
      {/* ── Render Header directly, it handles its own sticky behavior and background ── */}
      <Header />

      <div className="soil-page" style={{ fontFamily: langInfo.font }}>
        <div className="soil-wrap">

          {/* ── Relocated Language Picker ── */}
          <div className="soil-controls-top">
            <div className="soil-lang-picker" ref={menuRef}>
              <span className="soil-lang-label">{t("choose_lang", lang)}</span>
              
              <button
                type="button"
                className="soil-lang-trigger"
                onClick={() => setShowLangMenu((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={showLangMenu}
              >
                <span>{langInfo.label}</span>
                <span className={`soil-lang-arrow${showLangMenu ? " open" : ""}`}>▾</span>
              </button>

              {showLangMenu && (
                <div className="soil-lang-menu" role="listbox">
                  {Object.entries(LANGS).map(([code, info]) => (
                    <div
                      key={code}
                      role="option"
                      aria-selected={lang === code}
                      className={`soil-lang-opt${lang === code ? " active" : ""}`}
                      style={{ fontFamily: info.font }}
                      onClick={() => { setLang(code); setShowLangMenu(false); }}
                    >
                      {info.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Header ── */}
          <div className="soil-hdr">
            <div className="soil-eyebrow">
              <span className="soil-pulse" />
              AI Powered
            </div>
            <h1>{t("title", lang)}</h1>
            <p>{t("subtitle", lang)}</p>
          </div>

          {/* ── Form ── */}
          {!result && !loading && (
            <div className="soil-card">
              <p className="soil-card-label">01 &nbsp; Soil Parameters</p>
              <div className="soil-field-grid">
                {FIELDS.map((f) => (
                  <div className="soil-field-wrap" key={f}>
                    <label className="soil-field-label" htmlFor={`soil-${f}`}>
                      <span className="soil-field-icon">{FIELD_ICONS[f]}</span>
                      {t(f, lang)}
                    </label>
                    <div className="soil-field-inner">
                      <input
                        id={`soil-${f}`}
                        className="soil-field-input"
                        type="number"
                        name={f}
                        placeholder="0"
                        value={form[f] ?? ""}
                        onChange={handleChange}
                        min="0"
                        step="any"
                      />
                      {FIELD_UNITS[f] && (
                        <span className="soil-field-unit">{FIELD_UNITS[f]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="soil-submit-row" style={{ marginTop: 24 }}>
                <button type="button" className="soil-submit-btn" onClick={analyzeSoil}>
                  🔍 &nbsp;{t("analyze", lang)}
                </button>
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="soil-card soil-loading-wrap">
              <div className="soil-spinner" />
              <p className="soil-loading-txt">{t("analyzing", lang)}</p>
              <div className="soil-loading-bar">
                <div className="soil-loading-fill" />
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {result && !loading && (
            <>
              <div className="soil-result-grid">
                <div className="soil-res-card crop">
                  <span className="soil-res-icon">🌾</span>
                  <p className="soil-res-label">{t("crop", lang)}</p>
                  <p className="soil-res-value">{result.crop ?? "—"}</p>
                </div>
                <div className="soil-res-card conf">
                  <span className="soil-res-icon">📊</span>
                  <p className="soil-res-label">{t("confidence", lang)}</p>
                  <p className="soil-res-value">{confidence}%</p>
                  <div className="soil-conf-bar">
                    <div
                      className="soil-conf-fill"
                      style={{ width: `${Math.min(confidence, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="soil-res-card health">
                  <span className="soil-res-icon">🌱</span>
                  <p className="soil-res-label">{t("health", lang)}</p>
                  <p
                    className="soil-res-value"
                    style={{ color: healthColor(result.health) }}
                  >
                    {result.health ?? "—"}
                  </p>
                </div>
              </div>

              {/* Tips */}
              {Array.isArray(result.tips) && result.tips.length > 0 && (
                <div className="soil-tips-card">
                  <p className="soil-tips-title">🌾 &nbsp;{t("tips", lang)}</p>
                  <div className="soil-tips-list">
                    {result.tips.map((tip, i) => (
                      <div className="soil-tip-item" key={i}>
                        <span className="soil-tip-num">{i + 1}</span>
                        <p className="soil-tip-text">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw fallback */}
              {typeof result.raw === "string" && result.raw.length > 0 && (
                <div className="soil-card">
                  <div className="soil-raw-block">{result.raw}</div>
                </div>
              )}

              {/* KVK notice */}
              <div className="soil-kvk-notice">
                <span className="soil-kvk-ico">🏛️</span>
                <p className="soil-kvk-text">{t("kvk", lang)}</p>
              </div>

              <button type="button" className="soil-cta" onClick={reset}>
                ↺ &nbsp;{t("reset", lang)}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}