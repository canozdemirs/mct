import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle, ArrowLeft } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { treatments } from "@/lib/treatments";
import { treatmentDetails } from "@/lib/treatment-content";

const tierLabels: Record<string, string> = {
  "hassle-free": "Hassle-Free",
  gold: "Gold",
  premium: "Premium",
  exclusive: "Exclusive",
};

const tierColors: Record<string, string> = {
  "hassle-free": "border-gray-200 bg-white",
  gold: "border-teal bg-white ring-2 ring-teal",
  premium: "border-brand/40 bg-brand/5",
  exclusive: "border-amber-300 bg-amber-50",
};

const tierBadge: Record<string, string> = {
  "hassle-free": "",
  gold: "Most Popular",
  premium: "Best Value",
  exclusive: "All-Inclusive",
};

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = treatmentDetails[slug];
  if (!detail) return {};
  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const treatment = treatments.find((t) => t.slug === slug);
  const detail = treatmentDetails[slug];

  if (!treatment || !detail) notFound();

  const schemaGraph = [
    {
      "@type": "MedicalProcedure",
      "@id": `https://medicalcenterturkey.com/treatments/${slug}#procedure`,
      name: treatment.name,
      description: detail.intro,
      howPerformed: detail.howPerformed,
      procedureType: "https://schema.org/SurgicalProcedure",
      status: "EventScheduled",
      performer: {
        "@type": "MedicalOrganization",
        name: "Medical Center Turkey",
        url: "https://medicalcenterturkey.com",
      },
    },
    ...detail.packages.map((pkg) => ({
      "@type": "Offer",
      name: `${treatment.name} — ${tierLabels[pkg.tier]} Package`,
      description: pkg.inclusions.join(", "),
      priceCurrency: "USD",
      price: pkg.priceUsd,
      availability: "https://schema.org/InStock",
      url: `https://medicalcenterturkey.com/treatments/${slug}`,
      seller: {
        "@type": "Organization",
        name: "Medical Center Turkey",
      },
    })),
    {
      "@type": "FAQPage",
      mainEntity: detail.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ];

  return (
    <>
      <Nav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": schemaGraph,
          }),
        }}
      />

      <main>
        {/* Hero bar */}
        <div className="bg-brand text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <Link
              href="/#packages"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={15} />
              All Treatments
            </Link>
            <div className="max-w-3xl">
              <p className="text-teal text-xs font-bold uppercase tracking-widest mb-3">
                Medical Center Turkey — Istanbul
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {treatment.name} in Turkey
              </h1>
              <p className="text-white/75 text-lg leading-relaxed">
                {detail.intro}
              </p>
              <div className="flex flex-wrap gap-6 mt-8 text-sm">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Packages from</p>
                  <p className="font-bold text-2xl text-white">${detail.packages[0].priceUsd.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Typical stay</p>
                  <p className="font-semibold text-lg text-white">{detail.stayDuration}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Hospitals</p>
                  <p className="font-semibold text-lg text-white">Ministry of Health Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it's performed */}
        <section className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-lg font-bold text-brand mb-3">How the procedure works</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">{detail.howPerformed}</p>
          </div>
        </section>

        {/* Packages */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">MCT Packages</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">
              {treatment.name} Packages
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              All packages are managed end-to-end by your MCT case manager.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {detail.packages.map((pkg) => (
              <div
                key={pkg.tier}
                className={`relative rounded-2xl border-2 p-6 flex flex-col ${tierColors[pkg.tier]}`}
              >
                {tierBadge[pkg.tier] && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                    {tierBadge[pkg.tier]}
                  </span>
                )}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {tierLabels[pkg.tier]}
                  </p>
                  <p className="text-2xl font-bold text-brand">
                    ${pkg.priceUsd.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">all-inclusive</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check size={12} className="text-teal shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/908508888911?text=${encodeURIComponent(
                    `Hello MCT, I am interested in the ${treatment.name} ${tierLabels[pkg.tier]} Package.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 bg-teal text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#159fb3] transition-colors"
                >
                  <MessageCircle size={13} />
                  Get a Free Quote
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Final treatment suitability is determined by licensed physicians following medical evaluation. Results may vary.
          </p>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-teal">FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand mt-2">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {detail.faqs.map((faq, i) => (
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
              Ready to get started?
            </h2>
            <p className="text-white/70 mb-8 text-base leading-relaxed">
              Send us your details and we will prepare a personalised treatment plan and quote within 24 hours — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/908508888911?text=${encodeURIComponent(
                  `Hello MCT, I would like to enquire about ${treatment.name} in Turkey.`
                )}`}
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
