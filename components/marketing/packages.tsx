"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, X } from "lucide-react";
import { ConsultationForm } from "./consultation-form";

function TreatmentIcon({ name }: { name: string }) {
  const s = { stroke: "white", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const icons: Record<string, React.ReactNode> = {
    "Hair Transplant": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <ellipse cx="10" cy="23" rx="3.5" ry="4.5" {...s} />
        <circle cx="10" cy="26" r="1.8" fill="white" stroke="none" />
        <line x1="9" y1="18" x2="8" y2="8" {...s} strokeWidth={2} />
        <line x1="11" y1="18" x2="12" y2="9" {...s} />
        <ellipse cx="16" cy="22" rx="4" ry="5" {...s} />
        <circle cx="16" cy="26" r="2" fill="white" stroke="none" />
        <line x1="15" y1="17" x2="14" y2="5" {...s} strokeWidth={2.5} />
        <line x1="17" y1="17" x2="18" y2="6" {...s} />
        <ellipse cx="22" cy="23" rx="3.5" ry="4.5" {...s} />
        <circle cx="22" cy="26" r="1.8" fill="white" stroke="none" />
        <line x1="21" y1="18" x2="20" y2="9" {...s} strokeWidth={2} />
        <line x1="23" y1="18" x2="24" y2="10" {...s} />
      </svg>
    ),
    "All-on-4 Dental Implants": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        {[7, 13, 19, 25].map((x) => (
          <g key={x}>
            <rect x={x - 2} y="6" width="4" height="10" rx="2" {...s} />
            <line x1={x} y1="16" x2={x} y2="20" {...s} />
            <line x1={x - 3} y1="20" x2={x + 3} y2="20" {...s} />
            <line x1={x - 2} y1="22" x2={x + 2} y2="22" {...s} />
            <line x1={x - 1} y1="24" x2={x + 1} y2="24" {...s} />
          </g>
        ))}
      </svg>
    ),
    "Dental Implant": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 11 6 Q 10 4 13 4 Q 16 3 19 4 Q 22 4 21 6 Q 20 10 19 14 Q 18 18 16 18 Q 14 18 13 14 Q 12 10 11 6 Z" {...s} />
        <line x1="16" y1="18" x2="16" y2="22" {...s} />
        <line x1="12" y1="22" x2="20" y2="22" {...s} />
        <line x1="13" y1="25" x2="19" y2="25" {...s} />
        <line x1="14" y1="28" x2="18" y2="28" {...s} />
      </svg>
    ),
    "Rhinoplasty": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 16 4 Q 16 8 14 14 Q 12 20 10 22 Q 8 24 10 26 Q 12 28 16 27 Q 20 28 22 26 Q 24 24 22 22 Q 20 20 18 14 Q 16 8 16 4 Z" {...s} />
        <path d="M 10 26 Q 12 24 16 25 Q 20 24 22 26" {...s} />
      </svg>
    ),
    "Breast Augmentation": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 4 20 Q 4 10 10 8 Q 14 7 16 12 Q 18 7 22 8 Q 28 10 28 20 Q 28 26 22 27 Q 18 28 16 25 Q 14 28 10 27 Q 4 26 4 20 Z" {...s} />
      </svg>
    ),
    "Liposuction (3 Areas)": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 12 4 Q 10 8 10 12 Q 10 16 13 18 Q 11 20 11 24 Q 11 28 13 29" {...s} />
        <path d="M 20 4 Q 22 8 22 12 Q 22 16 19 18 Q 21 20 21 24 Q 21 28 19 29" {...s} />
        <line x1="10" y1="12" x2="7" y2="13" {...s} />
        <line x1="22" y1="12" x2="25" y2="13" {...s} />
        <line x1="13" y1="18" x2="19" y2="18" {...s} strokeWidth={1.5} />
        <line x1="11" y1="24" x2="8" y2="25" {...s} />
        <line x1="21" y1="24" x2="24" y2="25" {...s} />
      </svg>
    ),
    "Gynecomastia": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 6 14 Q 6 8 10 7 Q 14 6 16 10 Q 18 6 22 7 Q 26 8 26 14 Q 26 20 22 22 Q 19 23 16 22 Q 13 23 10 22 Q 6 20 6 14 Z" {...s} />
        <circle cx="11.5" cy="14" r="1.5" fill="white" stroke="none" />
        <circle cx="20.5" cy="14" r="1.5" fill="white" stroke="none" />
        <line x1="10" y1="22" x2="10" y2="27" {...s} />
        <line x1="22" y1="22" x2="22" y2="27" {...s} />
        <line x1="8" y1="27" x2="24" y2="27" {...s} />
      </svg>
    ),
    "LASIK Eye Surgery": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 4 16 Q 10 8 16 8 Q 22 8 28 16 Q 22 24 16 24 Q 10 24 4 16 Z" {...s} />
        <circle cx="16" cy="16" r="4" {...s} />
        <circle cx="16" cy="16" r="1.5" fill="white" stroke="none" />
        <line x1="24" y1="8" x2="28" y2="4" {...s} strokeWidth={2} stroke="#A3C6CF" />
        <line x1="26" y1="10" x2="30" y2="6" {...s} strokeWidth={1.5} stroke="#A3C6CF" />
      </svg>
    ),
    "Cataract Surgery": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 4 16 Q 10 8 16 8 Q 22 8 28 16 Q 22 24 16 24 Q 10 24 4 16 Z" {...s} />
        <circle cx="16" cy="16" r="5" {...s} />
        <circle cx="16" cy="16" r="2" fill="white" stroke="none" />
        <path d="M 20 12 Q 23 10 24 7" {...s} strokeWidth={1.5} />
        <path d="M 22 16 Q 26 16 28 14" {...s} strokeWidth={1.5} />
      </svg>
    ),
    "IVF": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="8" {...s} />
        <circle cx="16" cy="16" r="3" {...s} />
        <circle cx="16" cy="16" r="1" fill="white" stroke="none" />
        <line x1="16" y1="4" x2="16" y2="8" {...s} />
        <line x1="24" y1="8" x2="21" y2="11" {...s} />
        <line x1="28" y1="16" x2="24" y2="16" {...s} />
        <line x1="24" y1="24" x2="21" y2="21" {...s} />
        <line x1="16" y1="28" x2="16" y2="24" {...s} />
        <line x1="8" y1="24" x2="11" y2="21" {...s} />
        <line x1="4" y1="16" x2="8" y2="16" {...s} />
        <line x1="8" y1="8" x2="11" y2="11" {...s} />
      </svg>
    ),
    "Blepharoplasty": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M 4 16 Q 10 8 16 8 Q 22 8 28 16" {...s} />
        <path d="M 4 16 Q 10 22 16 22 Q 22 22 28 16" {...s} />
        <circle cx="16" cy="16" r="4" {...s} />
        <circle cx="16" cy="16" r="1.5" fill="white" stroke="none" />
        <path d="M 8 10 Q 12 7 16 8 Q 20 7 24 10" {...s} strokeWidth={2.5} />
      </svg>
    ),
    "Check-Up": (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <polyline points="2,16 7,16 10,8 13,24 16,12 19,20 22,16 30,16" {...s} strokeWidth={2} />
        <circle cx="16" cy="28" r="2" fill="white" stroke="none" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

const treatments = [
  {
    name: "Hair Transplant",
    price: "From €1,400",
    image: "/treatments/hair-transplant/v7.jpg",
    inclusions: [
      "FUE / DHI technique",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Post-op care kit",
      "Follow-up support",
    ],
  },
  {
    name: "All-on-4 Dental Implants",
    price: "From €1,500",
    image: "/treatments/hollywood-smile/card.jpg",
    inclusions: [
      "Full-arch fixed prosthesis",
      "Titanium implants",
      "Hospital coordination",
      "Digital treatment plan",
      "Aftercare kit",
      "Follow-up support",
    ],
  },
  {
    name: "Dental Implant",
    price: "From €400",
    image: "/treatments/dental-implant/card.jpg",
    inclusions: [
      "Titanium implant",
      "Hospital coordination",
      "Digital X-ray & consultation",
      "Aftercare kit",
      "Follow-up support",
    ],
  },
  {
    name: "Rhinoplasty",
    price: "From €2,500",
    image: "/treatments/rhinoplasty/card.jpg",
    inclusions: [
      "Operation",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Medication pack",
      "Follow-up support",
    ],
  },
  {
    name: "Breast Augmentation",
    price: "From €4,500",
    image: "/treatments/breast-augmentation/v3.jpg",
    inclusions: [
      "Silicone implants included",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Compression garment",
      "Follow-up support",
    ],
  },
  {
    name: "Liposuction (3 Areas)",
    price: "From €2,150",
    image: "/treatments/liposuction/card.jpg",
    inclusions: [
      "Operation",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Compression garment",
      "Follow-up support",
    ],
  },
  {
    name: "Gynecomastia",
    price: "From €2,200",
    image: "/treatments/gynecomastia/v2.jpg",
    inclusions: [
      "Liposuction + gland removal",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Compression vest",
      "Follow-up support",
    ],
  },
  {
    name: "LASIK Eye Surgery",
    price: "From €1,600",
    image: "/treatments/lasik/card.jpg",
    inclusions: [
      "Operation",
      "Hospital coordination",
      "Pre-op eye examination",
      "Post-op medication",
      "Follow-up support",
    ],
  },
  {
    name: "Cataract Surgery",
    price: "From €4,000",
    image: "/treatments/cataract/card.jpg",
    inclusions: [
      "Operation",
      "Choice of lens (Multifocal, Toric, etc.)",
      "Hospital coordination",
      "Pre-op examination",
      "Follow-up support",
    ],
  },
  {
    name: "IVF",
    price: "From €3,000",
    image: "/treatments/ivf/card.jpg",
    inclusions: [
      "Standard IVF protocol",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation (14 nights)",
      "Follow-up support",
    ],
  },
  {
    name: "Blepharoplasty",
    price: "From €1,600",
    image: "/treatments/blepharoplasty/v2.jpg",
    inclusions: [
      "Upper / lower eyelid surgery",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Whitening kit",
      "Follow-up support",
    ],
  },
  {
    name: "Check-Up",
    price: "From $550",
    image: "/treatments/checkup/card.jpg",
    inclusions: [
      "Full blood panel",
      "Cardiac screening",
      "Hospital coordination",
      "Detailed health report",
    ],
  },
];

function QuoteModal({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-50 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Free Consultation</span>
            <h3 className="text-xl font-bold text-brand mt-0.5">Get Your Free Treatment Plan</h3>
            <p className="text-xs text-gray-400 mt-1">We&apos;ll get back to you within 24 hours — no commitment required.</p>
          </div>
          <button onClick={onClose} className="shrink-0 mt-1 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">
          <ConsultationForm initialTreatment={name} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}

export function Packages() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="bg-gray-50 pb-16 sm:pb-24 pt-2" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-3">
            MCT Signature Packages
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Complete, transparent pricing — fully coordinated from arrival to aftercare. Hover a package to see what&apos;s included.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {treatments.map((t, i) => (
            <div
              key={t.name}
              className="flip-card h-64 cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <div className="flip-card-inner relative w-full h-full">
                {/* Front */}
                <div className="flip-card-front absolute inset-0 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2.5">
                    <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(5,57,128,0.6)", backdropFilter: "blur(6px)" }}>
                      <TreatmentIcon name={t.name} />
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{t.name}</h3>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 rounded-2xl bg-white border-2 border-teal flex flex-col p-4 shadow-lg">
                  <h3 className="text-sm font-bold text-brand">{t.name}</h3>
                  <span className="text-teal text-xs font-bold mb-2.5 block">{t.price}</span>
                  <ul className="space-y-1.5 flex-1">
                    {t.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <Check size={11} className="text-teal shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    {t.name === "Hair Transplant" ? (
                      <Link
                        href="/hair-transplant-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "All-on-4 Dental Implants" ? (
                      <Link
                        href="/all-on-4-dental-implants-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Dental Implant" ? (
                      <Link
                        href="/dental-implants-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Rhinoplasty" ? (
                      <Link
                        href="/rhinoplasty-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Breast Augmentation" ? (
                      <Link
                        href="/breast-augmentation-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Liposuction (3 Areas)" ? (
                      <Link
                        href="/liposuction-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Gynecomastia" ? (
                      <Link
                        href="/gynecomastia-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "LASIK Eye Surgery" ? (
                      <Link
                        href="/lasik-eye-surgery-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Cataract Surgery" ? (
                      <Link
                        href="/cataract-surgery-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Blepharoplasty" ? (
                      <Link
                        href="/blepharoplasty-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "IVF" ? (
                      <Link
                        href="/ivf-treatment-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : t.name === "Check-Up" ? (
                      <Link
                        href="/medical-check-up-turkey"
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </Link>
                    ) : (
                      <button
                        onClick={() => setSelected(t.name)}
                        className="flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors w-full"
                      >
                        View Package →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/treatment-prices-in-turkey"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand text-brand font-semibold text-sm hover:bg-brand hover:text-white transition-colors"
          >
            Create Your Package
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Final treatment suitability is determined by licensed physicians following medical
          evaluation. Results may vary.
        </p>
      </div>

      {selected && (
        <QuoteModal name={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
