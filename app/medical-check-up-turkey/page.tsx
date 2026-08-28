import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import CheckUpLanding from "@/components/marketing/checkup-landing";
import { Breadcrumb } from "@/components/marketing/breadcrumb";
import {
  generateFAQSchema,
  generateProductsSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

const PAGE_URL = "https://medicalcenterturkey.com/medical-check-up-turkey";

const faqs = [
  { q: "How long does the check-up take?", a: "Standard and Plus check-ups are typically completed in a single day — usually 4 to 6 hours at the hospital. VIP check-ups, which include gastroscopy, colonoscopy, and MRI, require 2 days. The Pediatric check-up is completed in 3 to 4 hours. Your schedule is pre-arranged by our team so there is no waiting between appointments." },
  { q: "Do I need to fast before my check-up?", a: "Yes. For all packages, you must fast for a minimum of 8 hours before your check-up. No food or drink (water is permitted) from midnight on the night before your appointment. For packages including gastroscopy and colonoscopy (VIP), you will receive specific bowel preparation instructions in advance." },
  { q: "Will I receive my results in English?", a: "Yes. All test results, imaging reports, and specialist consultation summaries are provided in English. Your dedicated GO coordinator and our medical team ensure that all findings are explained clearly before you leave Istanbul. You will receive a complete digital copy of your results." },
  { q: "What happens if something is found during my check-up?", a: "If any finding requires further attention, our medical team will explain the situation clearly during your results consultation. Depending on the finding, we can arrange additional tests, specialist referrals, or a follow-up plan. Our 12-month aftercare support means our team is available to assist with any next steps after you return home." },
  { q: "Do I need to stay overnight for a check-up?", a: "For Standard and Plus packages, your check-up is completed in one day. We recommend arriving the day before to rest after travel, making a 2-night stay ideal. VIP packages (with gastroscopy and colonoscopy) require 2 examination days, so a 3-night stay is recommended. The Hassle-Free Package includes hotel accommodation so everything is arranged for you." },
  { q: "What is the difference between Standard, Plus, and VIP?", a: "Standard provides essential full-body screening — core blood panels, ultrasounds, ECG, ECHO, and specialist examinations. Plus adds a cardiac stress test, extended blood panels (including hepatitis markers, thyroid function, and micronutrients), ENT specialist, and bone densitometry for patients over 40. VIP adds gastroscopy, colonoscopy, MRI (cranial and lumbar), neurology, and gastroenterology consultations — providing the most comprehensive picture of your health." },
  { q: "Can couples do the check-up together?", a: "Absolutely. Many of our international patients come as couples and complete their check-ups simultaneously. We pre-arrange all appointments so that both patients move through their examinations at the same time. Please mention during your consultation that you are booking for two people." },
  { q: "Is the Pediatric check-up suitable for all ages?", a: "The Pediatric Check-Up is suitable for children from approximately 3 years to 17 years. The examination includes a paediatric specialist consultation, ENT, ophthalmology, ECG, abdominal ultrasound, and a comprehensive blood panel covering growth, immunity, thyroid, and nutritional markers." },
];

// All 8 package variants across 4 tiers — USD currency
const packages = [
  { name: "Medical Check-Up Standard — Men", price: "750", description: "Full-body screening for men: internal medicine, cardiology, urology, eye and dietitian consultations, ECG, ECHO, abdominal and thyroid ultrasound, chest X-ray, comprehensive blood panel including PSA and cancer markers.", url: PAGE_URL, currency: "USD" as const },
  { name: "Medical Check-Up Standard — Women 40+", price: "750", description: "Full-body screening for women 40+: internal medicine, cardiology, gynecology, eye and dietitian consultations, ECG, ECHO, mammography, abdominal and thyroid ultrasound, comprehensive blood panel including CA 125 and Pap smear.", url: PAGE_URL, currency: "USD" as const },
  { name: "Medical Check-Up Standard — Women Under 40", price: "790", description: "Full-body screening for women under 40: internal medicine, cardiology, gynecology, eye and dietitian consultations, ECG, ECHO, breast ultrasound, abdominal and thyroid ultrasound, comprehensive blood panel including Pap smear.", url: PAGE_URL, currency: "USD" as const },
  { name: "Medical Check-Up Plus — Men", price: "1200", description: "Extended screening for men: all Standard inclusions plus cardiac stress test, ENT specialist, bone densitometry (40+), extended blood panel with hepatitis markers, thyroid function and micronutrients.", url: PAGE_URL, currency: "USD" as const },
  { name: "Medical Check-Up Plus — Women", price: "1200", description: "Extended screening for women: all Standard inclusions plus cardiac stress test, ENT specialist, bone densitometry (40+), mammography or breast ultrasound, extended blood panel with hepatitis markers and Pap smear.", url: PAGE_URL, currency: "USD" as const },
  { name: "Medical Check-Up VIP — Men", price: "2700", description: "Comprehensive screening for men: all Plus inclusions plus gastroscopy, colonoscopy, MRI (cranial and lumbar), neurology and gastroenterology consultations, PSA Free and PSA Total, and one additional department based on MRI results.", url: PAGE_URL, currency: "USD" as const },
  { name: "Medical Check-Up VIP — Women", price: "2700", description: "Comprehensive screening for women: all Plus inclusions plus gastroscopy, colonoscopy, MRI (cranial and lumbar), neurology, general surgery and gastroenterology consultations.", url: PAGE_URL, currency: "USD" as const },
  { name: "Pediatric Medical Check-Up", price: "550", description: "Children's comprehensive health assessment (ages 3–17): pediatrics, ENT and eye specialist consultations, ECG, abdominal ultrasound, blood panel covering growth, immunity, thyroid and nutritional markers.", url: PAGE_URL, currency: "USD" as const },
];

const testimonials = [
  { name: "Patient — United Kingdom", text: "I had been putting off a proper health check for years. Medical Center Turkey made the whole experience completely effortless. My GO accompanied me to every single appointment — there was no confusion, no waiting, no stress. The hospital was world-class and I received my full results the same day, explained clearly in English.", rating: 5 },
  { name: "Patient — USA", text: "The VIP package was extraordinary value. In the US, the same level of screening — MRI, gastroscopy, colonoscopy, cardiac stress test — would have cost me over $15,000. At Medical Center Turkey it was a fraction of that price, with a level of care and coordination that surpassed anything I've experienced at home.", rating: 5 },
  { name: "Patient — Canada", text: "My wife and I did the Plus check-up together. Everything was pre-arranged — we moved through our appointments simultaneously and were done by early afternoon. The results consultation was thorough and reassuring. We will absolutely be returning annually.", rating: 5 },
];

const faqSchema = generateFAQSchema(faqs);
const productsSchema = generateProductsSchema(packages);
const reviewSchema = generateReviewSchema("Medical Check-Up Turkey — Medical Center Turkey", testimonials);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://medicalcenterturkey.com" },
  { name: "Medical Check-Up Turkey", url: PAGE_URL },
]);

export const metadata: Metadata = {
  title: "Medical Check-Up Turkey | Standard, Plus & VIP Packages from $550 | Medical Center Turkey",
  description: "Comprehensive medical check-up in Istanbul with Medical Center Turkey. Standard from $750, Plus from $1,200, VIP $2,700, Pediatric $550. Ministry of Health authorized hospitals. Results in English.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function CheckUpPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Packages", href: "/#packages" }, { label: "Medical Check-Up Turkey" }]} />
      <main>
        <CheckUpLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
