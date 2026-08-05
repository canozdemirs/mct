"use client";

import { useState } from "react";
import { Check, ChevronDown, MessageCircle, Send, Star, Shield, Award, Users, Clock, Headphones, FileCheck } from "lucide-react";
import Image from "next/image";

const packages = [
  {
    tier: "Entry",
    name: "Premium Package",
    price: "From €1,400",
    highlight: false,
    badge: null as string | null,
    inclusions: [
      "Max Grafts FUE/DHI Plus Gold",
      "Blood Test & PRP",
      "Medication & Foam",
      "Mesotherapy & Gold Cream",
      "Laser Treatment",
      "Aesthetic Hospital",
      "Warranty Certificate",
      "Translator",
      "GO Day Care Assistance",
    ],
  },
  {
    tier: "Complete",
    name: "Gold Package",
    price: "From €1,700",
    highlight: false,
    badge: null as string | null,
    inclusions: [
      "Everything in Premium, plus:",
      "Local Anaesthesia",
      "Private Airport Transfers",
      "2 Nights 4-Star Hotel + Breakfast",
      "Free Lunch/Dinner on Op Day",
      "Panoramic Istanbul View",
    ],
  },
  {
    tier: "Most Popular",
    name: "Hassle-Free Package",
    price: "From €1,870",
    highlight: true,
    badge: "MOST POPULAR",
    inclusions: [
      "Everything in Premium, plus:",
      "Sedation (Light Sleep, Pain Free)",
      "Private Airport Transfers",
      "2 Nights 4-Star Hotel + Breakfast",
      "Free Lunch/Dinner on Op Day",
      "Panoramic Istanbul View",
    ],
  },
  {
    tier: "Luxury",
    name: "Exclusive Package",
    price: "From €3,300",
    highlight: false,
    badge: null as string | null,
    inclusions: [
      "Everything in Hassle-Free, plus:",
      "BMW Chauffeur (8h)",
      "2 Nights 5-Star Hotel",
      "Lunch/Dinner at Exclusive Restaurants",
      "Sightseeing & Shopping Tour",
      "Premium Bosphorus Experience",
    ],
  },
];

const faqs = [
  {
    q: "What is included in the MCT hair transplant package?",
    a: "Every MCT hair transplant package includes the operation itself (Max Grafts FUE/DHI Plus Gold), blood test & PRP, all medication and aftercare foam, mesotherapy & gold cream, laser treatment, surgery at a licensed aesthetic hospital, a warranty certificate, a dedicated translator, and full GO Day Care Assistance. Higher-tier packages add hotel accommodation, private airport transfers, and premium extras.",
  },
  {
    q: "How is the price of my hair transplant determined?",
    a: "Our packages are all-inclusive fixed prices — not per-graft. The package tier you choose determines your price: Premium (from €1,400), Gold (from €1,700), Hassle-Free (from €1,870), or Exclusive (from €3,300). DHI technique is available with an additional €250 fee. Credit card payments carry a 10% surcharge.",
  },
  {
    q: "How many days do I need to stay in Istanbul?",
    a: "We recommend 3 nights / 4 days. Day 1: arrival and check-in. Day 2: surgery day. Day 3: first professional wash and follow-up check. Day 4: departure. You can return to work within 2 days and wash your hair independently from the next day.",
  },
  {
    q: "Why should I choose Medical Center Turkey for my hair transplant?",
    a: "MCT has been coordinating international hair transplant patients since 2008. We pioneered the all-inclusive package model, hold dual health tourism certification, coordinate exclusively with Ministry of Health approved hospitals, and assign a dedicated GO Coordinator to every patient throughout their journey.",
  },
  {
    q: "Can the consultation and planning be done remotely before I travel?",
    a: "Yes. We conduct a full online consultation via WhatsApp or video call before you travel. Our team reviews your photos, recommends the right package and technique, and answers all your questions — no commitment required.",
  },
  {
    q: "What is the difference between the Gold and Hassle-Free packages?",
    a: "The key difference is the anaesthesia type. The Gold Package uses standard local anaesthesia. The Hassle-Free Package uses sedation — a light sleep state — making the procedure completely pain-free and anxiety-free. Both include hotel accommodation, private airport transfers, and full care on surgery day.",
  },
  {
    q: "What is the difference between FUE and DHI techniques?",
    a: "FUE (Follicular Unit Extraction) extracts grafts and implants them through channels opened in the scalp. DHI (Direct Hair Implantation) uses a Choi pen to extract and implant simultaneously, allowing more precise placement and potentially denser results. DHI is available on any package for an additional €250.",
  },
  {
    q: "How do I know the surgery will be safe and high quality?",
    a: "All surgery takes place in Ministry of Health certified aesthetic hospitals. MCT holds dual international health tourism certification and issues a formal warranty certificate with every procedure. Our 17-year track record and 5,000+ international patients speak to our consistency and standards.",
  },
  {
    q: "When will I see the final results of my hair transplant?",
    a: "Initial growth starts around 3–4 months post-operation. The majority of transplanted hair grows in between months 6–9. Full, final results are typically visible at the 12-month mark. MCT provides 12 months of aftercare support throughout the entire recovery journey.",
  },
  {
    q: "What happens after I return home?",
    a: "You leave with a detailed aftercare protocol and your care kit. Our team stays in contact via WhatsApp for the full 12 months. We schedule regular photo check-ins to monitor your progress and answer any questions that arise. You are never left alone after surgery.",
  },
];

const trustBlocks = [
  { icon: Shield, title: "Dual Health Tourism Certification", desc: "Certified by two independent international health tourism bodies — meeting the highest standards of patient coordination." },
  { icon: Award, title: "World's First Package System", desc: "MCT pioneered the all-inclusive hair transplant package model for international patients. Copied by many, matched by none." },
  { icon: Users, title: "17 Years · 5,000+ Patients", desc: "Since 2008, over 5,000 international patients from the UK, USA, Europe and beyond have trusted MCT." },
  { icon: FileCheck, title: "Warranty Certificate", desc: "Every patient receives a formal written warranty certificate covering their procedure — included in every package." },
];

const whyMCT = [
  { icon: Check, title: "Truly Hassle-Free", desc: "Surgery, hotel, transfers, aftercare — every single detail handled for you. Nothing left to chance." },
  { icon: Headphones, title: "Dedicated GO Coordinator", desc: "Your personal Guest Operations coordinator is with you from first contact to full 12-month recovery." },
  { icon: Star, title: "Zero Question Marks", desc: "Fixed all-inclusive pricing. No hidden fees, no per-graft billing surprises. What you see is what you pay." },
  { icon: Clock, title: "Fast Recovery", desc: "Back to work in 2 days. Independent hair washing from the very next day after surgery." },
  { icon: FileCheck, title: "Warranty Certificate", desc: "Formal written warranty included with every package — your results are backed in writing." },
  { icon: Shield, title: "Ministry of Health Approved", desc: "Surgery takes place exclusively in MOH certified partner hospitals. No exceptions." },
];

const journeySteps = [
  { day: "Before", title: "Free Online Consultation", desc: "Photo review, technique recommendation, package selection — all done remotely before you book your flights." },
  { day: "Day 1", title: "Arrival", desc: "Your private transfer picks you up at Istanbul airport and takes you directly to your hotel." },
  { day: "Day 2", title: "Surgery", desc: "Full day at the hospital. Your GO Coordinator is with you throughout. Surgery completed by evening." },
  { day: "Day 3", title: "Follow-Up & First Wash", desc: "Medical check-up at the hospital. First professional hair wash by our nursing team." },
  { day: "Day 4+", title: "Return Home & Support", desc: "Fly home with your aftercare kit. 12 months of WhatsApp support begins immediately." },
];

const recoveryTimeline = [
  { label: "Next Day", desc: "Independent hair washing" },
  { label: "2 Days", desc: "Return to work" },
  { label: "1 Week", desc: "Light exercise" },
  { label: "12 Months", desc: "Full aftercare support" },
];

const testimonials = [
  { name: "James T.", country: "United Kingdom", pkg: "Hassle-Free Package", text: "From the moment I landed in Istanbul, everything was taken care of. The GO coordinator was with me the whole day. Ten months later, the results are incredible." },
  { name: "Michael R.", country: "United States", pkg: "Gold Package", text: "I was nervous about travelling abroad for surgery. MCT made it completely seamless — the hotel, the transfers, the hospital. Zero stress. Highly recommend." },
  { name: "David K.", country: "Germany", pkg: "Exclusive Package", text: "The transparency was what impressed me most. Fixed price, clear inclusions, no surprises. The 12-month aftercare support is a real differentiator." },
];

export default function HairTransplantLanding() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", country: "", email: "", phone: "", pkg: "", message: "" });

  const handleWhatsApp = () => {
    const text = `Hello MCT,%0A%0AName: ${form.name}%0ACountry: ${form.country}%0AEmail: ${form.email}%0APhone: ${form.phone}%0APackage: ${form.pkg}%0A%0A${form.message}`;
    window.open(`https://wa.me/908508888911?text=${text}`, "_blank");
  };

  const handleEmail = () => {
    const body = `Hello MCT,\n\nName: ${form.name}\nCountry: ${form.country}\nEmail: ${form.email}\nPhone: ${form.phone}\nPackage: ${form.pkg}\n\n${form.message}`;
    window.location.href = `mailto:hello@medicalcenterturkey.com?subject=${encodeURIComponent("Hair Transplant Inquiry")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────── */}
      <section className="relative flex flex-col overflow-hidden">
        <div className="relative min-h-[620px] sm:min-h-[700px] flex items-center">
          <Image
            src="/treatments/hair-transplant-v7.jpg"
            alt="Hair transplant Turkey — Medical Center Turkey"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
            <span className="inline-block bg-white/10 border border-white/20 text-teal text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              17 Years of Experience · Ministry of Health Approved Partner Hospitals
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-2xl leading-tight mb-5">
              Hair Transplant Turkey.<br />Done Right. From Start to Finish.
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              You fly to Istanbul. We take care of everything else — the surgery, the hotel, the transfers, the aftercare. You just focus on your results.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#ht-form"
                className="inline-flex items-center gap-2 bg-teal text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#159fb3] transition-colors shadow-lg"
              >
                Start Your Experience
              </a>
              <a
                href="https://wa.me/908508888911"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#1ebe5a] transition-colors shadow-lg"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative bg-brand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { value: "17", label: "Years in Health Tourism" },
              { value: "5,000+", label: "International Patients" },
              { value: "#1", label: "Package System Pioneer" },
              { value: "12 Mo", label: "Aftercare Support" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. PACKAGES ──────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">All-Inclusive Packages</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2 mb-3">Choose Your Package</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">Fixed, transparent pricing. No hidden costs. No per-graft fees. Everything included.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl flex flex-col p-6 ${
                  pkg.highlight
                    ? "bg-brand text-white shadow-2xl shadow-brand/20 ring-2 ring-brand"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                    {pkg.badge}
                  </span>
                )}
                <div className="text-[10px] font-bold uppercase tracking-widest text-teal mb-1">{pkg.tier}</div>
                <h3 className={`text-base font-bold mb-1 ${pkg.highlight ? "text-white" : "text-brand"}`}>{pkg.name}</h3>
                <div className={`text-xl font-bold mb-5 ${pkg.highlight ? "text-white" : "text-brand"}`}>{pkg.price}</div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className={`flex items-start gap-2 text-xs leading-relaxed ${pkg.highlight ? "text-white/85" : "text-gray-600"}`}>
                      {item.startsWith("Everything") ? (
                        <span className="text-teal font-bold shrink-0">+</span>
                      ) : (
                        <Check size={11} className="text-teal shrink-0 mt-0.5" />
                      )}
                      <span className={item.startsWith("Everything") ? "font-semibold" : ""}>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#ht-form"
                  className={`text-center text-xs font-semibold px-4 py-2.5 rounded-full transition-colors ${
                    pkg.highlight ? "bg-teal text-white hover:bg-[#159fb3]" : "bg-brand text-white hover:bg-[#154d8a]"
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            DHI Technique available with an additional €250 fee on any package. Credit card payments carry a 10% surcharge.
          </p>
        </div>
      </section>

      {/* ── 3. BEFORE / AFTER ────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Results</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">See the Difference. Judge for Yourself.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="flex gap-2 justify-center mb-3">
                    <span className="text-xs bg-gray-100 text-gray-400 px-2.5 py-1 rounded-md font-semibold">Before</span>
                    <span className="text-gray-300 self-center">→</span>
                    <span className="text-xs bg-teal/10 text-teal px-2.5 py-1 rounded-md font-semibold">After</span>
                  </div>
                  <p className="text-xs text-gray-300">Patient photo coming soon</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TRUST BLOCKS ──────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBlocks.map((b) => (
              <div key={b.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center mb-4">
                  <b.icon size={20} className="text-teal" />
                </div>
                <h3 className="text-sm font-bold text-brand mb-2">{b.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. YOUR JOURNEY ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Step by Step</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">Your Journey</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
            {journeySteps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="inline-block bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {step.day}
                </div>
                <h3 className="text-sm font-bold text-brand mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                {i < journeySteps.length - 1 && (
                  <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-gray-100 rounded-full items-center justify-center z-10 text-gray-300 text-xs">›</div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-brand rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {recoveryTimeline.map((r) => (
              <div key={r.label}>
                <div className="text-teal font-bold text-sm mb-1">{r.label}</div>
                <div className="text-white/60 text-xs">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ──────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Patient Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">What Our Patients Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((r) => (
              <div key={r.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">&ldquo;{r.text}&rdquo;</p>
                <div>
                  <div className="text-sm font-bold text-brand">{r.name}</div>
                  <div className="text-xs text-gray-400">{r.country} · {r.pkg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHY MCT ───────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Why Us</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">Why Patients Choose MCT</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyMCT.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={18} className="text-teal" />
                </div>
                <h3 className="text-sm font-bold text-brand mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl border transition-all ${faqOpen === i ? "border-teal/30 shadow-md shadow-teal/5 bg-white" : "border-gray-100 bg-gray-50"}`}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className={`text-sm font-semibold transition-colors ${faqOpen === i ? "text-brand" : "text-gray-700"}`}>{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${faqOpen === i ? "bg-teal" : "bg-gray-100"}`}>
                    <ChevronDown size={13} className={`transition-transform duration-200 ${faqOpen === i ? "rotate-180 text-white" : "text-gray-400"}`} />
                  </div>
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FORM ──────────────────────────────────────────────── */}
      <section id="ht-form" className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-brand/5 p-8 sm:p-10">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Free Consultation</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-1 mb-2">Start Your Hair Transplant Journey</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Fill in the form and we will get back to you within 24 hours — no commitment required.</p>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Country</label>
                  <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="United Kingdom"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">WhatsApp / Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Package</label>
                <select value={form.pkg} onChange={e => setForm({ ...form, pkg: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all">
                  <option value="">Select a package</option>
                  <option value="Premium — From €1,400">Premium — From €1,400</option>
                  <option value="Gold — From €1,700">Gold — From €1,700</option>
                  <option value="Hassle-Free — From €1,870">Hassle-Free — From €1,870</option>
                  <option value="Exclusive — From €3,300">Exclusive — From €3,300</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Message</label>
                <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your hair loss situation, your questions, or any details you'd like to share..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all resize-none" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#1ebe5a] transition-colors shadow-lg shadow-[#25D366]/20">
                  <MessageCircle size={15} />
                  Send via WhatsApp
                </button>
                <button type="button" onClick={handleEmail}
                  className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#154d8a] transition-colors shadow-lg shadow-brand/20">
                  <Send size={15} />
                  Send Request
                </button>
              </div>

              <p className="text-xs text-gray-300 pt-1">
                Your information is kept strictly confidential. We never share patient data with third parties.
              </p>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">WhatsApp</div>
                <a href="https://wa.me/908508888911" target="_blank" rel="noopener noreferrer" className="text-sm text-teal font-semibold hover:underline">+90 850 888 8911</a>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email</div>
                <a href="mailto:hello@medicalcenterturkey.com" className="text-sm text-teal font-semibold hover:underline">hello@medicalcenterturkey.com</a>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Response Time</div>
                <span className="text-sm text-gray-600">Within 24 hours</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Final treatment suitability is determined by licensed physicians following medical evaluation. Results may vary.
          </p>
        </div>
      </section>
    </>
  );
}
