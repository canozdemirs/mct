import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import GynecomastiaLanding from "@/components/marketing/gynecomastia-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/gynecomastia-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey gynecomastia package?", a: "Our Hassle-Free Package covers everything from arrival to recovery. This includes the gynecomastia surgery (liposuction combined with glandular tissue removal), pre-operative blood tests and examination, general anaesthesia, 1 night post-operative hospital stay, all post-op medication and compression vest, private two-way airport transfers, 5 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your stay, and 12 months of online aftercare support. No hidden fees — one clear price covers everything." },
  { q: "How much does gynecomastia surgery cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €2,200 and covers the surgery, hospital stay, anaesthesia and compression vest. The Hassle-Free Package is €2,700 and adds 5 nights hotel, private transfers, and a dedicated coordinator. The Executive Package is €3,800 and includes 5-star accommodation and the full Istanbul VIP experience." },
  { q: "What does gynecomastia surgery involve?", a: "Gynecomastia surgery combines two techniques to achieve a flat, masculine chest contour. First, liposuction removes excess fatty tissue from the chest area. Then, where necessary, the surgeon removes the firm glandular tissue through a small incision around the areola. The combination of both techniques produces the most natural and complete result. Your surgeon will determine the exact approach during your pre-operative consultation." },
  { q: "How many days do I need to stay in Istanbul for gynecomastia surgery?", a: "We recommend a minimum of 5 to 6 days. Day 1 is arrival. Day 2 is your pre-operative consultation and blood tests. Day 3 is your surgery — you stay one night in hospital for post-operative monitoring. Days 4–5 are rest and recovery at your hotel. Your compression vest is fitted before discharge and must be worn for 4–6 weeks post-surgery." },
  { q: "Is gynecomastia surgery in Turkey safe?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner surgeons are board-certified plastic surgeons with extensive experience in chest contouring for international patients." },
  { q: "What is the recovery process after gynecomastia surgery?", a: "Most patients experience swelling and mild discomfort for the first 1–2 weeks. You should avoid strenuous upper-body activity for 4–6 weeks and wear your compression vest consistently during this period. Swelling gradually resolves over 2–3 months as your final result becomes fully visible. We provide 12 months of online aftercare support to monitor your progress." },
  { q: "Will there be visible scarring after gynecomastia surgery?", a: "Scars are minimal and strategically placed. The liposuction incisions are tiny (2–3mm) and fade to near-invisibility over time. Any incision for gland removal is made along the lower edge of the areola where the colour change naturally conceals it. Most patients find their scars to be barely noticeable within 6–12 months." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same surgery, pre-op consultation, hospital stay, 5 nights accommodation, private transfers, and dedicated GO coordinator. The Executive Package upgrades your hotel to 5-star and adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling." },
  { q: "When will I see my final gynecomastia result?", a: "You will notice an immediate improvement in chest shape after surgery, but swelling obscures the final result for several weeks. At 6–8 weeks, the majority of swelling has resolved and the chest contour begins to look natural. Your final result is typically fully visible at 3–6 months." },
];

const packages = [
  { name: "Gynecomastia Premium Package", price: "2200", description: "Gynecomastia surgery (liposuction and gland removal), pre-op blood tests, general anaesthesia, 1 night hospital stay, post-op medication and compression vest.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Gynecomastia Hassle-Free Package", price: "2700", description: "All-inclusive gynecomastia package — surgery, pre-op consultation, 5 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Gynecomastia Executive Package", price: "3800", description: "Full VIP gynecomastia experience — all Hassle-Free inclusions plus 5-star hotel, Istanbul city tour, fine dining and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Gynecomastia Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Gynecomastia Surgery Turkey | All-Inclusive Packages from €2,200 | Medical Center Turkey",
  description: "Gynecomastia surgery in Istanbul with Medical Center Turkey. All-inclusive packages from €2,200 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function GynecomastiaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <GynecomastiaLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
