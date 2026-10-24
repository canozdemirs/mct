import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { HairTransplantBeforeAfterLanding } from "@/components/marketing/hair-transplant-before-after-landing";
import { generateBreadcrumbSchema } from "@/lib/schema";

// Dedicated conversion-focused landing page, replacing the blog-engine
// rendering of this same URL -- see lib/blog-replaced-by-page.ts for how
// the blog engine (index, sitemap, static params, proxy.ts's rewrite) is
// kept from also serving this slug. Google Ads' "Before & After Results"
// sitelink points here; visitors expect photos immediately, not ~1,300
// words of migrated WordPress text first.
const PAGE_URL = "https://www.medicalcenterturkey.com/hair-transplant-surgery-before-and-after-turkey";

// 6 real before/after photos only -- the 7 "PATIENT REVIEW" screenshot
// cards that used to be mixed into this same set live in the Reviews
// section instead (see hair-transplant-before-after-landing.tsx), not
// here, since they're not photos of a treatment result.
const GALLERY_SLUGS = ["1", "2", "3", "4", "5", "6"];

export const metadata: Metadata = {
  title: "Hair Transplant Before and After Turkey | Real Patient Results | Medical Center Turkey",
  description: "See real hair transplant before and after results from Medical Center Turkey patients in Istanbul. Natural hairlines, all-inclusive packages from €1,840. Free online hair analysis.",
  alternates: {
    canonical: PAGE_URL,
  },
};

// Breadcrumb + a simple ItemList of ImageObject for the gallery -- no
// review/rating schema here (that already lives on /hair-transplant-
// packages, which carries the real, attributed Trustpilot reviews this
// page also displays; duplicating a rating schema on a second URL isn't
// warranted and risks a mismatched aggregate).
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.medicalcenterturkey.com" },
  { name: "Hair Transplant Before & After", url: PAGE_URL },
]);

const imageListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Hair Transplant Before and After — Medical Center Turkey Patient Results",
  numberOfItems: GALLERY_SLUGS.length,
  itemListElement: GALLERY_SLUGS.map((slug, i) => ({
    "@type": "ImageObject",
    position: i + 1,
    contentUrl: `https://www.medicalcenterturkey.com/blog/hair-transplant-surgery-before-and-after-turkey/${slug}.png`,
    name: `Hair transplant before and after – Medical Center Turkey patient ${i + 1}`,
  })),
};

export default function HairTransplantBeforeAfterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageListSchema) }} />
      <Nav />
      <main>
        <HairTransplantBeforeAfterLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
