import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { CostCalculator } from "@/components/marketing/cost-calculator";

export const metadata: Metadata = {
  title: "Treatment Prices in Turkey - Medical Center Turkey",
  description:
    "Treatment Prices calculator is a great tool to get know treatment prices, accommodation and daily expenses in Turkey. Learn your cost.",
};

export default function TreatmentPricesPage() {
  return (
    <>
      <Nav />
      <main className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="sr-only">Treatment Prices in Turkey</h1>
          <p className="sr-only">
            Use the calculator to estimate your travel and accommodation costs.
            Treatment pricing is personalised — contact us for an exact quote.
          </p>
          <CostCalculator />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
