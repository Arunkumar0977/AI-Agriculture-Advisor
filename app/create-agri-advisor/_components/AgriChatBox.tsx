"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send, Mic, ChevronRight, ChevronDown, Globe } from "lucide-react";
import axios from "axios";
import FinalUi from "./FinalUi";
import { useUser } from "@clerk/nextjs";


// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
  weatherData?: WeatherInfo;
};

export type AdvisoryInfo = {
  crop: string;
  growth_stage: string;
  problem: string;
  location: string;
  price: string;
  date: string;
  unit: string;
  recommendations: {
    fertilizers: { name: string; quantity: string; application_method: string }[];
    pest_control: { pest_name: string; treatment: string; precautions: string }[];
    irrigation_schedule: string;
    weather_advice: string;
    yield_tips: string;
  };
};

type WeatherInfo = {
  location: string;
  temperature: number;
  humidity: number;
  pressure: number;
  weather: string;
  description: string;
  wind_speed: number;
};

interface APIResponse {
  resp?: string;
  ui?: string;
  advisory?: AdvisoryInfo;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "English",  label: "English",   native: "English",   flag: "🇬🇧" },
  { code: "हिंदी",   label: "Hindi",     native: "हिंदी",    flag: "🇮🇳" },
  { code: "मराठी",   label: "Marathi",   native: "मराठी",    flag: "🇮🇳" },
  { code: "ਪੰਜਾਬੀ",  label: "Punjabi",   native: "ਪੰਜਾਬੀ",   flag: "🇮🇳" },
  { code: "తెలుగు",  label: "Telugu",    native: "తెలుగు",   flag: "🇮🇳" },
  { code: "বাংলা",   label: "Bengali",   native: "বাংলা",    flag: "🇮🇳" },
  { code: "ગુજરાતી", label: "Gujarati",  native: "ગુજરાતી",  flag: "🇮🇳" },
  { code: "ಕನ್ನಡ",  label: "Kannada",   native: "ಕನ್ನಡ",   flag: "🇮🇳" },
  { code: "தமிழ்",  label: "Tamil",     native: "தமிழ்",    flag: "🇮🇳" },
  { code: "മലയാളം", label: "Malayalam",  native: "മലയാളം",  flag: "🇮🇳" },
];

// ─── All UI text translated per language ─────────────────────────────────────

type LangStrings = {
  greeting: string;
  mainMenuLabel: string;
  cropAdvisory: string;
  weather: string;
  pestControl: string;
  selectCrop: string;
  growthStageLabel: string;
  problemTypeLabel: string;
  farmLocation: string;
  locationPlaceholder: string;
  submit: string;
  inputPlaceholder: string;
  onlineStatus: string;
  subtitle: string;
  advisorySteps: string[];
  shortcuts: { label: string; query: string; icon: string }[];
  weatherFetchError: string;
  generalError: string;
  weatherCardLabels: { humidity: string; wind: string; pressure: string };
  weatherIntro: string;
  viewButton: string;
};

const LANG_STRINGS: Record<string, LangStrings> = {
  English: {
    greeting: "🙏 Namaste! I'm your Agri Advisor. What would you like help with today?",
    mainMenuLabel: "Choose an option:",
    cropAdvisory: "Crop Advisory",
    weather: "Weather",
    pestControl: "Pest Control",
    selectCrop: "Select your crop:",
    growthStageLabel: "Growth stage:",
    problemTypeLabel: "Problem type:",
    farmLocation: "📍 Farm location:",
    locationPlaceholder: "District, State...",
    submit: "Submit",
    inputPlaceholder: "Ask about crops, weather, or farming...",
    onlineStatus: "Online",
    subtitle: "Smart farming advisor · किसान सहायक",
    advisorySteps: ["Language", "Crop", "Stage", "Problem", "Location"],
    shortcuts: [
      { label: "My weather",  query: "Weather in my area",                icon: "🌤️" },
      { label: "Pest help",   query: "How to control aphids on wheat?",   icon: "🐛" },
      { label: "Fertilizer",  query: "Best fertilizer for wheat crop",    icon: "🧪" },
      { label: "Irrigation",  query: "Irrigation schedule for my crop",   icon: "💧" },
    ],
    weatherFetchError: "❌ Unable to fetch weather. Please try again.",
    generalError: "❌ Something went wrong. Please try again.",
    weatherCardLabels: { humidity: "Humidity", wind: "Wind", pressure: "Pressure" },
    weatherIntro: "Here's the weather update for",
    viewButton: "View Advisory",
  },
  "हिंदी": {
    greeting: "🙏 नमस्ते! मैं आपका कृषि सलाहकार हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
    mainMenuLabel: "एक विकल्प चुनें:",
    cropAdvisory: "फसल सलाह",
    weather: "मौसम",
    pestControl: "कीट नियंत्रण",
    selectCrop: "अपनी फसल चुनें:",
    growthStageLabel: "फसल की अवस्था:",
    problemTypeLabel: "समस्या का प्रकार:",
    farmLocation: "📍 खेत का स्थान:",
    locationPlaceholder: "जिला, राज्य...",
    submit: "जमा करें",
    inputPlaceholder: "फसल, मौसम, या खेती के बारे में पूछें...",
    onlineStatus: "ऑनलाइन",
    subtitle: "स्मार्ट कृषि सलाहकार · Kisan Mitra",
    advisorySteps: ["भाषा", "फसल", "अवस्था", "समस्या", "स्थान"],
    shortcuts: [
      { label: "मेरा मौसम",    query: "मेरे क्षेत्र का मौसम",           icon: "🌤️" },
      { label: "कीट सहायता",   query: "गेहूं पर एफिड्स कैसे नियंत्रित करें?", icon: "🐛" },
      { label: "उर्वरक",       query: "गेहूं की फसल के लिए सर्वोत्तम उर्वरक", icon: "🧪" },
      { label: "सिंचाई",       query: "मेरी फसल के लिए सिंचाई कार्यक्रम",    icon: "💧" },
    ],
    weatherFetchError: "❌ मौसम की जानकारी नहीं मिली। कृपया पुनः प्रयास करें।",
    generalError: "❌ कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    weatherCardLabels: { humidity: "नमी", wind: "हवा", pressure: "दबाव" },
    weatherIntro: "यहाँ मौसम की जानकारी है",
    viewButton: "सलाह देखें",
  },
  "मराठी": {
    greeting: "🙏 नमस्कार! मी तुमचा कृषी सल्लागार आहे. आज मी तुम्हाला कशात मदद करू?",
    mainMenuLabel: "एक पर्याय निवडा:",
    cropAdvisory: "पीक सल्ला",
    weather: "हवामान",
    pestControl: "कीड नियंत्रण",
    selectCrop: "तुमचे पीक निवडा:",
    growthStageLabel: "पिकाची अवस्था:",
    problemTypeLabel: "समस्येचा प्रकार:",
    farmLocation: "📍 शेताचे ठिकाण:",
    locationPlaceholder: "जिल्हा, राज्य...",
    submit: "सबमिट करा",
    inputPlaceholder: "पिके, हवामान किंवा शेतीबद्दल विचारा...",
    onlineStatus: "ऑनलाइन",
    subtitle: "स्मार्ट शेती सल्लागार · Kisan Mitra",
    advisorySteps: ["भाषा", "पीक", "अवस्था", "समस्या", "ठिकाण"],
    shortcuts: [
      { label: "माझे हवामान", query: "माझ्या परिसरातील हवामान",    icon: "🌤️" },
      { label: "कीड मदत",   query: "गव्हावर मावा कसे नियंत्रित करायचे?", icon: "🐛" },
      { label: "खत",        query: "गव्हासाठी सर्वोत्तम खत",      icon: "🧪" },
      { label: "सिंचन",     query: "माझ्या पिकासाठी सिंचन वेळापत्रक", icon: "💧" },
    ],
    weatherFetchError: "❌ हवामान माहिती मिळवता आली नाही. पुन्हा प्रयत्न करा.",
    generalError: "❌ काहीतरी चुकले. पुन्हा प्रयत्न करा.",
    weatherCardLabels: { humidity: "आर्द्रता", wind: "वारा", pressure: "दाब" },
    weatherIntro: "येथे हवामान अपडेट आहे",
    viewButton: "सल्ला पहा",
  },
  "ਪੰਜਾਬੀ": {
    greeting: "🙏 ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    mainMenuLabel: "ਇੱਕ ਵਿਕਲਪ ਚੁਣੋ:",
    cropAdvisory: "ਫਸਲ ਸਲਾਹ",
    weather: "ਮੌਸਮ",
    pestControl: "ਕੀਟ ਨਿਯੰਤਰਣ",
    selectCrop: "ਆਪਣੀ ਫਸਲ ਚੁਣੋ:",
    growthStageLabel: "ਵਿਕਾਸ ਅਵਸਥਾ:",
    problemTypeLabel: "ਸਮੱਸਿਆ ਦੀ ਕਿਸਮ:",
    farmLocation: "📍 ਖੇਤ ਦਾ ਸਥਾਨ:",
    locationPlaceholder: "ਜ਼ਿਲ੍ਹਾ, ਸੂਬਾ...",
    submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
    inputPlaceholder: "ਫਸਲਾਂ, ਮੌਸਮ ਜਾਂ ਖੇਤੀ ਬਾਰੇ ਪੁੱਛੋ...",
    onlineStatus: "ਆਨਲਾਈਨ",
    subtitle: "ਸਮਾਰਟ ਖੇਤੀ ਸਲਾਹਕਾਰ · Kisan Mitra",
    advisorySteps: ["ਭਾਸ਼ਾ", "ਫਸਲ", "ਅਵਸਥਾ", "ਸਮੱਸਿਆ", "ਸਥਾਨ"],
    shortcuts: [
      { label: "ਮੇਰਾ ਮੌਸਮ",  query: "ਮੇਰੇ ਖੇਤਰ ਦਾ ਮੌਸਮ",           icon: "🌤️" },
      { label: "ਕੀਟ ਮਦਦ",    query: "ਕਣਕ ਤੇ ਮਾਹੂ ਕਿਵੇਂ ਕੰਟਰੋਲ ਕਰੀਏ?", icon: "🐛" },
      { label: "ਖਾਦ",        query: "ਕਣਕ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ",       icon: "🧪" },
      { label: "ਸਿੰਚਾਈ",     query: "ਮੇਰੀ ਫਸਲ ਲਈ ਸਿੰਚਾਈ ਸਮਾਂ-ਸਾਰਣੀ",  icon: "💧" },
    ],
    weatherFetchError: "❌ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    generalError: "❌ ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    weatherCardLabels: { humidity: "ਨਮੀ", wind: "ਹਵਾ", pressure: "ਦਬਾਅ" },
    weatherIntro: "ਇੱਥੇ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਹੈ",
    viewButton: "ਸਲਾਹ ਦੇਖੋ",
  },
  "తెలుగు": {
    greeting: "🙏 నమస్కారం! నేను మీ వ్యవసాయ సలహాదారుడిని. ఈరోజు మీకు ఏ విషయంలో సహాయం కావాలి?",
    mainMenuLabel: "ఒక ఎంపికను ఎంచుకోండి:",
    cropAdvisory: "పంట సలహా",
    weather: "వాతావరణం",
    pestControl: "చీడ నియంత్రణ",
    selectCrop: "మీ పంటను ఎంచుకోండి:",
    growthStageLabel: "వృద్ధి దశ:",
    problemTypeLabel: "సమస్య రకం:",
    farmLocation: "📍 పొలం స్థానం:",
    locationPlaceholder: "జిల్లా, రాష్ట్రం...",
    submit: "సమర్పించు",
    inputPlaceholder: "పంటలు, వాతావరణం లేదా వ్యవసాయం గురించి అడగండి...",
    onlineStatus: "ఆన్‌లైన్",
    subtitle: "స్మార్ట్ వ్యవసాయ సలహాదారు · Kisan Mitra",
    advisorySteps: ["భాష", "పంట", "దశ", "సమస్య", "స్థానం"],
    shortcuts: [
      { label: "నా వాతావరణం", query: "నా ప్రాంతంలో వాతావరణం",          icon: "🌤️" },
      { label: "చీడ సహాయం",  query: "గోధుమపై పేను ఎలా నియంత్రించాలి?",  icon: "🐛" },
      { label: "ఎరువు",      query: "గోధుమ పంటకు ఉత్తమ ఎరువు",          icon: "🧪" },
      { label: "నీటిపారుదల", query: "నా పంటకు నీటిపారుదల షెడ్యూల్",    icon: "💧" },
    ],
    weatherFetchError: "❌ వాతావరణ సమాచారం లభించలేదు. మళ్ళీ ప్రయత్నించండి.",
    generalError: "❌ ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.",
    weatherCardLabels: { humidity: "తేమ", wind: "గాలి", pressure: "పీడనం" },
    weatherIntro: "వాతావరణ నవీకరణ ఇక్కడ ఉంది",
    viewButton: "సలహా చూడండి",
  },
  "বাংলা": {
    greeting: "🙏 নমস্কার! আমি আপনার কিসান মিত্র। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    mainMenuLabel: "একটি বিকল্প বেছে নিন:",
    cropAdvisory: "ফসল পরামর্শ",
    weather: "আবহাওয়া",
    pestControl: "কীটপতঙ্গ নিয়ন্ত্রণ",
    selectCrop: "আপনার ফসল নির্বাচন করুন:",
    growthStageLabel: "বৃদ্ধির পর্যায়:",
    problemTypeLabel: "সমস্যার ধরন:",
    farmLocation: "📍 খামারের অবস্থান:",
    locationPlaceholder: "জেলা, রাজ্য...",
    submit: "জমা দিন",
    inputPlaceholder: "ফসল, আবহাওয়া বা কৃষি সম্পর্কে জিজ্ঞাসা করুন...",
    onlineStatus: "অনলাইন",
    subtitle: "স্মার্ট কৃষি উপদেষ্টা · Kisan Mitra",
    advisorySteps: ["ভাষা", "ফসল", "পর্যায়", "সমস্যা", "অবস্থান"],
    shortcuts: [
      { label: "আমার আবহাওয়া", query: "আমার এলাকার আবহাওয়া",          icon: "🌤️" },
      { label: "কীট সাহায্য", query: "গমে মাছিমাকড় কীভাবে নিয়ন্ত্রণ করবেন?", icon: "🐛" },
      { label: "সার",        query: "গম ফসলের জন্য সেরা সার",             icon: "🧪" },
      { label: "সেচ",        query: "আমার ফসলের জন্য সেচের সময়সূচি",    icon: "💧" },
    ],
    weatherFetchError: "❌ আবহাওয়া তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।",
    generalError: "❌ কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
    weatherCardLabels: { humidity: "আর্দ্রতা", wind: "বাতাস", pressure: "চাপ" },
    weatherIntro: "আবহাওয়ার আপডেট এখানে",
    viewButton: "পরামর্শ দেখুন",
  },
  "ગુજરાતી": {
    greeting: "🙏 નમસ્તે! હું તમારો કૃષિ સલાહકાર છું. આજે તમને કઈ મદદની જરૂર છે?",
    mainMenuLabel: "એક વિકલ્પ પસંદ કરો:",
    cropAdvisory: "પાક સલાહ",
    weather: "હવામાન",
    pestControl: "જીવાત નિયંત્રણ",
    selectCrop: "તમારો પાક પસંદ કરો:",
    growthStageLabel: "વૃદ્ધિ તબક્કો:",
    problemTypeLabel: "સમસ્યાનો પ્રકાર:",
    farmLocation: "📍 ખેતરનું સ્થાન:",
    locationPlaceholder: "જિલ્લો, રાજ્ય...",
    submit: "સબમિટ કરો",
    inputPlaceholder: "પાક, હવામાન અથવા ખેતી વિશે પૂછો...",
    onlineStatus: "ઓનલાઇન",
    subtitle: "સ્માર્ટ ખેતી સલાહકાર · Kisan Mitra",
    advisorySteps: ["ભાષા", "પાક", "તબક્કો", "સમસ્યા", "સ્થાન"],
    shortcuts: [
      { label: "મારું હવામાન", query: "મારા વિસ્તારનું હવામાન",          icon: "🌤️" },
      { label: "જીવાત મદદ",  query: "ઘઉં પર ​​મૉળો કેવી રીતે નિયંત્રિત કરવો?", icon: "🐛" },
      { label: "ખાતર",       query: "ઘઉંના પાક માટે શ્રેષ્ઠ ખાતર",      icon: "🧪" },
      { label: "સિંચાઈ",     query: "મારા પાક માટે સિંચાઈ સમયપત્રક",    icon: "💧" },
    ],
    weatherFetchError: "❌ હવામાન માહિતી મળી ન શકી. ફરી પ્રયાસ કરો.",
    generalError: "❌ કંઈક ખોટું થઈ ગયું. ફરી પ્રયાસ કરો.",
    weatherCardLabels: { humidity: "ભેજ", wind: "પવન", pressure: "દબાણ" },
    weatherIntro: "અહીં હવામાન અપડેટ છે",
    viewButton: "સલાહ જુઓ",
  },
  "ಕನ್ನಡ": {
    greeting: "🙏 ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಲಹೆಗಾರ. ಇಂದು ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?",
    mainMenuLabel: "ಒಂದು ಆಯ್ಕೆ ಆರಿಸಿ:",
    cropAdvisory: "ಬೆಳೆ ಸಲಹೆ",
    weather: "ಹವಾಮಾನ",
    pestControl: "ಕೀಟ ನಿಯಂತ್ರಣ",
    selectCrop: "ನಿಮ್ಮ ಬೆಳೆ ಆರಿಸಿ:",
    growthStageLabel: "ಬೆಳವಣಿಗೆ ಹಂತ:",
    problemTypeLabel: "ಸಮಸ್ಯೆಯ ವಿಧ:",
    farmLocation: "📍 ಜಮೀನಿನ ಸ್ಥಳ:",
    locationPlaceholder: "ಜಿಲ್ಲೆ, ರಾಜ್ಯ...",
    submit: "ಸಲ್ಲಿಸು",
    inputPlaceholder: "ಬೆಳೆಗಳು, ಹವಾಮಾನ ಅಥವಾ ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ...",
    onlineStatus: "ಆನ್‌ಲೈನ್",
    subtitle: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಲಹೆಗಾರ · Kisan Mitra",
    advisorySteps: ["ಭಾಷೆ", "ಬೆಳೆ", "ಹಂತ", "ಸಮಸ್ಯೆ", "ಸ್ಥಳ"],
    shortcuts: [
      { label: "ನನ್ನ ಹವಾಮಾನ", query: "ನನ್ನ ಪ್ರದೇಶದ ಹವಾಮಾನ",             icon: "🌤️" },
      { label: "ಕೀಟ ಸಹಾಯ",    query: "ಗೋಧಿಯ ಮೇಲೆ ಗಿಡಹೇನು ಹೇಗೆ ನಿಯಂತ್ರಿಸುವುದು?", icon: "🐛" },
      { label: "ಗೊಬ್ಬರ",      query: "ಗೋಧಿ ಬೆಳೆಗೆ ಉತ್ತಮ ಗೊಬ್ಬರ",          icon: "🧪" },
      { label: "ನೀರಾವರಿ",     query: "ನನ್ನ ಬೆಳೆಗೆ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ",     icon: "💧" },
    ],
    weatherFetchError: "❌ ಹವಾಮಾನ ಮಾಹಿತಿ ಪಡೆಯಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    generalError: "❌ ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    weatherCardLabels: { humidity: "ಆರ್ದ್ರತೆ", wind: "ಗಾಳಿ", pressure: "ಒತ್ತಡ" },
    weatherIntro: "ಇಲ್ಲಿ ಹವಾಮಾನ ಅಪ್‌ಡೇಟ್ ಇದೆ",
    viewButton: "ಸಲಹೆ ನೋಡಿ",
  },
  "தமிழ்": {
    greeting: "🙏 நமஸ்காரம்! நான் உங்கள் வேளாண் ஆலோசகர். இன்று உங்களுக்கு என்ன உதவி வேண்டும்?",
    mainMenuLabel: "ஒரு விருப்பத்தை தேர்ந்தெடுக்கவும்:",
    cropAdvisory: "பயிர் ஆலோசனை",
    weather: "வானிலை",
    pestControl: "பூச்சி கட்டுப்பாடு",
    selectCrop: "உங்கள் பயிரை தேர்ந்தெடுக்கவும்:",
    growthStageLabel: "வளர்ச்சி நிலை:",
    problemTypeLabel: "சிக்கல் வகை:",
    farmLocation: "📍 பண்ணை இடம்:",
    locationPlaceholder: "மாவட்டம், மாநிலம்...",
    submit: "சமர்ப்பி",
    inputPlaceholder: "பயிர்கள், வானிலை அல்லது வேளாண்மை பற்றி கேளுங்கள்...",
    onlineStatus: "ஆன்லைன்",
    subtitle: "ஸ்மார்ட் விவசாய ஆலோசகர் · Kisan Mitra",
    advisorySteps: ["மொழி", "பயிர்", "நிலை", "சிக்கல்", "இடம்"],
    shortcuts: [
      { label: "என் வானிலை",   query: "என் பகுதியில் வானிலை",               icon: "🌤️" },
      { label: "பூச்சி உதவி",  query: "கோதுமையில் அசுவினி எவ்வாறு கட்டுப்படுத்துவது?", icon: "🐛" },
      { label: "உரம்",         query: "கோதுமை பயிருக்கு சிறந்த உரம்",        icon: "🧪" },
      { label: "நீர்ப்பாசனம்", query: "என் பயிருக்கு நீர்ப்பாசன அட்டவணை",   icon: "💧" },
    ],
    weatherFetchError: "❌ வானிலை தகவல் கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
    generalError: "❌ ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    weatherCardLabels: { humidity: "ஈரப்பதம்", wind: "காற்று", pressure: "அழுத்தம்" },
    weatherIntro: "இங்கே வானிலை புதுப்பிப்பு உள்ளது",
    viewButton: "ஆலோசனை காண்க",
  },
  "മലയാളം": {
    greeting: "🙏 നമസ്തേ! ഞാൻ നിങ്ങളുടെ കാർഷിക ഉപദേഷ്ടാവാണ്. ഇന്ന് നിങ്ങൾക്ക് എന്ത് സഹായം വേണം?",
    mainMenuLabel: "ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:",
    cropAdvisory: "വിള ഉപദേശം",
    weather: "കാലാവസ്ഥ",
    pestControl: "കീട നിയന്ത്രണം",
    selectCrop: "നിങ്ങളുടെ വിള തിരഞ്ഞെടുക്കുക:",
    growthStageLabel: "വളർച്ചാ ഘട്ടം:",
    problemTypeLabel: "പ്രശ്‌നത്തിന്റെ തരം:",
    farmLocation: "📍 ഫാം സ്ഥാനം:",
    locationPlaceholder: "ജില്ല, സംസ്ഥാനം...",
    submit: "സമർപ്പിക്കുക",
    inputPlaceholder: "വിളകൾ, കാലാവസ്ഥ അല്ലെങ്കിൽ കൃഷിയെക്കുറിച്ച് ചോദിക്കൂ...",
    onlineStatus: "ഓൺലൈൻ",
    subtitle: "സ്മാർട്ട് കൃഷി ഉപദേഷ്ടാവ് · Kisan Mitra",
    advisorySteps: ["ഭാഷ", "വിള", "ഘട്ടം", "പ്രശ്‌നം", "സ്ഥാനം"],
    shortcuts: [
      { label: "എന്റെ കാലാവസ്ഥ", query: "എന്റെ പ്രദേശത്തെ കാലാവസ്ഥ",       icon: "🌤️" },
      { label: "കീട സഹായം",   query: "ഗോതമ്പിൽ മൂട്ടകൾ എങ്ങനെ നിയന്ത്രിക്കാം?", icon: "🐛" },
      { label: "വളം",         query: "ഗോതമ്പ് വിളയ്ക്ക് മികച്ച വളം",          icon: "🧪" },
      { label: "ജലസേചനം",    query: "എന്റെ വിളയ്ക്ക് ജലസേചന ഷെഡ്യൂൾ",      icon: "💧" },
    ],
    weatherFetchError: "❌ കാലാവസ്ഥ വിവരം ലഭിച്ചില്ല. വീണ്ടും ശ്രമിക്കൂ.",
    generalError: "❌ എന്തോ തെറ്റ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കൂ.",
    weatherCardLabels: { humidity: "ഈർപ്പം", wind: "കാറ്റ്", pressure: "മർദ്ദം" },
    weatherIntro: "ഇവിടെ കാലാവസ്ഥ അപ്ഡേറ്റ് ഉണ്ട്",
    viewButton: "ഉപദേശം കാണുക",
  },
};

// Crops localised per language
const CROPS_LOCALIZED: Record<string, { label: string; icon: string; value: string }[]> = {
  English:   [
    { label: "Wheat",     icon: "🌾", value: "Wheat" },
    { label: "Rice",      icon: "🌾", value: "Rice" },
    { label: "Tomato",    icon: "🍅", value: "Tomato" },
    { label: "Cotton",    icon: "🌿", value: "Cotton" },
    { label: "Maize",     icon: "🌽", value: "Maize" },
    { label: "Potato",    icon: "🥔", value: "Potato" },
    { label: "Soybean",   icon: "🫘", value: "Soybean" },
    { label: "Sugarcane", icon: "🎋", value: "Sugarcane" },
  ],
  "हिंदी": [
    { label: "गेहूं",   icon: "🌾", value: "गेहूं" },
    { label: "चावल",   icon: "🌾", value: "चावल" },
    { label: "टमाटर",  icon: "🍅", value: "टमाटर" },
    { label: "कपास",   icon: "🌿", value: "कपास" },
    { label: "मक्का",  icon: "🌽", value: "मक्का" },
    { label: "आलू",    icon: "🥔", value: "आलू" },
    { label: "सोयाबीन",icon: "🫘", value: "सोयाबीन" },
    { label: "गन्ना",  icon: "🎋", value: "गन्ना" },
  ],
  "मराठी": [
    { label: "गहू",     icon: "🌾", value: "गहू" },
    { label: "भात",     icon: "🌾", value: "भात" },
    { label: "टोमॅटो",  icon: "🍅", value: "टोमॅटो" },
    { label: "कापूस",   icon: "🌿", value: "कापूस" },
    { label: "मका",     icon: "🌽", value: "मका" },
    { label: "बटाटा",   icon: "🥔", value: "बटाटा" },
    { label: "सोयाबीन", icon: "🫘", value: "सोयाबीन" },
    { label: "ऊस",      icon: "🎋", value: "ऊस" },
  ],
  "ਪੰਜਾਬੀ": [
    { label: "ਕਣਕ",    icon: "🌾", value: "ਕਣਕ" },
    { label: "ਝੋਨਾ",   icon: "🌾", value: "ਝੋਨਾ" },
    { label: "ਟਮਾਟਰ",  icon: "🍅", value: "ਟਮਾਟਰ" },
    { label: "ਕਪਾਹ",   icon: "🌿", value: "ਕਪਾਹ" },
    { label: "ਮੱਕੀ",   icon: "🌽", value: "ਮੱਕੀ" },
    { label: "ਆਲੂ",    icon: "🥔", value: "ਆਲੂ" },
    { label: "ਸੋਇਆਬੀਨ",icon: "🫘", value: "ਸੋਇਆਬੀਨ" },
    { label: "ਗੰਨਾ",   icon: "🎋", value: "ਗੰਨਾ" },
  ],
};
const getCrops = (lang: string) =>
  CROPS_LOCALIZED[lang] ?? CROPS_LOCALIZED["English"];

const GROWTH_LOCALIZED: Record<string, { label: string; icon: string; value: string }[]> = {
  English: [
    { label: "Seedling",   icon: "🌱", value: "Seedling" },
    { label: "Vegetative", icon: "🌿", value: "Vegetative" },
    { label: "Flowering",  icon: "🌸", value: "Flowering" },
    { label: "Harvest",    icon: "🌾", value: "Harvest" },
  ],
  "हिंदी": [
    { label: "अंकुर",  icon: "🌱", value: "अंकुर" },
    { label: "वृद्धि", icon: "🌿", value: "वृद्धि" },
    { label: "फूल",   icon: "🌸", value: "फूल" },
    { label: "कटाई",  icon: "🌾", value: "कटाई" },
  ],
  "मराठी": [
    { label: "रोपे",    icon: "🌱", value: "रोपे" },
    { label: "वाढ",     icon: "🌿", value: "वाढ" },
    { label: "फुलोरा",  icon: "🌸", value: "फुलोरा" },
    { label: "काढणी",   icon: "🌾", value: "काढणी" },
  ],
  "ਪੰਜਾਬੀ": [
    { label: "ਬੂਟਾ",     icon: "🌱", value: "ਬੂਟਾ" },
    { label: "ਵਾਧਾ",     icon: "🌿", value: "ਵਾਧਾ" },
    { label: "ਫੁੱਲ",     icon: "🌸", value: "ਫੁੱਲ" },
    { label: "ਕਟਾਈ",    icon: "🌾", value: "ਕਟਾਈ" },
  ],
};
const getGrowthStages = (lang: string) =>
  GROWTH_LOCALIZED[lang] ?? GROWTH_LOCALIZED["English"];

const PROBLEMS_LOCALIZED: Record<string, { label: string; icon: string; value: string }[]> = {
  English: [
    { label: "Pest",                icon: "🐛", value: "Pest" },
    { label: "Disease",             icon: "🍂", value: "Disease" },
    { label: "Soil Issue",          icon: "🪱", value: "Soil Issue" },
    { label: "Water Stress",        icon: "💧", value: "Water Stress" },
    { label: "Nutrient Deficiency", icon: "🧪", value: "Nutrient Deficiency" },
  ],
  "हिंदी": [
    { label: "कीट",          icon: "🐛", value: "कीट" },
    { label: "रोग",           icon: "🍂", value: "रोग" },
    { label: "मिट्टी समस्या", icon: "🪱", value: "मिट्टी समस्या" },
    { label: "पानी की कमी",  icon: "💧", value: "पानी की कमी" },
    { label: "पोषण की कमी",  icon: "🧪", value: "पोषण की कमी" },
  ],
  "मराठी": [
    { label: "कीड",         icon: "🐛", value: "कीड" },
    { label: "रोग",          icon: "🍂", value: "रोग" },
    { label: "मातीची समस्या",icon: "🪱", value: "मातीची समस्या" },
    { label: "पाणी ताण",    icon: "💧", value: "पाणी ताण" },
    { label: "पोषण कमतरता", icon: "🧪", value: "पोषण कमतरता" },
  ],
  "ਪੰਜਾਬੀ": [
    { label: "ਕੀਟ",         icon: "🐛", value: "ਕੀਟ" },
    { label: "ਬਿਮਾਰੀ",      icon: "🍂", value: "ਬਿਮਾਰੀ" },
    { label: "ਮਿੱਟੀ ਸਮੱਸਿਆ",icon: "🪱", value: "ਮਿੱਟੀ ਸਮੱਸਿਆ" },
    { label: "ਪਾਣੀ ਦੀ ਕਮੀ", icon: "💧", value: "ਪਾਣੀ ਦੀ ਕਮੀ" },
    { label: "ਪੋਸ਼ਣ ਦੀ ਕਮੀ",icon: "🧪", value: "ਪੋਸ਼ਣ ਦੀ ਕਮੀ" },
  ],
};
const getProblems = (lang: string) =>
  PROBLEMS_LOCALIZED[lang] ?? PROBLEMS_LOCALIZED["English"];

// ─── Language Dropdown ────────────────────────────────────────────────────────

const LanguageDropdown = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (code: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === selected) ?? LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-green-600 bg-green-800/60 text-green-100 text-xs font-medium hover:bg-green-700 transition-colors"
      >
        <Globe className="w-3 h-3 text-green-400 flex-shrink-0" />
        <span className="truncate max-w-[72px]">{current.flag} {current.native}</span>
        <ChevronDown className={`w-3 h-3 text-green-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 bg-green-50 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">Choose Language</p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onSelect(lang.code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-green-50 transition-colors
                  ${selected === lang.code ? "bg-green-50 text-green-800 font-semibold" : "text-gray-700"}`}
              >
                <span>{lang.flag}</span>
                <span className="flex-1">{lang.native}</span>
                <span className="text-[10px] text-gray-400">{lang.label}</span>
                {selected === lang.code && <span className="text-green-600 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AgriChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [advisoryDetail, setAdvisoryDetail] = useState<AdvisoryInfo | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [currentStep, setCurrentStep] = useState(1);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const finalTriggered = useRef(false);
  const { user } = useUser();

  const t = LANG_STRINGS[selectedLanguage] ?? LANG_STRINGS["English"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: t.greeting,
      ui: "mainMenu",
    }]);
    setCurrentStep(1);
    setIsFinal(false);
    finalTriggered.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final" && !finalTriggered.current) {
      finalTriggered.current = true;
      setIsFinal(true);
      const generateMsg = selectedLanguage === "English"
        ? "Generate my complete advisory now"
        : `मेरी पूरी सलाह अभी ${selectedLanguage} भाषा में तैयार करें`;
      setTimeout(() => onSend(generateMsg), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // ── Weather ───────────────────────────────────────────────────────────────

const handleWeatherQuery = useCallback(async (query: string) => {
  try {
    const location =
      query.match(/weather in ([A-Za-z\s]+)/i)?.[1]?.trim() ||
      query.match(/in ([A-Za-z\s]+)/i)?.[1]?.trim() ||
      "Delhi";

    const res = await axios.post("/api/weather", {
      location,
      language: selectedLanguage,
    });

    const weather: WeatherInfo = res.data;

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `🌤️ ${t.weatherIntro} ${weather.location}:`,
        weatherData: weather,
      },
    ]);
  } catch (error) {
    console.error("Weather fetch error:", error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: t.weatherFetchError,
      },
    ]);
  } finally {
    setLoading(false);
  }
}, [selectedLanguage, t]);

  // ── Main send ─────────────────────────────────────────────────────────────
  const onSend = useCallback(
    async (overrideInput?: string) => {
      const input = overrideInput ?? userInput;
      if (!input.trim()) return;

      setLoading(true);
      const newMsg: Message = { role: "user", content: input };
      const newMessages = [...messages, newMsg];
      setMessages(newMessages);
      if (!overrideInput) setUserInput("");

      const lower = input.toLowerCase();

      if (lower.includes("weather") || lower.includes("temperature") || lower.includes("climate") ||
          lower.includes("मौसम") || lower.includes("हवामान") || lower.includes("வானிலை") ||
          lower.includes("కాలావస్థ") || lower.includes("കാലാവസ്ഥ") || lower.includes("ਮੌਸਮ")) {
        await handleWeatherQuery(input);
        return;
      }

      try {
        const { data } = await axios.post<APIResponse>("/api/aimodel", {
          messages: newMessages,
          isFinal,
          language: selectedLanguage,
          languageInstruction: `IMPORTANT: You MUST respond ONLY in ${selectedLanguage} language. All text including questions, options, advice, and explanations must be in ${selectedLanguage}. Do NOT use English unless the selected language is English.`,
        });

        const assistantMessage: Message = {
          role: "assistant",
          content: data.resp ?? (data.advisory ? "✅ Your advisory is ready!" : ""),
          ui: data.ui,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const uiStepMap: Record<string, number> = {
          cropType: 2, growthStage: 3, problem: 4, location: 5, final: 5,
        };
        if (data.ui && uiStepMap[data.ui]) setCurrentStep(uiStepMap[data.ui]);
        if (data.ui === "final") setIsFinal(true);

        if (data.advisory) {
          setAdvisoryDetail(data.advisory);
          if (user?.id) {
            try {
              await fetch("/api/addAgriAdvisory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  uid: user.id,
                  crop: data.advisory.crop,
                  growthStage: data.advisory.growth_stage,
                  problem: data.advisory.problem,
                  location: data.advisory.location,
                  price: data.advisory.price ?? "",
                  date: data.advisory.date ?? new Date().toISOString(),
                  unit: data.advisory.unit ?? "",
                  recommendations: data.advisory.recommendations,
                  createdAt: new Date().toISOString(),
                }),
              });
            } catch (err) {
              console.error("Save failed", err);
            }
          }
        }
      } catch (err) {
        console.error("AI API Error:", err);
        setMessages((prev) => [...prev, { role: "assistant", content: t.generalError }]);
      } finally {
        setLoading(false);
      }
    },
    [userInput, messages, isFinal, selectedLanguage, user, t, handleWeatherQuery]
  );

  const handleChipClick = (value: string) => {
    setUserInput(value);
    onSend(value);
  };

  // ── Sub-renderers ─────────────────────────────────────────────────────────

  const ChipGroup = ({ items }: { items: { label: string; icon?: string; value: string }[] }) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => handleChipClick(item.value)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-800 text-xs font-medium hover:bg-green-100 hover:border-green-400 transition-all duration-150"
        >
          {item.icon && <span className="text-sm">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );

  const RenderGenerativeUi = (ui?: string) => {
    switch (ui) {
      case "mainMenu":
        return (
          <>
            <p className="text-xs text-gray-500 mt-2">{t.mainMenuLabel}</p>
            <ChipGroup items={[
              { label: t.cropAdvisory, icon: "🌾", value: t.cropAdvisory },
              { label: t.weather,      icon: "🌤️", value: t.weather },
              { label: t.pestControl,  icon: "🐛", value: t.pestControl },
            ]} />
          </>
        );
      case "cropType":
        return (
          <>
            <p className="text-xs text-gray-500 mt-2">{t.selectCrop}</p>
            <ChipGroup items={getCrops(selectedLanguage)} />
          </>
        );
      case "growthStage":
        return (
          <>
            <p className="text-xs text-gray-500 mt-2">{t.growthStageLabel}</p>
            <ChipGroup items={getGrowthStages(selectedLanguage)} />
          </>
        );
      case "problem":
        return (
          <>
            <p className="text-xs text-gray-500 mt-2">{t.problemTypeLabel}</p>
            <ChipGroup items={getProblems(selectedLanguage)} />
          </>
        );
      case "location":
        return (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">{t.farmLocation}</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.locationPlaceholder}
                className="flex-1 text-sm border border-green-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
              />
              <button
                onClick={() => onSend()}
                className="px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-medium hover:bg-green-800 transition-colors"
              >
                {t.submit}
              </button>
            </div>
          </div>
        );
      case "final":
        return <FinalUi disable={!advisoryDetail} />;
      default:
        return null;
    }
  };

  const RenderWeatherCard = (w?: WeatherInfo) => {
    if (!w) return null;
    const wl = t.weatherCardLabels;
    const weatherIcon =
      w.weather?.toLowerCase().includes("rain")  ? "🌧️" :
      w.weather?.toLowerCase().includes("cloud") ? "☁️"  :
      w.weather?.toLowerCase().includes("clear") ? "☀️"  :
      w.weather?.toLowerCase().includes("storm") ? "⛈️" : "🌤️";

    return (
      <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600">
          <span className="text-lg">{weatherIcon}</span>
          <div>
            <p className="text-white text-xs font-semibold">{w.location}</p>
            <p className="text-blue-200 text-[10px]">{w.description}</p>
          </div>
          <p className="ml-auto text-white text-2xl font-light">{w.temperature}°C</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-blue-100 px-2 py-2">
          {[
            { label: wl.humidity, value: `${w.humidity}%`,       icon: "💧" },
            { label: wl.wind,     value: `${w.wind_speed} m/s`,  icon: "🌬️" },
            { label: wl.pressure, value: `${w.pressure} hPa`,   icon: "🌡️" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5 px-2 py-1">
              <span className="text-base">{item.icon}</span>
              <span className="text-xs font-semibold text-blue-800">{item.value}</span>
              <span className="text-[10px] text-blue-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Progress tracker ──────────────────────────────────────────────────────
  const ProgressTracker = () => (
    <div className="flex items-center gap-1 px-3 py-2 bg-amber-50 border-b border-amber-100 overflow-x-auto flex-shrink-0">
      {t.advisorySteps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                ${done ? "bg-green-600 text-white" : active ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[11px] whitespace-nowrap font-medium
                ${done ? "text-green-700" : active ? "text-amber-700" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
            {i < t.advisorySteps.length - 1 && (
              <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-[90vh] flex flex-col rounded-3xl overflow-hidden border border-green-200 shadow-2xl bg-white">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-green-900 flex-shrink-0 min-h-[60px]">
        <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-lg flex-shrink-0">
          🌾
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-green-50 font-semibold text-sm leading-tight truncate">
            AgriAdvisor
          </p>
          <p className="text-green-400 text-[11px] truncate">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageDropdown selected={selectedLanguage} onSelect={setSelectedLanguage} />
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-green-300 bg-green-800 px-2 py-1 rounded-full border border-green-700 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t.onlineStatus}
          </span>
        </div>
      </div>

      {/* Progress */}
      <ProgressTracker />

      {/* Messages */}
      <section className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-green-50/20 to-white">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold
              ${msg.role === "assistant" ? "bg-green-100 text-green-800" : "bg-green-800 text-green-100"}`}>
              {msg.role === "assistant" ? "🌱" : "KS"}
            </div>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
              ${msg.role === "user"
                ? "bg-green-700 text-white rounded-br-sm"
                : "bg-white border border-green-100 text-gray-800 rounded-bl-sm"}`}>
              <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
              {msg.role === "assistant" && RenderGenerativeUi(msg.ui)}
              {RenderWeatherCard(msg.weatherData)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm">🌱</div>
            <div className="bg-white border border-green-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </section>

      {/* Input area */}
      <section className="border-t border-green-100 bg-white px-4 pt-3 pb-4 flex-shrink-0">
        {/* Shortcut chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {t.shortcuts.map((s) => (
            <button
              key={s.label}
              onClick={() => handleChipClick(s.query)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs hover:border-green-400 hover:bg-green-50 hover:text-green-700 transition-all font-medium"
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Text input row */}
        <div className="flex gap-2 items-end">
          <button className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:border-green-400 hover:bg-green-50 transition-colors flex-shrink-0">
            <Mic className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
              }}
              placeholder={t.inputPlaceholder}
              className="w-full resize-none border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent min-h-[44px] max-h-28 bg-gray-50"
              rows={1}
            />
          </div>
          <button
            onClick={() => onSend()}
            disabled={loading || !userInput.trim()}
            className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-md"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AgriChatBox;