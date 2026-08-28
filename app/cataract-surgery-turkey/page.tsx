import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import CataractLanding from "@/components/marketing/cataract-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/cataract-surgery-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey cataract surgery package?", a: "Our Hassle-Free Package covers everything from arrival to recovery. This includes cataract surgery on both eyes with a premium intraocular lens (IOL), a full pre-operative eye examination and biometry measurements, local anaesthesia, post-operative eye drops and protective goggles, a day-after follow-up appointment, private two-way airport transfers, 4 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. One clear price — no hidden fees." },
  { q: "How much does cataract surgery cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €4,000 and covers the surgery on both eyes including a premium IOL, pre-op examination, and follow-up. The Hassle-Free Package is €5,500 and adds 4 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €6,500 and includes 5-star accommodation and the full Istanbul VIP experience." },
  { q: "What type of lens (IOL) is included in the package?", a: "Our packages include a premium intraocular lens (IOL) for both eyes. Your surgeon will discuss lens options during your pre-operative consultation, including monofocal, multifocal, and toric lenses depending on your visual needs and lifestyle. The most suitable lens type is determined after your biometry measurements and a detailed discussion with your surgeon." },
  { q: "How many days do I need to stay in Istanbul for cataract surgery?", a: "We recommend 4 to 5 days. Day 1 is arrival and rest. Day 2 is your pre-operative eye examination and biometry. Day 3 is your surgery — cataract surgery is an outpatient procedure performed under local anaesthesia, typically taking 20–30 minutes per eye. Day 4 is your follow-up appointment to confirm healing. Most patients can fly home comfortably on Day 5." },
  { q: "Is cataract surgery in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner ophthalmologists are board-certified eye surgeons with extensive experience in cataract and refractive surgery for international patients, using the latest generation phacoemulsification technology." },
  { q: "What does cataract surgery involve?", a: "Modern cataract surgery uses a technique called phacoemulsification. A tiny incision is made in the cornea, the clouded natural lens is broken up using ultrasound and gently removed, and a clear artificial intraocular lens (IOL) is inserted in its place. The procedure is performed under local anaesthetic eye drops — no needles, no stitches — and takes approximately 20–30 minutes per eye. Most patients notice improved vision within 24 hours." },
  { q: "What is the recovery process after cataract surgery?", a: "Recovery is fast. Most patients notice significantly clearer vision within 24 to 48 hours. You should use the prescribed eye drops as instructed, avoid rubbing your eyes, and wear protective goggles during sleep for the first week. Avoid swimming and dusty environments for 2 weeks. Full visual stabilisation typically occurs within 4–6 weeks as the eye settles around the new lens." },
  { q: "Will I still need glasses after cataract surgery?", a: "This depends on the lens type chosen. Monofocal lenses correct vision at one distance — most patients choose distance correction and use reading glasses for close work. Multifocal lenses are designed to reduce dependence on glasses at multiple distances. Your surgeon will explain the options and help you choose the lens that best matches your visual expectations during your pre-operative consultation." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same surgery, lens, pre-op examination, follow-up appointment, 4 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling." },
];

const packages = [
  { name: "Cataract Surgery Premium Package", price: "4000", description: "Cataract surgery both eyes with premium IOL, pre-op eye examination and biometry, local anaesthesia, post-op eye drops and goggles, day-after follow-up.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Cataract Surgery Hassle-Free Package", price: "5500", description: "All-inclusive cataract package — surgery (both eyes) with premium IOL, pre-op examination, 4 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Cataract Surgery Executive Package", price: "6500", description: "Full VIP cataract experience — all Hassle-Free inclusions plus 5-star hotel, Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Patient — United Kingdom", text: "I had been struggling with cataracts for two years — the waiting list at home was endless. Medical Center Turkey arranged everything perfectly. The surgeon was outstanding, the hospital was modern and spotless, and I could see clearly the very next morning. My GO was with me at every step. Absolutely first-class.", rating: 5 },
  { name: "Patient — USA", text: "The cost of cataract surgery in the US was simply out of reach for me. Medical Center Turkey delivered an exceptional standard of care at a fraction of the price. The lens consultation was thorough, the surgery was painless, and the coordinator made the whole experience completely stress-free.", rating: 5 },
  { name: "Patient — Ireland", text: "I was nervous about travelling abroad for eye surgery, but the team put every concern to rest immediately. The pre-op examination was the most thorough I've ever had. Surgery was quick and painless. I woke up the next day seeing the world clearly for the first time in years. Highly recommended.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("Cataract Surgery Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Cataract Surgery Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Cataract Surgery Turkey | All-Inclusive Packages from €4,000 | Medical Center Turkey",
  description: "Cataract surgery in Istanbul with Medical Center Turkey. All-inclusive packages from €4,000 — surgery (both eyes), premium IOL, hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function CataractPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <CataractLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
