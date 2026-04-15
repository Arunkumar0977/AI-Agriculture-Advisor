"use client";

import { useState } from "react";
import Header from "../_components/Header";
 
type WeatherData = {
  temperature: number;
  rainfall: number;
  weather: string;
  description: string;
  humidity: number;
  wind_speed: number;
  location: string;
};

type ResultData = {
  english: string;
  regional: string;
};

type LangCode =
  | "en" | "hi" | "pa" | "mr" | "te"
  | "bn" | "ta" | "gu" | "kn" | "or";

type LangStrings = {
  title: string;
  sub: string;
  form: string;
  result: string;
  soil: string;
  soilPH: string;
  season: string;
  location: string;
  locPH: string;
  fetch: string;
  temp: string;
  tempPH: string;
  rain: string;
  rainPH: string;
  submit: string;
  analysing: string;
  empty: string;
  clear: string;
  winter: string;
  summer: string;
  rainy: string;
  humidity: string;
  wind: string;
  langLabel: string;
};


const LANGS: { code: LangCode; name: string; locale: string }[] = [
  { code: "en", name: "🇬🇧 English",   locale: "en-IN" },
  { code: "hi", name: "🇮🇳 हिंदी",      locale: "hi-IN" },
  { code: "pa", name: "🌾 ਪੰਜਾਬੀ",     locale: "pa-IN" },
  { code: "mr", name: "🌾 मराठी",      locale: "mr-IN" },
  { code: "te", name: "🌾 తెలుగు",     locale: "te-IN" },
  { code: "bn", name: "🌾 বাংলা",      locale: "bn-IN" },
  { code: "ta", name: "🌾 தமிழ்",     locale: "ta-IN" },
  { code: "gu", name: "🌾 ગુજરાતી",    locale: "gu-IN" },
  { code: "kn", name: "🌾 ಕನ್ನಡ",      locale: "kn-IN" },
  { code: "or", name: "🌾 ଓଡ଼ିଆ",      locale: "or-IN" },
];

const STRINGS: Record<LangCode, LangStrings> = {
  en: {
    title: "🌱 Smart Crop Advisor",
    sub: "AI-powered recommendations for your farm",
    form: "📋 Farm Details",
    result: "🌾 Recommendation",
    soil: "Soil Type",
    soilPH: "e.g. Sandy loam, Clay...",
    season: "Season",
    location: "Location",
    locPH: "City or district...",
    fetch: "Fetch Weather",
    temp: "🌡️ Temp (°C)",
    tempPH: "e.g. 28",
    rain: "🌧️ Rainfall (mm)",
    rainPH: "e.g. 120",
    submit: "🤖 Get AI Recommendation",
    analysing: "Analysing...",
    empty: "Fill in your farm details and click\n\"Get AI Recommendation\"",
    clear: "↩ Clear & Try Again",
    winter: "Winter", summer: "Summer", rainy: "Rainy",
    humidity: "Humidity", wind: "Wind", langLabel: "English",
  },
  hi: {
    title: "🌱 स्मार्ट फसल सलाहकार",
    sub: "आपकी खेती के लिए AI आधारित सलाह",
    form: "📋 खेत की जानकारी",
    result: "🌾 सुझाव",
    soil: "मिट्टी का प्रकार",
    soilPH: "जैसे: रेतीली, चिकनी...",
    season: "मौसम",
    location: "स्थान",
    locPH: "शहर या जिला...",
    fetch: "मौसम लाएं",
    temp: "🌡️ तापमान (°C)",
    tempPH: "जैसे: 28",
    rain: "🌧️ वर्षा (mm)",
    rainPH: "जैसे: 120",
    submit: "🤖 AI से सुझाव लें",
    analysing: "विश्लेषण हो रहा है...",
    empty: "खेत की जानकारी भरें और\n\"AI से सुझाव लें\" दबाएं",
    clear: "↩ फिर से करें",
    winter: "सर्दी", summer: "गर्मी", rainy: "बरसात",
    humidity: "नमी", wind: "हवा", langLabel: "हिंदी",
  },
  pa: {
    title: "🌱 ਸਮਾਰਟ ਫ਼ਸਲ ਸਲਾਹਕਾਰ",
    sub: "ਤੁਹਾਡੇ ਖੇਤ ਲਈ AI ਸਲਾਹ",
    form: "📋 ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ",
    result: "🌾 ਸੁਝਾਅ",
    soil: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
    soilPH: "ਜਿਵੇਂ: ਰੇਤਲੀ, ਚਿੱਕਣੀ...",
    season: "ਰੁੱਤ",
    location: "ਸਥਾਨ",
    locPH: "ਸ਼ਹਿਰ ਜਾਂ ਜ਼ਿਲ੍ਹਾ...",
    fetch: "ਮੌਸਮ ਲਿਆਓ",
    temp: "🌡️ ਤਾਪਮਾਨ (°C)",
    tempPH: "ਜਿਵੇਂ: 28",
    rain: "🌧️ ਵਰਖਾ (mm)",
    rainPH: "ਜਿਵੇਂ: 120",
    submit: "🤖 AI ਸੁਝਾਅ ਲਓ",
    analysing: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
    empty: "ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ ਭਰੋ ਅਤੇ AI ਸੁਝਾਅ ਲਓ",
    clear: "↩ ਦੁਬਾਰਾ ਕਰੋ",
    winter: "ਸਰਦੀ", summer: "ਗਰਮੀ", rainy: "ਬਰਸਾਤ",
    humidity: "ਨਮੀ", wind: "ਹਵਾ", langLabel: "ਪੰਜਾਬੀ",
  },
  mr: {
    title: "🌱 स्मार्ट पीक सल्लागार",
    sub: "तुमच्या शेतासाठी AI सल्ला",
    form: "📋 शेताची माहिती",
    result: "🌾 शिफारस",
    soil: "मातीचा प्रकार",
    soilPH: "उदा: वालुकामय, चिकणमाती...",
    season: "हंगाम",
    location: "स्थान",
    locPH: "शहर किंवा जिल्हा...",
    fetch: "हवामान आणा",
    temp: "🌡️ तापमान (°C)",
    tempPH: "उदा: 28",
    rain: "🌧️ पाऊस (mm)",
    rainPH: "उदा: 120",
    submit: "🤖 AI शिफारस घ्या",
    analysing: "विश्लेषण होत आहे...",
    empty: "शेताची माहिती भरा आणि AI शिफारस घ्या",
    clear: "↩ पुन्हा करा",
    winter: "हिवाळा", summer: "उन्हाळा", rainy: "पावसाळा",
    humidity: "आर्द्रता", wind: "वारा", langLabel: "मराठी",
  },
  te: {
    title: "🌱 స్మార్ట్ పంట సలహాదారు",
    sub: "మీ వ్యవసాయానికి AI సలహా",
    form: "📋 వ్యవసాయ వివరాలు",
    result: "🌾 సిఫార్సు",
    soil: "నేల రకం",
    soilPH: "ఉదా: ఇసుక, బంకమట్టి...",
    season: "సీజన్",
    location: "స్థానం",
    locPH: "నగరం లేదా జిల్లా...",
    fetch: "వాతావరణం తీసుకో",
    temp: "🌡️ ఉష్ణోగ్రత (°C)",
    tempPH: "ఉదా: 28",
    rain: "🌧️ వర్షపాతం (mm)",
    rainPH: "ఉదా: 120",
    submit: "🤖 AI సిఫార్సు పొందండి",
    analysing: "విశ్లేషిస్తున్నాము...",
    empty: "వివరాలు నమోదు చేసి AI సిఫార్సు పొందండి",
    clear: "↩ మళ్ళీ చేయండి",
    winter: "శీతాకాలం", summer: "వేసవి", rainy: "వర్షాకాలం",
    humidity: "తేమ", wind: "గాలి", langLabel: "తెలుగు",
  },
  bn: {
    title: "🌱 স্মার্ট ফসল উপদেষ্টা",
    sub: "আপনার খামারের জন্য AI পরামর্শ",
    form: "📋 জমির তথ্য",
    result: "🌾 সুপারিশ",
    soil: "মাটির ধরন",
    soilPH: "যেমন: বালিমাটি, এঁটেল...",
    season: "মৌসুম",
    location: "স্থান",
    locPH: "শহর বা জেলা...",
    fetch: "আবহাওয়া আনুন",
    temp: "🌡️ তাপমাত্রা (°C)",
    tempPH: "যেমন: 28",
    rain: "🌧️ বৃষ্টিপাত (mm)",
    rainPH: "যেমন: 120",
    submit: "🤖 AI পরামর্শ নিন",
    analysing: "বিশ্লেষণ হচ্ছে...",
    empty: "জমির তথ্য পূরণ করুন এবং AI পরামর্শ নিন",
    clear: "↩ আবার করুন",
    winter: "শীত", summer: "গ্রীষ্ম", rainy: "বর্ষা",
    humidity: "আর্দ্রতা", wind: "বাতাস", langLabel: "বাংলা",
  },
  ta: {
    title: "🌱 ஸ்மார்ட் பயிர் ஆலோசகர்",
    sub: "உங்கள் விவசாயத்திற்கு AI ஆலோசனை",
    form: "📋 நிலம் விவரங்கள்",
    result: "🌾 பரிந்துரை",
    soil: "மண் வகை",
    soilPH: "எ.கா: மணல் மண், களிமண்...",
    season: "பருவம்",
    location: "இடம்",
    locPH: "நகரம் அல்லது மாவட்டம்...",
    fetch: "வானிலை கொண்டுவா",
    temp: "🌡️ வெப்பநிலை (°C)",
    tempPH: "எ.கா: 28",
    rain: "🌧️ மழையளவு (mm)",
    rainPH: "எ.கா: 120",
    submit: "🤖 AI பரிந்துரை பெறுக",
    analysing: "பகுப்பாய்வு செய்கிறோம்...",
    empty: "விவரங்களை நிரப்பி AI பரிந்துரை பெறுக",
    clear: "↩ மீண்டும் முயற்சி",
    winter: "குளிர்காலம்", summer: "கோடை", rainy: "மழைக்காலம்",
    humidity: "ஈரப்பதம்", wind: "காற்று", langLabel: "தமிழ்",
  },
  gu: {
    title: "🌱 સ્માર્ટ પાક સલાહકાર",
    sub: "તમારા ખેતર માટે AI સલાહ",
    form: "📋 ખેતરની માહિતી",
    result: "🌾 ભલામણ",
    soil: "જમીનનો પ્રકાર",
    soilPH: "દા.ત.: રેતાળ, ચીકણી...",
    season: "ઋતુ",
    location: "સ્થળ",
    locPH: "શહેર અથવા જિલ્લો...",
    fetch: "હવામાન લાવો",
    temp: "🌡️ તાપમાન (°C)",
    tempPH: "દા.ત.: 28",
    rain: "🌧️ વર્ષા (mm)",
    rainPH: "દા.ત.: 120",
    submit: "🤖 AI ભલામણ મેળવો",
    analysing: "વિશ્લેષણ થઈ રહ્યું છે...",
    empty: "માહિતી ભરો અને AI ભલામણ મેળવો",
    clear: "↩ ફરીથી કરો",
    winter: "શિયાળો", summer: "ઉનાળો", rainy: "ચોમાસું",
    humidity: "ભેજ", wind: "પવન", langLabel: "ગુજરાતી",
  },
  kn: {
    title: "🌱 ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಸಲಹೆಗಾರ",
    sub: "ನಿಮ್ಮ ಕೃಷಿಗೆ AI ಸಲಹೆ",
    form: "📋 ಜಮೀನಿನ ವಿವರ",
    result: "🌾 ಶಿಫಾರಸು",
    soil: "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
    soilPH: "ಉದಾ: ಮರಳು ಮಣ್ಣು, ಜೇಡಿ...",
    season: "ಋತು",
    location: "ಸ್ಥಳ",
    locPH: "ನಗರ ಅಥವಾ ಜಿಲ್ಲೆ...",
    fetch: "ಹವಾಮಾನ ತನ್ನಿ",
    temp: "🌡️ ತಾಪಮಾನ (°C)",
    tempPH: "ಉದಾ: 28",
    rain: "🌧️ ಮಳೆ (mm)",
    rainPH: "ಉದಾ: 120",
    submit: "🤖 AI ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
    analysing: "ವಿಶ್ಲೇಷಣೆ ಆಗುತ್ತಿದೆ...",
    empty: "ವಿವರ ತುಂಬಿ AI ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
    clear: "↩ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    winter: "ಚಳಿಗಾಲ", summer: "ಬೇಸಿಗೆ", rainy: "ಮಳೆಗಾಲ",
    humidity: "ತೇವಾಂಶ", wind: "ಗಾಳಿ", langLabel: "ಕನ್ನಡ",
  },
  or: {
    title: "🌱 ସ୍ମାର୍ଟ ଫସଲ ପରାମର୍ଶଦାତା",
    sub: "ଆପଣଙ୍କ ଖେତ ପାଇଁ AI ପରାମର୍ଶ",
    form: "📋 ଜମି ବିବରଣୀ",
    result: "🌾 ସୁପାରିଶ",
    soil: "ମାଟି ପ୍ରକାର",
    soilPH: "ଯଥା: ବାଲୁ, ଦୋରସା...",
    season: "ଋତୁ",
    location: "ସ୍ଥାନ",
    locPH: "ସହର ବା ଜିଲ୍ଲା...",
    fetch: "ପାଣିପାଗ ଆଣ",
    temp: "🌡️ ତାପମାତ୍ରା (°C)",
    tempPH: "ଯଥା: 28",
    rain: "🌧️ ବର୍ଷା (mm)",
    rainPH: "ଯଥା: 120",
    submit: "🤖 AI ସୁପାରିଶ ପାଆ",
    analysing: "ବିଶ୍ଳେଷଣ ହେଉଛି...",
    empty: "ଜମି ବିବରଣୀ ଭର ଓ AI ସୁପାରିଶ ପାଆ",
    clear: "↩ ପୁଣି ଚେଷ୍ଟା",
    winter: "ଶୀତ", summer: "ଗ୍ରୀଷ୍ମ", rainy: "ବର୍ଷା",
    humidity: "ଆର୍ଦ୍ରତା", wind: "ବାୟୁ", langLabel: "ଓଡ଼ିଆ",
  },
};

const SEASONS = [
  { value: "winter" as const, icon: "❄️", color: "#6dd5fa" },
  { value: "summer" as const, icon: "☀️", color: "#f7971e" },
  { value: "rainy"  as const, icon: "🌧️", color: "#4facfe" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CropRecommendationPage() {
  const [currentLang, setCurrentLang] = useState<LangCode>("en");
  const [soil, setSoil]               = useState("");
  const [season, setSeason]           = useState("");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall]       = useState("");
  const [location, setLocation]       = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [result, setResult]           = useState<ResultData | null>(null);
  const [loading, setLoading]         = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError]     = useState<string | null>(null);

  const s = STRINGS[currentLang];

  // ── Language switch ──────────────────────────────────────────────────────
  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLang(e.target.value as LangCode);
    setResult(null);
  };

  // ── Weather fetch ────────────────────────────────────────────────────────
  const fetchWeather = async () => {
    if (!location.trim()) {
      setWeatherError("Please enter a location first.");
      return;
    }
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res  = await fetch("/api/weather", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ location }),
      });
      const data = await res.json();
      if (!res.ok) { setWeatherError(data.error ?? "Failed to fetch weather."); return; }
      setWeatherData(data);
      setTemperature(String(data.temperature));
      setRainfall(String(data.rainfall));
    } catch {
      setWeatherError("Network error. Please try again.");
    } finally {
      setWeatherLoading(false);
    }
  };

  // ── AI submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch("/api/crop-recommend", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          soil, season, temperature, rainfall, location,
          language:  currentLang,
          langLabel: s.langLabel,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ english: "Error fetching recommendation.", regional: "" });
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div>
    <div className=" sticky top-0 z-10">
      <Header/>
    </div>
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #56ab2f, transparent)" }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #f7971e, transparent)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
              style={{ textShadow: "0 0 40px rgba(86,171,47,0.5)" }}
            >
              {s.title}
            </h1>
            <p className="text-green-300 text-lg opacity-80 mt-1">{s.sub}</p>
          </div>

          {/* ── Language Dropdown ── */}
          <div className="relative">
            <select
              value={currentLang}
              onChange={handleLangChange}
              className="appearance-none pl-4 pr-10 py-3 rounded-xl text-base font-medium outline-none cursor-pointer transition-all"
              style={{
                background:  "rgba(86,171,47,0.15)",
                border:      "1px solid rgba(86,171,47,0.45)",
                color:       "#a8e063",
                minWidth:    "170px",
              }}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}
                  style={{ background: "#1a3a2a", color: "white" }}>
                  {l.name}
                </option>
              ))}
            </select>
            {/* Chevron icon */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">
              ▾
            </span>
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* ── FORM CARD ── */}
          <div
            className="rounded-3xl p-8 border border-white/10 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
          >
            <h2 className="text-xl font-semibold text-green-300 mb-6 flex items-center gap-2">
              {s.form}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Soil */}
              <div>
                <label className="block text-sm text-green-200 mb-1 font-medium">{s.soil}</label>
                <input
                  placeholder={s.soilPH}
                  value={soil}
                  onChange={(e) => setSoil(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 border border-white/10 outline-none focus:border-green-400 transition-all"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
              </div>

              {/* Season */}
              <div>
                <label className="block text-sm text-green-200 mb-2 font-medium">{s.season}</label>
                <div className="flex gap-2">
                  {SEASONS.map((ss) => (
                    <button
                      key={ss.value}
                      type="button"
                      onClick={() => setSeason(ss.value)}
                      className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all"
                      style={{
                        background:   season === ss.value ? `${ss.color}33` : "rgba(255,255,255,0.06)",
                        borderColor:  season === ss.value ? ss.color : "rgba(255,255,255,0.1)",
                        color:        season === ss.value ? ss.color : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {ss.icon} {s[ss.value]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-green-200 mb-1 font-medium">{s.location}</label>
                <div className="flex gap-2">
                  <input
                    placeholder={s.locPH}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 rounded-xl px-4 py-3 text-white placeholder-white/30 border border-white/10 outline-none focus:border-green-400 transition-all"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <button
                    type="button"
                    onClick={fetchWeather}
                    disabled={weatherLoading}
                    className="px-4 py-3 rounded-xl font-medium text-sm border border-yellow-400/40 text-yellow-300 transition-all hover:bg-yellow-400/10 disabled:opacity-50 whitespace-nowrap"
                    style={{ background: "rgba(251,191,36,0.08)" }}
                  >
                    {weatherLoading ? "⏳" : `🌦 ${s.fetch}`}
                  </button>
                </div>
                {weatherError && (
                  <p className="text-red-400 text-xs mt-1">⚠️ {weatherError}</p>
                )}
              </div>

              {/* Weather strip */}
              {weatherData && (
                <div
                  className="rounded-2xl p-4 border border-blue-400/20 text-sm"
                  style={{ background: "rgba(79,172,254,0.08)" }}
                >
                  <p className="text-blue-300 font-semibold mb-2">
                    🌍 {weatherData.location} — {weatherData.weather}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-white/70">
                    <div>
                      <p className="text-lg font-bold text-white">{weatherData.temperature}°C</p>
                      <p className="text-xs">{s.temp.replace("🌡️ ", "").replace(" (°C)", "")}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{weatherData.humidity}%</p>
                      <p className="text-xs">{s.humidity}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{weatherData.wind_speed} m/s</p>
                      <p className="text-xs">{s.wind}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Temp & Rainfall */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-green-200 mb-1 font-medium">{s.temp}</label>
                  <input
                    placeholder={s.tempPH}
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 border border-white/10 outline-none focus:border-green-400 transition-all"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-green-200 mb-1 font-medium">{s.rain}</label>
                  <input
                    placeholder={s.rainPH}
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 border border-white/10 outline-none focus:border-green-400 transition-all"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all disabled:opacity-60"
                style={{
                  background:  loading
                    ? "rgba(86,171,47,0.4)"
                    : "linear-gradient(135deg, #56ab2f, #a8e063)",
                  boxShadow: loading ? "none" : "0 0 30px rgba(86,171,47,0.4)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {s.analysing}
                  </span>
                ) : (
                  s.submit
                )}
              </button>
            </form>
          </div>

          {/* ── RESULT CARD ── */}
          <div
            className="rounded-3xl p-8 border border-white/10 shadow-2xl min-h-64 flex flex-col"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
          >
            <h2 className="text-xl font-semibold text-green-300 mb-6 flex items-center gap-2">
              {s.result}
            </h2>

            {/* Empty state */}
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-white/30 gap-4">
                <span className="text-6xl">🌿</span>
                <p className="text-sm whitespace-pre-line">{s.empty}</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                <p className="text-green-300 text-sm animate-pulse">{s.analysing}</p>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="space-y-5 flex-1">

                {/* English block — always shown */}
                <div
                  className="rounded-2xl p-5 border border-green-400/20"
                  style={{ background: "rgba(86,171,47,0.1)" }}
                >
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-2">
                    English
                  </p>
                  <p className="text-white text-lg leading-relaxed font-medium">
                    {result.english}
                  </p>
                </div>

                {/* Regional block — shown when language is not English */}
                {currentLang !== "en" && result.regional && (
                  <div
                    className="rounded-2xl p-5 border border-orange-400/20"
                    style={{ background: "rgba(251,146,60,0.08)" }}
                  >
                    <p className="text-xs text-orange-400 font-semibold uppercase tracking-widest mb-2">
                      {s.langLabel}
                    </p>
                    <p
                      className="text-white text-lg leading-relaxed"
                      style={{ fontFamily: "'Noto Sans', 'Noto Sans Devanagari', serif" }}
                    >
                      {result.regional}
                    </p>
                  </div>
                )}

                {/* Clear */}
                <button
                  onClick={() => setResult(null)}
                  className="w-full py-2 rounded-xl text-sm text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60 transition-all"
                >
                  {s.clear}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-10">
          Powered by OpenWeather · AI Agriculture Advisory
        </p>
      </div>
    </div>
    </div>
  );
}