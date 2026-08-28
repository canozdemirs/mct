"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "@formspree/react";
import { Check, MessageCircle, Send, CheckCircle } from "lucide-react";
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

const tiers = [
  {
    id: "standard",
    label: "Standard",
    price: "From $750",
    tagline: "Essential full-body screening",
    packages: [
      {
        name: "Standard — Men",
        price: "$750",
        examinations: ["Internal Medicine", "Cardiology", "Urology", "Eye", "Dietitian"],
        cardiological: ["ECG", "ECHO"],
        radiological: ["Whole Abdominal Ultrasound", "Thyroid Ultrasound", "Chest X-Ray"],
        laboratory: ["Hemogram", "HbA1c", "Sedimentation", "TSH", "CEA", "CA 19-9", "CA 15-3", "AFP", "ALT", "HOMA-IR", "Vitamin B12", "Vitamin D", "Ferritin", "Creatinine", "CRP", "Complete Urine Analysis", "FOBT", "HDL", "LDL", "Triglycerides", "PSA"],
        additional: ["Uroflowmetry"],
      },
      {
        name: "Standard — Women 40+",
        price: "$750",
        examinations: ["Internal Medicine", "Cardiology", "Gynecology", "Eye", "Dietitian"],
        cardiological: ["ECG", "ECHO"],
        radiological: ["Whole Abdominal Ultrasound", "Thyroid Ultrasound", "Chest X-Ray", "Mammography"],
        laboratory: ["Hemogram", "HbA1c", "Sedimentation", "TSH", "CEA", "CA 19-9", "CA 15-3", "CA 125", "ALT", "HOMA-IR", "Vitamin B12", "Vitamin D", "Ferritin", "Creatinine", "CRP", "Complete Urine Analysis", "FOBT", "HDL", "LDL", "Triglycerides", "AFP", "Pap Smear Test"],
        additional: [],
      },
      {
        name: "Standard — Women Under 40",
        price: "$790",
        examinations: ["Internal Medicine", "Cardiology", "Gynecology", "Eye", "Dietitian"],
        cardiological: ["ECG", "ECHO"],
        radiological: ["Whole Abdominal Ultrasound", "Thyroid Ultrasound", "Chest X-Ray", "Breast Ultrasound"],
        laboratory: ["Hemogram", "HbA1c", "Sedimentation", "TSH", "CEA", "CA 19-9", "CA 15-3", "CA 125", "ALT", "HOMA-IR", "Vitamin B12", "Vitamin D", "Ferritin", "Creatinine", "CRP", "Complete Urine Analysis", "FOBT", "HDL", "LDL", "Triglycerides", "AFP", "Pap Smear Test"],
        additional: [],
      },
    ],
  },
  {
    id: "plus",
    label: "Plus",
    price: "From $1,200",
    tagline: "Extended screening with cardiac stress test",
    packages: [
      {
        name: "Plus — Men",
        price: "$1,200",
        examinations: ["Internal Medicine", "Cardiology", "Urology", "Eye", "ENT", "Dietitian"],
        cardiological: ["ECG", "ECHO", "Cardiac Stress Test"],
        radiological: ["Whole Abdominal Ultrasound", "Thyroid Ultrasound", "Chest X-Ray", "Bone Densitometry (age 40+)"],
        laboratory: ["Glucose", "HOMA-IR", "Albumin", "Total Cholesterol", "HbA1c", "Urea", "Creatinine", "Sodium", "Calcium", "Potassium", "Phosphorus", "Magnesium", "Uric Acid", "AST", "ALT", "GGT", "Total Bilirubin", "Alkaline Phosphatase", "TSH", "CEA", "CA 19-9", "CA 15-3", "Free T3", "Free T4", "HDL", "LDL", "Triglycerides", "Hemogram", "Sedimentation", "CRP", "Complete Urine Analysis", "HBsAg", "Anti-HBs", "Anti-HCV", "Iron", "Iron Binding", "Ferritin", "FOBT", "Vitamin B12", "Vitamin D", "RF", "Folic Acid", "PSA"],
        additional: ["Uroflowmetry"],
      },
      {
        name: "Plus — Women",
        price: "$1,200",
        examinations: ["Internal Medicine", "Cardiology", "Gynecology", "Eye", "ENT", "Dietitian"],
        cardiological: ["ECG", "ECHO", "Cardiac Stress Test"],
        radiological: ["Whole Abdominal Ultrasound", "Thyroid Ultrasound", "Chest X-Ray", "Mammography (40+) / Breast US (under 40)", "Bone Densitometry (40+)"],
        laboratory: ["Glucose", "HOMA-IR", "Albumin", "Total Cholesterol", "HbA1c", "Urea", "Creatinine", "Sodium", "Calcium", "Potassium", "Phosphorus", "Magnesium", "Uric Acid", "AST", "ALT", "GGT", "Total Bilirubin", "Alkaline Phosphatase", "TSH", "CEA", "CA 19-9", "CA 15-3", "CA 125", "Free T3", "Free T4", "HDL", "LDL", "Triglycerides", "Hemogram", "Sedimentation", "CRP", "Complete Urine Analysis", "HBsAg", "Anti-HBs", "Anti-HCV", "Iron", "Iron Binding", "Ferritin", "FOBT", "Vitamin B12", "Vitamin D", "RF", "Folic Acid", "Prolactin", "Pap Smear Test"],
        additional: [],
      },
    ],
  },
  {
    id: "vip",
    label: "VIP",
    price: "$2,700",
    tagline: "Comprehensive screening with MRI & endoscopy",
    packages: [
      {
        name: "VIP — Men",
        price: "$2,700",
        examinations: ["Internal Medicine", "Cardiology", "Urology", "Eye", "Neurology", "Gastroenterology", "Dietitian", "+ 1 Department (based on MRI result)"],
        cardiological: ["ECG", "ECHO", "Cardiac Stress Test"],
        gastroenterology: ["Gastroscopy (incl. 1 gastric biopsy)", "Colonoscopy (incl. 1 colonic biopsy)"],
        radiological: ["Whole Abdominal Ultrasound", "Thyroid Ultrasound", "Chest X-Ray", "Bone Densitometry (40+)", "MRI — Cranial & Lumbar"],
        laboratory: ["Glucose", "HOMA-IR", "Albumin", "Total Cholesterol", "HbA1c", "Urea", "Creatinine", "Sodium", "Calcium", "Potassium", "Phosphorus", "Magnesium", "Uric Acid", "AST", "ALT", "GGT", "Total Bilirubin", "Alkaline Phosphatase", "TSH", "CEA", "CA 19-9", "CA 15-3", "Free T3", "Free T4", "HDL", "LDL", "Triglycerides", "Hemogram", "Sedimentation", "CRP", "Complete Urine Analysis", "HBsAg", "Anti-HBs", "Anti-HCV", "Iron", "Iron Binding", "Ferritin", "FOBT", "Vitamin B12", "Vitamin D", "RF", "Folic Acid", "AFP", "PSA Free", "PSA Total"],
        additional: ["Uroflowmetry"],
      },
      {
        name: "VIP — Women",
        price: "$2,700",
        examinations: ["Internal Medicine", "Cardiology", "Gynecology", "General Surgery", "Eye", "Neurology", "Gastroenterology", "Dietitian"],
        cardiological: ["ECG", "ECHO", "Cardiac Stress Test"],
        gastroenterology: ["Gastroscopy (incl. 1 gastric biopsy)", "Colonoscopy (incl. 1 colonic biopsy)"],
        radiological: ["Whole Abdominal Ultrasound", "Thyroid Ultrasound", "Chest X-Ray", "Bone Densitometry (40+)", "Mammography (40+) / Breast US (under 40)", "MRI — Cranial & Lumbar"],
        laboratory: ["Glucose", "HOMA-IR", "Albumin", "Total Cholesterol", "HbA1c", "Urea", "Creatinine", "Sodium", "Calcium", "Potassium", "Phosphorus", "Magnesium", "Uric Acid", "AST", "ALT", "GGT", "Total Bilirubin", "Alkaline Phosphatase", "TSH", "CEA", "CA 19-9", "CA 15-3", "CA 125", "Free T3", "Free T4", "HDL", "LDL", "Triglycerides", "Hemogram", "Sedimentation", "CRP", "Complete Urine Analysis", "HBsAg", "Anti-HBs", "Anti-HCV", "Iron", "Iron Binding", "Ferritin", "FOBT", "Vitamin B12", "Vitamin D", "RF", "Folic Acid", "AFP", "Prolactin", "Pap Smear Test"],
        additional: [],
      },
    ],
  },
  {
    id: "pediatric",
    label: "Pediatric",
    price: "$550",
    tagline: "Children's comprehensive health assessment",
    packages: [
      {
        name: "Pediatric Check-Up",
        price: "$550",
        examinations: ["Pediatrics", "ENT", "Eye"],
        cardiological: ["ECG"],
        radiological: ["Whole Abdominal Ultrasound"],
        laboratory: ["Hemogram", "Complete Urine Analysis", "TSH", "Total Cholesterol", "Sedimentation Rate", "Free T4", "Urea", "Creatinine", "Triglycerides", "ALT", "LDL", "Iron", "Iron Binding", "CRP", "Calcium", "Vitamin B12", "Vitamin D", "Glucose", "HBsAg", "Anti-HBs"],
        additional: [],
      },
    ],
  },
];

const faqs = [
  {
    q: "How long does the check-up take?",
    a: "Standard and Plus check-ups are typically completed in a single day — usually 4 to 6 hours at the hospital. VIP check-ups, which include gastroscopy, colonoscopy, and MRI, require 2 days. The Pediatric check-up is completed in 3 to 4 hours. Your schedule is pre-arranged by our team so there is no waiting between appointments.",
  },
  {
    q: "Do I need to fast before my check-up?",
    a: "Yes. For all packages, you must fast for a minimum of 8 hours before your check-up. No food or drink (water is permitted) from midnight on the night before your appointment. For packages including gastroscopy and colonoscopy (VIP), you will receive specific bowel preparation instructions in advance.",
  },
  {
    q: "Will I receive my results in English?",
    a: "Yes. All test results, imaging reports, and specialist consultation summaries are provided in English. Your dedicated GO coordinator and our medical team ensure that all findings are explained clearly before you leave Istanbul. You will receive a complete digital copy of your results.",
  },
  {
    q: "What happens if something is found during my check-up?",
    a: "If any finding requires further attention, our medical team will explain the situation clearly during your results consultation. Depending on the finding, we can arrange additional tests, specialist referrals, or a follow-up plan. Our 12-month aftercare support means our team is available to assist with any next steps after you return home.",
  },
  {
    q: "Do I need to stay overnight for a check-up?",
    a: "For Standard and Plus packages, your check-up is completed in one day. We recommend arriving the day before to rest after travel, making a 2-night stay ideal. VIP packages (with gastroscopy and colonoscopy) require 2 examination days, so a 3-night stay is recommended. The Hassle-Free Package includes hotel accommodation so everything is arranged for you.",
  },
  {
    q: "What is the difference between Standard, Plus, and VIP?",
    a: "Standard provides essential full-body screening — core blood panels, ultrasounds, ECG, ECHO, and specialist examinations. Plus adds a cardiac stress test, extended blood panels (including hepatitis markers, thyroid function, and micronutrients), ENT specialist, and bone densitometry for patients over 40. VIP adds gastroscopy, colonoscopy, MRI (cranial and lumbar), neurology, and gastroenterology consultations — providing the most comprehensive picture of your health.",
  },
  {
    q: "Can couples do the check-up together?",
    a: "Absolutely. Many of our international patients come as couples and complete their check-ups simultaneously. We pre-arrange all appointments so that both patients move through their examinations at the same time. Please mention during your consultation that you are booking for two people.",
  },
  {
    q: "Is the Pediatric check-up suitable for all ages?",
    a: "The Pediatric Check-Up is suitable for children from approximately 3 years to 17 years. The examination includes a paediatric specialist consultation, ENT, ophthalmology, ECG, abdominal ultrasound, and a comprehensive blood panel covering growth, immunity, thyroid, and nutritional markers.",
  },
];

const journeySteps = [
  { num: "1", title: "Free Online Consultation", desc: "Share your medical history and health concerns via WhatsApp or the form. We recommend the right package for you and answer every question — at no cost." },
  { num: "2", title: "Day 1 — Arrival in Istanbul", desc: "Private airport pickup, hotel check-in, rest. Your GO (personal coordinator) meets you upon arrival. Fasting begins from midnight." },
  { num: "3", title: "Day 2 — Full Check-Up Day", desc: "Early arrival at our partner hospital. All specialist examinations, laboratory tests, and imaging are completed in a pre-arranged schedule — no waiting between appointments. Your GO accompanies you throughout." },
  { num: "4", title: "Same Day — Results Consultation", desc: "Following your examinations, a senior physician reviews all findings with you in English. Any concerning results are explained clearly with recommended next steps." },
  { num: "5", title: "Day 3 — Departure", desc: "Fly home with a complete digital copy of all your results in English and 12 months of online aftercare support from our team." },
];

const testimonials = [
  {
    name: "Patient — United Kingdom",
    source: "Google Review · GB",
    text: "I had been putting off a proper health check for years. Medical Center Turkey made the whole experience completely effortless. My GO accompanied me to every single appointment — there was no confusion, no waiting, no stress. The hospital was world-class and I received my full results the same day, explained clearly in English.",
  },
  {
    name: "Patient — USA",
    source: "Trustpilot · US",
    text: "The VIP package was extraordinary value. In the US, the same level of screening — MRI, gastroscopy, colonoscopy, cardiac stress test — would have cost me over $15,000. At Medical Center Turkey it was a fraction of that price, with a level of care and coordination that surpassed anything I've experienced at home.",
  },
  {
    name: "Patient — Canada",
    source: "Google Review · CA",
    text: "My wife and I did the Plus check-up together. Everything was pre-arranged — we moved through our appointments simultaneously and were done by early afternoon. The results consultation was thorough and reassuring. We will absolutely be returning annually.",
  },
];

type PackageData = {
  name: string;
  price: string;
  examinations: string[];
  cardiological: string[];
  gastroenterology?: string[];
  radiological: string[];
  laboratory: string[];
  additional: string[];
};

function PackageCard({ pkg, scrollToForm }: { pkg: PackageData; scrollToForm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(87,136,172,0.2)", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(5,57,128,0.05)" }}>
      <div style={{ padding: "24px 28px", background: "#F4F8FB", borderBottom: "1px solid rgba(87,136,172,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#053980", marginBottom: 6 }}>{pkg.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#053980" }}>{pkg.price}</div>
          </div>
          <button
            onClick={scrollToForm}
            style={{ background: "#053980", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            Get Started
          </button>
        </div>
      </div>
      <div style={{ padding: "20px 28px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#5788AC", marginBottom: 10 }}>Specialist Examinations</div>
            <ul className="space-y-1.5">
              {pkg.examinations.map((item) => (
                <li key={item} className="flex gap-2 items-start" style={{ fontSize: 13, color: "#1A2A3A" }}>
                  <Check size={13} style={{ color: "#5788AC", flexShrink: 0, marginTop: 2 }} />{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#5788AC", marginBottom: 10 }}>Cardiological</div>
            <ul className="space-y-1.5">
              {pkg.cardiological.map((item) => (
                <li key={item} className="flex gap-2 items-start" style={{ fontSize: 13, color: "#1A2A3A" }}>
                  <Check size={13} style={{ color: "#5788AC", flexShrink: 0, marginTop: 2 }} />{item}
                </li>
              ))}
            </ul>
            {pkg.gastroenterology && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#5788AC", marginBottom: 10, marginTop: 16 }}>Gastroenterology</div>
                <ul className="space-y-1.5">
                  {pkg.gastroenterology.map((item) => (
                    <li key={item} className="flex gap-2 items-start" style={{ fontSize: 13, color: "#1A2A3A" }}>
                      <Check size={13} style={{ color: "#5788AC", flexShrink: 0, marginTop: 2 }} />{item}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#5788AC", marginBottom: 10, marginTop: 16 }}>Radiological</div>
            <ul className="space-y-1.5">
              {pkg.radiological.map((item) => (
                <li key={item} className="flex gap-2 items-start" style={{ fontSize: 13, color: "#1A2A3A" }}>
                  <Check size={13} style={{ color: "#5788AC", flexShrink: 0, marginTop: 2 }} />{item}
                </li>
              ))}
            </ul>
            {pkg.additional.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#5788AC", marginBottom: 10, marginTop: 16 }}>Additional</div>
                <ul className="space-y-1.5">
                  {pkg.additional.map((item) => (
                    <li key={item} className="flex gap-2 items-start" style={{ fontSize: 13, color: "#1A2A3A" }}>
                      <Check size={13} style={{ color: "#5788AC", flexShrink: 0, marginTop: 2 }} />{item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#5788AC", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, padding: 0 }}
          >
            <span style={{ transition: "transform .2s", display: "inline-block", transform: open ? "rotate(90deg)" : "none" }}>▶</span>
            {open ? "Hide" : "Show"} Full Laboratory Panel ({pkg.laboratory.length} tests)
          </button>
          {open && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
              {pkg.laboratory.map((item) => (
                <span key={item} style={{ fontSize: 12, color: "#1A2A3A", background: "#F4F8FB", border: "1px solid rgba(87,136,172,0.2)", borderRadius: 6, padding: "3px 10px" }}>{item}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckUpLanding() {
  const [activeTier, setActiveTier] = useState("standard");
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
  const activeTierData = tiers.find((t) => t.id === activeTier)!;

  const scrollToForm = () => {
    document.getElementById("checkup-form-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      _subject: `Medical Check-Up Inquiry — Medical Center Turkey`,
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
            Istanbul&apos;s Complete Health Check-Up Experience
          </div>
          <h1 className="font-extrabold leading-tight text-white" style={{ fontSize: "clamp(34px, 6vw, 64px)", lineHeight: 1.1, maxWidth: 820, margin: "0 auto 24px" }}>
            Medical Check-Up <span style={{ color: "#A3C6CF" }}>Turkey.</span><br />
            Know Your Health. From Start to Finish.
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.75)", maxWidth: 620, margin: "0 auto 44px" }}>
            You fly to Istanbul. We take care of everything else — the hospital, the appointments, the transfers, the results. Standard, Plus, VIP, and Pediatric packages available.
          </p>

          {/* Icon */}
          <div className="flex justify-center mb-12">
            <svg viewBox="0 0 100 100" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.06)" stroke="#A3C6CF" strokeWidth="3" />
              <rect x="34" y="28" width="32" height="40" rx="4" fill="rgba(163,198,207,0.15)" stroke="#A3C6CF" strokeWidth="2" />
              <line x1="42" y1="40" x2="58" y2="40" stroke="#A3C6CF" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="42" y1="48" x2="58" y2="48" stroke="#A3C6CF" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="42" y1="56" x2="52" y2="56" stroke="#A3C6CF" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="64" cy="64" r="10" fill="rgba(5,57,128,0.8)" stroke="#A3C6CF" strokeWidth="1.5" />
              <path d="M59 64 L63 68 L69 61" stroke="#A3C6CF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>1 Day</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Check-Up Duration</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 30, fontWeight: 800, color: "#A3C6CF" }}>12 Mo</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Aftercare Support</div>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-3 mt-10">
            {["Ministry of Health Authorized", "TÜRSAB Licensed", "★ 4.9 Trustpilot"].map((b) => (
              <div key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "7px 16px" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6.5" fill="#A3C6CF" /><path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.90)", letterSpacing: 0.3 }}>{b}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <button onClick={scrollToForm} style={{ background: "linear-gradient(135deg, #1b5fa8, #1ab3c8)", color: "#fff", padding: "16px 36px", borderRadius: 100, fontWeight: 700, fontSize: 17, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(27,95,168,0.35)" }}>
              Get Free Consultation
            </button>
            <a href="https://wa.me/908508888911" target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", padding: "16px 28px", borderRadius: 100, fontWeight: 600, fontSize: 16, border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#25D366" aria-hidden><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.32-1.39a9.87 9.87 0 0 0 4.67 1.19h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.16 0 4.2.84 5.73 2.37a8.07 8.07 0 0 1 2.38 5.75c0 4.48-3.65 8.13-8.13 8.13a8.1 8.1 0 0 1-4.14-1.13l-.3-.17-3.16.83.84-3.08-.19-.32a8.09 8.09 0 0 1-1.24-4.32c0-4.48 3.65-8.06 8.21-8.06zm-4.7 4.6c-.16 0-.42.06-.64.31s-.85.83-.85 2.02.87 2.35.99 2.51c.12.16 1.7 2.6 4.13 3.64 2.04.87 2.46.7 2.9.66.44-.04 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28s-1.42-.7-1.64-.78-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.18 7.2 7.2 0 0 1-1.33-1.65c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.75-1.8-.2-.47-.4-.4-.54-.41z" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. PACKAGES ─────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Check-Up Packages</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>Choose Your Package</h2>
            <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, margin: "0 auto 40px" }}>4 tiers. 8 packages. Men, women, and children. One clear price — no hidden costs.</p>
          </div>

          {/* Tier Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier.id)}
                style={{
                  padding: "12px 28px", borderRadius: 100, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all .2s",
                  background: activeTier === tier.id ? "#053980" : "transparent",
                  color: activeTier === tier.id ? "#fff" : "#053980",
                  border: activeTier === tier.id ? "2px solid #053980" : "2px solid rgba(5,57,128,0.2)",
                }}
              >
                {tier.label}
                <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 8, opacity: 0.75 }}>{tier.price}</span>
              </button>
            ))}
          </div>

          {/* Active Tier Info */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: "#6B7C8D" }}>{activeTierData.tagline}</div>
          </div>

          {/* Package Cards */}
          <div className="flex flex-col gap-6">
            {activeTierData.packages.map((pkg) => (
              <PackageCard key={pkg.name} pkg={pkg} scrollToForm={scrollToForm} />
            ))}
          </div>

          <div style={{ background: "#F4F8FB", border: "1px solid rgba(87,136,172,0.25)", borderRadius: 10, padding: "16px 24px", fontSize: 14, color: "#6B7C8D", marginTop: 28, textAlign: "center" }}>
            All packages are completed at Ministry of Health certified partner hospitals. Results provided in English. Credit card payments carry a 10% surcharge.
          </div>
        </div>
      </section>
      {/* ── 4. JOURNEY ───────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Step by Step</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>3 Days. Complete Peace of Mind.</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Your entire Istanbul check-up experience is planned, coordinated, and supported by our team from the moment you land.</p>
          <div style={{ maxWidth: 700 }}>
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
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Patient Reviews</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#053980", lineHeight: 1.2, marginBottom: 14 }}>What Our Patients Say</h2>
          <p style={{ fontSize: 16, color: "#6B7C8D", maxWidth: 560, marginBottom: 52 }}>Unprompted reviews from patients who trusted us with their health check-up in Istanbul.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((r) => (
              <div key={r.name} style={{ background: "#fff", border: "1px solid rgba(87,136,172,0.15)", borderRadius: 16, padding: 28 }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 16 }}>★</span>)}
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
            {[
              { icon: "✓", title: "Truly Hassle-Free", desc: "Every appointment pre-arranged. No waiting between examinations. You move seamlessly from one specialist to the next." },
              { icon: "🎧", title: "Dedicated GO Coordinator", desc: "Your personal 'Gentle Organiser' accompanies you to every single appointment throughout your check-up day." },
              { icon: "★", title: "Zero Question Marks", desc: "We've heard every question. We have the answers before you even ask them." },
              { icon: "📋", title: "Results in English", desc: "All reports, imaging, and specialist consultations are provided in English. A senior physician reviews findings with you before departure." },
              { icon: "⚡", title: "All in One Day", desc: "Standard and Plus check-ups are fully completed in a single day — no multiple trips, no weeks of waiting for results." },
              { icon: "🛡️", title: "Ministry of Health Authorized", desc: "We operate under official authorization from the Turkish Ministry of Health. No shortcuts. No compromises." },
            ].map((item) => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "24px 22px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#A3C6CF", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>What is a GO — Gentle Organiser?</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>Every patient gets a dedicated English-speaking coordinator who handles your transfers, guides you through every department, translates at the hospital, and ensures your check-up day runs smoothly from first appointment to final consultation.</p>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ + FORM ────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #053980, #031e46)", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#A3C6CF", marginBottom: 14 }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>The most common questions from our international check-up patients — answered honestly.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between gap-4 text-left" style={{ padding: "16px 20px", cursor: "pointer", background: "none", border: "none" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{faq.q}</span>
                      <span style={{ fontSize: 20, color: "#A3C6CF", transition: "transform .2s", transform: faqOpen === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
                    </button>
                    {faqOpen === i && (
                      <div style={{ padding: "0 20px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div id="checkup-form-box" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", scrollMarginTop: "80px" }}>
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
                      <option value="Standard Check-Up — Men — $750" style={{ color: "#000" }}>Standard — Men — $750</option>
                      <option value="Standard Check-Up — Women 40+ — $750" style={{ color: "#000" }}>Standard — Women 40+ — $750</option>
                      <option value="Standard Check-Up — Women Under 40 — $790" style={{ color: "#000" }}>Standard — Women Under 40 — $790</option>
                      <option value="Plus Check-Up — Men — $1,200" style={{ color: "#000" }}>Plus — Men — $1,200</option>
                      <option value="Plus Check-Up — Women — $1,200" style={{ color: "#000" }}>Plus — Women — $1,200</option>
                      <option value="VIP Check-Up — Men — $2,700" style={{ color: "#000" }}>VIP — Men — $2,700</option>
                      <option value="VIP Check-Up — Women — $2,700" style={{ color: "#000" }}>VIP — Women — $2,700</option>
                      <option value="Pediatric Check-Up — $550" style={{ color: "#000" }}>Pediatric — $550</option>
                      <option value="Not sure yet" style={{ color: "#000" }}>Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Your Message (optional)</label>
                    <textarea rows={3} placeholder="Tell us about your health concerns or ask any questions..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none", resize: "vertical" }} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={handleWhatsApp} style={{ flex: 1, background: "#25D366", color: "#fff", padding: "14px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <MessageCircle size={16} /> Send via WhatsApp
                    </button>
                    <button type="button" onClick={handleEmail} disabled={fsState.submitting} style={{ flex: 1, background: "#2884C0", color: "#fff", padding: "14px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: fsState.submitting ? 0.6 : 1 }}>
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
