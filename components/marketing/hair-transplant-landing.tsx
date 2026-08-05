"use client";

import { useState } from "react";
import { Check, ChevronDown, MessageCircle, Send, Star, Shield, Award, Users, Clock, Headphones, FileCheck, ArrowRight } from "lucide-react";
import Image from "next/image";

const packages = [
  {
    tier: "Entry",
    name: "Premium Package",
    price: "From €1,400",
    subtitle: "All-inclusive · No hidden fees",
    highlight: false,
    badge: null as string | null,
    inclusions: [
      "Max Grafts FUE / DHI Plus Gold",
      "Blood Test & PRP Treatment",
      "Medication & Foam",
      "Mesotherapy & Gold Cream",
      "Laser Treatment",
      "Aesthetic Hospital",
      "Warranty Certificate",
      "Translator / Interpreter",
      "GOs Day Care Assistance",
    ],
  },
  {
    tier: "Complete",
    name: "Gold Package",
    price: "From €1,700",
    subtitle: "All-inclusive · Local Anaesthesia",
    highlight: false,
    badge: "Award Winning · Best Value",
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
    price: "From €1,870",
    subtitle: "Most popular · The package others tried to copy",
    highlight: true,
    badge: "MOST POPULAR",
    inclusions: [
      "Everything in Premium",
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
    price: "From €3,300",
    subtitle: "Full VIP experience · Premium accommodation",
    highlight: false,
    badge: null as string | null,
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
    a: "When you book with Medical Center Turkey, you don't feel like a medical tourist in a foreign country — you feel like a VIP being taken care of at home. From the moment you land in Istanbul to the moment you fly back, someone is always by your side. Your personal English-speaking GO coordinator handles everything: transfers, hotel, hospital, translations, meals, and any question you have along the way. You never have to figure anything out alone. We've been doing this since 2008, and our entire system is built around one goal — making sure you feel safe, comfortable, and looked after every single step of the way. You arrive as a guest. You leave with results and peace of mind.",
  },
  {
    q: "Do I need to be in Istanbul for the procedure? Can it be done remotely or locally?",
    a: "Yes, you will need to travel to Istanbul for the procedure itself — hair transplant surgery must be performed in person. However, everything before and after can be handled remotely. Your free consultation happens online via WhatsApp or our contact form — just send us your photos and we will assess your case and recommend the right package. After you return home, all follow-up support for the 12 months post-procedure is provided online by our team. We have patients from the USA, UK, Germany, Netherlands, and across Europe who travel specifically for this experience.",
  },
  {
    q: "What is the difference between the Gold Package and the Hassle-Free Package?",
    a: "The only difference is the anaesthesia. Both packages include identical services — hotel, transfers, meals, GO coordinator, and all treatments. The Gold Package is performed under local anaesthesia, while the Hassle-Free Package uses sedation (light sleep), making it completely pain-free and anxiety-free. If you prefer to be fully awake during the procedure, the Gold Package is the right choice.",
  },
  {
    q: "What is the difference between FUE and DHI hair transplant techniques?",
    a: "Both techniques are modern and highly effective — the right choice depends on your individual case. FUE (Follicular Unit Extraction) is the gold standard method where grafts are extracted individually and implanted into the recipient area. DHI (Direct Hair Implantation) uses a specialised implanter pen to place grafts directly without creating incisions first, which can offer more precise angle and direction control. Our surgeons will recommend the most suitable technique after reviewing your photos during the free consultation. DHI is available on any of our packages for an additional €250.",
  },
  {
    q: "Is a hair transplant in Turkey safe? How do I know the quality is reliable?",
    a: "Safety is our number one priority. We work exclusively with hospitals and clinics approved by the Turkish Ministry of Health — we do not compromise on this. Turkey is one of the world's leading destinations for hair transplant procedures, with highly experienced surgeons and modern facilities at a fraction of the cost of the UK or USA. Medical Center Turkey has been operating since 2008 with over 5,000 international patients treated through our network. Every hair transplant comes with an official warranty certificate, and our team is available to you for 12 months after your procedure. We have English-speaking support 7 days a week.",
  },
  {
    q: "When will I see the final results of my hair transplant?",
    a: "Hair transplant results develop gradually. In the first 2–4 weeks, the transplanted hairs will shed — this is completely normal and expected. New growth begins around months 3–4. By month 6 you will see significant improvement, and your final, full result is typically visible at 12 months. This is why our aftercare support runs for a full year — we check in with you at 1 month, 3 months, and 12 months to monitor your progress and answer any questions you have along the way.",
  },
];

const trustBlocks = [
  { icon: Shield, title: "Dual Health Tourism Certification", desc: "Both our agency and our partner hospital hold Turkey's official Health Tourism Authorization Certificate — the highest accreditation standard issued by the Ministry of Health." },
  { icon: Award, title: "World's First Package System", desc: "We pioneered the all-inclusive health tourism package model in 2008. No one has more experience doing this right." },
  { icon: Users, title: "17 Years. 5,000+ Patients.", desc: "Operating since 2008 with over 5,000 international patients from the USA, UK, and Europe. Experience you can trust." },
  { icon: FileCheck, title: "Warranty Certificate", desc: "Every hair transplant comes with an official written warranty certificate — your guarantee that we stand behind every result we deliver." },
];

const whyMCT = [
  { icon: Check, title: "Truly Hassle-Free", desc: "From first message to final result — every detail is handled. No research, no coordination, no stress on your end." },
  { icon: Headphones, title: "Dedicated GO Coordinator", desc: "Your personal 'Gentle Organiser' is with you from airport arrival to departure. You are never alone." },
  { icon: Star, title: "Zero Question Marks", desc: "We answer every concern before you board the plane. 17 years means we've heard every question — and we have the answers." },
  { icon: Clock, title: "Fast Recovery", desc: "Back to daily life in 2 days. Most patients don't miss more than a long weekend." },
  { icon: FileCheck, title: "Warranty Certificate", desc: "Every hair transplant comes with an official warranty certificate — your written guarantee for peace of mind." },
  { icon: Shield, title: "Ministry of Health Approved", desc: "We work exclusively with Turkish Ministry of Health approved hospitals. No shortcuts. No compromises." },
];

const journeySteps = [
  { day: "Step 1", title: "Free Online Consultation", desc: "Send us your photos via WhatsApp or the form. We review your case, recommend a package, and answer every question — at no cost." },
  { day: "Day 1", title: "Arrival in Istanbul", desc: "Private airport pickup. Check in to your hotel. Rest and prepare. Your GO (personal coordinator) meets you upon arrival." },
  { day: "Day 2", title: "Hair Transplant Surgery", desc: "FUE or DHI Plus Gold technique. Blood test and physical examination. Personalized hairline design with your surgeon. Your GO stays with you throughout." },
  { day: "Day 3", title: "Follow-Up & First Wash", desc: "Post-op consultation. First professional hair wash and dressing application. Aftercare kit and full instructions provided." },
  { day: "Day 4+", title: "Return Home & Ongoing Support", desc: "Fly home confidently. We provide 12 months of online follow-up support and monitor your results every step of the way." },
];

const recoveryTimeline = [
  { label: "Next Day", desc: "Independent hair washing" },
  { label: "2 Days", desc: "Return to work" },
  { label: "1 Week", desc: "Light exercise" },
  { label: "12 Months", desc: "Full aftercare support" },
];

const testimonials = [
  {
    name: "Sena Alkan",
    source: "Google Review · GR · November 2025",
    pkg: "Hassle-Free Package",
    text: "My husband had his hair transplant at Medical Center Turkey and we are extremely happy with the whole experience. From the moment we arrived in Istanbul, everything was perfectly organized – the transfers, the hotel, and the clinic. The team was very professional, kind and attentive. They truly exceeded our expectations!",
  },
  {
    name: "Stylez",
    source: "Google Review · CA · May 2024",
    pkg: "Gold Package",
    text: "I am currently on day 29 post hair transplant with Medical Center Turkey and could not be happier with the service. I could not have asked for a better experience from start to finish. I can honestly say they deserve 5 stars for the service they provide. I would highly recommend it — great people and with reasonable prices as well!",
  },
  {
    name: "S.H.",
    source: "Trustpilot · ES · December 2024",
    pkg: "Premium Package",
    text: "Perfect procedure! All the procedures are perfectly organized. Pick-up from the airport, hotel check-in, preparation for a comfortable stay, postoperative care and explanation. The doctors and staff were kind and there was no anxiety. I'm looking forward to the growth of my hair in the future! Thank you.",
  },
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
        <div className="relative min-h-[620px] sm:min-h-[700px] flex items-center justify-center text-center">
          <Image
            src="/mct_head_office.jpg"
            alt="Medical Center Turkey — Istanbul"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand/88" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-24 w-full flex flex-col items-center">
            <span className="inline-block border border-white/25 text-white/70 text-[11px] font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
              Istanbul&apos;s Complete Hair Transplant Experience · Est. 2008
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">Hair Transplant </span>
              <span className="text-teal">Turkey.</span>
              <br />
              <span className="text-white">Done Right. From Start to Finish.</span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
              You fly to Istanbul. We take care of everything else — the surgery, the hotel, the transfers, the aftercare. You just focus on your results.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="#ht-form"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white hover:text-brand transition-colors"
              >
                ✦ Start Your Experience
              </a>
              <a
                href="https://wa.me/908508888911"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#1ebe5a] transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative bg-brand-dark border-t border-white/10">
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
                <div className={`text-xl font-bold mb-1 ${pkg.highlight ? "text-white" : "text-brand"}`}>{pkg.price}</div>
                <div className={`text-[11px] mb-5 ${pkg.highlight ? "text-white/60" : "text-gray-400"}`}>{pkg.subtitle}</div>
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
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Results</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">See the Difference. Judge for Yourself.</h2>
          </div>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-12">
            Every result is from a real Medical Center Turkey patient. Natural hairlines, natural growth — no filters, no tricks.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 8, 9].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm aspect-[4/3] relative">
                <Image
                  src={`/treatments/hair-transplant/landing/hair_transplant-before-and-after-${n}.webp`}
                  alt={`Hair transplant before and after result ${n}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500 mb-4">Ready to write your own before &amp; after story?</p>
            <a
              href="#ht-form"
              className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#154d8a] transition-colors"
            >
              Get Your Free Consultation <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. TRUST BLOCKS ──────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">17 Years of Experience</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2 mb-3">We Answer Every Question. Before You Even Ask.</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">Most patients arrive nervous and full of doubts. They leave confident. Because we&apos;ve spent 17 years removing every single question mark from this journey.</p>
          </div>
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
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Step by Step</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">3 Days. Life-Changing Results.</h2>
          </div>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-12">
            Your entire Istanbul experience is planned, coordinated, and supported by our team.
          </p>

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
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Patient Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">What Our Patients Say</h2>
          </div>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-12">
            Unprompted reviews from patients who trusted us with their hair transplant experience in Istanbul.
          </p>
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
                  <div className="text-xs text-gray-400 mt-0.5">{r.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHY MCT ───────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Why Us</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">Why Patients Choose Medical Center Turkey</h2>
          </div>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-12">
            We built this industry. We know exactly what can go wrong — and we&apos;ve eliminated it from your journey.
          </p>
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

          {/* GO Definition */}
          <div className="mt-8 bg-brand rounded-2xl p-6 sm:p-8 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-teal mb-3">What is a GO — Gentle Organiser?</div>
            <p className="text-white/80 text-sm max-w-2xl mx-auto leading-relaxed">
              Every patient gets a dedicated English-speaking coordinator who handles your transfers, translates at the hospital, stays with you during your procedure, and is available 24/7 throughout your stay.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">Frequently Asked Questions</h2>
          </div>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-12">
            The most common questions from our international patients — answered honestly.
          </p>
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
            <p className="text-gray-400 text-sm mb-2 leading-relaxed">Send us your details and photos. Our team will review your case and recommend the right package — completely free, no pressure, no commitment.</p>

            <div className="flex flex-wrap gap-4 mb-8 mt-4">
              <a href="https://wa.me/908508888911" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1ebe5a] transition-colors">
                <MessageCircle size={15} /> 💬 WhatsApp Us Directly
              </a>
            </div>

            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 pb-4 border-b border-gray-100">Get Your Free Hair Analysis</div>

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
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
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
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Which package are you interested in?</label>
                <select value={form.pkg} onChange={e => setForm({ ...form, pkg: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all">
                  <option value="">Select a package...</option>
                  <option value="Premium Package — From €1,400">Premium Package — From €1,400</option>
                  <option value="Gold Package — From €1,700">Gold Package — From €1,700</option>
                  <option value="Hassle-Free Package — From €1,870">Hassle-Free Package — From €1,870</option>
                  <option value="Exclusive Package — From €3,300">Exclusive Package — From €3,300</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Your Message (optional)</label>
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
                  ✦ Send My Free Consultation Request
                </button>
              </div>

              <p className="text-xs text-gray-300 pt-1">
                No commitment required · No spam · We reply within 24 hours
              </p>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Phone</div>
                <a href="tel:+908508888911" className="text-sm text-teal font-semibold hover:underline">+90 850 888 89 11</a>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email</div>
                <a href="mailto:hello@medicalcenterturkey.com" className="text-sm text-teal font-semibold hover:underline">hello@medicalcenterturkey.com</a>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Location</div>
                <span className="text-sm text-gray-600">Ataşehir, Istanbul, Turkey</span>
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
