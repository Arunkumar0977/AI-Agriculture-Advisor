'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// ─── Language Definitions ─────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', native: 'English'  },
  { code: 'hi', flag: '🇮🇳', native: 'हिंदी'     },
  { code: 'pa', flag: '🇮🇳', native: 'ਪੰਜਾਬੀ'    },
  { code: 'mr', flag: '🇮🇳', native: 'मराठी'     },
  { code: 'te', flag: '🇮🇳', native: 'తెలుగు'    },
  { code: 'ta', flag: '🇮🇳', native: 'தமிழ்'     },
  { code: 'kn', flag: '🇮🇳', native: 'ಕನ್ನಡ'     },
  { code: 'gu', flag: '🇮🇳', native: 'ગુજરાતી'   },
  { code: 'bn', flag: '🇮🇳', native: 'বাংলা'     },
  { code: 'ur', flag: '🇵🇰', native: 'اردو'      },
];

const UI: Record<string, Record<string, string>> = {
  en: {
    title: 'Crop Price Guide', subtitle: "Get today's market price for your crop",
    langLabel: 'Choose your language', locationLabel: 'Your Location',
    locationPlaceholder: 'Enter your village, district or state...',
    cropLabel: 'Crop Name', cropPlaceholder: 'e.g. Wheat, Rice, Tomato, Onion...',
    btnCheck: 'Check Price', checking: 'Fetching price...',
    resultTitle: 'Market Price Result', tryAnother: 'Check Another Crop',
    footerNote: '* Prices are AI estimates based on current market trends. Always verify at your local mandi.',
    errorTitle: 'Could not fetch price', errorRetry: 'Try Again', quickSelect: 'Quick select',
    avgLabel: 'Average Price', minLabel: 'Min Price', maxLabel: 'Max Price',
    adviceLabel: "Farmer's Advice", bestTimeLabel: 'Best Time to Sell', mandiLabel: 'Nearby Mandis',
  },
  hi: {
    title: 'फसल मूल्य गाइड', subtitle: 'अपनी फसल का आज का बाज़ार भाव जानें',
    langLabel: 'अपनी भाषा चुनें', locationLabel: 'आपका स्थान',
    locationPlaceholder: 'अपना गाँव, जिला या राज्य दर्ज करें...',
    cropLabel: 'फसल का नाम', cropPlaceholder: 'जैसे गेहूं, चावल, टमाटर, प्याज...',
    btnCheck: 'भाव जानें', checking: 'भाव खोजा जा रहा है...',
    resultTitle: 'बाज़ार भाव परिणाम', tryAnother: 'दूसरी फसल जाँचें',
    footerNote: '* कीमतें AI अनुमान हैं। अपनी स्थानीय मंडी में सत्यापित करें।',
    errorTitle: 'भाव नहीं मिला', errorRetry: 'फिर कोशिश करें', quickSelect: 'जल्दी चुनें',
    avgLabel: 'औसत मूल्य', minLabel: 'न्यूनतम मूल्य', maxLabel: 'अधिकतम मूल्य',
    adviceLabel: 'किसान सलाह', bestTimeLabel: 'बेचने का सही समय', mandiLabel: 'नजदीकी मंडी',
  },
  pa: {
    title: 'ਫ਼ਸਲ ਭਾਅ ਗਾਈਡ', subtitle: 'ਆਪਣੀ ਫ਼ਸਲ ਦਾ ਅੱਜ ਦਾ ਬਾਜ਼ਾਰ ਭਾਅ ਜਾਣੋ',
    langLabel: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ', locationLabel: 'ਤੁਹਾਡੀ ਜਗ੍ਹਾ',
    locationPlaceholder: 'ਆਪਣਾ ਪਿੰਡ, ਜ਼ਿਲ੍ਹਾ ਜਾਂ ਸੂਬਾ ਦਰਜ ਕਰੋ...',
    cropLabel: 'ਫ਼ਸਲ ਦਾ ਨਾਮ', cropPlaceholder: 'ਜਿਵੇਂ ਕਣਕ, ਚਾਵਲ, ਟਮਾਟਰ...',
    btnCheck: 'ਭਾਅ ਜਾਣੋ', checking: 'ਭਾਅ ਲੱਭਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
    resultTitle: 'ਬਾਜ਼ਾਰ ਭਾਅ ਨਤੀਜਾ', tryAnother: 'ਹੋਰ ਫ਼ਸਲ ਜਾਂਚੋ',
    footerNote: '* ਕੀਮਤਾਂ AI ਅਨੁਮਾਨ ਹਨ। ਮੰਡੀ ਵਿੱਚ ਜਾਂਚ ਕਰੋ।',
    errorTitle: 'ਭਾਅ ਨਹੀਂ ਮਿਲਿਆ', errorRetry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼', quickSelect: 'ਜਲਦੀ ਚੁਣੋ',
    avgLabel: 'ਔਸਤ ਭਾਅ', minLabel: 'ਘੱਟੋ-ਘੱਟ ਭਾਅ', maxLabel: 'ਵੱਧ ਤੋਂ ਵੱਧ ਭਾਅ',
    adviceLabel: 'ਕਿਸਾਨ ਸਲਾਹ', bestTimeLabel: 'ਵੇਚਣ ਦਾ ਸਹੀ ਸਮਾਂ', mandiLabel: 'ਨੇੜੇ ਦੀ ਮੰਡੀ',
  },
  mr: {
    title: 'पीक भाव मार्गदर्शक', subtitle: 'आजचा तुमच्या पिकाचा बाजार भाव जाणून घ्या',
    langLabel: 'तुमची भाषा निवडा', locationLabel: 'तुमचे स्थान',
    locationPlaceholder: 'तुमचे गाव, जिल्हा किंवा राज्य...',
    cropLabel: 'पिकाचे नाव', cropPlaceholder: 'उदा. गहू, तांदूळ, टोमॅटो...',
    btnCheck: 'भाव तपासा', checking: 'भाव शोधला जात आहे...',
    resultTitle: 'बाजार भाव निकाल', tryAnother: 'दुसरे पीक तपासा',
    footerNote: '* किंमती AI अंदाज आहेत. मंडईत सत्यापित करा.',
    errorTitle: 'भाव मिळाला नाही', errorRetry: 'पुन्हा प्रयत्न करा', quickSelect: 'लवकर निवडा',
    avgLabel: 'सरासरी भाव', minLabel: 'किमान भाव', maxLabel: 'कमाल भाव',
    adviceLabel: 'शेतकरी सल्ला', bestTimeLabel: 'विकण्याची योग्य वेळ', mandiLabel: 'जवळची मंडी',
  },
  te: {
    title: 'పంట ధర గైడ్', subtitle: 'మీ పంటకు నేటి మార్కెట్ ధర తెలుసుకోండి',
    langLabel: 'మీ భాషను ఎంచుకోండి', locationLabel: 'మీ స్థానం',
    locationPlaceholder: 'మీ గ్రామం, జిల్లా లేదా రాష్ట్రం...',
    cropLabel: 'పంట పేరు', cropPlaceholder: 'ఉదా. గోధుమ, వరి, టమాటా...',
    btnCheck: 'ధర తనిఖీ చేయండి', checking: 'ధర వెతుకుతోంది...',
    resultTitle: 'మార్కెట్ ధర ఫలితం', tryAnother: 'మరో పంట తనిఖీ',
    footerNote: '* ధరలు AI అంచనాలు. మండిలో ధృవీకరించండి.',
    errorTitle: 'ధర దొరకలేదు', errorRetry: 'మళ్ళీ ప్రయత్నించండి', quickSelect: 'త్వరగా ఎంచుకోండి',
    avgLabel: 'సగటు ధర', minLabel: 'కనిష్ట ధర', maxLabel: 'గరిష్ట ధర',
    adviceLabel: 'రైతు సలహా', bestTimeLabel: 'అమ్మడానికి సరైన సమయం', mandiLabel: 'సమీప మండీలు',
  },
  ta: {
    title: 'பயிர் விலை வழிகாட்டி', subtitle: 'உங்கள் பயிரின் இன்றைய சந்தை விலை அறிக',
    langLabel: 'உங்கள் மொழியை தேர்வு செய்க', locationLabel: 'உங்கள் இடம்',
    locationPlaceholder: 'உங்கள் கிராமம், மாவட்டம் அல்லது மாநிலம்...',
    cropLabel: 'பயிர் பெயர்', cropPlaceholder: 'எ.கா. கோதுமை, அரிசி, தக்காளி...',
    btnCheck: 'விலை சரிபார்க்க', checking: 'விலை தேடுகிறது...',
    resultTitle: 'சந்தை விலை முடிவு', tryAnother: 'மற்றொரு பயிர் சரிபார்க்க',
    footerNote: '* விலைகள் AI மதிப்பீடுகள். மண்டியில் சரிபார்க்கவும்.',
    errorTitle: 'விலை கிடைக்கவில்லை', errorRetry: 'மீண்டும் முயற்சிக்கவும்', quickSelect: 'விரைவாக தேர்வு',
    avgLabel: 'சராசரி விலை', minLabel: 'குறைந்தபட்ச விலை', maxLabel: 'அதிகபட்ச விலை',
    adviceLabel: 'விவசாயி ஆலோசனை', bestTimeLabel: 'விற்க சரியான நேரம்', mandiLabel: 'அருகிலுள்ள மண்டி',
  },
  kn: {
    title: 'ಬೆಳೆ ಬೆಲೆ ಮಾರ್ಗದರ್ಶಿ', subtitle: 'ನಿಮ್ಮ ಬೆಳೆಯ ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ತಿಳಿಯಿರಿ',
    langLabel: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ', locationLabel: 'ನಿಮ್ಮ ಸ್ಥಳ',
    locationPlaceholder: 'ನಿಮ್ಮ ಗ್ರಾಮ, ಜಿಲ್ಲೆ ಅಥವಾ ರಾಜ್ಯ...',
    cropLabel: 'ಬೆಳೆಯ ಹೆಸರು', cropPlaceholder: 'ಉದಾ. ಗೋಧಿ, ಅಕ್ಕಿ, ಟೊಮೆಟೊ...',
    btnCheck: 'ಬೆಲೆ ಪರಿಶೀಲಿಸಿ', checking: 'ಬೆಲೆ ಹುಡುಕುತ್ತಿದೆ...',
    resultTitle: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಫಲಿತಾಂಶ', tryAnother: 'ಮತ್ತೊಂದು ಬೆಳೆ ಪರಿಶೀಲಿಸಿ',
    footerNote: '* ಬೆಲೆಗಳು AI ಅಂದಾಜುಗಳು. ಮಂಡಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.',
    errorTitle: 'ಬೆಲೆ ಸಿಗಲಿಲ್ಲ', errorRetry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', quickSelect: 'ತ್ವರಿತ ಆಯ್ಕೆ',
    avgLabel: 'ಸರಾಸರಿ ಬೆಲೆ', minLabel: 'ಕನಿಷ್ಠ ಬೆಲೆ', maxLabel: 'ಗರಿಷ್ಠ ಬೆಲೆ',
    adviceLabel: 'ರೈತ ಸಲಹೆ', bestTimeLabel: 'ಮಾರಾಟಕ್ಕೆ ಉತ್ತಮ ಸಮಯ', mandiLabel: 'ಹತ್ತಿರದ ಮಂಡಿ',
  },
  gu: {
    title: 'પાક ભાવ માર્ગદર્શિકા', subtitle: 'તમારા પાકનો આજનો બજાર ભાવ જાણો',
    langLabel: 'તમારી ભાષા પસંદ કરો', locationLabel: 'તમારું સ્થળ',
    locationPlaceholder: 'તમારું ગામ, જિલ્લો અથવા રાજ્ય...',
    cropLabel: 'પાકનું નામ', cropPlaceholder: 'જેમ કે ઘઉં, ચોખા, ટામેટા...',
    btnCheck: 'ભાવ તપાસો', checking: 'ભાવ શોધવામાં આવી રહ્યો છે...',
    resultTitle: 'બજાર ભાવ પરિણામ', tryAnother: 'બીજો પાક તપાસો',
    footerNote: '* ભાવ AI અંદાજ છે. સ્થાનિક મંડીમાં ચકાસો.',
    errorTitle: 'ભાવ મળ્યો નહીં', errorRetry: 'ફરી પ્રયાસ કરો', quickSelect: 'ઝડપી પસંદ',
    avgLabel: 'સરેરાશ ભાવ', minLabel: 'ઓછામાં ઓછો ભાવ', maxLabel: 'વધુમાં વધુ ભાવ',
    adviceLabel: 'ખેડૂત સલાહ', bestTimeLabel: 'વેચવાનો સારો સમય', mandiLabel: 'નજીકની મંડી',
  },
  bn: {
    title: 'ফসলের মূল্য গাইড', subtitle: 'আপনার ফসলের আজকের বাজার মূল্য জানুন',
    langLabel: 'আপনার ভাষা বেছে নিন', locationLabel: 'আপনার অবস্থান',
    locationPlaceholder: 'আপনার গ্রাম, জেলা বা রাজ্য লিখুন...',
    cropLabel: 'ফসলের নাম', cropPlaceholder: 'যেমন গম, চাল, টমেটো...',
    btnCheck: 'মূল্য জানুন', checking: 'মূল্য খোঁজা হচ্ছে...',
    resultTitle: 'বাজার মূল্য ফলাফল', tryAnother: 'অন্য ফসল দেখুন',
    footerNote: '* দাম AI অনুমান। স্থানীয় মান্ডিতে যাচাই করুন।',
    errorTitle: 'মূল্য পাওয়া যায়নি', errorRetry: 'আবার চেষ্টা করুন', quickSelect: 'দ্রুত নির্বাচন',
    avgLabel: 'গড় মূল্য', minLabel: 'সর্বনিম্ন মূল্য', maxLabel: 'সর্বোচ্চ মূল্য',
    adviceLabel: 'কৃষকের পরামর্শ', bestTimeLabel: 'বিক্রির সেরা সময়', mandiLabel: 'কাছের মান্ডি',
  },
  ur: {
    title: 'فصل قیمت گائیڈ', subtitle: 'اپنی فصل کی آج کی منڈی قیمت جانیں',
    langLabel: 'اپنی زبان منتخب کریں', locationLabel: 'آپ کا مقام',
    locationPlaceholder: 'اپنا گاؤں، ضلع یا صوبہ درج کریں...',
    cropLabel: 'فصل کا نام', cropPlaceholder: 'مثلاً گندم، چاول، ٹماٹر...',
    btnCheck: 'قیمت چیک کریں', checking: 'قیمت تلاش کی جا رہی ہے...',
    resultTitle: 'منڈی قیمت نتیجہ', tryAnother: 'دوسری فصل چیک کریں',
    footerNote: '* قیمتیں AI تخمینے ہیں۔ مقامی منڈی میں تصدیق کریں۔',
    errorTitle: 'قیمت نہیں ملی', errorRetry: 'دوبارہ کوشش کریں', quickSelect: 'جلدی منتخب کریں',
    avgLabel: 'اوسط قیمت', minLabel: 'کم از کم قیمت', maxLabel: 'زیادہ سے زیادہ قیمت',
    adviceLabel: 'کسان مشورہ', bestTimeLabel: 'بیچنے کا بہترین وقت', mandiLabel: 'قریبی منڈیاں',
  },
};

const QUICK_CROPS = [
  { emoji: '🌾', name: 'Wheat'    }, { emoji: '🌾', name: 'Rice'     },
  { emoji: '🌽', name: 'Maize'    }, { emoji: '🍅', name: 'Tomato'   },
  { emoji: '🧅', name: 'Onion'    }, { emoji: '🥔', name: 'Potato'   },
  { emoji: '🫘', name: 'Soybean'  }, { emoji: '🌻', name: 'Mustard'  },
  { emoji: '🌱', name: 'Cotton'   }, { emoji: '🍬', name: 'Sugarcane'},
];

interface PriceResult {
  cropName: string; location: string; minPrice: string; maxPrice: string;
  avgPrice: string; unit: string; trend: string; trendEmoji: string;
  advice: string; bestTime: string; nearbyMandis: string[]; summary: string;
}

export default function CropPricePage() {
  const [lang, setLang]               = useState('en');
  const [location, setLocation]       = useState('');
  const [crop, setCrop]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState<PriceResult | null>(null);
  const [error, setError]             = useState('');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const t   = UI[lang] ?? UI.en;
  const rtl = lang === 'ur';
  const cl  = LANGUAGES.find(l => l.code === lang)!;

  const handleSubmit = async () => {
    if (!location.trim() || !crop.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/crop-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: location.trim(), crop: crop.trim(), lang }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch { setError(t.errorTitle); }
    finally { setLoading(false); }
  };

  const canSubmit = !loading && location.trim() && crop.trim();

 
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '16px 18px', fontSize: 16, borderRadius: 14,
    border: '2px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.09)',
    color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} style={{
      minHeight: '100vh',
      background: 'linear-gradient(155deg,#162a0e 0%,#254d12 45%,#3a6e20 100%)',
      fontFamily: "'Noto Sans','Segoe UI',sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingBottom: 60, position: 'relative', 
    }}>
     
      <div style={{ position:'absolute', inset:0, opacity:0.035,
        backgroundImage:'radial-gradient(#fff 1px,transparent 1px)',
        backgroundSize:'48px 48px', pointerEvents:'none' }} />
     
      <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(180,230,60,0.15),transparent 70%)', pointerEvents:'none' }} />

      {/* ── Nav bar ── */}
      <nav style={{ width:'100%', background:'rgba(0,0,0,0.28)', backdropFilter:'blur(10px)',
        padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid rgba(255,255,255,0.09)', position:'sticky', top:0, zIndex:100 }}>

             <div className='left' style={{ display: 'flex', alignItems: 'center', color:'white', gap:8 }}>
                <Image src={'/logo.svg'} alt='logo' width={30} height={30}/>
                <h2 className='font-bold'>MY-AGRI-APP</h2>
              </div>
              <div className="right-side" style={{ cursor:' pointer', color:'white', justifyContent: 'flex-end' }}>
                <Link href='/'>
                <Button className="cursor-pointer bg-green-915 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300">HOME</Button>
                </Link>
              </div>  
          
       

        {/* Language toggle */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowLangPicker(v => !v)} style={{
            background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.22)',
            borderRadius:24, padding:'8px 16px', color:'#e8f8c8', fontSize:14,
            cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontFamily:'inherit',
          }}>
            <span style={{ fontSize:20 }}>{cl.flag}</span>
            <span style={{ fontWeight:600 }}>{cl.native}</span>
            <span style={{ fontSize:10, opacity:0.6 }}>▼</span>
          </button>

          {showLangPicker && (
            <>
              
              <div onClick={() => setShowLangPicker(false)}
                style={{ position:'fixed', inset:0, zIndex:149 }} />
              <div style={{
                position:'absolute', top:'calc(100% + 8px)',
                [rtl ? 'left' : 'right']: 0,
                width:230, background:'#1a3d0a',
                border:'1px solid rgba(255,255,255,0.14)', borderRadius:18,
                overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.55)', zIndex:200,
              }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setShowLangPicker(false); }} style={{
                    width:'100%', display:'flex', alignItems:'center', gap:10, padding:'12px 16px',
                    background: lang===l.code ? 'rgba(120,210,50,0.18)' : 'none',
                    border:'none', borderBottom:'1px solid rgba(255,255,255,0.06)',
                    color: lang===l.code ? '#b8f06e' : '#cde8a0',
                    cursor:'pointer', fontSize:14, fontFamily:'inherit', textAlign:'left',
                  }}>
                    <span style={{ fontSize:20 }}>{l.flag}</span>
                    <span style={{ flex:1 }}>{l.native}</span>
                    {lang===l.code && <span style={{ color:'#7ddb3c', fontWeight:700 }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </nav>

      <div style={{ width:'100%', maxWidth:560, padding:'0 16px' }}>

        {/* Hero */}
        <div style={{ textAlign:'center', padding:'32px 0 24px' }}>
          <div style={{ fontSize:60, lineHeight:1, marginBottom:10 }}>🌾</div>
          <h1 style={{ color:'#e8f8c8', fontSize:28, fontWeight:900, margin:0,
            textShadow:'0 2px 16px rgba(0,0,0,0.5)', letterSpacing:'-0.01em' }}>{t.title}</h1>
          <p style={{ color:'#a8d870', fontSize:15, margin:'8px 0 0' }}>{t.subtitle}</p>
        </div>

        {/* ── Input Form ── */}
        {!result && !error && (
          <div style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(24px)',
            border:'1px solid rgba(255,255,255,0.13)', borderRadius:24,
            padding:'26px 22px', boxShadow:'0 12px 48px rgba(0,0,0,0.35)' }}>

            {/* Location */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', color:'#b8e890', fontSize:14, fontWeight:700, marginBottom:8 }}>
                📍 {t.locationLabel}
              </label>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder={t.locationPlaceholder} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(140,220,60,0.65)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')} />
            </div>

            {/* Crop */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', color:'#b8e890', fontSize:14, fontWeight:700, marginBottom:8 }}>
                🌱 {t.cropLabel}
              </label>
              <input value={crop} onChange={e => setCrop(e.target.value)}
                placeholder={t.cropPlaceholder} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(140,220,60,0.65)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')} />
            </div>

            {/* Quick chips */}
            <div style={{ marginBottom:22 }}>
              <div style={{ color:'#7aaa50', fontSize:11, textTransform:'uppercase',
                letterSpacing:'0.1em', marginBottom:10 }}>{t.quickSelect}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {QUICK_CROPS.map(c => (
                  <button key={c.name} onClick={() => setCrop(c.name)} style={{
                    background: crop===c.name ? 'rgba(120,210,40,0.28)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${crop===c.name ? 'rgba(140,220,60,0.6)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius:20, padding:'8px 14px', color: crop===c.name ? '#b8f06e' : '#cde8a0',
                    fontSize:14, cursor:'pointer', fontFamily:'inherit',
                    display:'flex', alignItems:'center', gap:6, transition:'all 0.15s',
                  }}>
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={!canSubmit} style={{
              width:'100%', padding:'18px', fontSize:18, fontWeight:800, borderRadius:16,
              border:'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
              background: canSubmit
                ? 'linear-gradient(135deg,#7ac520 0%,#4a9a10 100%)'
                : 'rgba(120,180,60,0.25)',
              color:'#fff', fontFamily:'inherit', letterSpacing:'0.02em',
              boxShadow: canSubmit ? '0 4px 24px rgba(100,180,30,0.45)' : 'none',
              transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            }}>
              {loading ? (
                <>
                  <span style={{ width:22, height:22, border:'2.5px solid rgba(255,255,255,0.25)',
                    borderTopColor:'#fff', borderRadius:'50%', display:'inline-block',
                    animation:'spin 0.8s linear infinite' }} />
                  {t.checking}
                </>
              ) : <>{t.btnCheck} 🔍</>}
            </button>
          </div>
        )}

        
        {error && (
          <div style={{ background:'rgba(220,60,60,0.12)', border:'1px solid rgba(255,100,100,0.28)',
            borderRadius:22, padding:'28px 24px', textAlign:'center' }}>
            <div style={{ fontSize:44, marginBottom:10 }}>😔</div>
            <div style={{ color:'#ffb0b0', fontSize:17, fontWeight:700, marginBottom:20 }}>{error}</div>
            <button onClick={() => { setError(''); setResult(null); }} style={{
              background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:14, padding:'12px 28px', color:'#fff', fontSize:15,
              cursor:'pointer', fontFamily:'inherit', fontWeight:700,
            }}>{t.errorRetry}</button>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ textAlign:'center', paddingBottom:4 }}>
              <h2 style={{ color:'#b8f06e', fontSize:21, fontWeight:900, margin:0 }}>{t.resultTitle}</h2>
              <p style={{ color:'#7aaa50', fontSize:13, margin:'4px 0 0' }}>
                {result.cropName} · {result.location}
              </p>
            </div>

            {/* Price card */}
            <div style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(24px)',
              border:'1px solid rgba(255,255,255,0.13)', borderRadius:24,
              padding:'24px 22px', boxShadow:'0 12px 48px rgba(0,0,0,0.35)' }}>

              {/* Avg big */}
              <div style={{ textAlign:'center', marginBottom:22 }}>
                <div style={{ color:'#7aaa50', fontSize:11, textTransform:'uppercase',
                  letterSpacing:'0.12em', marginBottom:4 }}>{t.avgLabel} / {result.unit}</div>
                <div style={{ color:'#e8f8c8', fontSize:52, fontWeight:900,
                  letterSpacing:'-0.02em', lineHeight:1 }}>₹{result.avgPrice}</div>
                <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:6,
                  background:'rgba(255,255,255,0.1)', borderRadius:20, padding:'5px 16px' }}>
                  <span style={{ fontSize:16 }}>{result.trendEmoji}</span>
                  <span style={{ color:'#c8e6a0', fontSize:14, fontWeight:600 }}>{result.trend}</span>
                </div>
              </div>

              {/* Min / Max */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                {[
                  { label:t.minLabel, val:`₹${result.minPrice}`, color:'#ff9060', bg:'rgba(255,100,50,0.1)', icon:'📉' },
                  { label:t.maxLabel, val:`₹${result.maxPrice}`, color:'#7de060', bg:'rgba(80,200,40,0.1)', icon:'📈' },
                ].map(item => (
                  <div key={item.label} style={{ background:item.bg,
                    border:`1px solid ${item.color}33`, borderRadius:16, padding:'14px', textAlign:'center' }}>
                    <div style={{ fontSize:24, marginBottom:4 }}>{item.icon}</div>
                    <div style={{ color:'rgba(255,255,255,0.55)', fontSize:11,
                      textTransform:'uppercase', letterSpacing:'0.08em' }}>{item.label}</div>
                    <div style={{ color:item.color, fontSize:24, fontWeight:900, marginTop:3 }}>{item.val}</div>
                    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>per {result.unit}</div>
                  </div>
                ))}
              </div>

              {/* Advice */}
              <div style={{ background:'rgba(120,200,50,0.11)', border:'1px solid rgba(120,200,50,0.22)',
                borderRadius:16, padding:'14px 16px', marginBottom:12 }}>
                <div style={{ color:'#a8d870', fontSize:11, textTransform:'uppercase',
                  letterSpacing:'0.09em', marginBottom:6 }}>💡 {t.adviceLabel}</div>
                <p style={{ color:'#d8f0a0', fontSize:14, lineHeight:1.65, margin:0 }}>{result.advice}</p>
              </div>

              {/* Best time */}
              <div style={{ background:'rgba(255,180,50,0.09)', border:'1px solid rgba(255,180,50,0.2)',
                borderRadius:16, padding:'14px 16px', marginBottom:12 }}>
                <div style={{ color:'#f0c060', fontSize:11, textTransform:'uppercase',
                  letterSpacing:'0.09em', marginBottom:5 }}>🕐 {t.bestTimeLabel}</div>
                <p style={{ color:'#ffe8a0', fontSize:14, lineHeight:1.55, margin:0 }}>{result.bestTime}</p>
              </div>

              {/* Nearby mandis */}
              {result.nearbyMandis?.length > 0 && (
                <div style={{ background:'rgba(80,160,240,0.09)', border:'1px solid rgba(80,160,240,0.18)',
                  borderRadius:16, padding:'14px 16px', marginBottom:12 }}>
                  <div style={{ color:'#80c0f0', fontSize:11, textTransform:'uppercase',
                    letterSpacing:'0.09em', marginBottom:8 }}>🏪 {t.mandiLabel}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {result.nearbyMandis.map((m, i) => (
                      <span key={i} style={{ background:'rgba(80,160,240,0.14)',
                        border:'1px solid rgba(80,160,240,0.24)', borderRadius:20,
                        padding:'5px 12px', color:'#b0d8ff', fontSize:13 }}>📍 {m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:14 }}>
                <p style={{ color:'rgba(200,230,160,0.75)', fontSize:13, lineHeight:1.7, margin:0 }}>
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Back button */}
            <button onClick={() => { setResult(null); setError(''); }} style={{
              width:'100%', padding:'16px', fontSize:16, fontWeight:700, borderRadius:16,
              border:'2px solid rgba(255,255,255,0.18)', background:'rgba(255,255,255,0.05)',
              color:'#c8e6a0', cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em',
            }}>← {t.tryAnother}</button>
          </div>
        )}

        <p style={{ color:'rgba(180,230,100,0.4)', fontSize:11, textAlign:'center',
          marginTop:24, lineHeight:1.6, padding:'0 8px' }}>{t.footerNote}</p>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(200,230,160,0.38); }
      `}</style>
    </div>
  );
}