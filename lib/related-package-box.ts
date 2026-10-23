// "Related Package" box injected into blog post bodies -- 2026-10-23
// internal-link project, item 1. The post's content is a static,
// pre-sanitized HTML string rendered via dangerouslySetInnerHTML (see
// app/(blog-engine)/posts/[slug]/page.tsx and blog-article-content.tsx),
// so this box has to be generated as an HTML string spliced into that
// same blob rather than a React component -- there's no React tree here
// to render one into.
//
// `!text-white` / `!no-underline` on the CTA override the wrapper's own
// `[&_a]:text-teal [&_a]:underline` rule (applied to every anchor inside
// the article body) via Tailwind's `!important` prefix, since both rules
// are plain class selectors and source order isn't reliable to control.
import { BLOG_LANDING_MATCHES } from "@/lib/blog-landing-matches.generated";

interface LandingInfo {
  name: string;
  description: string;
  href: string;
  ctaLabel: string;
}

// Exported for reuse by other "which landing page is this" call sites
// (e.g. the hospital page's Popular Treatments section) so the name/
// description copy has one source of truth.
export const LANDING_INFO: Readonly<Record<string, LandingInfo>> = {
  "hair-transplant-packages": {
    name: "Hair Transplant Packages",
    description: "All-inclusive FUE/DHI hair transplant packages combining surgery, accommodation and transfers in one price.",
    href: "/hair-transplant-packages",
    ctaLabel: "View Package",
  },
  "dental-implants-turkey": {
    name: "Dental Implants Turkey",
    description: "All-inclusive dental implant packages with Ministry of Health certified partner clinics.",
    href: "/dental-implants-turkey",
    ctaLabel: "View Package",
  },
  "all-on-4-dental-implants-turkey": {
    name: "All-on-4 Dental Implants Turkey",
    description: "A full-arch, same-day dental implant solution for patients missing most or all of their teeth.",
    href: "/all-on-4-dental-implants-turkey",
    ctaLabel: "View Package",
  },
  "rhinoplasty-turkey": {
    name: "Rhinoplasty Turkey",
    description: "All-inclusive nose job packages with experienced plastic surgeons and full aftercare.",
    href: "/rhinoplasty-turkey",
    ctaLabel: "View Package",
  },
  "breast-augmentation-turkey": {
    name: "Breast Augmentation Turkey",
    description: "All-inclusive breast augmentation packages, from implant selection to recovery support.",
    href: "/breast-augmentation-turkey",
    ctaLabel: "View Package",
  },
  "liposuction-turkey": {
    name: "Liposuction Turkey",
    description: "All-inclusive body contouring and liposuction packages with certified partner hospitals.",
    href: "/liposuction-turkey",
    ctaLabel: "View Package",
  },
  "gynecomastia-turkey": {
    name: "Gynecomastia Surgery Turkey",
    description: "All-inclusive gynecomastia surgery packages to treat enlarged male breast tissue.",
    href: "/gynecomastia-turkey",
    ctaLabel: "View Package",
  },
  "blepharoplasty-turkey": {
    name: "Blepharoplasty Turkey",
    description: "All-inclusive eyelid surgery packages to refresh and rejuvenate the eye area.",
    href: "/blepharoplasty-turkey",
    ctaLabel: "View Package",
  },
  "lasik-eye-surgery-turkey": {
    name: "LASIK Eye Surgery Turkey",
    description: "All-inclusive LASIK packages for safe, fast vision correction.",
    href: "/lasik-eye-surgery-turkey",
    ctaLabel: "View Package",
  },
  "cataract-surgery-turkey": {
    name: "Cataract Surgery Turkey",
    description: "All-inclusive cataract surgery packages with modern lens options.",
    href: "/cataract-surgery-turkey",
    ctaLabel: "View Package",
  },
  "ivf-treatment-turkey": {
    name: "IVF Treatment Turkey",
    description: "All-inclusive IVF treatment packages with experienced fertility specialists.",
    href: "/ivf-treatment-turkey",
    ctaLabel: "View Package",
  },
  "medical-check-up-turkey": {
    name: "Medical Check-Up Turkey",
    description: "Standard, Plus and VIP full-body check-up packages for a complete health screening.",
    href: "/medical-check-up-turkey",
    ctaLabel: "View Package",
  },
  "hospitals-in-turkey": {
    name: "Partner Hospitals in Turkey",
    description: "Browse our network of Ministry of Health certified partner hospitals.",
    href: "/hospitals-in-turkey",
    ctaLabel: "View Hospitals",
  },
};

// Secondary (outline) button, same data-cta="consultation" mechanism the
// WordPress-era banner images used before removeBannerImages() started
// stripping them -- see lib/gone-page.ts's sibling discussion. Only added
// to the END-of-article box, never the mid-article one (2026-10-23
// follow-up, item 1): one package CTA mid-article reads as a helpful
// pointer, two reads as nagging.
const QUOTE_BUTTON = `<a href="#" data-cta="consultation" class="!no-underline !text-brand inline-flex items-center justify-center rounded-full border border-brand px-5 py-2.5 text-sm font-semibold hover:!text-white hover:bg-brand transition-colors">Get a Free Quote</a>`;

function renderBoxHtml(info: LandingInfo, withQuoteButton: boolean): string {
  return `<div class="my-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 not-prose">
<p class="text-xs font-bold uppercase tracking-widest text-teal mb-2">Related Package</p>
<h4 class="text-lg font-bold text-brand mb-1">${info.name}</h4>
<p class="text-sm text-gray-600 mb-4">${info.description}</p>
<div class="flex flex-wrap gap-3">
<a href="${info.href}" class="!no-underline !text-white inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold hover:bg-[#154d8a] transition-colors">${info.ctaLabel}</a>
${withQuoteButton ? QUOTE_BUTTON : ""}
</div>
</div>`;
}

/** Returns the box's HTML, or null if this post has no title-tier landing
 * match (see lib/blog-landing-matches.generated.ts). `withQuoteButton`
 * adds the secondary "Get a Free Quote" CTA -- pass true only for the
 * end-of-article box, false for the mid-article one. */
export function getRelatedPackageBoxHtml(slug: string, withQuoteButton: boolean): string | null {
  const landing = BLOG_LANDING_MATCHES[slug];
  if (!landing) return null;
  const info = LANDING_INFO[landing];
  if (!info) return null;
  return renderBoxHtml(info, withQuoteButton);
}

/** Fallback box for posts with no landing match at all (including the
 * body-tier matches deliberately excluded from BLOG_LANDING_MATCHES) --
 * no package to point to, so just a plain consultation CTA. Always
 * end-of-article only, never mid-article. */
export function getGenericConsultationBoxHtml(): string {
  return `<div class="my-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 not-prose text-center">
<h4 class="text-lg font-bold text-brand mb-1">Have questions about your treatment?</h4>
<p class="text-sm text-gray-600 mb-4">Our International Patient Center will prepare a free, personalized plan within 48 hours.</p>
<a href="#" data-cta="consultation" class="!no-underline !text-white inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold hover:bg-[#154d8a] transition-colors">Get a Free Quote</a>
</div>`;
}

// Matches the article's opening block of real text. By the time this
// runs, removeTemplateIntro() (in the page component) has already
// stripped the generic "...is an article that aims to give you all the
// information..." sentence most posts open with -- so what's actually
// left at the start is often the bullet-list table of contents that
// originally followed it, THEN the real first paragraph. The optional
// leading <ul> is skipped so the box still lands after real prose, not
// immediately under the H1 the way matching only the very first tag did.
const FIRST_PARAGRAPH = /^\s*(?:<ul\b[\s\S]*?<\/ul>\s*)?<(p|span)\b[^>]*>[\s\S]*?<\/\1>/;

/** Splices the two box variants into an article's HTML: endBoxHtml is
 * always appended at the end, and midBoxHtml is ALSO inserted after the
 * first paragraph of body text for long posts (3+ H2 sections) -- never
 * directly under the H1, which is what inserting before the first <h2>
 * used to do on posts whose opening paragraph is very short. */
export function injectRelatedPackageBox(html: string, midBoxHtml: string, endBoxHtml: string): string {
  const h2Count = (html.match(/<h2[ >]/g) || []).length;
  let result = html;
  if (h2Count >= 3) {
    const match = result.match(FIRST_PARAGRAPH);
    if (match) {
      const insertAt = match[0].length;
      result = result.slice(0, insertAt) + midBoxHtml + result.slice(insertAt);
    }
  }
  return result + endBoxHtml;
}
