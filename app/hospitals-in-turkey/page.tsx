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
            <HospitalGrid hospitals={hospitals} initialGroup={initialGroup} />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
