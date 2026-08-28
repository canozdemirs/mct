import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import RhinoplastyLanding from "@/components/marketing/rhinoplasty-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/rhinoplasty-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey rhinoplasty package?", a: "Our Hassle-Free Package covers everything you need from arrival to recovery. This includes the rhinoplasty surgery (open or closed technique), pre-operative blood tests and examination, general anaesthesia, 1 night post-operative hospital stay, all post-op medication and nasal splint, private two-way airport transfers, 7 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. No hidden fees — one clear price covers everything." },
  { q: "How much does rhinoplasty cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €2,500 and covers the surgery and hospital stay. The Hassle-Free Package is €3,000 and adds 7 nights hotel, private transfers, and a dedicated coordinator — making your entire Istanbul stay completely self-contained. Our Executive Package is €4,200 and includes 5-star hotel accommodation and the full Istanbul VIP experience. Final pricing may vary slightly depending on your case complexity — we provide a personalised quote after your free consultation." },
  { q: "How many days do I need to stay in Istanbul for rhinoplasty?", a: "We recommend a minimum of 7 days and 7 nights. Day 1 is arrival. Day 2 is your pre-operative consultation, blood tests, and examination. Day 3 is your rhinoplasty surgery — you stay one night in hospital for post-operative monitoring. Days 4–7 are recovery at your hotel. Your cast and splint remain in place for approximately 7 days before removal. Most patients are comfortable flying home after 7 days, though we recommend staying closer to 10 days if possible for extra comfort during initial recovery." },
  { q: "What is the difference between open and closed rhinoplasty?", a: "In closed rhinoplasty, all incisions are made inside the nostrils — there are no external scars. This technique is suitable for cases requiring moderate reshaping and typically has a shorter recovery time. Open rhinoplasty involves a small incision across the columella (the strip of tissue between the nostrils), giving the surgeon greater visibility and access for more complex reshaping. Your surgeon will recommend the most appropriate technique based on your anatomy and desired result during your pre-operative consultation." },
  { q: "Is rhinoplasty in Turkey safe? How do I know the quality is reliable?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate. Our partner surgeons are board-certified specialists with extensive experience in rhinoplasty for international patients. Turkey is one of the world's leading destinations for rhinoplasty, combining highly skilled surgeons, modern facilities, and significantly lower costs than the UK, USA, or Western Europe." },
  { q: "Why should I choose Medical Center Turkey?", a: "When you book with Medical Center Turkey, you don't navigate a foreign healthcare system alone. From airport pickup on Day 1 to your final check before departure, your dedicated English-speaking GO coordinator handles every detail — transfers, hotel, hospital coordination, translations, and any question along the way. We have been serving international patients, and our entire system exists to make you feel safe, informed, and looked after every step of the way." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same rhinoplasty surgery, pre-op consultation, hospital stay, 7 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star, and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling. If you want to recover in maximum comfort with the full Istanbul experience, the Executive Package is the right choice." },
  { q: "When will I see my final rhinoplasty result?", a: "Rhinoplasty results develop gradually. Initial swelling and bruising peak in the first 48–72 hours and then begin to resolve. Most patients look presentable (with some residual swelling) by day 10–14. Around 70% of your final result is visible at 3 months. The remaining swelling, particularly at the tip, continues to refine for up to 12 months. This is why our aftercare support runs for a full year — we check in with you at 1 month, 3 months, and 12 months to monitor your progress." },
  { q: "Can I combine rhinoplasty with other procedures?", a: "Yes, in many cases rhinoplasty can be combined with other facial procedures during the same surgical session, subject to your surgeon's assessment. Common combinations include septoplasty (to correct a deviated septum), chin augmentation, or ear correction. Combining procedures can reduce overall recovery time compared to having each done separately. Your surgeon will evaluate whether combination surgery is appropriate for you during your pre-operative consultation. We will always prioritise your safety above scheduling convenience." },
];

const packages = [
  { name: "Rhinoplasty Premium Package", price: "2500", description: "Rhinoplasty surgery (open or closed technique), pre-op blood tests, general anaesthesia, 1 night hospital stay, post-op medication and nasal splint, translator and GO assistance.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Rhinoplasty Hassle-Free Package", price: "3000", description: "All-inclusive rhinoplasty package — surgery, pre-op consultation, 7 nights 4-star hotel, private airport transfers, dedicated GO coordinator and 12 months aftercare.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Rhinoplasty Executive Package", price: "4200", description: "Full VIP rhinoplasty package — all Hassle-Free inclusions plus 5-star hotel, Istanbul city tour, fine dining, shopping assistance and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Patient — USA", text: "I travelled from the US and Medical Center Turkey made everything seamless. My coordinator was with me every step — airport, hotel, hospital. The surgeon was exceptional. I am absolutely thrilled with my result.", rating: 5 },
  { name: "Patient — United Kingdom", text: "I was nervous about having surgery abroad but this team put me completely at ease. The hospital was modern, the surgeon was professional and kind, and my GO handled everything so I never felt lost or alone.", rating: 5 },
  { name: "Patient — Canada", text: "The price difference compared to Canada was significant but the quality was exactly the same — actually better in terms of personal attention. My result is natural and exactly what I wanted. Highly recommend.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("Rhinoplasty Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Rhinoplasty Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Rhinoplasty Turkey | Nose Job Packages from €3,000 | Medical Center Turkey",
  description: "Get your rhinoplasty in Istanbul with Medical Center Turkey. All-inclusive packages from €3,000 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals. Board-certified surgeons. 5,000+ international patients.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function RhinoplastyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <RhinoplastyLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
