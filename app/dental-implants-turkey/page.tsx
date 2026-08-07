import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import DentalImplantLanding from "@/components/marketing/dental-implant-landing";

export const metadata: Metadata = {
  title: "Dental Implants Turkey | All-Inclusive Packages from €400 | Medical Center Turkey",
  description:
    "Get your dental implants in Istanbul with Medical Center Turkey. All-inclusive packages from €400 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health approved hospitals. Trusted since 2018. 5,000+ international patients.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function DentalImplantsPage() {
  return (
    <>
      <Nav />
      <main>
        <DentalImplantLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
