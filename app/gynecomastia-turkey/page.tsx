import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import GynecomastiaLanding from "@/components/marketing/gynecomastia-landing";

export const metadata: Metadata = {
  title: "Gynecomastia Surgery Turkey | All-Inclusive Packages from €2,200 | Medical Center Turkey",
  description:
    "Get your gynecomastia surgery in Istanbul with Medical Center Turkey. All-inclusive packages from €2,200 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health approved hospitals. Board-certified surgeons. Trusted since 2018.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function GynecomastiaPage() {
  return (
    <>
      <Nav />
      <main>
        <GynecomastiaLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
