import type { Metadata } from "next";
import { MedicalTourismTurkeyNav } from "@/components/marketing/medical-tourism-turkey-nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { MedicalTourismTurkeyLanding } from "@/components/marketing/medical-tourism-turkey-landing";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { MEDICAL_TOURISM_TURKEY_FAQS } from "@/lib/medical-tourism-turkey-content";

// Single Turkish corporate page, adapted from the existing WordPress page at
// the same URL. Not part of a multilingual/i18n system — no [locale]
// segment, no next-intl, no hreflang. Root layout's <html lang="en"> is
// intentionally left unchanged (see report); this page's own content is
// wrapped in <div lang="tr"> instead (see MedicalTourismTurkeyLanding).
// No explicit `robots` metadata here. The root layout sets none either
// (Phase 5K-D) — pre-launch protection comes solely from proxy.ts, which
// sets X-Robots-Tag: noindex, nofollow on any non-production host. Same
// as every other page on the site (corrected 2026-10-14; this comment
// previously described a layout-level noindex that no longer exists).
//
// Uses MedicalTourismTurkeyNav instead of the global <Nav /> (English
// header) so this page shows exactly one navigation bar instead of two
// stacked headers. The global Nav component itself is untouched and still
// used everywhere else.

const PAGE_URL = "https://www.medicalcenterturkey.com/medical-tourism-turkey";

export const metadata: Metadata = {
  title: "Sağlık Turizmi Türkiye | Medical Center Turkey",
  description:
    "Medical Center Turkey, uluslararası hastalar için Türkiye'de sağlık turizmi koordinasyonu sağlayan, Sağlık Bakanlığı yetkili aracı kuruluşudur. Ön görüşmeden taburcu sürecine kadar tüm aşamalar koordine edilir.",
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function MedicalTourismTurkeyPage() {
  const faqSchema = generateFAQSchema(MEDICAL_TOURISM_TURKEY_FAQS);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.medicalcenterturkey.com" },
    { name: "Sağlık Turizmi Türkiye", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <MedicalTourismTurkeyNav />
      <main>
        <MedicalTourismTurkeyLanding />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
