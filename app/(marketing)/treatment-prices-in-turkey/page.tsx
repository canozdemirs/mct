import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { treatments, categoryLabels } from "@/lib/treatments";

export const metadata: Metadata = {
  title: "Treatment Prices in Turkey 2026 — Full Comparison Table | Medical Center Turkey",
  description:
    "Compare treatment prices in Turkey vs UK and US. Hair transplant, rhinoplasty, dental implants, breast augmentation, bariatric surgery and more. All-inclusive packages with no hidden fees.",
  robots: { index: false, follow: false },
};

const ukPrices: Record<string, string> = {
  "hair-transplant": "£8,000 – £15,000",
  rhinoplasty: "£6,000 – £12,000",
  "breast-augmentation": "£6,000 – £10,000",
  liposuction: "£4,000 – £9,000",
  "tummy-tuck": "£7,000 – £12,000",
  bbl: "£8,000 – £14,000",
  facelift: "£10,000 – £20,000",
  "dental-veneers-implants": "£500/tooth – £3,500/implant",
  "medical-check-up": "£1,500 – £5,000",
  "bariatric-surgery": "£8,000 – £15,000",
};

const savings: Record<string, string> = {
  "hair-transplant": "Up to 80%",
  rhinoplasty: "Up to 75%",
  "breast-augmentation": "Up to 70%",
  liposuction: "Up to 75%",
  "tummy-tuck": "Up to 70%",
  bbl: "Up to 75%",
  facelift: "Up to 70%",
  "dental-veneers-implants": "Up to 75%",
  "medical-check-up": "Up to 80%",
  "bariatric-surgery": "Up to 75%",
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Treatment Prices in Turkey 2026",
  description:
    "Comparison table of medical treatment prices in Turkey versus UK and US. All prices are for all-inclusive Medical Center Turkey packages.",
  url: "https://medicalcenterturkey.com/treatment-prices-in-turkey",
  publisher: {
    "@type": "Organization",
    name: "Medical Center Turkey",
    url: "https://medicalcenterturkey.com",
  },
};

const faqs = [
  {
    q: "Are the prices on this page all-inclusive?",
    a: "Yes. All MCT package prices include hospital fees, surgeon fees, anaesthesia, post-operative medication, VIP airport transfers, and hotel accommodation. There are no hidden extras.",
  },
  {
    q: "Why are treatment prices in Turkey so much lower than the UK or US?",
    a: "Lower cost of living and operational costs in Turkey mean that hospitals and clinics can offer internationally equivalent quality at significantly lower prices. The techniques, equipment, and implant brands used are the same as in Western Europe and the US.",
  },
  {
    q: "Is the quality of medical care in Turkey comparable to the UK?",
    a: "MCT works exclusively with Ministry of Health certified hospitals — many of which hold JCI accreditation, the international gold standard in healthcare quality. The surgeons are often European-board certified and have trained internationally.",
  },
  {
    q: "Do prices vary depending on the specific procedure or complexity?",
    a: "Yes. The prices shown are starting prices. Complex cases, combination procedures, or premium package tiers will be priced accordingly. Your personalised quote is provided after reviewing your case.",
  },
  {
    q: "How do I get an exact price for my treatment?",
    a: "Contact us via WhatsApp or the consultation form with your details and any relevant photos. Our case management team will prepare a personalised treatment plan and all-inclusive quote within 24 hours.",
  },
];

const groupedTreatments = treatments.reduce<Record<string, typeof treatments>>(
  (acc, t) => {
    const key = t.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  },
  {}
);

const categoryOrder: Array<typeof treatments[0]["category"]> = [
  "hair",
  "aesthetic",
  "dental",
  "checkup",
  "general-medical",
];

export default function TreatmentPricesPage() {
  return (
    <>
      <Nav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <main>
        {/* Hero */}
        <div className="bg-brand text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <p className="text-teal text-xs font-bold uppercase tracking-widest mb-3">
              Medical Center Turkey — 2026
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Treatment Prices in Turkey
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              All-inclusive package prices for treatments coordinated by Medical Center Turkey in Istanbul.
              Compare with UK and US prices — no hidden fees.
            </p>
          </div>
        </div>

        {/* What's included banner */}
        <div className="bg-teal/10 border-b border-teal/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <p className="font-semibold text-brand text-xs uppercase tracking-wide mr-2">All packages include:</p>
              {[
                "Hospital & surgeon fees",
                "Anaesthesia",
                "VIP airport transfer",
                "Hotel accommodation",
                "Post-op medication",
                "Follow-up support",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-gray-700 text-xs">
                  <Check size={12} className="text-teal shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price tables */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {categoryOrder.map((cat) => {
            const group = groupedTreatments[cat];
            if (!group) return null;
            return (
              <div key={cat} className="mb-12">
                <h2 className="text-lg font-bold text-brand mb-4 pb-2 border-b border-gray-200">
                  {categoryLabels[cat]}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-bold uppercase tracking-wide text-gray-400">
                        <th className="pb-3 pr-6 min-w-[200px]">Treatment</th>
                        <th className="pb-3 pr-6 text-brand min-w-[160px]">MCT Turkey Price</th>
                        <th className="pb-3 pr-6 min-w-[160px]">UK Comparison</th>
                        <th className="pb-3 pr-6 min-w-[100px]">You Save</th>
                        <th className="pb-3 min-w-[120px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.map((t) => (
                        <tr key={t.slug} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 pr-6">
                            <Link
                              href={`/treatments/${t.slug}`}
                              className="font-semibold text-gray-900 hover:text-brand transition-colors"
                            >
                              {t.name}
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">{t.shortDescription}</p>
                          </td>
                          <td className="py-4 pr-6">
                            <span className="font-bold text-brand text-base">
                              ${t.priceRangeUsd[0].toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {" – "}${t.priceRangeUsd[1].toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 pr-6 text-gray-500">{ukPrices[t.slug]}</td>
                          <td className="py-4 pr-6">
                            <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                              {savings[t.slug]}
                            </span>
                          </td>
                          <td className="py-4">
                            <Link
                              href={`/treatments/${t.slug}`}
                              className="text-xs font-semibold text-brand hover:text-teal transition-colors"
                            >
                              View packages →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <p className="text-xs text-gray-400 mt-2">
            Prices are starting prices for MCT Hassle-Free packages in USD as of 2026.
            UK comparison prices are approximate private market rates. Final pricing is confirmed after case review.
            Final treatment suitability is determined by licensed physicians following medical evaluation.
          </p>
        </div>

        {/* FAQ */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-teal">FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">
                Treatment Prices in Turkey — Questions Answered
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border border-gray-200 rounded-2xl bg-white overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none">
                    <span className="font-semibold text-sm text-gray-800 group-open:text-brand transition-colors">
                      {faq.q}
                    </span>
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 group-open:bg-teal flex items-center justify-center text-gray-400 group-open:text-white text-xs font-bold transition-all">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Get your personalised price quote
            </h2>
            <p className="text-white/70 mb-8 text-base leading-relaxed">
              Share your details and we will prepare a treatment plan and all-inclusive quote within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/908508888911?text=Hello%20MCT%2C%20I%20would%20like%20a%20price%20quote%20for%20treatment%20in%20Turkey."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-[#1fb55a] transition-colors shadow-lg"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
              <Link
                href="/#consultation"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
