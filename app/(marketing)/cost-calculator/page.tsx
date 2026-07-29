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
      <main className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Treatment Prices in Turkey
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Use the calculator below to estimate your travel and accommodation costs.
            Treatment pricing is personalised — contact us for an exact quote.
          </p>
        </div>
        <CostCalculator />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
