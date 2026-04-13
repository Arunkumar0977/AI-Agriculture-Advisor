"use client";

import { useState, useRef } from "react";
import { Send, MapPin, Phone, Mail, Leaf, CheckCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import Header from "../_components/Header";


const EMAILJS_SERVICE_ID  = "service_f1plwer";  
const EMAILJS_TEMPLATE_ID = "template_70ptxai"; 
const EMAILJS_PUBLIC_KEY  = "KrPUQFqVKuxkZvT3C";   
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send message. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
    <div>
      <Header/>
    </div>
    <main className="min-h-screen bg-[#f5f2eb] font-sans relative overflow-hidden">
      
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-green-200/30 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-green-100/40 blur-2xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-16 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-green-700" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-green-700">
              Get in Touch
            </span>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-bold text-green-950 leading-[1.05] mb-5"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            We&apos;re here to
            <br />
            <span className="text-green-700 italic">help you grow.</span>
          </h1>
          <p className="text-green-800/70 text-lg leading-relaxed max-w-xl">
            Have a question about crop advisory, weather data, or need technical support?
            Our team of agri-experts is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Left: Contact info cards ── */}
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                icon: <MapPin className="w-5 h-5" />,
                label: "Visit Us",
                value: "Manhana, near MPGI",
                sub: "Kanpur, India 209217",
                color: "bg-amber-100 text-amber-800",
              },
              {
                icon: <Phone className="w-5 h-5" />,
                label: "Call Us",
                value: "+91 7488840134",
                sub: "Mon–Sat, 8am – 6pm IST",
                color: "bg-green-100 text-green-800",
              },
              {
                icon: <Mail className="w-5 h-5" />,
                label: "Email Us",
                value: "support@agriadvisor.in",
                sub: "We reply within 24 hours",
                color: "bg-emerald-100 text-emerald-800",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 bg-white/70 backdrop-blur-sm border border-green-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-green-700 mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-green-950 font-semibold text-sm">{item.value}</p>
                  <p className="text-green-700/60 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-green-800 text-green-50 rounded-2xl p-5 mt-2">
              <p className="text-sm font-semibold mb-1">🌾 Farmer Helpline</p>
              <p className="text-green-200 text-xs leading-relaxed">
                For urgent crop advisory in Hindi, Punjabi, or other regional languages,
                call our dedicated Kisan Helpline available 7 days a week.
              </p>
              <p className="text-amber-300 font-bold text-sm mt-3">1800-180-1551</p>
            </div>
          </div>

          {/* ── Right: Contact form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl shadow-lg p-8">

              {submitted ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2
                    className="text-2xl font-bold text-green-900"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Message Sent!
                  </h2>
                  <p className="text-green-700/70 max-w-sm text-sm leading-relaxed">
                    Thank you for reaching out. We&apos;ve received your message and will
                    get back to you within 24 hours.
                  </p>
                  <button
                    onClick={resetForm}
                    className="mt-2 px-6 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2
                      className="text-2xl font-bold text-green-950 mb-1"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      Send us a message
                    </h2>
                    <p className="text-green-700/60 text-sm">
                      Fill out the form below and we&apos;ll be in touch soon.
                    </p>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-green-800 mb-1.5 tracking-wide uppercase">
                        Full Name
                      </label>
                      {/* name attr must match your EmailJS template variable: {{name}} */}
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rajesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-green-50/50 text-green-950 text-sm placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-800 mb-1.5 tracking-wide uppercase">
                        Email Address
                      </label>
                      {/* name attr must match your EmailJS template variable: {{email}} */}
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-green-50/50 text-green-950 text-sm placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-green-800 mb-1.5 tracking-wide uppercase">
                      Subject
                    </label>
                    {/* name attr must match your EmailJS template variable: {{subject}} */}
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-green-50/50 text-green-950 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a topic…</option>
                      <option value="Crop Advisory Help">Crop Advisory Help</option>
                      <option value="Weather Data Issue">Weather Data Issue</option>
                      <option value="Pest & Disease Control">Pest &amp; Disease Control</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Feedback & Suggestions">Feedback &amp; Suggestions</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-green-800 mb-1.5 tracking-wide uppercase">
                      Message
                    </label>
                    {/* name attr must match your EmailJS template variable: {{message}} */}
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your question or issue in detail…"
                      className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-green-50/50 text-green-950 text-sm placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none"
                    />
                  </div>

                  {/* Error banner */}
                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-green-800 hover:bg-green-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-green-900/20"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-green-700/50">
                    By submitting, you agree to our Privacy Policy. We never share your data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer strip ── */}
        <div className="mt-16 pt-8 border-t border-green-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-green-700/50">
          <p>© {new Date().getFullYear()} AgriAdvisor · Kisan Mitra. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <Leaf className="w-3 h-3 text-green-500" />
            <span>Empowering Indian farmers with smart technology</span>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
}