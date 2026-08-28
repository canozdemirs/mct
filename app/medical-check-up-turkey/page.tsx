import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import CheckUpLanding from "@/components/marketing/checkup-landing";

export const metadata: Metadata = {
  title: "Medical Check-Up Turkey | Standard, Plus & VIP Packages from $550 | Medical Center Turkey",
  description:
    "Comprehensive medical check-up in Istanbul with Medical Center Turkey. Standard from $750, Plus from $1,200, VIP $2,700, Pediatric $550. Ministry of Health approved hospitals. Results in English. Trusted since 2018.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function CheckUpPage() {
  return (
    <>
      <Nav />
      <main>
        <CheckUpLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
