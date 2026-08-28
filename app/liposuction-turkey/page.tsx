import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import LiposuctionLanding from "@/components/marketing/liposuction-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/liposuction-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey liposuction package?", a: "Our Hassle-Free Package covers everything from arrival to recovery. This includes the liposuction surgery (up to 3 body areas), pre-operative blood tests and examination, general anaesthesia, 1 night post-operative hospital stay, all post-op medication and compression garment, private two-way airport transfers, 5 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. No hidden fees — one clear price covers everything." },
  { q: "How much does liposuction cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €2,150 and covers the surgery, hospital stay, anaesthesia and compression garment. The Hassle-Free Package is €2,600 and adds 5 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €3,600 and includes 5-star accommodation and the full Istanbul VIP experience." },
  { q: "Which body areas can be treated with liposuction?", a: "Our packages cover up to 3 body areas per procedure. The most commonly treated areas include the abdomen, flanks (love handles), thighs (inner and outer), upper arms, back, chest, and chin/neck. Your surgeon will confirm the final treatment plan during your pre-operative consultation, based on your goals and anatomy." },
  { q: "How many days do I need to stay in Istanbul for liposuction?", a: "We recommend a minimum of 5 to 6 days. Day 1 is arrival. Day 2 is your pre-operative consultation and blood tests. Day 3 is your surgery — you stay one night in hospital for monitoring. Days 4–5 are rest and recovery at your hotel. Your compression garment is fitted before discharge and must be worn for 4–6 weeks post-surgery. Most patients fly home after 5 nights feeling comfortable." },
  { q: "Is liposuction in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner surgeons are board-certified plastic surgeons with extensive experience in body contouring for international patients." },
  { q: "What is the recovery process after liposuction?", a: "Most patients experience swelling, bruising, and mild discomfort for the first 1–2 weeks. You should avoid strenuous activity for 4–6 weeks and wear your compression garment consistently during this period. Swelling gradually subsides over 3–6 months as your final result becomes visible. We provide 12 months of online aftercare support to monitor your progress." },
  { q: "Why should I choose Medical Center Turkey?", a: "When you book with Medical Center Turkey, you don't navigate a foreign healthcare system alone. From airport pickup on Day 1 to your final check before departure, your dedicated English-speaking GO coordinator handles every detail — transfers, hotel, hospital coordination, translations, and any question along the way. We have been serving international patients, and our entire system exists to make you feel safe, informed, and looked after every step of the way." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same surgery, pre-op consultation, hospital stay, 5 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling." },
  { q: "When will I see my final liposuction result?", a: "You will notice an immediate change in shape after surgery, but swelling obscures the final result for several weeks. At 6–8 weeks, the majority of swelling has resolved. Your final result is typically fully visible at 3–6 months. Results are permanent as long as a stable weight is maintained — fat cells removed by liposuction do not return." },
];

const packages = [
  { name: "Liposuction Premium Package", price: "2150", description: "Liposuction surgery up to 3 body areas, pre-op blood tests, general anaesthesia, 1 night hospital stay, post-op medication and compression garment.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Liposuction Hassle-Free Package", price: "2600", description: "All-inclusive liposuction package — surgery (up to 3 areas), pre-op consultation, 5 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Liposuction Executive Package", price: "3600", description: "Full VIP liposuction experience — all Hassle-Free inclusions plus 5-star hotel, Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Patient — United Kingdom", text: "I had three areas treated and the results have been incredible. The whole experience was so much smoother than I expected — from the airport pickup to the hospital to the hotel, everything was taken care of. My coordinator was with me every step of the way.", rating: 5 },
  { name: "Patient — USA", text: "The price compared to the US was a fraction of the cost, but the quality and care were honestly better than I expected. The surgeon was meticulous, the hospital was modern, and the aftercare has been excellent. I am thrilled with my result.", rating: 5 },
  { name: "Patient — Canada", text: "I was nervous about going abroad for surgery but Medical Center Turkey made the whole process feel completely safe. My GO coordinator was amazing — she handled everything and was always reachable. Couldn't recommend them more highly.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("Liposuction Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Liposuction Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Liposuction Turkey | All-Inclusive Packages from €2,150 | Medical Center Turkey",
  description: "Liposuction in Istanbul with Medical Center Turkey. All-inclusive packages from €2,150 — surgery (up to 3 areas), hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function LiposuctionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <LiposuctionLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
