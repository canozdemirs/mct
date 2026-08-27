import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import IVFLanding from "@/components/marketing/ivf-landing";

export const metadata: Metadata = {
  title: "IVF Treatment Turkey | All-Inclusive Packages from €3,000 | Medical Center Turkey",
  description:
    "Get your IVF treatment in Istanbul with Medical Center Turkey. All-inclusive packages from €3,000 — one complete IVF cycle, hotel, transfers & 12 months aftercare included. Ministry of Health approved fertility clinics. Specialist reproductive team. Trusted since 2018.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function IVFPage() {
  return (
    <>
      <Nav />
      <main>
        <IVFLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
