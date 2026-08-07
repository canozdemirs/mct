"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "@formspree/react";
import { Check, MessageCircle, Send, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

const packages = [
  {
    tier: "Entry",
    name: "Premium Package",
    price: "2,500",
    subtitle: "Surgery only · No hidden fees",
    highlight: false,
    badge: null as string | null,
    cta: "outline",
    inclusions: [
      "Rhinoplasty Surgery (Open or Closed Technique)",
      "Pre-Op Blood Tests & Examination",
      "General Anaesthesia",
      "1 Night Hospital Stay (Post-Op)",
      "Post-Op Medication & Nasal Splint",
      "Translator / Interpreter",
      "GO Assistance on Surgery Day",
    ],
  },
  {
    tier: "Complete",
    name: "Hassle-Free Package",
    price: "3,000",
    subtitle: "All-inclusive · 7 nights stay",
    highlight: true,
    badge: "MOST POPULAR",
    cta: "gold",
    inclusions: [
      "Everything in Premium",
      "Private Airport Transfers (Two Way)",
      "7 Nights @ 4-Star Hotel",
      "Breakfast at Hotel",
      "Dedicated GO Coordinator Throughout Stay",
    ],
  },
  {
    tier: "Luxury",
    name: "Executive Package",
    price: "4,200",
    subtitle: "Full VIP experience · Istanbul included",
    highlight: false,
    badge: null as string | null,
    cta: "outline",
    inclusions: [
      "Everything in Hassle-Free",
      "5-Star Hotel Accommodation",
      "Guided Istanbul City Tour",
      "Restaurant Reservations (Fine Dining)",
      "Shopping Assistance & VIP Access",
      "Priority Scheduling",
    ],
  },
];

const faqs = [
  {
    q: "What is included in the Medical Center Turkey rhinoplasty package?",
    a: "Our Hassle-Free Package covers everything you need from arrival to recovery. This includes the rhinoplasty surgery (open or closed technique), pre-operative blood tests and examination, general anaesthesia, 1 night post-operative hospital stay, all post-op medication and nasal splint, private two-way airport transfers, 7 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. No hidden fees — one clear price covers everything.",
  },
  {
    q: "How much does rhinoplasty cost in Turkey with Medical Center Turkey?",
    a: "Our Premium Package starts from €2,500 and covers the surgery and hospital stay. The Hassle-Free Package is €3,000 and adds 7 nights hotel, private transfers, and a dedicated coordinator — making your entire Istanbul stay completely self-contained. Our Executive Package is €4,200 and includes 5-star hotel accommodation and the full Istanbul VIP experience. Final pricing may vary slightly depending on your case complexity — we provide a personalised quote after your free consultation.",
  },
  {
    q: "How many days do I need to stay in Istanbul for rhinoplasty?",
    a: "We recommend a minimum of 7 days and 7 nights. Day 1 is arrival. Day 2 is your pre-operative consultation, blood tests, and examination. Day 3 is your rhinoplasty surgery — you stay one night in hospital for post-operative monitoring. Days 4–7 are recovery at your hotel. Your cast and splint remain in place for approximately 7 days before removal. Most patients are comfortable flying home after 7 days, though we recommend staying closer to 10 days if possible for extra comfort during initial recovery.",
  },
  {
    q: "What is the difference between open and closed rhinoplasty?",
    a: "In closed rhinoplasty, all incisions are made inside the nostrils — there are no external scars. This technique is suitable for cases requiring moderate reshaping and typically has a shorter recovery time. Open rhinoplasty involves a small incision across the columella (the strip of tissue between the nostrils), giving the surgeon greater visibility and access for more complex reshaping. Your surgeon will recommend the most appropriate technique based on your anatomy and desired result during your pre-operative consultation.",
  },
  {
    q: "Is rhinoplasty in Turkey safe? How do I know the quality is reliable?",
    a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate. Our partner surgeons are board-certified specialists with extensive experience in rhinoplasty for international patients. Turkey is one of the world's leading destinations for rhinoplasty, combining highly skilled surgeons, modern facilities, and significantly lower costs than the UK, USA, or Western Europe.",
  },
  {
    q: "Why should I choose Medical Center Turkey?",
    a: "When you book with Medical Center Turkey, you don't navigate a foreign healthcare system alone. From airport pickup on Day 1 to your final check before departure, your dedicated English-speaking GO coordinator handles every detail — transfers, hotel, hospital coordination, translations, and any question along the way. We have been serving international patients since 2018, and our entire system exists to make you feel safe, informed, and looked after every step of the way.",
  },
  {
    q: "What is the difference between the Hassle-Free and Executive packages?",
    a: "Both packages include the same rhinoplasty surgery, pre-op consultation, hospital stay, 7 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star, and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling. If you want to recover in maximum comfort with the full Istanbul experience, the Executive Package is the right choice.",
  },
  {
    q: "When will I see my final rhinoplasty result?",
    a: "Rhinoplasty results develop gradually. Initial swelling and bruising peak in the first 48–72 hours and then begin to resolve. Most patients look presentable (with some residual swelling) by day 10–14. Around 70% of your final result is visible at 3 months. The remaining swelling, particularly at the tip, continues to refine for up to 12 months. This is why our aftercare support runs for a full year — we check in with you at 1 month, 3 months, and 12 months to monitor your progress.",
  },
  {
    q: "Can I combine rhinoplasty with other procedures?",
    a: "Yes, in many cases rhinoplasty can be combined with other facial procedures during the same surgical session, subject to your surgeon's assessment. Common combinations include septoplasty (to correct a deviated septum), chin augmentation, or ear correction. Combining procedures can reduce overall recovery time compared to having each done separately. Your surgeon will evaluate whether combination surgery is appropriate for you during your pre-operative consultation. We will always prioritise your safety above scheduling convenience.",
  },
];

const trustBlocks = [
  {
    icon: "🎖️",
    title: "Dual Health Tourism Certification",
    desc: "Both our agency and our partner hospital hold Turkey's official Health Tourism Authorization Certificate — the highest accreditation standard issued by the Ministry of Health.",
  },
  {
    icon: "🌍",
    title: "World's First Package System",
    desc: "We pioneered the all-inclusive health tourism package model. No one has more experience doing this right.",
  },
  {
    icon: "📋",
    title: "Since 2018. 5,000+ Patients.",
    desc: "Serving international patients from the USA, UK, and Europe since 2018. Experience you can trust.",
  },
];

const whyMCT = [
  { icon: "✓", title: "Truly Hassle-Free", desc: "Every detail handled — no research, no coordination, no stress on your end." },
  { icon: "🎧", title: "Dedicated GO Coordinator", desc: "Your personal 'Gentle Organiser' from airport arrival to departure. You are never alone." },
  { icon: "★", title: "Zero Question Marks", desc: "We've heard every question. Since 2018 we have the answers before you even ask them." },
  { icon: "⚡", title: "Board-Certified Surgeons", desc: "We work exclusively with board-certified plastic and ENT surgeons with extensive international patient experience." },
  { icon: "🛡️", title: "Ministry of Health Approved", desc: "Exclusively partnered with Ministry of Health approved hospitals. No shortcuts. No compromises." },
];

const journeySteps = [
  { num: "1", title: "Free Online Consultation", desc: "Send us your photos via WhatsApp or the form. We review your case, recommend a package, and answer every question — at no cost." },
  { num: "2", title: "Day 1 — Arrival in Istanbul", desc: "Private airport pickup, hotel check-in, rest. Your GO (personal coordinator) meets you upon arrival." },
  { num: "3", title: "Day 2 — Pre-Op Consultation", desc: "Full examination, blood tests, and your surgical plan is finalised with your surgeon. Computer imaging may be used to preview your expected result." },
  { num: "4", title: "Day 3 — Rhinoplasty Surgery", desc: "Your procedure is performed under general anaesthesia. You stay one night in hospital for post-operative monitoring. Your GO stays with you throughout." },
  { num: "5", title: "Day 4 — Hospital Discharge", desc: "Post-op check, discharge from hospital. Your GO accompanies you back to your hotel. Rest and recovery begins." },
  { num: "6", title: "Days 5–7 — Recovery at Hotel", desc: "Rest, light walks, swelling and bruising begin to resolve. Your GO is available for any questions or needs throughout." },
  { num: "7", title: "Return Home & Ongoing Support", desc: "Fly home confidently. Cast removal (if applicable) is timed before departure. 12 months of online aftercare support from our team." },
];

const recoveryTimeline = [
  { val: "1 Week", label: "Splint / cast removed" },
  { val: "2 Weeks", label: "Return to work" },
  { val: "3 Months", label: "70% of final result visible" },
  { val: "12 Months", label: "Full final result & aftercare" },
];

const testimonials = [
  {
    name: "Patient — USA",
    source: "Google Review · US · Placeholder",
    text: "I travelled from the US and Medical Center Turkey made everything seamless. My coordinator was with me every step — airport, hotel, hospital. The surgeon was exceptional. I am absolutely thrilled with my result.",
  },
  {
    name: "Patient — United Kingdom",
    source: "Trustpilot · GB · Placeholder",
    text: "I was nervous about having surgery abroad but this team put me completely at ease. The hospital was modern, the surgeon was professional and kind, and my GO handled everything so I never felt lost or alone.",
  },
  {
    name: "Patient — Canada",
    source: "Google Review · CA · Placeholder",
    text: "The price difference compared to Canada was significant but the quality was exactly the same — actually better in terms of personal attention. My result is natural and exactly what I wanted. Highly recommend.",
  },
];

export default function RhinoplastyLanding() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", country: "", email: "", phone: "", pkg: "", message: "" });
  const [fsState, handleFormspreeSubmit] = useForm("maewyylb");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const countPatients = useCountUp(5000, 2000, statsVisible);

  const scrollToForm = () => {
    document.getElementById("rh-form-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWhatsApp = () => {
    const text = `Hello MCT,%0A%0AName: ${form.name}%0ACountry: ${form.country}%0AEmail: ${form.email}%0APhone: ${form.phone}%0APackage: ${form.pkg}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
  };

  const handleEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleFormspreeSubmit({
      name: form.name,
      country: form.country,
      email: form.email,
      phone: form.phone,
      package: form.pkg,
      message: form.message,
      _subject: `Rhinoplasty Inquiry — Medical Center Turkey`,
      _replyto: form.email,
    } as never);
  };

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-5 pt-24 pb-36">
        <Image src="/mct_head_office.jpg" alt="Medical Center Turkey Istanbul" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,57,128,0.45) 0%, rgba(5,57,128,0.65) 55%, rgba(3,30,70,0.95) 100%)" }} />
        <div className="relative max-w-4xl mx-auto w-full">
          <div className="inline-block mb-7" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", padding: "8px 18px", borderRadius: 100 }}>
            Istanbul&apos;s Complete Rhinoplasty Experience · Since 2018
          </div>
          <h1 className="font-extrabold leading-tight text-white" style={{ fontSize: "clamp(34px, 6vw, 64px)", lineHeight: 1.1, maxWidth: 820, margin: "0 auto 24px" }}>
            Rhinoplasty <span style={{ color: "#A3C6CF" }}>Turkey.</span><br />
            Done Right. From Start to Finish.
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.75)", maxWidth: 620, margin: "0 auto 44px" }}>
            You fly to Istanbul. We take care of everything else — the surgery, the hospital stay, the hotel, the transfers, the aftercare. You just focus on your result.
          </p>

          {/* Nose icon */}
          <div className="flex justify-center mb-12">
            <svg viewBox="0 0 100 100" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.06)" stroke="#A3C6CF" strokeWidth="3" />
              <path d="M 50 18 C 50 18 44 30 40 44 C 36 58 32 64 32 72 C 32 74 34 76 38 76 C 42 76 44 72 50 72 C 56 72 58 76 62 76 C 66 76 68 74 68 72 C 68 64 64 58 60 44 C 56 30 50 18 50 18 Z" fill="rgba(163,198,207,0.2)" stroke="#A3C6CF" strokeWidth="1.8" />
              <path d="M 50 18 C 50 18 50 38 50 58" stroke="rgba(163,198,207,0.4)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
              <ellipse cx="40" cy="73" rx="6" ry="4" fill="rgba(163,198,207,0.25)" stroke="#A3C6CF" strokeWidth="1.2" />
              <ellipse cx="60" cy="73" rx="6" ry="4" fill="rgba(163,198,207,0.25)" stroke="#A3C6CF" strokeWidth="1.2" />
            </svg>
          </div>

          <div className="flex justify-center gap-8 mt-4 flex-wrap" ref={statsRef}>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>2018</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Since</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>
                {statsVisible ? (countPatients >= 5000 ? "5,000+" : countPatients.toLocaleString()) : "0"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>International Patients</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>7</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Days Stay</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>12 Mo</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Aftercare Support</div>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-3 mt-10">
            {[
              { label: "Ministry of Health Certified" },
              { label: "TÜRSAB Licensed" },
              { label: "★ 4.9 Trustpilot" },
            ].map((b) => (
              <div key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "7px 16px" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6.5" fill="#A3C6CF" /><path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.90)", letterSpacing: 0.3 }}>{b.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <button
              onClick={scrollToForm}
              style={{ background: "linear-gradient(135deg, #1b5fa8, #1ab3c8)", color: "#fff", padding: "16px 36px", borderRadius: 100, fontWeight: 700, fontSize: 17, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(27,95,168,0.35)" }}
            >
              Get Free Consultation
            </button>
            <a
              href="https://wa.me/908508888911"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "rgba(255,255,255,0.10)", color: "#fff", padding: "16px 28px", borderRadius: 100, fontWeight: 600, fontSize: 16, border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#25D366" aria-hidden><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.32-1.39a9.87 9.87 0 0 0 4.67 1.19h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.16 0 4.2.84 5.73 2.37a8.07 8.07 0 0 1 2.38 5.75c0 4.48-3.65 8.13-8.13 8.13a8.1 8.1 0 0 1-4.14-1.13l-.3-.17-3.16.83.84-3.08-.19-.32a8.09 8.09 0 0 1-1.24-4.32c0-4.48 3.65-8.06 8.21-8.06zm-4.7 4.6c-.16 0-.42.06-.64.31s-.85.83-.85 2.02.87 2.35.99 2.51c.12.16 1.7 2.6 4.13 3.64 2.04.87 2.46.7 2.9.66.44-.04 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28s-1.42-.7-1.64-.78-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.18 7.2 7.2 0 0 1-1.33-1.65c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.75-1.8-.2-.47-.4-.4-.54-.41z" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. PACKAGES ─────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>All-Inclusive Packages</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>Choose Your Package</h2>
            <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, margin: "0 auto 52px" }}>Fixed, transparent pricing. No hidden costs. Everything included from day one.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div key={pkg.name} className="relative flex flex-col" style={{ background: "#fff", borderRadius: 16, border: pkg.highlight ? "2px solid #5788AC" : "1px solid rgba(87,136,172,0.18)", overflow: "hidden", boxShadow: "0 2px 12px rgba(5,57,128,0.05)", transition: "box-shadow .2s, transform .2s" }}>
                {pkg.badge && (
                  <div style={{ position: "absolute", top: 0, right: 0, background: "#053980", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "6px 16px", borderRadius: "0 0 0 10px", textTransform: "uppercase" }}>
                    {pkg.badge}
                  </div>
                )}
                <div style={{ padding: "32px 28px 24px", background: pkg.highlight ? "#053980" : "#F4F8FB", borderBottom: "1px solid rgba(87,136,172,0.12)" }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: pkg.highlight ? "#A3C6CF" : "#5788AC", marginBottom: 10 }}>{pkg.tier}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: pkg.highlight ? "#fff" : "#053980", marginBottom: 16, minHeight: 58 }}>{pkg.name}</div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: pkg.highlight ? "#fff" : "#053980", lineHeight: 1 }}>
                    <sup style={{ fontSize: 22, fontWeight: 600, color: pkg.highlight ? "#A3C6CF" : "#5788AC", verticalAlign: "super" }}>€</sup>
                    {pkg.price}
                  </div>
                  <div style={{ fontSize: 13, color: pkg.highlight ? "rgba(255,255,255,0.6)" : "#6B7C8D", marginTop: 6 }}>{pkg.subtitle}</div>
                </div>
                <div style={{ padding: 28, flex: 1 }}>
                  <ul className="space-y-3">
                    {pkg.inclusions.map((item, i) => (
                      <li key={i} className="flex gap-3 items-start" style={{ fontSize: 14, color: "#1A2A3A" }}>
                        <Check size={15} style={{ color: "#5788AC", flexShrink: 0, marginTop: 2 }} />
                        <span className={item.startsWith("Everything") ? "font-semibold" : ""}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ margin: "8px 28px 28px" }}>
                  <button onClick={scrollToForm} style={{
                    display: "block", width: "100%", textAlign: "center", padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s",
                    ...(pkg.cta === "gold"
                      ? { background: "#053980", color: "#fff", border: "none" }
                      : { background: "transparent", color: "#053980", border: "1.5px solid rgba(5,57,128,0.3)" })
                  }}>
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#F4F8FB", border: "1px solid rgba(87,136,172,0.25)", borderRadius: 10, padding: "16px 24px", fontSize: 14, color: "#6B7C8D", marginTop: 28, textAlign: "center" }}>
            Final treatment suitability is determined by your surgeon following pre-operative examination. Credit card payments carry a 10% surcharge.
          </div>
        </div>
      </section>

      {/* ── 3. BEFORE / AFTER ───────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Real Results · Real Patients</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>See the Difference. Judge for Yourself.</h2>
            <p style={{ fontSize: 16, color: "#6B7C8D" }}>Every result is from a real Medical Center Turkey patient. Natural profiles, real transformations — no filters, no tricks.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(5,57,128,0.08)", background: "#fff", aspectRatio: "1/1", position: "relative" }}>
                <Image
                  src={`/treatments/rhinoplasty/before-after/rhinoplasty-result-${n}.jpg`}
                  alt={`Rhinoplasty before and after result ${n} — Medical Center Turkey patient`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ fontSize: 16, color: "#6B7C8D", marginBottom: 20 }}>Ready to start your transformation?</p>
            <button onClick={scrollToForm} style={{ background: "#053980", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Get Your Free Consultation <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. TRUST ─────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Since 2018</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>We Answer Every Question. Before You Even Ask.</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Most patients arrive nervous and full of doubts. They leave confident. Because since 2018, we&apos;ve been removing every single question mark from this journey.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustBlocks.map((b) => (
              <div key={b.title} style={{ background: "#fff", border: "1px solid rgba(87,136,172,0.15)", borderRadius: 12, padding: "28px 22px", textAlign: "center", boxShadow: "0 2px 8px rgba(5,57,128,0.04)" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#053980", marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: "#6B7C8D" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. JOURNEY ───────────────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Step by Step</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>7 Days. Life-Changing Results.</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Your entire Istanbul experience is planned, coordinated, and supported by our team from the moment you land.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              {journeySteps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 28, padding: "28px 0", borderBottom: i < journeySteps.length - 1 ? "1px solid rgba(87,136,172,0.1)" : "none" }}>
                  <div style={{ width: 52, height: 52, minWidth: 52, background: "#053980", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17 }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#053980", marginBottom: 6 }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: "#6B7C8D" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-center">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#053980", marginBottom: 24 }}>Recovery Timeline</h3>
              <div className="grid grid-cols-2 gap-4">
                {recoveryTimeline.map((r) => (
                  <div key={r.val} style={{ background: "#fff", borderRadius: 10, padding: 20, textAlign: "center", borderTop: "3px solid #5788AC", boxShadow: "0 2px 8px rgba(5,57,128,0.05)" }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#053980", marginBottom: 6 }}>{r.val}</div>
                    <div style={{ fontSize: 12, color: "#6B7C8D" }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Patient Reviews</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>What Our Patients Say</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Unprompted reviews from patients who trusted us with their rhinoplasty experience in Istanbul.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((r) => (
              <div key={r.name} style={{ background: "#F4F8FB", border: "1px solid rgba(87,136,172,0.15)", borderRadius: 16, padding: 28 }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: 16 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#1A2A3A", lineHeight: 1.7, marginBottom: 20 }}>&ldquo;{r.text}&rdquo;</p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#053980" }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7C8D", marginTop: 2 }}>{r.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHY MCT ───────────────────────────────────────────── */}
      <section className="relative py-20 px-5">
        <Image src="/mct_head_office.jpg" alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,40,90,0.88) 0%, rgba(4,40,90,0.82) 100%)" }} />
        <div className="relative" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#A3C6CF", marginBottom: 14 }}>Why Us</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>Why Patients Choose Medical Center Turkey</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 560, marginBottom: 52 }}>We built this industry. We know exactly what can go wrong — and we&apos;ve eliminated it from your journey.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyMCT.map((item) => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "24px 22px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#A3C6CF", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>What is a GO — Gentle Organiser?</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>Every patient gets a dedicated English-speaking coordinator who handles your transfers, translates at the hospital, stays with you during your procedure, and is available throughout your entire stay in Istanbul.</p>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ + FORM ────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #053980, #031e46)", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left — FAQ */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#A3C6CF", marginBottom: 14 }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>The most common questions from our international rhinoplasty patients — answered honestly.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
                    <button
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left"
                      style={{ padding: "16px 20px", cursor: "pointer", background: "none", border: "none" }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{faq.q}</span>
                      <span style={{ fontSize: 20, color: "#A3C6CF", transition: "transform .2s", transform: faqOpen === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
                    </button>
                    {faqOpen === i && (
                      <div style={{ padding: "0 20px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div id="rh-form-box" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", scrollMarginTop: "80px" }}>
              <div id="consultation" />
              <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Get Your Free Consultation</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>We&apos;ll respond within 24 hours</div>
              </div>
              {fsState.succeeded ? (
                <div style={{ padding: 48, textAlign: "center" }}>
                  <CheckCircle size={48} style={{ color: "#A3C6CF", margin: "0 auto 16px" }} />
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Request Sent!</div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>We&apos;ve received your request and will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }} onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", key: "name", type: "text", ph: "John Smith" },
                      { label: "Country", key: "country", type: "text", ph: "United Kingdom" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>{f.label}</label>
                        <input type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none" }} />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Email Address", key: "email", type: "email", ph: "john@example.com" },
                      { label: "WhatsApp / Phone", key: "phone", type: "tel", ph: "+1 234 567 8900" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>{f.label}</label>
                        <input type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none" }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Which package are you interested in?</label>
                    <select value={form.pkg} onChange={e => setForm({ ...form, pkg: e.target.value })}
                      style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none" }}>
                      <option value="" style={{ color: "#000" }}>Select a package...</option>
                      <option value="Premium Package — From €2,500" style={{ color: "#000" }}>Premium Package — From €2,500</option>
                      <option value="Hassle-Free Package — From €3,000" style={{ color: "#000" }}>Hassle-Free Package — From €3,000</option>
                      <option value="Executive Package — From €4,200" style={{ color: "#000" }}>Executive Package — From €4,200</option>
                      <option value="Not sure yet" style={{ color: "#000" }}>Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Your Message (optional)</label>
                    <textarea rows={3} placeholder="Tell us about your goals or ask any questions..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none", resize: "vertical" }} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={handleWhatsApp}
                      style={{ flex: 1, background: "#25D366", color: "#fff", padding: "14px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <MessageCircle size={16} /> Send via WhatsApp
                    </button>
                    <button type="button" onClick={handleEmail} disabled={fsState.submitting}
                      style={{ flex: 1, background: "#2884C0", color: "#fff", padding: "14px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: fsState.submitting ? 0.6 : 1 }}>
                      <Send size={16} /> {fsState.submitting ? "Sending..." : "Send My Consultation Request"}
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>No commitment required · No spam · We reply within 24 hours</p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
