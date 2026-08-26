import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import CataractLanding from "@/components/marketing/cataract-landing";

export const metadata: Metadata = {
  title: "Cataract Surgery Turkey | All-Inclusive Packages from €4,000 | Medical Center Turkey",
  description:
    "Get your cataract surgery in Istanbul with Medical Center Turkey. All-inclusive packages from €4,000 — surgery (both eyes), premium IOL, hotel, transfers & 12 months aftercare included. Ministry of Health approved hospitals. Board-certified ophthalmologists. Trusted since 2018.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function CataractPage() {
  return (
    <>
      <Nav />
      <main>
        <CataractLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
