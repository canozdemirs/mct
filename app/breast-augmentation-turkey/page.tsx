import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import BreastAugmentationLanding from "@/components/marketing/breast-augmentation-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/breast-augmentation-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey breast augmentation package?", a: "Our Hassle-Free Package covers everything from arrival to recovery. This includes the breast augmentation surgery, premium silicone implants, pre-operative blood tests and examination, general anaesthesia, 1 night post-operative hospital stay, all post-op medication and compression garment, private two-way airport transfers, 7 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. No hidden fees — one clear price covers everything." },
  { q: "How much does breast augmentation cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €4,500 and covers the surgery, premium silicone implants, and hospital stay. The Hassle-Free Package is €5,000 and adds 7 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €6,200 and includes 5-star accommodation and the full Istanbul VIP experience. Silicone implants are always included — there are no hidden costs for the implants themselves." },
  { q: "How many days do I need to stay in Istanbul for breast augmentation?", a: "We recommend a minimum of 7 days and 7 nights. Day 1 is arrival. Day 2 is your pre-operative consultation, blood tests, and examination. Day 3 is your surgery — you stay one night in hospital for post-operative monitoring. Days 4–7 are recovery at your hotel. You must avoid heavy lifting and strenuous activity for 4–6 weeks post-surgery. Most patients fly home after 7 days feeling comfortable, with clear aftercare instructions and a compression garment provided." },
  { q: "Are the silicone implants included in the price?", a: "Yes — always. This is one of the most important things that sets Medical Center Turkey apart. Our package price always includes premium silicone implants. There are no surprise add-ons, no upgrade fees for implants, and no hidden costs. The price you see is the price you pay." },
  { q: "What type of implants do you use?", a: "We use premium, CE-marked silicone gel implants from internationally recognised manufacturers — the same brands used in the UK, USA, and Western Europe. Your surgeon will discuss implant size, profile, shape (round or anatomical), and placement (sub-glandular or sub-muscular) during your pre-operative consultation, based on your body type and desired outcome." },
  { q: "Is breast augmentation in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner surgeons are board-certified plastic surgeons with extensive experience in breast surgery for international patients." },
  { q: "Why should I choose Medical Center Turkey?", a: "When you book with Medical Center Turkey, you don't navigate a foreign healthcare system alone. From airport pickup on Day 1 to your final check before departure, your dedicated English-speaking GO coordinator handles every detail — transfers, hotel, hospital coordination, translations, and any question along the way. We have been serving international patients, and our entire system exists to make you feel safe, informed, and looked after every step of the way." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same surgery, premium implants, pre-op consultation, hospital stay, 7 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling." },
  { q: "When will I see my final breast augmentation result?", a: "Initial swelling peaks in the first week and gradually resolves over 6–8 weeks. At around 6 weeks, implants begin to settle into their final position — a process called 'dropping and fluffing'. Your final result is typically fully visible at 3–6 months. We provide 12 months of online aftercare support, checking in at 1 month, 3 months, and 6 months to monitor your progress." },
];

const packages = [
  { name: "Breast Augmentation Premium Package", price: "4500", description: "Breast augmentation surgery including premium silicone implants, pre-op blood tests, general anaesthesia, 1 night hospital stay, post-op medication and compression garment.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Breast Augmentation Hassle-Free Package", price: "5000", description: "All-inclusive breast augmentation — everything in Premium plus 7 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Breast Augmentation Executive Package", price: "6200", description: "Full VIP breast augmentation experience — all Hassle-Free inclusions plus 5-star hotel, Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Breast Augmentation Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Breast Augmentation Turkey | All-Inclusive Packages from €4,500 | Medical Center Turkey",
  description: "Breast augmentation in Istanbul with Medical Center Turkey. All-inclusive packages from €4,500 — premium silicone implants always included, surgery, hotel, transfers & 12 months aftercare. Ministry of Health authorized hospitals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function BreastAugmentationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <BreastAugmentationLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
