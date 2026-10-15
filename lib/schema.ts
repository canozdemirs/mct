// JSON-LD Structured Data Generators for Medical Center Turkey

export interface FAQ {
  q: string;
  a: string;
}

export interface PackageOffer {
  name: string;
  price: string; // e.g. "2,500" or "$750"
  description: string;
  url: string;
  currency: "EUR" | "USD";
}

export interface Testimonial {
  name: string;
  text: string;
  rating?: number;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Strips currency symbols and commas → numeric string for schema
function parsePrice(price: string): string {
  return price.replace(/[$€,]/g, "").trim();
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function generateProductsSchema(packages: PackageOffer[]) {
  return {
    "@context": "https://schema.org",
    "@graph": packages.map((pkg) => ({
      "@type": "Product",
      name: pkg.name,
      description: pkg.description,
      brand: {
        "@type": "Brand",
        name: "Medical Center Turkey",
      },
      offers: {
        "@type": "Offer",
        price: parsePrice(pkg.price),
        priceCurrency: pkg.currency,
        availability: "https://schema.org/InStock",
        url: pkg.url,
        seller: {
          "@type": "Organization",
          name: "Medical Center Turkey",
        },
      },
    })),
  };
}

// Post-launch P1 fix (2026-10-15): "@type" was hardcoded to "MedicalClinic",
// naming Medical Center Turkey itself under a type that implies it directly
// delivers medical care -- the same issue already fixed in
// generateOrganizationSchema(), missed here because it's a separate
// generator. Changed to "Organization" to match. See CLAUDE.md: "MCT is
// NOT a hospital/clinic/healthcare provider."
//
// Separately, and left unresolved by this fix because no markup change can
// resolve it: Google's structured-data policies treat review/rating markup
// an organization publishes about itself on its own site as "self-serving"
// and do not guarantee it star-rating rich-result eligibility, regardless
// of @type. This function's output has never been, and is not now, proven
// eligible for that treatment -- do not assume otherwise when reasoning
// about expected search appearance. Testimonial content, names, ratings
// and counts are unchanged by this fix.
export function generateReviewSchema(
  serviceName: string,
  testimonials: Testimonial[]
) {
  const count = testimonials.length;
  const avgRating =
    testimonials.reduce((sum, t) => sum + (t.rating ?? 5), 0) / count;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: serviceName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: count,
      bestRating: "5",
      worstRating: "1",
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: (t.rating ?? 5).toString(),
        bestRating: "5",
      },
      reviewBody: t.text,
    })),
  };
}

// Dynamic BreadcrumbList — also used by the future breadcrumb component
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Blog index pages only — reflects just what's actually rendered on the
// page (name/description/url + how many blog posts exist in total), no
// per-item listing (the cards themselves aren't structured-data-worthy on
// their own; each article already carries its own BlogPosting schema on
// its own page via generateArticleSchema).
export function generateCollectionPageSchema({
  name,
  description,
  url,
  numberOfItems,
}: {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    // Pre-launch GEO fix (2026-10-14): "MedicalBusiness" implied MCT itself
    // delivers medical care, contradicting CLAUDE.md's explicit identity
    // ("MCT is NOT a hospital/clinic/healthcare provider... an
    // International Patient Center and Health Tourism Coordinator").
    // "Organization" is schema.org's accurate, non-overclaiming type for a
    // coordination company in this position -- it does not need a specific
    // medical/business subtype to be valid or well-formed.
    "@type": "Organization",
    name: "Medical Center Turkey",
    description:
      "Medical Center Turkey is an International Patient Center and Health Tourism Coordinator based in Istanbul, Turkey. It connects international patients with licensed, Ministry of Health certified healthcare providers and manages the complete treatment journey from first inquiry to aftercare. Medical Center Turkey is not a hospital, clinic or healthcare provider.",
    url: "https://www.medicalcenterturkey.com",
    logo: "https://www.medicalcenterturkey.com/mct-logo.png",
    telephone: "+908508888911",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Barbaros Mah. Al Zambak Sk. Varyap Meridian Grand Tower A Blok No:2 D:226",
      addressLocality: "Ataşehir",
      addressRegion: "İstanbul",
      postalCode: "34746",
      addressCountry: "TR",
    },
    sameAs: [
      "https://www.instagram.com/medicalcenterturkey",
      "https://www.facebook.com/medicalcenterturkey",
      "https://www.linkedin.com/company/medicalcenterturkey",
      "https://www.trustpilot.com/review/medicalcenterturkey.com",
    ],
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: article.image,
    author: {
      "@type": "Organization",
      name: "Medical Center Turkey",
    },
    publisher: {
      "@type": "Organization",
      name: "Medical Center Turkey",
      logo: {
        "@type": "ImageObject",
        url: "https://www.medicalcenterturkey.com/mct-logo.png",
      },
    },
  };
}

// Helper: render multiple schemas as one <script> tag (call JSON.stringify on result)
export function combineSchemas(...schemas: object[]) {
  return schemas;
}
