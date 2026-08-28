import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import AllOnFourLanding from "@/components/marketing/all-on-4-landing";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/all-on-4-dental-implants-turkey";

const faqs = [
  { q: "What is included in the Medical Center Turkey All-on-4 package?", a: "Our Hassle-Free Package is our most comprehensive option and includes: the All-on-4 implant surgery (4 implants + fixed temporary prosthesis), 3D panoramic X-ray and pre-surgical consultation, local anaesthesia, post-operative medication, private two-way airport transfers, 7 nights at a 4-star hotel, daily breakfast, a dedicated English-speaking GO (Gentle Organiser) coordinator throughout your entire stay, official warranty certificate, and 12 months of online aftercare support after you return home. No hidden fees — one clear price covers everything." },
  { q: "How much does All-on-4 dental implants cost in Turkey with Medical Center Turkey?", a: "Our Premium Package starts from €1,500 and covers the surgery and in-clinic support. The Hassle-Free Package is €2,140 and adds 7 nights hotel, private transfers, and a dedicated coordinator — making it completely self-contained. Our Executive Package is €3,340 and includes the full Istanbul VIP experience. Final pricing may vary slightly depending on your individual clinical case — we provide a personalised quote after reviewing your X-rays or scans during your free online consultation. There are no hidden fees." },
  { q: "How many days do I need to stay in Istanbul for All-on-4?", a: "We recommend 7 days and 7 nights for the complete experience. Day 1 is arrival. Day 2 is your consultation and 3D scan. Day 3 is your All-on-4 surgery — on the same day you receive a fixed temporary prosthesis, so you leave the clinic with teeth. Days 4–6 are recovery and monitoring, with optional sightseeing (Executive package). Day 7 is your final fit check before flying home. The 7-day schedule is designed so you can return confidently, with teeth, and with full aftercare instructions." },
  { q: "What is the difference between All-on-4 and traditional dental implants?", a: "Traditional dental implants replace individual teeth — one implant per missing tooth — which can require 8 to 20+ implants for a full arch, multiple surgeries, and 12 to 18 months of treatment. All-on-4 uses just 4 strategically angled implants to support an entire arch of fixed teeth in a single procedure. The angled placement maximises available bone, which means most patients do not need bone grafting. You leave with a fixed temporary prosthesis on the same day as surgery — not a removable denture, but fixed, non-removable teeth." },
  { q: "Why should I choose Medical Center Turkey?", a: "When you book with Medical Center Turkey, you don't navigate a foreign healthcare system alone — you have a dedicated coordinator handling every detail. From airport pickup on Day 1 to your final check before departure, someone is always by your side. Your personal English-speaking GO handles transfers, hotel, hospital coordination, translations, and any question you have along the way. We have been serving international patients, and our entire system is built around one goal: making sure you feel safe, informed, and looked after every single step of the way." },
  { q: "What is the difference between the Hassle-Free and Executive packages?", a: "Both packages include the same All-on-4 surgery, 3D scan, 7 nights hotel, private transfers, and dedicated GO coordinator. The Executive Package adds a guided Istanbul city tour, fine dining restaurant reservations, personal shopping assistance with VIP access, and priority scheduling for your appointments. If you would like to combine your dental treatment with a premium Istanbul experience, the Executive Package is the right choice." },
  { q: "Is All-on-4 in Turkey safe? How do I know the quality is reliable?", a: "Safety is our non-negotiable priority. We work exclusively with hospitals holding the Turkish Ministry of Health's Health Tourism Authorization Certificate — the highest accreditation standard in Turkey. Our partner hospitals use premium implant systems from globally recognised manufacturers. Turkey is one of the world's leading destinations for dental implant procedures, with highly trained oral surgeons and fully equipped surgical facilities at a fraction of UK or US prices. Medical Center Turkey has been operating with over 5,000 international patients across all treatment types. Every All-on-4 procedure comes with an official written warranty certificate." },
  { q: "When will I get my permanent (final) teeth?", a: "You leave Istanbul with a fixed temporary prosthesis on the day of surgery — not removable dentures, but teeth that are screwed in and fixed. The permanent (final) prosthesis is fitted after the implants fully integrate with your jawbone, which typically takes 3 to 6 months. We coordinate this final fitting remotely with your local dentist, or you can return to Istanbul for it. Throughout the integration period, our team provides 12 months of online aftercare support to monitor your progress." },
  { q: "Do I need bone grafting before All-on-4?", a: "In most cases, no. This is one of the key advantages of the All-on-4 protocol. The four implants are placed at strategic angles to maximise contact with available natural bone, allowing the procedure to be completed even in patients with some degree of bone loss. However, your suitability is determined by your 3D panoramic X-ray, which is reviewed on Day 2 before surgery. If your case requires additional bone grafting, your surgeon will discuss the options with you during the consultation. We will flag any potential complexity during your free online pre-consultation before you travel." },
];

const packages = [
  { name: "All-on-4 Premium Package", price: "1500", description: "All-on-4 dental implant surgery (4 implants + fixed prosthesis), 3D panoramic X-ray and consultation, local anaesthesia, post-op medication, warranty certificate.", url: PAGE_URL, currency: "EUR" as const },
  { name: "All-on-4 Hassle-Free Package", price: "2140", description: "All-inclusive All-on-4 package — surgery, 3D scan, 7 nights 4-star hotel, private airport transfers and dedicated GO coordinator.", url: PAGE_URL, currency: "EUR" as const },
  { name: "All-on-4 Executive Package", price: "3340", description: "Full VIP All-on-4 experience — all Hassle-Free inclusions plus Istanbul city tour, fine dining, shopping assistance and priority scheduling.", url: PAGE_URL, currency: "EUR" as const },
];

const testimonials = [
  { name: "Beyza Türk", text: "I would not trust anybody else to touch me since I am the 1% who everything will go wrong for. The hospital stay was the most enjoyable experience I've ever had. The staff at Medical Center Turkey treated me like family and demanded nothing less than the finest. The staff was kind and pleasant when I arrived for my appointment, and they truly took the time to size me properly for my dental implants. My operation was a huge success, and the final appearance is gorgeous and natural-looking. The speed of my healing was also amazing. You may put your faith in Medical Center Turkey if you're considering getting dental implants.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("All-on-4 Dental Implants Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "All-on-4 Dental Implants Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "All-on-4 Dental Implants Turkey | All-Inclusive Packages from €1,500 | Medical Center Turkey",
  description: "All-on-4 dental implants in Istanbul with Medical Center Turkey. Fixed teeth in 7 days from €1,500 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health authorized hospitals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AllOnFourPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        <AllOnFourLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
