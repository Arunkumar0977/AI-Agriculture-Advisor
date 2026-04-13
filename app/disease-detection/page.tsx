"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Header from "../_components/Header";

type DiseaseDetails = {
  diseaseName?: string;
  cause?: string;
  symptoms?: string;
  solution?: string;
  prevention?: string;
};

type DetectionResult = {
  english?: string | DiseaseDetails;
  hindi?: string | DiseaseDetails;
};


export default function DiseaseDetectionPage() {
  const [image, setImage] = useState<string>("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [lang, setLang] = useState<"english" | "hindi">("english");
  const [dragOver, setDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setImage(base64);
    analyzeImage(base64);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setImage(base64);
    analyzeImage(base64);
  };

  const startCamera = async () => {
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert("Camera not accessible.");
      setMode("upload");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setMode("upload");
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);
    stopCamera();
    analyzeImage(imageData);
  };

  const analyzeImage = async (imageUrl: string) => {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/disease-detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageUrl }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const reset = () => {
    setImage("");
    setResult(null);
    setLoading(false);
    stopCamera();
    setMode("upload");
    setLang("english");
  };

  const isHealthy =
    result?.english?.toLowerCase?.().includes("healthy") ||
    result?.english?.toLowerCase?.().includes("no disease");

  return (
    <div>
    <div><Header/></div>
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Tiro+Devanagari+Hindi&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #080f0a;
          --bg2:       #0d1710;
          --bg3:       #111e14;
          --panel:     #0f1a11;
          --border:    rgba(74,222,128,0.10);
          --border2:   rgba(74,222,128,0.22);
          --green:     #4ade80;
          --green-light: #22c55e;
          --green-glow:#16a34a;
          --amber:     #fbbf24;
          --amber-dim: #d97708;
          --red:       #f87171;
          --violet:    #a78bfa;
          --cyan:      #38bdf8;
          --text:      #dff0e3;
          --text-dim:  #5a8060;
          --text-muted:#2e4a32;
          --scan-line: rgba(74,222,128,0.035);
        }

        html, body { height: 100%; background: #080f0a; }

        .app {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Syne', sans-serif;
          color: var(--text);
          overflow-x: hidden;
          position: relative;
        }

        /* Ambient glow + scanlines */
        .app::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 15% 8%,  rgba(74,222,128,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 85% 92%, rgba(251,191,36,0.05)  0%, transparent 65%),
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(74,222,128,0.02)  0%, transparent 80%),
            repeating-linear-gradient(0deg, transparent, transparent 39px, var(--scan-line) 40px);
        }

        
        .wrap { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; padding: 0 20px 80px; }

        /* ── Header ── */
       
        .hdr { padding: 52px 0 36px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }

        .hdr-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(74,222,128,0.07);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 999px; padding: 6px 18px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--green);
          animation: fadeDown 0.5s ease both;
          
        }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--green);
          box-shadow: 0 0 8px var(--green);
          animation: blink 1.8s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .hdr h1 {
          font-size: clamp(34px, 7vw, 58px);
          font-weight: 800; letter-spacing: -1.5px; line-height: 1.0;
          background: linear-gradient(150deg, #ffffff 20%, #a3e6b8 60%, var(--green) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: fadeDown 0.5s 0.08s ease both;
        }
        .hdr-sub {
          font-family: 'DM Mono', monospace; font-size: 13px; color: var(--text-dim);
          display: flex; align-items: center; gap: 10px;
          animation: fadeDown 0.5s 0.16s ease both;
        }
        .hdr-sub span { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: var(--text-muted); }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }

        /* ── Card ── */
        .card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 22px; padding: 28px;
          margin-bottom: 14px;
          position: relative; overflow: hidden;
          animation: fadeUp 0.45s ease both;
        }
        .card::after {
          content: '';
          position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,222,128,0.35), transparent);
        }

        .card-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .card-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* ── Mode tabs ── */
        .mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
        .mode-btn {
          padding: 16px 10px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--bg3);
          color: var(--text-dim);
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
        }
        .mode-btn .ico { font-size: 28px; }
        .mode-btn .sub { font-family: 'DM Mono', monospace; font-size: 11px; opacity: 0.5; }
        .mode-btn:hover { border-color: var(--border2); color: var(--text); }
        .mode-btn.active {
          border-color: rgba(74,222,128,0.4);
          background: rgba(74,222,128,0.06);
          color: var(--green);
          box-shadow: 0 0 24px rgba(74,222,128,0.08), inset 0 0 24px rgba(74,222,128,0.03);
        }

        /* ── Drop zone ── */
        .dropzone {
          border: 1.5px dashed rgba(74,222,128,0.2);
          border-radius: 18px; padding: 48px 24px;
          text-align: center; cursor: pointer;
          background: rgba(13,23,16,0.6);
          transition: all 0.25s ease; position: relative; overflow: hidden;
        }
        .dropzone:hover { border-color: rgba(74,222,128,0.4); background: rgba(74,222,128,0.03); }
        .dropzone.over { border-color: var(--green); background: rgba(74,222,128,0.06); transform: scale(1.01); }
        .dz-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .dz-icon { font-size: 54px; display: block; margin-bottom: 16px; filter: drop-shadow(0 0 20px rgba(74,222,128,0.5)); animation: float 3.5s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .dz-title { font-size: 19px; font-weight: 700; margin-bottom: 8px; }
        .dz-sub { font-size: 13px; color: var(--text-dim); font-family: 'DM Mono', monospace; line-height: 1.8; }
        .dz-sub .hi { font-family: 'Tiro Devanagari Hindi', serif; font-size: 14px; display: block; margin-top: 4px; }
        .dz-btn {
          margin-top: 22px;
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green); color: #000;
          padding: 12px 30px; border-radius: 999px;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          border: none; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 0 24px rgba(74,222,128,0.35);
          position: relative; z-index: 1;
        }
        .dz-btn:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(74,222,128,0.55); }

        /* ── Camera ── */
        .cam-wrap {
          border-radius: 18px; overflow: hidden;
          background: #000; aspect-ratio: 4/3; position: relative;
          border: 1px solid var(--border2);
        }
        .cam-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cam-corner { position: absolute; width: 26px; height: 26px; border-style: solid; border-color: var(--green); }
        .cam-corner.tl { top:12px; left:12px; border-width:2px 0 0 2px; border-radius:3px 0 0 0; }
        .cam-corner.tr { top:12px; right:12px; border-width:2px 2px 0 0; border-radius:0 3px 0 0; }
        .cam-corner.bl { bottom:12px; left:12px; border-width:0 0 2px 2px; border-radius:0 0 0 3px; }
        .cam-corner.br { bottom:12px; right:12px; border-width:0 2px 2px 0; border-radius:0 0 3px 0; }
        .scan-bar {
          position: absolute; left: 0; right: 0; height: 2px; top: 0;
          background: linear-gradient(90deg, transparent 0%, var(--green) 50%, transparent 100%);
          opacity: 0.9;
          animation: scanDown 2.2s ease-in-out infinite;
        }
        @keyframes scanDown { 0%{top:0%;opacity:0.9} 90%{top:100%;opacity:0.4} 100%{top:100%;opacity:0} }

        .cam-actions { display: flex; gap: 10px; margin-top: 12px; }
        .btn-capture {
          flex: 1; padding: 15px;
          background: var(--green); color: #000;
          border: none; border-radius: 16px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 0 20px rgba(74,222,128,0.3);
        }
        .btn-capture:hover { transform: translateY(-2px); box-shadow: 0 0 36px rgba(74,222,128,0.5); }
        .btn-cancel {
          padding: 15px 20px;
          background: rgba(248,113,113,0.08);
          color: var(--red); border: 1px solid rgba(248,113,113,0.2);
          border-radius: 16px;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }

        /* ── Preview ── */
        .preview { border-radius: 18px; overflow: hidden; border: 1px solid var(--border2); position: relative; box-shadow: 0 8px 40px rgba(74,222,128,0.08); }
        .preview img { width: 100%; max-height: 280px; object-fit: cover; display: block; }
        .preview-tag {
          position: absolute; top: 12px; left: 12px;
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px;
          color: var(--green); background: rgba(8,15,10,0.85); backdrop-filter: blur(10px);
          border: 1px solid rgba(74,222,128,0.25); padding: 5px 13px; border-radius: 999px;
        }
        .preview-retake {
          position: absolute; bottom: 12px; right: 12px;
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--text-dim); background: rgba(8,15,10,0.8); backdrop-filter: blur(8px);
          border: 1px solid var(--border); padding: 5px 14px; border-radius: 999px;
          cursor: pointer; transition: all 0.2s;
        }
        .preview-retake:hover { color: var(--text); border-color: var(--border2); }

        /* ── Loading ── */
        .loading-wrap { text-align: center; padding: 36px 20px; }
        .loading-img-wrap { border-radius: 14px; overflow: hidden; margin-bottom: 28px; position: relative; }
        .loading-img-wrap img { width: 100%; max-height: 160px; object-fit: cover; display: block; opacity: 0.35; filter: blur(2px); }
        .loading-img-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to top, var(--panel), transparent);
        }
        .orb {
          width: 76px; height: 76px; border-radius: 50%; margin: 0 auto 20px;
          background: conic-gradient(var(--green), var(--green-dim), transparent, var(--green));
          display: flex; align-items: center; justify-content: center; font-size: 28px;
          animation: spin 2s linear infinite;
          box-shadow: 0 0 32px rgba(74,222,128,0.4);
          position: relative;
        }
        .orb::before {
          content: '';
          position: absolute; inset: 3px; border-radius: 50%;
          background: var(--panel);
        }
        .orb-inner { position: relative; z-index: 1; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-title { font-size: 18px; font-weight: 700; color: var(--green); }
        .loading-sub { font-family: 'Tiro Devanagari Hindi', serif; font-size: 14px; color: var(--text-muted); margin-top: 6px; }
        .pbar { height: 2px; background: var(--bg3); border-radius: 999px; margin: 20px auto 0; max-width: 180px; overflow: hidden; }
        .pfill { height: 100%; width: 35%; background: var(--green); border-radius: 999px; box-shadow: 0 0 8px var(--green); animation: sweep 1.6s ease-in-out infinite; }
        @keyframes sweep { 0%{transform:translateX(-280%)} 100%{transform:translateX(580%)} }

        /* ── Status banner ── */
        .status-card {
          border-radius: 18px; padding: 20px 22px;
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 14px; border: 1px solid;
          animation: fadeUp 0.4s ease both;
        }
        .status-card.healthy { background: rgba(74,222,128,0.06); border-color: rgba(74,222,128,0.22); }
        .status-card.disease { background: rgba(248,113,113,0.06); border-color: rgba(248,113,113,0.22); }
        .s-icon {
          width: 54px; height: 54px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 26px;
        }
        .status-card.healthy .s-icon { background: rgba(74,222,128,0.12); box-shadow: 0 0 20px rgba(74,222,128,0.2); }
        .status-card.disease  .s-icon { background: rgba(248,113,113,0.12); box-shadow: 0 0 20px rgba(248,113,113,0.2); }
        .s-name { font-size: 21px; font-weight: 800; letter-spacing: -0.5px; }
        .status-card.healthy .s-name { color: var(--green); }
        .status-card.disease  .s-name { color: var(--red);   }
        .s-sub { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-dim); margin-top: 4px; }

        /* ── Lang toggle ── */
        .lang-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 22px; }
        .lang-btn {
          padding: 11px; border: 1px solid var(--border); border-radius: 13px;
          background: var(--bg3); color: var(--text-dim);
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .lang-btn.active {
          border-color: rgba(251,191,36,0.4);
          background: rgba(251,191,36,0.07);
          color: var(--amber);
          box-shadow: 0 0 18px rgba(251,191,36,0.08);
        }

        /* ── Result rows ── */
        .result-rows { display: flex; flex-direction: column; gap: 10px; }
        .rrow {
          border-radius: 14px; padding: 14px 18px;
          border: 1px solid var(--border);
          background: rgba(13,23,16,0.8);
          position: relative; overflow: hidden;
          animation: fadeUp 0.4s ease both;
          transition: border-color 0.2s;
        }
        .rrow::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; border-radius: 14px 0 0 14px;
        }
        .rrow:hover { border-color: var(--border2); }
        .rrow.r-disease::before { background: var(--red); }
        .rrow.r-cause::before   { background: var(--amber); }
        .rrow.r-symptoms::before{ background: var(--violet); }
        .rrow.r-solution::before{ background: var(--green); }
        .rrow.r-prev::before    { background: var(--cyan); }
        .rrow-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .rrow.r-disease .rrow-label  { color: var(--red);    }
        .rrow.r-cause .rrow-label    { color: var(--amber);  }
        .rrow.r-symptoms .rrow-label { color: var(--violet); }
        .rrow.r-solution .rrow-label { color: var(--green);  }
        .rrow.r-prev .rrow-label     { color: var(--cyan);   }
        .rrow-val { font-size: 14px; color: var(--text); line-height: 1.75; }
        .rrow-val.hi { font-family: 'Tiro Devanagari Hindi', serif; font-size: 15.5px; }

        /* plain-text fallback */
        .raw-result {
          white-space: pre-wrap; font-size: 14px; line-height: 1.8;
          color: var(--text); font-family: 'DM Mono', monospace;
          background: rgba(13,23,16,0.8); border: 1px solid var(--border);
          border-radius: 14px; padding: 18px;
        }
        .raw-result.hi { font-family: 'Tiro Devanagari Hindi', serif; font-size: 15px; }

        /* ── Result preview ── */
        .result-preview { border-radius: 16px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 14px; position: relative; }
        .result-preview img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
        .result-preview::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,15,10,0.7) 0%, transparent 40%);
          pointer-events: none;
        }
        .result-preview-tag {
          position: absolute; bottom: 12px; left: 12px; z-index: 1;
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px;
          color: var(--green); background: rgba(8,15,10,0.85); backdrop-filter: blur(8px);
          border: 1px solid rgba(74,222,128,0.25); padding: 5px 13px; border-radius: 999px;
        }

        /* ── Tip ── */
        .tip {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(251,191,36,0.05);
          border: 1px solid rgba(251,191,36,0.16);
          border-radius: 14px; padding: 14px 18px; margin-bottom: 14px;
          animation: fadeUp 0.4s 0.2s ease both;
        }
        .tip-ico { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .tip-txt { font-size: 13px; color: #a07020; line-height: 1.65; }
        .tip-txt strong { color: var(--amber); }

        /* ── CTA ── */
        .cta {
          width: 100%; padding: 16px;
          background: transparent; border: 1px solid rgba(74,222,128,0.3);
          border-radius: 16px; color: var(--green);
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          position: relative; overflow: hidden;
          animation: fadeUp 0.4s 0.3s ease both;
        }
        .cta::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(74,222,128,0.07), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .cta:hover { box-shadow: 0 0 30px rgba(74,222,128,0.2); transform: translateY(-2px); }
        .cta:hover::before { opacity: 1; }
        .cta-div { opacity: 0.3; }

        .footer {
          text-align: center; padding-top: 28px;
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--text-muted); letter-spacing: 1.5px;
        }

        canvas { display: none; }

        /* stagger */
        .rrow:nth-child(1){animation-delay:0.04s} .rrow:nth-child(2){animation-delay:0.09s}
        .rrow:nth-child(3){animation-delay:0.14s} .rrow:nth-child(4){animation-delay:0.19s}
        .rrow:nth-child(5){animation-delay:0.24s}
      `}</style>
      
      
      <div className="app">
        
        <div className="wrap">

          {/* ── Header ── */}
         
          <div className="hdr">
            <div className="hdr-badge">
              <span className="live-dot" />
              AI Plant Diagnostics
            </div>
            <h1>Plant Disease<br />Detector</h1>
            <p className="hdr-sub">
              फसल रोग पहचानकर्ता <span /> Crop Diagnostics Engine
            </p>
          </div>

          {/* ── Input Card ── */}
          {!result && !loading && (
            <div className="card">
              <p className="card-label">01 &nbsp; Choose Input Method</p>

              <div className="mode-row">
                <button className={`mode-btn ${mode === "upload" ? "active" : ""}`}
                  onClick={() => setMode("upload")}>
                  <span className="ico">🖼️</span>
                  Upload Photo
                  <span className="sub">drag or browse</span>
                </button>
                <button className={`mode-btn ${mode === "camera" ? "active" : ""}`}
                  onClick={startCamera}>
                  <span className="ico">📷</span>
                  Live Camera
                  <span className="sub">capture now</span>
                </button>
              </div>

              {mode === "upload" && (
                <div
                  className={`dropzone ${dragOver ? "over" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("filein")?.click()}
                >
                  <div className="dz-glow" />
                  <span className="dz-icon">{dragOver ? "📂" : "🌿"}</span>
                  <p className="dz-title">{dragOver ? "Release to analyze" : "Drop your crop photo"}</p>
                  <p className="dz-sub">
                    JPG · PNG · WEBP supported
                    <span className="hi">फोटो यहाँ खींचें या नीचे दबाएं</span>
                  </p>
                  <input id="filein" type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
                  <button className="dz-btn" onClick={(e) => { e.stopPropagation(); document.getElementById("filein")?.click(); }}>
                    ＋ &nbsp;Browse Files
                  </button>
                </div>
              )}

              {mode === "camera" && (
                <>
                  <div className="cam-wrap">
                    <video ref={videoRef} autoPlay playsInline />
                    <div className="scan-bar" />
                    <div className="cam-corner tl" /><div className="cam-corner tr" />
                    <div className="cam-corner bl" /><div className="cam-corner br" />
                  </div>
                  <div className="cam-actions">
                    <button className="btn-capture" onClick={capturePhoto}>📸 &nbsp;Capture Photo</button>
                    <button className="btn-cancel" onClick={stopCamera}>✕ Cancel</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="card loading-wrap">
              {image && (
  <div className="loading-img-wrap relative w-full h-40">
    <Image
      src={image}
      alt="uploaded image"
      fill
      className="object-cover"
    />
  </div>
)}
              <div className="orb"><span className="orb-inner">🔬</span></div>
              <p className="loading-title">Scanning specimen…</p>
              <p className="loading-sub">आपकी फसल का विश्लेषण हो रहा है</p>
              <div className="pbar"><div className="pfill" /></div>
            </div>
          )}

          {/* ── Results ── */}
          {result && (
            <>
              <div className={`status-card ${isHealthy ? "healthy" : "disease"}`}>
                <div className="s-icon">{isHealthy ? "✅" : "⚠️"}</div>
                <div>
                  <p className="s-name">{isHealthy ? "Plant is Healthy" : "Disease Detected"}</p>
                  <p className="s-sub">
                    {isHealthy
                      ? "No treatment required · पौधा स्वस्थ है"
                      : "Treatment recommended · उपचार आवश्यक है"}
                  </p>
                </div>
              </div>

              {image && (
              <div className="loading-img-wrap relative w-full h-40">
                <Image
                  src={image}
                  alt="uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
)}

              <div className="card">
                <p className="card-label">02 &nbsp; Diagnosis Report</p>

                <div className="lang-row">
                  <button className={`lang-btn ${lang === "english" ? "active" : ""}`} onClick={() => setLang("english")}>
                    🇬🇧 &nbsp;English
                  </button>
                  <button className={`lang-btn ${lang === "hindi" ? "active" : ""}`} onClick={() => setLang("hindi")}>
                    🇮🇳 &nbsp;हिंदी
                  </button>
                </div>

                {/* Handles both plain string and structured object responses */}
                {typeof result[lang] === "string" ? (
                  <div className={`raw-result ${lang === "hindi" ? "hi" : ""}`}>
                    {result[lang]}
                  </div>
                ) : (
                  <div className="result-rows">
                    <div className="rrow r-disease">
                      <p className="rrow-label">🦠 &nbsp;{lang === "english" ? "Disease Name" : "रोग का नाम"}</p>
                      <p className={`rrow-val ${lang === "hindi" ? "hi" : ""}`}>{result[lang]?.diseaseName || "—"}</p>
                    </div>
                    <div className="rrow r-cause">
                      <p className="rrow-label">🔍 &nbsp;{lang === "english" ? "Cause" : "कारण"}</p>
                      <p className={`rrow-val ${lang === "hindi" ? "hi" : ""}`}>{result[lang]?.cause || "—"}</p>
                    </div>
                    <div className="rrow r-symptoms">
                      <p className="rrow-label">👁 &nbsp;{lang === "english" ? "Symptoms" : "लक्षण"}</p>
                      <p className={`rrow-val ${lang === "hindi" ? "hi" : ""}`}>{result[lang]?.symptoms || "—"}</p>
                    </div>
                    <div className="rrow r-solution">
                      <p className="rrow-label">💊 &nbsp;{lang === "english" ? "Solution" : "उपाय"}</p>
                      <p className={`rrow-val ${lang === "hindi" ? "hi" : ""}`}>{result[lang]?.solution || "—"}</p>
                    </div>
                    <div className="rrow r-prev">
                      <p className="rrow-label">🛡 &nbsp;{lang === "english" ? "Prevention" : "बचाव"}</p>
                      <p className={`rrow-val ${lang === "hindi" ? "hi" : ""}`}>{result[lang]?.prevention || "—"}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="tip">
                <span className="tip-ico">🌾</span>
                <p className="tip-txt">
                  <strong>For medicine advice</strong>, consult your local KVK (Krishi Vigyan Kendra).<br />
                  दवाई के लिए अपने नजदीकी <strong>कृषि विज्ञान केंद्र</strong> से संपर्क करें।
                </p>
              </div>

              <button className="cta" onClick={reset}>
                ↺ &nbsp;Scan Another Crop <span className="cta-div">·</span> नई फसल स्कैन करें
              </button>

              <p className="footer">Made with 🌿 for Indian Farmers · भारतीय किसानों के लिए</p>
            </>
          )}
        </div>

        <canvas ref={canvasRef} />
      </div>
    </>
    </div>
  );
}


