"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "@formspree/react";
import { Check, MessageCircle, Send, CheckCircle, ArrowRight } from "lucide-react";
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
    price: "4,000",
    subtitle: "Surgery only · Both eyes · No hidden fees",
    highlight: false,
    badge: null as string | null,
    cta: "outline",
    inclusions: [
      "Cataract Surgery — Both Eyes",
      "Premium IOL (Intraocular Lens) — Both Eyes",
      "Pre-Op Full Eye Examination & Biometry",
      "Local Anaesthesia",
      "Post-Op Eye Drops & Protective Goggles",
      "Day-After Follow-Up Appointment",
      "Translator / Interpreter",
      "GO Assistance on Surgery Day",
    ],
  },
  {
    tier: "Complete",
    name: "Hassle-Free Package",
    price: "5,500",
    subtitle: "All-inclusive · 4 nights stay",
    highlight: true,
    badge: "MOST POPULAR",
    cta: "gold",
    inclusions: [
      "Everything in Premium",
      "Private Airport Transfers (Two Way)",
      "4 Nights @ 4-Star Hotel",
      "Breakfast at Hotel",
      "Dedicated GO Coordinator Throughout Stay",
    ],
  },
  {
    tier: "Luxury",
    name: "Executive Package",
    price: "6,500",
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
    q: "What is included in the Medical Center Turkey cataract surgery package?",
    a: "Our Hassle-Free Package covers everything from arrival to recovery. This includes cataract surgery on both eyes with a premium intraocular lens (IOL), a full pre-operative eye examination and biometry measurements, local anaesthesia, post-operative eye drops and protective goggles, a day-after follow-up appointment, private two-way airport transfers, 4 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. One clear price — no hidden fees.",
  },
  {
    q: "How much does cataract surgery cost in Turkey with Medical Center Turkey?",
    a: "Our Premium Package starts from €4,000 and covers the surgery on both eyes including a premium IOL, pre-op examination, and follow-up. The Hassle-Free Package is €5,500 and adds 4 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €6,500 and includes 5-star accommodation and the full Istanbul VIP experience.",
  },
  {
    q: "What type of lens (IOL) is included in the package?",
    a: "Our packages include a premium intraocular lens (IOL) for both eyes. Your surgeon will discuss lens options during your pre-operative consultation, including monofocal, multifocal, and toric lenses depending on your visual needs and lifestyle. The most suitable lens type is determined after your biometry measurements and a detailed discussion with your surgeon.",
  },
  {
    q: "How many days do I need to stay in Istanbul for cataract surgery?",
    a: "We recommend 4 to 5 days. Day 1 is arrival and rest. Day 2 is your pre-operative eye examination and biometry. Day 3 is your surgery — cataract surgery is an outpatient procedure performed under local anaesthesia, typically taking 20–30 minutes per eye. Day 4 is your follow-up appointment to confirm healing. Most patients can fly home comfortably on Day 5.",
  },
  {
    q: "Is cataract surgery in Turkey safe?",
    a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner ophthalmologists are board-certified eye surgeons with extensive experience in cataract and refractive surgery for international patients, using the latest generation phacoemulsification technology.",
  },
  {
    q: "What does cataract surgery involve?",
    a: "Modern cataract surgery uses a technique called phacoemulsification. A tiny incision is made in the cornea, the clouded natural lens is broken up using ultrasound and gently removed, and a clear artificial intraocular lens (IOL) is inserted in its place. The procedure is performed under local anaesthetic eye drops — no needles, no stitches — and takes approximately 20–30 minutes per eye. Most patients notice improved vision within 24 hours.",
  },
  {
    q: "What is the recovery process after cataract surgery?",
    a: "Recovery is fast. Most patients notice significantly clearer vision within 24 to 48 hours. You should use the prescribed eye drops as instructed, avoid rubbing your eyes, and wear protective goggles during sleep for the first week. Avoid swimming and dusty environments for 2 weeks. Full visual stabilisation typically occurs within 4–6 weeks as the eye settles around the new lens.",
  },
  {
    q: "Will I still need glasses after cataract surgery?",
    a: "This depends on the lens type chosen. Monofocal lenses correct vision at one distance — most patients choose distance correction and use reading glasses for close work. Multifocal lenses are designed to reduce dependence on glasses at multiple distances. Your surgeon will explain the options and help you choose the lens that best matches your visual expectations during your pre-operative consultation.",
  },
  {
    q: "What is the difference between the Hassle-Free and Executive packages?",
    a: "Both packages include the same surgery, lens, pre-op examination, follow-up appointment, 4 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling.",
  },
];

const whyMCT = [
  { icon: "✓", title: "Truly Hassle-Free", desc: "Every detail handled — no research, no coordination, no stress on your end." },
  { icon: "🎧", title: "Dedicated GO Coordinator", desc: "Your personal 'Gentle Organiser' from airport arrival to departure. You are never alone." },
  { icon: "★", title: "Zero Question Marks", desc: "We've heard every question. We have the answers before you even ask them." },
  { icon: "👁️", title: "Premium IOL Included", desc: "A premium intraocular lens for both eyes is always included — no unexpected lens upgrade fees." },
  { icon: "⚡", title: "No-Stitch Technique", desc: "Modern phacoemulsification — no needles, no stitches, no general anaesthesia. Fast, safe, and proven." },
  { icon: "🛡️", title: "Ministry of Health Authorized", desc: "We operate under official authorization from the Turkish Ministry of Health. No shortcuts. No compromises." },
];

const journeySteps = [
  { num: "1", title: "Free Online Consultation", desc: "Share your current vision prescription and any eye health history via WhatsApp or the form. We review your case, recommend a package, and answer every question — at no cost." },
  { num: "2", title: "Day 1 — Arrival in Istanbul", desc: "Private airport pickup, hotel check-in, rest. Your GO (personal coordinator) meets you upon arrival." },
  { num: "3", title: "Day 2 — Eye Examination & Biometry", desc: "A comprehensive pre-operative eye examination including biometry measurements to determine the precise IOL power for your eyes. Your surgeon discusses lens options and confirms your surgical plan." },
  { num: "4", title: "Day 3 — Surgery", desc: "Cataract surgery on both eyes performed as an outpatient procedure under local anaesthetic eye drops. Each eye takes approximately 20–30 minutes. You return to your hotel to rest — most patients notice clearer vision by evening." },
  { num: "5", title: "Day 4 — Follow-Up Appointment", desc: "A follow-up examination confirms your eyes are healing well and your vision is stabilising. Your GO accompanies you to every appointment." },
  { num: "6", title: "Return Home with Clear Vision", desc: "Fly home confidently with your post-op eye drop schedule and full aftercare instructions. 12 months of online aftercare support from our team." },
];

const recoveryTimeline = [
  { val: "24–48 Hrs", label: "Clearer vision begins" },
  { val: "1 Week", label: "Light sensitivity resolves" },
  { val: "2 Weeks", label: "Return to normal activity" },
  { val: "12 Months", label: "Full aftercare support" },
];

const testimonials = [
  {
    name: "Ann Black",
    source: "Trustpilot · IE · January 2023",
    text: "My sister & i went for lens replacement, the staff at the hospital were very efficient and we were very happy with the care that we were given. Everything was so organized, our transport, at the hotel Dedeman, we had a lovely stay there the staff were very helpful and friendly and the food was delicious and reasonably priced. I would have no hesitation in recommending anyone travelling to Turkey for surgery.",
  },
];

export default function CataractLanding() {
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
    document.getElementById("cataract-form-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      _subject: `Cataract Surgery Inquiry — Medical Center Turkey`,
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
            Istanbul&apos;s Complete Cataract Surgery Experience
          </div>
          <h1 className="font-extrabold leading-tight text-white" style={{ fontSize: "clamp(34px, 6vw, 64px)", lineHeight: 1.1, maxWidth: 820, margin: "0 auto 24px" }}>
            Cataract Surgery <span style={{ color: "#A3C6CF" }}>Turkey.</span><br />
            See Clearly Again. From Start to Finish.
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.75)", maxWidth: 620, margin: "0 auto 44px" }}>
            You fly to Istanbul. We take care of everything else — the surgery, the premium lens, the hotel, the transfers, the aftercare. Both eyes. One trip.
          </p>

          {/* Eye / Lens Icon */}
          <div className="flex justify-center mb-12">
            <svg viewBox="0 0 100 100" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.06)" stroke="#A3C6CF" strokeWidth="3" />
              <path d="M 18 50 Q 35 30 50 30 Q 65 30 82 50 Q 65 70 50 70 Q 35 70 18 50 Z" fill="rgba(163,198,207,0.15)" stroke="#A3C6CF" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="50" cy="50" r="12" fill="rgba(163,198,207,0.2)" stroke="#A3C6CF" strokeWidth="1.8" />
              <circle cx="50" cy="50" r="5" fill="#A3C6CF" />
              <line x1="50" y1="38" x2="50" y2="34" stroke="#A3C6CF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="50" y1="62" x2="50" y2="66" stroke="#A3C6CF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="38" y1="50" x2="34" y2="50" stroke="#A3C6CF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="62" y1="50" x2="66" y2="50" stroke="#A3C6CF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex justify-center gap-8 mt-4 flex-wrap" ref={statsRef}>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>
                {statsVisible ? (countPatients >= 5000 ? "5,000+" : countPatients.toLocaleString()) : "0"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>International Patients</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>4</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Days Stay</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>12 Mo</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Aftercare Support</div>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-3 mt-10">
            {[
              { label: "Ministry of Health Authorized" },
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
            <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, margin: "0 auto 52px" }}>Fixed, transparent pricing. Both eyes and premium lens included. No hidden costs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div key={pkg.name} className="relative flex flex-col" style={{ background: "#fff", borderRadius: 16, border: pkg.highlight ? "2px solid #5788AC" : "1px solid rgba(87,136,172,0.18)", overflow: "hidden", boxShadow: "0 2px 12px rgba(5,57,128,0.05)" }}>
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
                    display: "block", width: "100%", textAlign: "center", padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer",
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
            Final treatment suitability is determined by your surgeon following pre-operative eye examination. Credit card payments carry a 10% surcharge.
          </div>


          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a
              href="/#packages"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid rgba(87,136,172,0.35)", color: "#5788AC", borderRadius: 100, padding: "11px 26px", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#053980"; (e.currentTarget as HTMLAnchorElement).style.color = "#053980"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(87,136,172,0.35)"; (e.currentTarget as HTMLAnchorElement).style.color = "#5788AC"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              View All Treatment Packages
            </a>
          </div>
        </div>
      </section>
      {/* ── 4. JOURNEY ───────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Step by Step</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>4 Days. A Lifetime of Clear Vision.</h2>
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
                  <div key={r.val} style={{ background: "#F4F8FB", borderRadius: 10, padding: 20, textAlign: "center", borderTop: "3px solid #5788AC", boxShadow: "0 2px 8px rgba(5,57,128,0.05)" }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#053980", marginBottom: 6 }}>{r.val}</div>
                    <div style={{ fontSize: 12, color: "#6B7C8D" }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Patient Reviews</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>What Our Patients Say</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Unprompted reviews from patients who trusted us with their cataract surgery in Istanbul.</p>
          <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
            {testimonials.map((r) => (
              <div key={r.name} style={{ background: "#fff", border: "1px solid rgba(87,136,172,0.15)", borderRadius: 16, padding: 28 }}>
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

      {/* ── 6. WHY MCT ───────────────────────────────────────────── */}
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

      {/* ── 7. FAQ + FORM ────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #053980, #031e46)", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left — FAQ */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#A3C6CF", marginBottom: 14 }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>The most common questions from our international cataract surgery patients — answered honestly.</p>
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
            <div id="cataract-form-box" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", scrollMarginTop: "80px" }}>
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
                      <option value="Premium Package — From €4,000" style={{ color: "#000" }}>Premium Package — From €4,000</option>
                      <option value="Hassle-Free Package — From €5,500" style={{ color: "#000" }}>Hassle-Free Package — From €5,500</option>
                      <option value="Executive Package — From €6,500" style={{ color: "#000" }}>Executive Package — From €6,500</option>
                      <option value="Not sure yet" style={{ color: "#000" }}>Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Your Message (optional)</label>
                    <textarea rows={3} placeholder="Tell us about your vision or ask any questions..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
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
