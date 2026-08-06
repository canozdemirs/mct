import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import AllOnFourLanding from "@/components/marketing/all-on-4-landing";

export const metadata: Metadata = {
  title: "All-on-4 Dental Implants Turkey | All-Inclusive Packages from €1,500 | Medical Center Turkey",
  description:
    "Get your All-on-4 dental implants in Istanbul with Medical Center Turkey. All-inclusive packages from €1,500 — surgery, hotel, transfers & 12 months aftercare included. Fixed teeth in 7 days. Ministry of Health approved hospitals. Trusted since 2018. 5,000+ international patients.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AllOnFourPage() {
  return (
    <>
      <Nav />
      <main>
        <AllOnFourLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
