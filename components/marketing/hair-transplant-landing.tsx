"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "@formspree/react";
import { Check, MessageCircle, Send, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import HairTransplantVideoHero from "@/components/marketing/HairTransplantVideoHero";

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
    price: "1,400",
    subtitle: "All-inclusive · No hidden fees",
    highlight: false,
    badge: null as string | null,
    cta: "outline",
    inclusions: [
      "Max Grafts FUE / DHI Plus Gold",
      "Blood Test & PRP Treatment",
      "Medication & Foam",
      "Mesotherapy & Gold Cream",
      "Laser Treatment",
      "Aesthetic Hospital",
      "Warranty Certificate",
      "Translator / Interpreter",
      "GO's Day Care Assistance",
    ],
  },
  {
    tier: "Complete",
    name: "Gold Package",
    price: "1,700",
    subtitle: "All-inclusive · Local Anaesthesia",
    highlight: false,
    badge: "Award Winning · Best Value",
    cta: "outline",
    inclusions: [
      "Everything in Premium",
      "Local Anaesthesia",
      "Private Airport Transfers",
      "2 Nights @ 4-Star Hotel",
      "Breakfast at Hotel",
      "Free Lunch & Dinner on Operation Day",
      "Panoramic Istanbul View",
    ],
  },
  {
    tier: "Most Popular",
    name: "Hassle-Free Package",
    price: "1,870",
    subtitle: "Most popular · The package others tried to copy",
    highlight: true,
    badge: "MOST POPULAR",
    cta: "gold",
    inclusions: [
      "Everything in Gold Package",
      "Sedation — Performed Under Light Sleep · Pain Free",
      "Private Airport Transfers",
      "2 Nights @ 4-Star Hotel",
      "Breakfast at Hotel",
      "Free Lunch & Dinner on Operation Day",
      "Panoramic Istanbul View",
    ],
  },
  {
    tier: "Luxury",
    name: "Exclusive Package",
    price: "3,300",
    subtitle: "Full VIP experience · Premium accommodation",
    highlight: false,
    badge: null as string | null,
    cta: "outline",
    inclusions: [
      "Everything in Hassle-Free",
      "BMW Chauffeur (8 hours)",
      "2 Nights @ 5-Star Hotel",
      "Lunch & Dinner @ Exclusive Restaurants",
      "Sightseeing & Shopping Tour",
      "Premium Bosphorus Experience",
    ],
  },
];

const faqs = [
  {
    q: "What is included in the Medical Center Turkey hair transplant package?",
    a: "Our all-inclusive Hassle-Free Package & Gold Package cover everything you need from arrival to results. This includes the hair transplant procedure itself (FUE or DHI Plus Gold technique), blood test and PRP treatment, mesotherapy and laser treatment, gold cream and aftercare medications, private airport transfers, 2 nights at a 4-star hotel, breakfast, lunch and dinner on your operation day, a panoramic Istanbul view experience, a dedicated English-speaking GO (Gentle Organiser) who stays with you throughout your entire stay, and 12 months of online aftercare support after you return home. No hidden fees — one clear price covers everything.",
  },
  {
    q: "How much does a hair transplant in Turkey cost with Medical Center Turkey?",
    a: "Our packages start from €1,400 for the Premium Package and from €1,870 for the most popular Hassle-Free Package, which includes hotel, transfers, meals, and a personal coordinator. Our Exclusive VIP Package starts from €3,300 and includes luxury hotel accommodation, BMW chauffeur service, and private dining experiences. Final pricing may vary slightly depending on your individual case and graft requirements — we provide a personalised quote after reviewing your photos during the free consultation. There are no hidden fees.",
  },
  {
    q: "How many days do I need to stay in Istanbul for a hair transplant?",
    a: "We recommend a minimum of 3 days and 2 nights in Istanbul. Day 1 is your arrival — we pick you up from the airport and you check in to your hotel. Day 2 is your hair transplant procedure, which typically takes 6–8 hours. Day 3 includes your first professional hair wash, post-op consultation, and you receive your full aftercare kit before flying home. Most patients are comfortable returning to work within 2 days of arriving home. We have designed the entire schedule so you don't need to take more than a long weekend.",
  },
  {
    q: "Why should I choose Medical Center Turkey?",
    a: "When you book with Medical Center Turkey, you don't feel like a medical tourist in a foreign country — you feel like a VIP being taken care of at home. From the moment you land in Istanbul to the moment you fly back, someone is always by your side. Your personal English-speaking GO coordinator handles everything: transfers, hotel, hospital, translations, meals, and any question you have along the way. You never have to figure anything out alone. And our entire system is built around one goal — making sure you feel safe, comfortable, and looked after every single step of the way.",
  },
  {
    q: "Do I need to be in Istanbul for the procedure? Can it be done remotely or locally?",
    a: "Yes, you will need to travel to Istanbul for the procedure itself — hair transplant surgery must be performed in person. However, everything before and after can be handled remotely. Your free consultation happens online via WhatsApp or our contact form — just send us your photos and we will assess your case and recommend the right package. After you return home, all follow-up support for the 12 months post-procedure is provided online by our team.",
  },
  {
    q: "What is the difference between the Gold Package and the Hassle-Free Package?",
    a: "The only difference is the anaesthesia. Both packages include identical services — hotel, transfers, meals, GO coordinator, and all treatments. The Gold Package is performed under local anaesthesia, while the Hassle-Free Package uses sedation (light sleep), making it completely pain-free and anxiety-free. If you prefer to be fully awake during the procedure, the Gold Package is the right choice.",
  },
  {
    q: "What is the difference between FUE and DHI hair transplant techniques?",
    a: "Both techniques are modern and highly effective — the right choice depends on your individual case. FUE (Follicular Unit Extraction) is the gold standard method where grafts are extracted individually and implanted into the recipient area. DHI (Direct Hair Implantation) uses a specialised implanter pen to place grafts directly without creating incisions first, which can offer more precise angle and direction control. DHI is available on any of our packages for an additional €150.",
  },
  {
    q: "Is a hair transplant in Turkey safe? How do I know the quality is reliable?",
    a: "Safety is our number one priority. We work exclusively with hospitals and clinics approved by the Turkish Ministry of Health — we do not compromise on this. Turkey is one of the world's leading destinations for hair transplant procedures, with highly experienced surgeons and modern facilities at a fraction of the cost of the UK or USA. Medical Center Turkey has been operating with over 5,000 international patients treated through our network. Every hair transplant comes with an official warranty certificate.",
  },
  {
    q: "When will I see the final results of my hair transplant?",
    a: "Hair transplant results develop gradually. In the first 2–4 weeks, the transplanted hairs will shed — this is completely normal and expected. New growth begins around months 3–4. By month 6 you will see significant improvement, and your final, full result is typically visible at 12 months. This is why our aftercare support runs for a full year — we check in with you at 1 month, 3 months, and 12 months to monitor your progress.",
  },
];

const whyMCT = [
  { icon: "✓", title: "Truly Hassle-Free", desc: "From first message to final result — every detail is handled. No research, no coordination, no stress on your end." },
  { icon: "🎧", title: "Dedicated GO Coordinator", desc: "Your personal 'Gentle Organiser' is with you from airport arrival to departure. You are never alone." },
  { icon: "★", title: "Zero Question Marks", desc: "We answer every concern before you board the plane. We've heard every question — and we have the answers." },
  { icon: "⚡", title: "Fast Recovery", desc: "Back to daily life in 2 days. Most patients don't miss more than a long weekend." },
  { icon: "📄", title: "Warranty Certificate", desc: "Every hair transplant comes with an official warranty certificate — your written guarantee for peace of mind." },
  { icon: "🛡️", title: "Ministry of Health Authorized", desc: "We operate under official authorization from the Turkish Ministry of Health. No shortcuts. No compromises." },
];

const journeySteps = [
  { num: "1", title: "Free Online Consultation", desc: "Send us your photos via WhatsApp or the form. We review your case, recommend a package, and answer every question — at no cost." },
  { num: "2", title: "Day 1 — Arrival in Istanbul", desc: "Private airport pickup. Check in to your hotel. Rest and prepare. Your GO (personal coordinator) meets you upon arrival." },
  { num: "3", title: "Day 2 — Hair Transplant Surgery", desc: "FUE or DHI Plus Gold technique. Blood test and physical examination. Personalized hairline design with your surgeon. Your GO stays with you throughout." },
  { num: "4", title: "Day 3 — Follow-Up & First Wash", desc: "Post-op consultation. First professional hair wash and dressing application. Aftercare kit and full instructions provided." },
  { num: "5", title: "Return Home & Ongoing Support", desc: "Fly home confidently. We provide 12 months of online follow-up support and monitor your results every step of the way." },
];

const recoveryTimeline = [
  { val: "Next Day", label: "Independent hair washing" },
  { val: "2 Days", label: "Return to work" },
  { val: "1 Week", label: "Light exercise" },
  { val: "12 Months", label: "Full aftercare support" },
];

const testimonials = [
  {
    name: "Manish Parmar",
    source: "Trustpilot · CA · December 2024",
    text: "My case manager Mr. Can (John) Ozdemir was very professional and detailed in our initial correspondence. He is very organized and exceeds all standards of customer satisfaction and comfort. I was not nervous at all traveling from Toronto to Istanbul because I was confident that John had everything under control; from booking all appointments, picking me up from the airport and informing me of what to expect in detail. He answered all of my questions many times to make sure I understood the whole process before and after the hair transplant. I will be going back in a year to complete my 2nd session with this great team.",
  },
  {
    name: "Veronica J. S",
    source: "Trustpilot · NO · July 2022",
    text: "We had a very positive experience with the exclusive package with Turkey medical center, from the beginning to the end of our stay in Istanbul. Can picked us up at the airport and took us back to the airport on the last day. The day my husband had the hair transplant, Can was with him the whole time and took him safe back to the hotel after. He took us sightseeing exciting places and restaurants with great food the day after the operation. My husband has felt safe from he booked to operation to now, when he is home and recovering.",
  },
  {
    name: "Michael Mccloud",
    source: "Trustpilot · US · June 2024",
    text: "If you're looking for a professional clinic for hair transplants in Istanbul, this is the one. Can the patient rep is highly communicative and professional, shows up on time and escorts you through the whole process from start to finish. This is not a transplant mill — these are highly trained and skilled medical professionals. After the initial examination, the surgery is scheduled the next morning. And you're back in the hotel that afternoon with new hair. Can't recommend enough.",
  },
  {
    name: "Glenn Thompson",
    source: "Trustpilot · GB · February 2024",
    text: "Would recommend to anyone wanting a hair transplant. You get your own local assistant who picks you up from the airport, takes you to hotel, takes you to clinic and back. My host (a fantastic chap called Can) is amazing and really puts so much effort into making sure you are okay. The value for money is amazing as the package includes hotel, transplant, additional treatments and all transport.",
  },
];

export default function HairTransplantLanding() {
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
  const countAftercare = useCountUp(12, 1200, statsVisible);

  const scrollToForm = () => {
    document.getElementById("ht-form-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      _subject: `Hair Transplant Inquiry — Medical Center Turkey`,
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
            Istanbul&apos;s Complete Hair Transplant Experience
          </div>
          <h1 className="font-extrabold leading-tight text-white" style={{ fontSize: "clamp(34px, 6vw, 64px)", lineHeight: 1.1, maxWidth: 820, margin: "0 auto 24px" }}>
            Hair Transplant <span style={{ color: "#A3C6CF" }}>Turkey.</span><br />
            Done Right. From Start to Finish.
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.75)", maxWidth: 600, margin: "0 auto 44px" }}>
            You fly to Istanbul. We take care of everything else — the surgery, the hotel, the transfers, the aftercare. You just focus on your results.
          </p>

          {/* Hair follicle icon */}
          <div className="flex justify-center mb-12">
            <svg viewBox="0 0 100 100" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.06)" stroke="#A3C6CF" strokeWidth="3" />
              <path d="M 8 64 Q 28 56 50 59 Q 72 56 92 64 L 92 96 Q 50 98 8 96 Z" fill="rgba(163,198,207,0.25)" />
              <path d="M 8 64 Q 28 56 50 59 Q 72 56 92 64" fill="none" stroke="#A3C6CF" strokeWidth="1.5" />
              <ellipse cx="31" cy="68" rx="5" ry="7" fill="rgba(255,255,255,0.1)" stroke="#A3C6CF" strokeWidth="1.2" />
              <circle cx="31" cy="72" r="3" fill="#A3C6CF" />
              <path d="M 29 62 Q 28 45 27 28" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 33 62 Q 34 45 35 30" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
              <ellipse cx="50" cy="66" rx="6" ry="8" fill="rgba(255,255,255,0.1)" stroke="#A3C6CF" strokeWidth="1.2" />
              <circle cx="50" cy="71" r="3.5" fill="#A3C6CF" />
              <path d="M 48 59 Q 47 38 46 16" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9" />
              <path d="M 52 59 Q 53 38 54 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
              <ellipse cx="69" cy="68" rx="5" ry="7" fill="rgba(255,255,255,0.1)" stroke="#A3C6CF" strokeWidth="1.2" />
              <circle cx="69" cy="72" r="3" fill="#A3C6CF" />
              <path d="M 67 62 Q 66 46 65 31" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 71 62 Q 72 46 73 33" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
            </svg>
          </div>

          <div ref={statsRef} className="flex justify-center gap-12 mt-4 flex-wrap">
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>
                {statsVisible ? (countPatients >= 5000 ? "5,000+" : countPatients.toLocaleString()) : "0"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>International Patients</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>#1</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Package System Pioneer</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>
                {statsVisible ? `${countAftercare} Mo` : "0 Mo"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Aftercare Support</div>
            </div>
          </div>

          {/* Trust badges */}
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
        </div>
      </section>


      {/* ── VIDEO HERO ──────────────────────────────────────────── */}
      <HairTransplantVideoHero
        videoSrc="/Videos/hair-transplant-promo.mp4"
        posterSrc="/Videos/video-poster.jpg"
        onCtaClick={scrollToForm}
      />

      {/* ── 2. PACKAGES ─────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>All-Inclusive Packages</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>Choose Your Package</h2>
            <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, margin: "0 auto 52px" }}>Fixed, transparent pricing. No hidden costs. No per-graft fees. Everything included.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((pkg) => (
              <div key={pkg.name} className="relative flex flex-col" style={{ background: "#fff", borderRadius: 16, border: pkg.highlight ? "2px solid #5788AC" : "1px solid rgba(87,136,172,0.18)", overflow: "hidden", boxShadow: "0 2px 12px rgba(5,57,128,0.05)", transition: "box-shadow .2s, transform .2s" }}>
                {pkg.badge && (
                  <div style={{ position: "absolute", top: 0, right: 0, background: "#053980", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "6px 16px", borderRadius: "0 0 0 10px", textTransform: "uppercase" }}>
                    {pkg.badge}
                  </div>
                )}
                {/* Header */}
                <div style={{ padding: "32px 28px 24px", background: pkg.highlight ? "#053980" : "#F4F8FB", borderBottom: "1px solid rgba(87,136,172,0.12)" }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: pkg.highlight ? "#A3C6CF" : "#5788AC", marginBottom: 10 }}>{pkg.tier}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: pkg.highlight ? "#fff" : "#053980", marginBottom: 16, minHeight: 58 }}>{pkg.name}</div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: pkg.highlight ? "#fff" : "#053980", lineHeight: 1 }}>
                    <sup style={{ fontSize: 22, fontWeight: 600, color: pkg.highlight ? "#A3C6CF" : "#5788AC", verticalAlign: "super" }}>€</sup>
                    {pkg.price}
                  </div>
                  <div style={{ fontSize: 13, color: pkg.highlight ? "rgba(255,255,255,0.6)" : "#6B7C8D", marginTop: 6 }}>{pkg.subtitle}</div>
                </div>
                {/* Body */}
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
            <strong style={{ color: "#053980" }}>DHI Technique</strong>: Available with an additional €150 fee on any package. Credit card payments carry a 10% surcharge.
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

      {/* ── 3. BEFORE / AFTER ───────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Real Results · Real Patients</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>See the Difference. Judge for Yourself.</h2>
            <p style={{ fontSize: 16, color: "#6B7C8D" }}>Every result is from a real Medical Center Turkey patient. Natural hairlines, natural growth — no filters, no tricks.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 8, 9].map((n) => (
              <div key={n} style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(5,57,128,0.08)", background: "#fff", aspectRatio: "1/1", position: "relative", transition: "transform .2s, box-shadow .2s" }}>
                <Image
                  src={`/treatments/hair-transplant/landing/hair_transplant-before-and-after-${n}.webp`}
                  alt={`Hair transplant before and after result ${n}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ fontSize: 16, color: "#6B7C8D", marginBottom: 20 }}>Ready to write your own before &amp; after story?</p>
            <button onClick={scrollToForm} style={{ background: "#053980", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Get Your Free Consultation <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
      {/* ── 5. JOURNEY ───────────────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Step by Step</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>3 Days. Life-Changing Results.</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Your entire Istanbul experience is planned, coordinated, and supported by our team.</p>

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
                  <div key={r.val} style={{ background: "#F4F8FB", borderRadius: 10, padding: 20, textAlign: "center", borderTop: "3px solid #5788AC" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#053980", marginBottom: 6 }}>{r.val}</div>
                    <div style={{ fontSize: 12, color: "#6B7C8D" }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
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
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>Every patient gets a dedicated English-speaking coordinator who handles your transfers, translates at the hospital, stays with you during your procedure, and is available 24/7 throughout your stay.</p>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Patient Reviews</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>What Our Patients Say</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Unprompted reviews from patients who trusted us with their hair transplant experience in Istanbul.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* ── 8. FAQ + FORM ────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #053980, #031e46)", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left — FAQ */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#A3C6CF", marginBottom: 14 }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>The most common questions from our international patients — answered honestly.</p>
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
            <div id="ht-form-box" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", scrollMarginTop: "80px" }}>
              <div id="consultation" />
              <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Get Your Free Hair Analysis</div>
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
                    <option value="Premium Package — From €1,400" style={{ color: "#000" }}>Premium Package — From €1,400</option>
                    <option value="Gold Package — From €1,700" style={{ color: "#000" }}>Gold Package — From €1,700</option>
                    <option value="Hassle-Free Package — From €1,870" style={{ color: "#000" }}>Hassle-Free Package — From €1,870</option>
                    <option value="Exclusive Package — From €3,300" style={{ color: "#000" }}>Exclusive Package — From €3,300</option>
                    <option value="Not sure yet" style={{ color: "#000" }}>Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Your Message (optional)</label>
                  <textarea rows={3} placeholder="Tell us about your hair loss situation..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
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
