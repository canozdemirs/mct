import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import BlepharoplastyLanding from "@/components/marketing/blepharoplasty-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/blepharoplasty-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey blepharoplasty package?", a: "Our Hassle-Free Package covers all 4 eyelids (upper and lower blepharoplasty) in a single procedure. It includes pre-operative blood tests and examination, anaesthesia, post-operative medication and eye drops, private two-way airport transfers, 5 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. One clear price — no hidden fees." },
  { q: "How much does blepharoplasty cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €1,600 and covers blepharoplasty on 2 eyelids (upper or lower). The Hassle-Free Package is €2,100 and includes all 4 eyelids plus 5 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €3,200 and includes 5-star accommodation and the full Istanbul VIP experience." },
  { q: "What is the difference between upper and lower blepharoplasty?", a: "Upper blepharoplasty removes excess skin and fat from the upper eyelids, correcting drooping lids that can make the eyes appear tired or heavy. Lower blepharoplasty targets under-eye bags and puffiness caused by excess fat and loose skin beneath the eyes. Many patients opt for all 4 eyelids simultaneously — the Hassle-Free Package covers upper and lower blepharoplasty in one procedure for a fully refreshed, harmonious result." },
  { q: "How many days do I need to stay in Istanbul for blepharoplasty?", a: "We recommend a minimum of 5 to 6 days. Day 1 is arrival. Day 2 is your pre-operative consultation and blood tests. Day 3 is your surgery — blepharoplasty is typically performed under local anaesthesia as an outpatient or short-stay procedure. Days 4–5 are rest and recovery at your hotel. Most patients are comfortable flying home after 5 nights. Sutures are typically removed at 5–7 days post-surgery." },
  { q: "Is blepharoplasty in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner surgeons are board-certified plastic surgeons and oculoplastic specialists with extensive experience in eyelid surgery for international patients." },
  { q: "What does blepharoplasty surgery involve?", a: "Blepharoplasty is performed under local anaesthesia in most cases. For upper eyelids, the incision is placed within the natural eyelid crease, making scars virtually invisible once healed. Excess skin, muscle, and fat are removed or repositioned. For lower eyelids, the incision is made just below the lash line or inside the eyelid (transconjunctival approach) to remove or redistribute fat deposits. The entire procedure for all 4 eyelids takes approximately 1.5–2 hours." },
  { q: "What is the recovery process after blepharoplasty?", a: "Swelling and bruising around the eyes peak in the first 48–72 hours and then begin to resolve. Most patients feel comfortable appearing in public with sunglasses after 7–10 days. Sutures are typically removed at 5–7 days. You should avoid strenuous activity for 2–3 weeks and protect your eyes from direct sunlight. The majority of swelling resolves within 4–6 weeks, with your final, refined result fully visible at 3 months." },
  { q: "Will there be visible scarring after blepharoplasty?", a: "Scarring is minimal and strategically hidden. Upper eyelid scars are placed within the natural eyelid crease and become nearly invisible once fully healed. Lower eyelid scars, when external, are positioned just below the lash line where they blend naturally. By 3–6 months, the vast majority of patients find their scars to be imperceptible." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include all 4 eyelids, pre-op examination, anaesthesia, post-op medication, 5 nights accommodation, private transfers, and a dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling." },
];

const packages = [
  { name: "Blepharoplasty Premium Package", price: "1600", description: "Blepharoplasty on 2 eyelids (upper or lower), pre-op blood tests, local or general anaesthesia, post-op medication and eye drops.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Blepharoplasty Hassle-Free Package", price: "2100", description: "All-inclusive blepharoplasty — all 4 eyelids (upper and lower), pre-op examination, anaesthesia, 5 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Blepharoplasty Executive Package", price: "3200", description: "Full VIP blepharoplasty experience — all 4 eyelids plus 5-star hotel, Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Patient — United Kingdom", text: "I had been unhappy with my heavy upper eyelids for years. The team at Medical Center Turkey made the whole process completely stress-free. My GO was exceptional — from the airport to the clinic to discharge. The result has taken years off my appearance and I couldn't be happier.", rating: 5 },
  { name: "Patient — USA", text: "Having all 4 eyelids done at once made total sense and the price in Turkey was a fraction of what I was quoted at home. The surgeon was meticulous and the hospital was immaculate. My coordinator was with me every step. The results are absolutely natural.", rating: 5 },
  { name: "Patient — Canada", text: "I was nervous about travelling abroad for surgery but this team removed every concern. The pre-op consultation was thorough, every question was answered, and my GO made me feel completely looked after. My eyes look refreshed and natural — exactly what I wanted.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("Blepharoplasty Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Blepharoplasty Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Blepharoplasty Turkey | Eyelid Surgery Packages from €1,600 | Medical Center Turkey",
  description: "Blepharoplasty in Istanbul with Medical Center Turkey. All-inclusive packages from €1,600 — upper or lower eyelid surgery, hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function BlepharoplastyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <BlepharoplastyLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
