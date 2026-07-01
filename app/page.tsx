import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Packages } from "@/components/marketing/packages";
import { Stats } from "@/components/marketing/stats";
import { ContactFAQ } from "@/components/marketing/contact-faq";
import { HospitalNetwork } from "@/components/marketing/hospital-network";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const metadata: Metadata = {
  title: "Medical Center Turkey — International Patient Center | Istanbul",
  description:
    "Medical Center Turkey connects international patients with Ministry of Health certified hospitals in Istanbul. Hair transplant, rhinoplasty, dental implants, plastic surgery — complete packages managed from first inquiry to safe return home.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Packages />
        <Stats />
        <ContactFAQ />
      </main>
      <HospitalNetwork />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
