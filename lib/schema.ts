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

export function generateReviewSchema(
  serviceName: string,
  testimonials: Testimonial[]
) {
  const count = testimonials.length;
  const avgRating =
    testimonials.reduce((sum, t) => sum + (t.rating ?? 5), 0) / count;

  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
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

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Medical Center Turkey",
    url: "https://medicalcenterturkey.com",
    logo: "https://medicalcenterturkey.com/mct-logo.png",
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

// Helper: render multiple schemas as one <script> tag (call JSON.stringify on result)
export function combineSchemas(...schemas: object[]) {
  return schemas;
}
