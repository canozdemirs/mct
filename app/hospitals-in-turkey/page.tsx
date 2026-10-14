import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { HospitalGrid } from "@/components/marketing/hospital-grid";
import { hospitals, hospitalGroups } from "@/lib/hospitals";

export const metadata: Metadata = {
  title: "Partner Hospitals in Turkey | Medical Center Turkey",
  description:
    "Medical Center Turkey coordinates treatment at leading hospital groups across Istanbul, Ankara and Antalya. One point of contact from first consultation to your safe return home.",
  alternates: {
    canonical: "https://www.medicalcenterturkey.com/hospitals-in-turkey",
  },
};

type PageProps = { searchParams: Promise<{ group?: string }> };

export default async function HospitalsInTurkeyPage({ searchParams }: PageProps) {
  const { group } = await searchParams;
  const validGroups = Object.keys(hospitalGroups);
  const initialGroup =
    group && validGroups.includes(group)
      ? (group as keyof typeof hospitalGroups)
      : "all";

  return (
    <>
      <Nav />
      <main>
        <h1 className="sr-only">Hospitals in Turkey</h1>

        {/* Filter + Grid */}
        <section className="pt-12 pb-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Pre-launch GEO fix (2026-10-14): English authorization
                statement, approved by the business owner -- see
                how-it-works.tsx for the same text and its sourcing note. */}
            <p className="text-center text-sm text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Medical Center Turkey is a health tourism intermediary organization authorized by the T.C. Ministry of Health of Turkey, providing consultancy, planning and coordination services to international patients seeking treatment in Turkey.
            </p>
            <HospitalGrid hospitals={hospitals} initialGroup={initialGroup} />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
