import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import HairTransplantLanding from "@/components/marketing/hair-transplant-landing";

export const metadata: Metadata = {
  title: "Hair Transplant Turkey | All-Inclusive Packages from €1,400 | Medical Center Turkey",
  description:
    "Get your hair transplant in Turkey with Medical Center Turkey. All-inclusive packages from €1,400 — surgery, hotel, transfers & 12 months aftercare included. Ministry of Health approved hospitals. 17 years experience. 5,000+ international patients.",
};

export default function HairTransplantTurkeyPage() {
  return (
    <>
      <Nav />
      <main>
        <HairTransplantLanding />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
