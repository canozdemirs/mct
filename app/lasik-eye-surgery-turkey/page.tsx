import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import LasikLanding from "@/components/marketing/lasik-landing";

export const metadata: Metadata = {
  title: "LASIK Eye Surgery Turkey | All-Inclusive Packages from €1,600 | Medical Center Turkey",
  description:
    "Get your LASIK eye surgery in Istanbul with Medical Center Turkey. All-inclusive packages from €1,600 — surgery (both eyes), hotel, transfers & 12 months aftercare included. Ministry of Health approved hospitals. Board-certified ophthalmologists. Trusted since 2018.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function LasikPage() {
  return (
    <>
      <Nav />
      <main>
        <LasikLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
