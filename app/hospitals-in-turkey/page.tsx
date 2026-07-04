import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { HospitalGrid } from "@/components/marketing/hospital-grid";
import { hospitals } from "@/lib/hospitals";

export const metadata: Metadata = {
  title: "Hospitals in Turkey | JCI-Accredited Partner Hospitals | Medical Center Turkey",
  description:
    "Browse JCI-accredited partner hospitals in Turkey coordinated by Medical Center Turkey for international patients. Compare leading hospital groups across Istanbul, Ankara and Antalya — and start your treatment journey with full support.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const STEPS = [
  "Free consultation",
  "We match you with the right hospital",
  "Full coordination during treatment",
];

export default function HospitalsInTurkeyPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section
          className="py-20 md:py-28 text-white"
          style={{ background: "linear-gradient(135deg, #1b5fa8 0%, #1ab3c8 100%)" }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              MCT Partner Network
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
              Hospitals in Turkey
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              JCI-accredited partner hospitals where Medical Center Turkey coordinates
              treatment for international patients.
            </p>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HospitalGrid hospitals={hospitals} />
          </div>
        </section>

        {/* Info strip */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-teal-50 border border-teal-100 p-8 text-center">
              <p className="text-base font-semibold text-[#1b5fa8] mb-8">
                All appointments at our partner hospitals are arranged exclusively through
                Medical Center Turkey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
                {STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-[#1ab3c8] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{step}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <svg
                        className="hidden sm:block shrink-0 text-[#1ab3c8] mx-3"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
