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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="order-2 lg:order-1 lg:col-span-1">
            <h1 className="text-lg lg:text-3xl font-semibold lg:font-extrabold mb-2 lg:mb-4 text-slate-500 lg:text-slate-900">
              Treatment Prices in Turkey
            </h1>
            <p className="text-sm lg:text-base text-slate-400 lg:text-slate-500 leading-relaxed">
              Use the calculator to estimate your travel and accommodation costs.
              Treatment pricing is personalised — contact us for an exact quote.
            </p>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-2">
            <CostCalculator />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
