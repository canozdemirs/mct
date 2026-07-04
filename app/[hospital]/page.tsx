import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Check, ChevronRight, MessageCircle, Send } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { HospitalGallery } from "@/components/marketing/hospital-gallery";
import { GroupLogo } from "@/components/marketing/group-logo";
import {
  hospitalGroups,
  getHospitalBySlug,
  getHospitalsByGroup,
  getAllHospitalSlugs,
} from "@/lib/hospitals";

type PageProps = { params: Promise<{ hospital: string }> };

export async function generateStaticParams() {
  return getAllHospitalSlugs().map((slug) => ({ hospital: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hospital: slug } = await params;
  const hospital = getHospitalBySlug(slug);
  if (!hospital) return {};

  const location = hospital.district
    ? `${hospital.district}, ${hospital.city}`
    : hospital.city;

  return {
    title: `${hospital.name} – Treatment for International Patients | Medical Center Turkey`,
    description: `${hospital.name} in ${location}, Turkey. Medical Center Turkey arranges treatment at this partner hospital for international patients — free consultation, transparent pricing, airport transfers, and full coordination from arrival to discharge.`,
    alternates: {
      canonical: `/${hospital.slug}`,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

export default async function HospitalPage({ params }: PageProps) {
  const { hospital: slug } = await params;
  const hospital = getHospitalBySlug(slug);
  if (!hospital) notFound();

  const group = hospitalGroups[hospital.group];
  const otherInGroup = getHospitalsByGroup(hospital.group).filter(
    (h) => h.slug !== hospital.slug,
  );
  const location = hospital.district
    ? `${hospital.district}, ${hospital.city}`
    : hospital.city;

  const hasKeyFacts =
    hospital.beds !== null ||
    hospital.operatingRooms !== null ||
    hospital.area !== "";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://medicalcenterturkey.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hospitals in Turkey",
        item: "https://medicalcenterturkey.com/hospitals-in-turkey",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hospital.name,
        item: `https://medicalcenterturkey.com/${hospital.slug}`,
      },
    ],
  };

  const hospitalJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    "@id": `https://medicalcenterturkey.com/${hospital.slug}`,
    name: hospital.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: hospital.district || hospital.city,
      addressRegion: hospital.city,
      addressCountry: "TR",
    },
    provider: {
      "@type": "MedicalOrganization",
      "@id": "https://medicalcenterturkey.com",
      name: "Medical Center Turkey",
      description: "International Patient Center and Health Tourism Coordinator",
      url: "https://medicalcenterturkey.com",
    },
  };

  if (hospital.treatmentUnits.length > 0) {
    hospitalJsonLd.medicalSpecialty = hospital.treatmentUnits;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalJsonLd) }}
      />
      <Nav />
      <main className="bg-slate-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav
              className="flex items-center gap-1.5 text-sm text-slate-400 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-slate-600 transition-colors shrink-0">
                Home
              </Link>
              <ChevronRight size={13} className="shrink-0" />
              <Link
                href="/hospitals-in-turkey"
                className="hover:text-slate-600 transition-colors shrink-0"
              >
                Hospitals in Turkey
              </Link>
              <ChevronRight size={13} className="shrink-0" />
              <span className="text-slate-600 font-medium truncate">{hospital.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
              {hospital.name}
            </h1>
            <p className="text-base text-slate-500 mb-3">{group.name}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <MapPin size={14} className="text-[#1ab3c8] shrink-0" />
              <span>{location}</span>
            </div>
            {hospital.accreditations.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {hospital.accreditations.map((acc) => (
                  <span
                    key={acc}
                    className="bg-teal-50 text-[#1ab3c8] text-xs rounded-full px-2.5 py-1 font-medium"
                  >
                    {acc}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Two-column body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start gap-8">
            {/* ── Main content ── */}
            <div>
              <HospitalGallery images={hospital.images} name={hospital.name} />

              {hospital.overview && (
                <section className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-3">Overview</h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {hospital.overview}
                  </p>
                </section>
              )}

              {hasKeyFacts && (
                <section className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Key Facts</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {hospital.beds !== null && (
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-2xl font-extrabold text-[#1b5fa8]">{hospital.beds}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Beds</p>
                      </div>
                    )}
                    {hospital.operatingRooms !== null && (
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-2xl font-extrabold text-[#1b5fa8]">
                          {hospital.operatingRooms}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Operating Rooms</p>
                      </div>
                    )}
                    {hospital.area && (
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-xl font-extrabold text-[#1b5fa8] leading-tight">
                          {hospital.area}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Total Area</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {hospital.freeServices.length > 0 && (
                <section className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Free Services by MCT</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {hospital.freeServices.map((service) => (
                      <div key={service} className="flex items-start gap-2.5">
                        <Check size={15} className="text-[#1ab3c8] mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {hospital.languages.length > 0 && (
                <section className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Languages Spoken</h2>
                  <div className="flex flex-wrap gap-2">
                    {hospital.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {hospital.treatmentUnits.length > 0 && (
                <section className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Treatment Units</h2>
                  <div className="grid md:grid-cols-3 gap-2">
                    {hospital.treatmentUnits.map((unit) => (
                      <div
                        key={unit}
                        className="text-sm text-slate-700 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        {unit}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {hospital.mapEmbedUrl && (
                <section className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Location</h2>
                  <div className="rounded-xl overflow-hidden border border-slate-100">
                    <iframe
                      src={hospital.mapEmbedUrl}
                      width="100%"
                      height="360"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      className="block"
                      title={`${hospital.name} location map`}
                    />
                  </div>
                </section>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside className="mt-8 lg:mt-0 space-y-5 lg:sticky lg:top-24">
              {/* CTA card */}
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <div
                  className="p-6"
                  style={{
                    background: "linear-gradient(135deg, #1b5fa8 0%, #1ab3c8 100%)",
                  }}
                >
                  <h2 className="text-white font-bold text-lg mb-1.5 leading-snug">
                    Get treatment at {hospital.name}
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Free consultation, transparent pricing, full coordination by Medical
                    Center Turkey.
                  </p>
                </div>
                <div className="bg-white p-5 space-y-3">
                  <a
                    href="https://wa.me/908508888911"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white rounded-full py-3 font-semibold text-sm hover:bg-[#1fb55a] transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Us
                  </a>
                  <a
                    href="#consultation"
                    className="flex items-center justify-center gap-2 w-full bg-[#1b5fa8] text-white rounded-full py-3 font-semibold text-sm hover:bg-[#154d8a] transition-colors"
                  >
                    <Send size={15} />
                    Free Consultation
                  </a>
                </div>
              </div>

              {/* Group card */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="p-5">
                  <div className="mb-3">
                    <GroupLogo src={group.logo} alt={group.name} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1.5">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-slate-500 leading-relaxed">{group.description}</p>
                  )}
                </div>

                {otherInGroup.length > 0 && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Other {group.name} hospitals
                    </p>
                    <ul className="space-y-2">
                      {otherInGroup.map((h) => (
                        <li key={h.slug}>
                          <Link
                            href={`/${h.slug}`}
                            className="flex items-center gap-1.5 text-sm text-[#1b5fa8] hover:underline"
                          >
                            <ChevronRight size={12} className="text-[#1ab3c8] shrink-0" />
                            {h.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
