import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import BreastAugmentationLanding from "@/components/marketing/breast-augmentation-landing";

export const metadata: Metadata = {
  title: "Breast Augmentation Turkey | All-Inclusive Packages from €5,000 | Medical Center Turkey",
  description:
    "Get your breast augmentation in Istanbul with Medical Center Turkey. All-inclusive packages from €5,000 — surgery, hotel, transfers & 12 months aftercare included. Premium silicone implants. Ministry of Health approved hospitals. Trusted since 2018.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function BreastAugmentationPage() {
  return (
    <>
      <Nav />
      <main>
        <BreastAugmentationLanding />
      </main>
      <WhatsAppFloat />
    </>
  );
}
