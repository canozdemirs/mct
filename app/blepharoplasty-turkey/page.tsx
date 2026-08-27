import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import BlepharoplastyLanding from "@/components/marketing/blepharoplasty-landing";

export const metadata: Metadata = {
  title: "Blepharoplasty Turkey | Eyelid Surgery Packages from €1,600 | Medical Center Turkey",
  description:
    "Get your blepharoplasty in Istanbul with Medical Center Turkey. All-inclusive packages from €1,600 — upper or lower eyelid surgery, hotel, transfers & 12 months aftercare included. Ministry of Health approved hospitals. Board-certified surgeons. Trusted since 2018.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function BlepharoplastyPage() {
  return (
    <>
      <Nav />
      <main>
        <BlepharoplastyLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
