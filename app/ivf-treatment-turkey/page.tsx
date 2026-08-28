import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import IVFLanding from "@/components/marketing/ivf-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/ivf-treatment-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey IVF package?", a: "Our Hassle-Free Package covers one complete IVF cycle from start to finish. This includes the initial consultation and assessment, all hormonal blood tests and ultrasound monitoring appointments, egg retrieval (OPU) under sedation, sperm analysis and preparation, embryo culture and transfer, luteal phase support medication, private two-way airport transfers, 14 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. One clear price — no hidden fees." },
  { q: "How much does IVF cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €3,000 and covers one complete IVF cycle including all monitoring, egg retrieval, embryo culture, and transfer. The Hassle-Free Package is €4,200 and adds 14 nights hotel and private transfers — everything you need for your entire Istanbul stay. The Executive Package is €5,200 and includes 5-star accommodation and the full Istanbul VIP experience." },
  { q: "How many days do I need to stay in Istanbul for IVF?", a: "A standard IVF cycle requires approximately 12 to 14 days in Istanbul. The treatment begins with baseline monitoring, followed by daily stimulation injections and regular ultrasound monitoring (approximately every 2 days). Egg retrieval (OPU) is performed when follicles reach the correct size — typically around Day 10–12. Embryo transfer follows 3–5 days after retrieval. You can return home after the transfer and complete your luteal phase support and pregnancy test at home." },
  { q: "Is IVF in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals and fertility clinics holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner reproductive endocrinologists and embryologists are internationally trained specialists with extensive IVF experience for international patients." },
  { q: "What does the IVF process involve?", a: "IVF consists of several stages. First, ovarian stimulation — daily hormone injections stimulate the ovaries to produce multiple eggs, monitored by regular blood tests and ultrasounds. Second, egg retrieval (OPU) — eggs are collected under sedation in a minor procedure taking 20–30 minutes. Third, fertilisation — eggs are fertilised with prepared sperm in the laboratory and monitored as they develop into embryos. Fourth, embryo transfer — the best quality embryo is transferred to the uterus in a simple, painless procedure. Finally, the two-week wait — a pregnancy test is performed 10–14 days after transfer." },
  { q: "What is the IVF success rate in Turkey?", a: "Success rates vary depending on the patient's age, diagnosis, and individual response to treatment. Turkey's leading IVF clinics report clinical pregnancy rates of 50–65% per transfer for patients under 35, which is comparable to the best European clinics. Your personalised success estimate will be discussed during your initial consultation. We never quote guaranteed success rates — results depend on individual factors that are assessed during your assessment." },
  { q: "Do I need to bring my partner?", a: "If using a partner's sperm, your partner is required for the sperm analysis and preparation on the day of egg retrieval. If using donor sperm, your partner does not need to travel. Your clinic coordinator will advise on exactly when your partner needs to be present based on your specific protocol." },
  { q: "Can I use donor eggs or donor sperm?", a: "Yes. Turkey has a well-established, legal framework for egg and sperm donation. Anonymous egg donation is available at our partner clinics, with donors carefully screened for genetic conditions, infectious diseases, and physical characteristics. Donor programmes can significantly improve success rates for patients with poor ovarian reserve or previous IVF failures. Your reproductive specialist will discuss all options during your initial consultation." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same complete IVF cycle, all monitoring appointments, egg retrieval, embryo culture, transfer, 14 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling." },
];

const packages = [
  { name: "IVF Premium Package", price: "3000", description: "Standard IVF protocol (1 cycle) including initial consultation, hormonal blood tests, ultrasound monitoring, egg retrieval under sedation, embryo culture and transfer, luteal phase support.", url: PAGE_URL, currency: "EUR" as const },
  { name: "IVF Hassle-Free Package", price: "4200", description: "All-inclusive IVF package — one complete cycle plus 14 nights 4-star hotel, private airport transfers and dedicated GO coordinator throughout your stay.", url: PAGE_URL, currency: "EUR" as const },
  { name: "IVF Executive Package", price: "5200", description: "Full VIP IVF experience — all Hassle-Free inclusions plus 5-star hotel, Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Patient — United Kingdom", text: "After two failed IVF cycles at home, we came to Medical Center Turkey as a last hope. The clinic was world-class, the embryologist kept us updated every single day, and our GO made us feel completely supported throughout. We are now expecting our first child. We cannot thank this team enough.", rating: 5 },
  { name: "Patient — USA", text: "IVF in the US was simply unaffordable for us. Medical Center Turkey offered the same — honestly higher — standard of care at a fraction of the price. The monitoring was thorough, the laboratory was advanced, and the team was warm and professional throughout. We got our positive test 12 days after transfer.", rating: 5 },
  { name: "Patient — Ireland", text: "I was terrified about going through IVF abroad but this team removed every single worry. The coordinator was with me at every appointment, the doctor explained everything in detail, and I never felt alone. The whole experience was far better than our clinic back home.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("IVF Treatment Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "IVF Treatment Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "IVF Treatment Turkey | All-Inclusive Packages from €3,000 | Medical Center Turkey",
  description: "IVF treatment in Istanbul with Medical Center Turkey. All-inclusive packages from €3,000 — one complete IVF cycle, hotel, transfers & 12 months aftercare included. Ministry of Health authorized fertility clinics.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function IVFPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <IVFLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
