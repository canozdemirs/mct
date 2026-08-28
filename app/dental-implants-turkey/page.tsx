import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import DentalImplantLanding from "@/components/marketing/dental-implant-landing";
import { Breadcrumb } from "@/components/marketing/breadcrumb";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/dental-implants-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey dental implant package?", a: "Our Hassle-Free Package is our most complete option and includes: the titanium dental implant surgery, 3D panoramic X-ray and pre-surgical consultation, local anaesthesia, temporary crown where applicable, post-operative medication, private two-way airport transfers, 5 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, official warranty certificate, and 12 months of online aftercare support. No hidden fees — one clear price covers everything." },
  { q: "How much do dental implants cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €400 per implant and covers the surgery and in-clinic support. The Hassle-Free Package is €900 for a single implant and adds 5 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €1,500 for a single implant and includes the full Istanbul VIP experience. For multiple implants, we provide a personalised quote after reviewing your X-rays during your free online consultation." },
  { q: "How many days do I need to stay in Istanbul for dental implants?", a: "We recommend 5 days and 5 nights for the complete implant experience. Day 1 is arrival. Day 2 is your consultation and 3D scan. Day 3 is your implant surgery, where the titanium post is placed and a temporary crown fitted where appropriate. Days 4–5 are recovery and monitoring. You return home confident, with clear aftercare instructions and 12 months of online support. The osseointegration phase (3–6 months) and permanent crown fitting can be coordinated remotely with your local dentist." },
  { q: "Is getting a dental implant in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner hospitals use premium titanium implant systems from globally recognised manufacturers. Turkey is one of the world's leading destinations for dental treatment, combining highly trained oral surgeons, modern facilities, and significantly lower costs than the UK, USA, or Western Europe. Every implant comes with an official written warranty certificate." },
  { q: "Why should I choose Medical Center Turkey?", a: "When you book with Medical Center Turkey, you don't navigate a foreign healthcare system alone. From airport pickup on Day 1 to your final check before departure, your dedicated English-speaking GO coordinator handles every detail — transfers, hotel, hospital coordination, translations, and any question you have along the way. We have been serving international patients, and our entire system exists to make you feel safe, informed, and looked after every step of the way." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same implant surgery, 3D scan, 5 nights hotel, private transfers, and dedicated GO coordinator. The Executive Package adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling. If you would like to combine your dental treatment with a premium Istanbul experience, the Executive Package is the right choice." },
  { q: "How long do dental implants last?", a: "With proper care, titanium dental implants can last a lifetime. The implant post — the titanium screw that fuses with the jawbone — is designed to be permanent. The crown (the visible tooth part) typically lasts 10–15 years before it may need replacement due to normal wear. Our warranty certificate covers the implant and its placement. Good oral hygiene, regular check-ups with your local dentist, and not smoking are the most important factors for long-term success." },
  { q: "When will I get my permanent crown?", a: "In most cases a temporary crown is fitted on the day of surgery, so you leave with a tooth. The permanent crown is placed after osseointegration — the process by which the titanium implant fuses with the jawbone — which typically takes 3 to 6 months. We coordinate the permanent crown fitting remotely with your local dentist, or you can return to Istanbul for it. Our team provides 12 months of online aftercare support throughout this process." },
  { q: "Do I need bone grafting before a dental implant?", a: "Not always. Bone grafting is only required when there is insufficient bone density or volume to support the implant securely. Your suitability is determined by the 3D panoramic X-ray taken on Day 2, which gives your surgeon a precise view of your jaw structure. If your case requires bone grafting, this will be discussed with you during your online pre-consultation — before you travel — so there are no surprises on arrival." },
];

const packages = [
  { name: "Dental Implant Premium Package", price: "400", description: "Titanium dental implant per tooth, 3D panoramic X-ray and consultation, local anaesthesia, temporary crown where applicable, post-op medication and warranty certificate.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Dental Implant Hassle-Free Package", price: "900", description: "All-inclusive single implant package — everything in Premium plus 5 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Dental Implant Executive Package", price: "1500", description: "Full VIP single implant experience — all Hassle-Free inclusions plus Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Patient — USA", text: "I came to Istanbul for two implants and the experience was seamless from start to finish. The GO coordinator was with me every step of the way. The clinic was modern, the surgeon was excellent, and the price was a fraction of what I was quoted at home.", rating: 5 },
  { name: "Patient — United Kingdom", text: "I was nervous about getting dental implants abroad but Medical Center Turkey made it completely stress-free. The hotel, transfers, and hospital were all world-class. I left with a temporary crown and couldn't be happier.", rating: 5 },
  { name: "Patient — Canada", text: "The whole process — from my first WhatsApp message to landing back in Canada — was handled professionally. My coordinator answered every question immediately. The implant looks and feels perfect.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("Dental Implants Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Dental Implants Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Dental Implants Turkey | All-Inclusive Packages from €400 | Medical Center Turkey",
  description: "Dental implants in Istanbul with Medical Center Turkey. Premium titanium implants from €400 — all-inclusive packages with hotel, transfers & warranty certificate. Ministry of Health authorized hospitals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function DentalImplantsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Packages", href: "/#packages" }, { label: "Dental Implants Turkey" }]} />
      <main>
        <DentalImplantLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
