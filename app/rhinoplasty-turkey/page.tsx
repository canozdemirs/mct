import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import RhinoplastyLanding from "@/components/marketing/rhinoplasty-landing";

export const metadata: Metadata = {
  title: "Rhinoplasty Turkey | Nose Job Packages from €3,000 | Medical Center Turkey",
  description:
    "Get your rhinoplasty in Istanbul with Medical Center Turkey. All-inclusive packages from €3,000 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health approved hospitals. Board-certified surgeons. Trusted since 2018. 5,000+ international patients.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RhinoplastyPage() {
  return (
    <>
      <Nav />
      <main>
        <RhinoplastyLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
