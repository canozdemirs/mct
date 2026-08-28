import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import HairTransplantLanding from "@/components/marketing/hair-transplant-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/hair-transplant-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey hair transplant package?", a: "Our all-inclusive Hassle-Free Package & Gold Package cover everything you need from arrival to results. This includes the hair transplant procedure itself (FUE or DHI Plus Gold technique), blood test and PRP treatment, mesotherapy and laser treatment, gold cream and aftercare medications, private airport transfers, 2 nights at a 4-star hotel, breakfast, lunch and dinner on your operation day, a panoramic Istanbul view experience, a dedicated English-speaking GO (Gentle Organiser) who stays with you throughout your entire stay, and 12 months of online aftercare support after you return home. No hidden fees — one clear price covers everything." },
  { q: "How much does a hair transplant in Turkey cost with Medical Center Turkey?", a: "Our packages start from €1,400 for the Premium Package and from €1,870 for the most popular Hassle-Free Package, which includes hotel, transfers, meals, and a personal coordinator. Our Exclusive VIP Package starts from €3,300 and includes luxury hotel accommodation, BMW chauffeur service, and private dining experiences. Final pricing may vary slightly depending on your individual case and graft requirements — we provide a personalised quote after reviewing your photos during the free consultation. There are no hidden fees." },
  { q: "How many days do I need to stay in Istanbul for a hair transplant?", a: "We recommend a minimum of 3 days and 2 nights in Istanbul. Day 1 is your arrival — we pick you up from the airport and you check in to your hotel. Day 2 is your hair transplant procedure, which typically takes 6–8 hours. Day 3 includes your first professional hair wash, post-op consultation, and you receive your full aftercare kit before flying home. Most patients are comfortable returning to work within 2 days of arriving home. We have designed the entire schedule so you don't need to take more than a long weekend." },
  { q: "Why should I choose Medical Center Turkey?", a: "When you book with Medical Center Turkey, you don't feel like a medical tourist in a foreign country — you feel like a VIP being taken care of at home. From the moment you land in Istanbul to the moment you fly back, someone is always by your side. Your personal English-speaking GO coordinator handles everything: transfers, hotel, hospital, translations, meals, and any question you have along the way. You never have to figure anything out alone. And our entire system is built around one goal — making sure you feel safe, comfortable, and looked after every single step of the way." },
  { q: "Do I need to be in Istanbul for the procedure? Can it be done remotely or locally?", a: "Yes, you will need to travel to Istanbul for the procedure itself — hair transplant surgery must be performed in person. However, everything before and after can be handled remotely. Your free consultation happens online via WhatsApp or our contact form — just send us your photos and we will assess your case and recommend the right package. After you return home, all follow-up support for the 12 months post-procedure is provided online by our team." },
  { q: "What is the difference between the Gold Package and the Hassle-Free Package?", a: "The only difference is the anaesthesia. Both packages include identical services — hotel, transfers, meals, GO coordinator, and all treatments. The Gold Package is performed under local anaesthesia, while the Hassle-Free Package uses sedation (light sleep), making it completely pain-free and anxiety-free. If you prefer to be fully awake during the procedure, the Gold Package is the right choice." },
  { q: "What is the difference between FUE and DHI hair transplant techniques?", a: "Both techniques are modern and highly effective — the right choice depends on your individual case. FUE (Follicular Unit Extraction) is the gold standard method where grafts are extracted individually and implanted into the recipient area. DHI (Direct Hair Implantation) uses a specialised implanter pen to place grafts directly without creating incisions first, which can offer more precise angle and direction control. DHI is available on any of our packages for an additional €150." },
  { q: "Is a hair transplant in Turkey safe? How do I know the quality is reliable?", a: "Safety is our number one priority. We work exclusively with hospitals and clinics approved by the Turkish Ministry of Health — we do not compromise on this. Turkey is one of the world's leading destinations for hair transplant procedures, with highly experienced surgeons and modern facilities at a fraction of the cost of the UK or USA. Medical Center Turkey has been operating with over 5,000 international patients treated through our network. Every hair transplant comes with an official warranty certificate." },
  { q: "When will I see the final results of my hair transplant?", a: "Hair transplant results develop gradually. In the first 2–4 weeks, the transplanted hairs will shed — this is completely normal and expected. New growth begins around months 3–4. By month 6 you will see significant improvement, and your final, full result is typically visible at 12 months. This is why our aftercare support runs for a full year — we check in with you at 1 month, 3 months, and 12 months to monitor your progress." },
];

const packages = [
  { name: "Hair Transplant Premium Package", price: "1400", description: "Max Grafts FUE / DHI Plus Gold, blood test and PRP treatment, medication, mesotherapy, gold cream, laser treatment, warranty certificate, translator and GO assistance.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Hair Transplant Gold Package", price: "1700", description: "Everything in Premium plus local anaesthesia, private airport transfers, 2 nights 4-star hotel, breakfast, and free lunch & dinner on operation day.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Hair Transplant Hassle-Free Package", price: "1870", description: "Everything in Gold Package with sedation (light sleep, pain-free) instead of local anaesthesia — the most popular hair transplant package.", url: PAGE_URL, currency: "EUR" as const },
  { name: "Hair Transplant Exclusive Package", price: "3300", description: "Full VIP hair transplant experience — everything in Hassle-Free plus BMW chauffeur 8 hours, 5-star hotel, exclusive restaurant dining, sightseeing and Bosphorus experience.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Sena Alkan", text: "My husband had his hair transplant at Medical Center Turkey and we are extremely happy with the whole experience. From the moment we arrived in Istanbul, everything was perfectly organized – the transfers, the hotel, and the clinic. The team was very professional, kind and attentive. They truly exceeded our expectations!", rating: 5 },
  { name: "Stylez", text: "I am currently on day 29 post hair transplant with Medical Center Turkey and could not be happier with the service. I could not have asked for a better experience from start to finish. I can honestly say they deserve 5 stars for the service they provide. I would highly recommend it — great people and with reasonable prices as well!", rating: 5 },
  { name: "S.H.", text: "Perfect procedure! All the procedures are perfectly organized. Pick-up from the airport, hotel check-in, preparation for a comfortable stay, postoperative care and explanation. The doctors and staff were kind and there was no anxiety. I'm looking forward to the growth of my hair in the future! Thank you.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("Hair Transplant Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Hair Transplant Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Hair Transplant Turkey | All-Inclusive Packages from €1,400 | Medical Center Turkey",
  description: "Get your hair transplant in Turkey with Medical Center Turkey. All-inclusive packages from €1,400 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals. 5,000+ international patients.",
};

export default function HairTransplantTurkeyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <HairTransplantLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
