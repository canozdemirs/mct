import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import LasikLanding from "@/components/marketing/lasik-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/lasik-eye-surgery-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey LASIK package?", a: "Our Hassle-Free Package covers everything from arrival to recovery. This includes LASIK surgery on both eyes using wavefront-guided laser technology, a full pre-operative eye examination, local anaesthetic drops, post-operative eye drops and protective goggles, a day-after follow-up appointment, private two-way airport transfers, 3 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. One clear price — no hidden fees." },
  { q: "How much does LASIK eye surgery cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €1,600 and covers the surgery itself (both eyes), pre-op examination, anaesthetic drops, post-op drops, protective goggles, and a day-after check. The Hassle-Free Package is €2,100 and adds 3 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €2,900 and includes 5-star accommodation and the full Istanbul VIP experience." },
  { q: "Am I a candidate for LASIK surgery?", a: "Most adults with stable vision prescriptions are candidates for LASIK. Ideal candidates have a prescription within the treatable range, stable vision for at least one year, healthy corneas with sufficient thickness, and no underlying eye conditions such as keratoconus or severe dry eye. Your pre-operative examination at our partner hospital will confirm your suitability before any commitment is made." },
  { q: "How many days do I need to stay in Istanbul for LASIK?", a: "LASIK is an outpatient procedure with a very fast recovery — we recommend just 3 days. Day 1 is arrival and rest. Day 2 is your pre-operative eye examination followed by the LASIK procedure itself — the laser treatment on both eyes takes approximately 10–15 minutes. Day 3 is your follow-up appointment to confirm your vision has stabilised, and you can fly home the same day." },
  { q: "Is LASIK eye surgery in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner eye surgeons are board-certified ophthalmologists with extensive experience in refractive surgery for international patients, using the latest generation wavefront-guided laser technology." },
  { q: "What is the LASIK procedure like on surgery day?", a: "LASIK is a quick, painless outpatient procedure. Anaesthetic drops are applied to numb the eye. The surgeon creates a thin corneal flap, the laser reshapes the underlying corneal tissue to correct your prescription, and the flap is repositioned — naturally adhering without stitches. The entire procedure for both eyes takes approximately 15 minutes. Most patients experience improved vision within hours of surgery." },
  { q: "What is the recovery process after LASIK?", a: "LASIK has one of the fastest recovery timelines of any surgical procedure. Most patients notice dramatically improved vision within 24 hours. Mild dryness, light sensitivity, and slight haziness are normal for the first few days and resolve quickly. You should avoid rubbing your eyes for 2 weeks, use the prescribed eye drops as instructed, and wear protective goggles during sleep for the first week. Full visual stabilisation occurs within 4–6 weeks." },
  { q: "Will I achieve 20/20 vision after LASIK?", a: "The majority of patients achieve 20/20 vision or better after LASIK. Results depend on your individual prescription and corneal anatomy, which is why the pre-operative examination is so important. Your surgeon will give you a realistic expectation of your outcome at your pre-op consultation. We never guarantee specific visual outcomes — your result is confirmed only after the full pre-operative assessment." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same surgery, pre-op eye examination, follow-up appointment, 3 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling." },
];

const packages = [
  { name: "LASIK Eye Surgery Premium Package", price: "1600", description: "LASIK surgery both eyes with wavefront-guided laser, pre-op eye examination, anaesthetic drops, post-op drops and protective goggles, day-after follow-up appointment.", url: PAGE_URL, currency: "EUR" as const },
  { name: "LASIK Eye Surgery Hassle-Free Package", price: "2100", description: "All-inclusive LASIK package — surgery (both eyes), pre-op examination, follow-up, 3 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "LASIK Eye Surgery Executive Package", price: "2900", description: "Full VIP LASIK experience — all Hassle-Free inclusions plus 5-star hotel, Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "LASIK Eye Surgery Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "LASIK Eye Surgery Turkey | All-Inclusive Packages from €1,600 | Medical Center Turkey",
  description: "LASIK eye surgery in Istanbul with Medical Center Turkey. All-inclusive packages from €1,600 — surgery (both eyes), hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals. Board-certified ophthalmologists.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function LasikPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <LasikLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
