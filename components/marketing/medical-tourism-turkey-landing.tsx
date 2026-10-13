"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Globe, Award, UserCheck, ChevronDown } from "lucide-react";
import { MedicalTourismTurkeyProcess } from "./medical-tourism-turkey-process";
import { ConsultationForm } from "./consultation-form";
import { MailtoWithReference } from "./mailto-with-reference";
import { MEDICAL_TOURISM_TURKEY_FAQS as faqs } from "@/lib/medical-tourism-turkey-content";

// Phase: TR mini-site redesign. The English homepage's hero (components/
// marketing/hero.tsx) is a single flat image (public/hero-son.png) with its
// headline, subheadline, top trust-badge row AND bottom feature row all
// baked into the pixels -- there is no HTML/CSS text to translate, and no
// textless source version of that exact photo exists in the repo (checked
// public/hero-image1.png too -- same problem). Reusing it here would either
// (a) show English text with no Turkish equivalent, or (b) force Turkish
// text directly on top of the existing baked English text, which collides
// visually. Per the brief's own fallback instruction, the original file is
// left untouched; this page instead reuses public/istanbul_hero.webp (an
// existing, already-in-repo, textless Istanbul skyline photo -- not a newly
// generated/unrelated stock image) as the background for a real HTML/CSS
// text overlay, keeping the same design APPROACH as the English homepage
// (full-bleed photo + gradient scrim + white/gold text + pill CTAs) even
// though the specific photo differs. Flagged explicitly in the report.
const trustBadges = [
  { icon: ShieldCheck, title: "Sağlık Turizmi Yetki Belgesi", subtitle: "AK-1494" },
  { icon: Globe, title: "TÜRSAB Üyesi", subtitle: "No: 18274" },
  // "Hospitals" (plural) deliberately, not "Medical Center Turkey" itself --
  // MCT is a coordinator, not a JCI-accredited provider. Subtitle makes the
  // partner-hospital scope explicit (see CLAUDE.md "Partner Hospital Rules").
  { icon: Award, title: "JCI Akreditasyonlu Hastaneler", subtitle: "Ortak Hastanelerimiz" },
  { icon: UserCheck, title: "VIP Hasta Koordinasyonu", subtitle: "7/24 Destek" },
];

export function MedicalTourismTurkeyLanding() {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div lang="tr">
      {/* In-page anchor nav */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-center gap-6 overflow-x-auto">
          <a href="#hero" className="text-xs font-semibold text-brand hover:text-teal whitespace-nowrap">Ana Sayfa</a>
          <a href="#hakkimizda" className="text-xs font-semibold text-brand hover:text-teal whitespace-nowrap">Hakkımızda</a>
          <a href="#surec" className="text-xs font-semibold text-brand hover:text-teal whitespace-nowrap">Süreç</a>
          <a href="#sss" className="text-xs font-semibold text-brand hover:text-teal whitespace-nowrap">SSS</a>
          <a href="#iletisim" className="text-xs font-semibold text-brand hover:text-teal whitespace-nowrap">İletişim</a>
        </div>
      </nav>

      {/* Trust badges -- mirrors the row the English hero image bakes in at
          its top, rebuilt here as real, translatable HTML/CSS. */}
      <section id="hero" className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {trustBadges.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <Icon className="text-teal" size={26} />
              <div className="text-xs sm:text-sm font-bold text-brand leading-snug">{title}</div>
              <div className="text-[11px] sm:text-xs text-gray-400">{subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[440px] sm:min-h-[520px] lg:min-h-[600px] flex items-center">
        <Image
          src="/istanbul_hero.webp"
          alt="İstanbul"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(13,45,82,0.94) 0%, rgba(13,45,82,0.82) 35%, rgba(13,45,82,0.55) 65%, rgba(13,45,82,0.25) 100%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-2xl mb-5 leading-tight">
            Türkiye&apos;de Ayrıcalıklı Sağlık Hizmeti
          </h1>
          <p className="text-white/80 max-w-xl mb-8 text-base sm:text-lg leading-relaxed">
            Uluslararası Standartlarda Tedavi. Size Özel Sağlık Hizmetleri. Sağlığınız Önceliğimiz.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/hospitals-in-turkey"
              className="px-6 py-3 rounded-full bg-white text-brand font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Hastanelerimiz
            </Link>
            <a
              href="#iletisim"
              className="px-6 py-3 rounded-full font-semibold text-sm text-white transition-colors"
              style={{ background: "linear-gradient(135deg, #1ab3c8, #1b5fa8)" }}
            >
              İletişime Geçin
            </a>
          </div>
        </div>
      </section>

      {/* Biz Kimiz? */}
      <section id="hakkimizda" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-6 text-center">Biz Kimiz?</h2>
          <div className="text-gray-600 leading-relaxed text-[15px] space-y-4">
            <p>
              Medical Center Turkey, Türkiye&apos;de sağlık hizmeti almak isteyen uluslararası hastalara danışmanlık,
              planlama ve koordinasyon hizmetleri sunan, T.C. Sağlık Bakanlığı tarafından yetkilendirilmiş bir sağlık
              turizmi aracı kuruluşudur.
            </p>
            <p>
              Amacımız, dünyanın farklı ülkelerinden Türkiye&apos;ye gelen hastaların ihtiyaçlarına uygun sağlık
              kuruluşlarına ulaşmalarını kolaylaştırmak ve tedavi yolculuklarının her aşamasında güvenilir bir
              iletişim ve koordinasyon noktası olmaktır.
            </p>
            <p>
              Türkiye&apos;nin sağlık alanındaki gelişmiş altyapısını, deneyimli sağlık profesyonellerini ve
              uluslararası standartlarda hizmet sunan hastanelerini hastalarımızla buluşturuyoruz. Saç ekimi, diş
              tedavileri, estetik cerrahi, göz sağlığı ve diğer birçok tıbbi alanda, hastalarımızın ihtiyaçlarına
              uygun tedavi seçeneklerini değerlendirmelerine yardımcı oluyoruz.
            </p>

            {aboutExpanded && (
              <>
                <p className="font-semibold text-brand text-base">
                  İlk görüşmeden ülkenize dönüşünüze kadar yanınızdayız.
                </p>
                <p>
                  Tedavi öncesinde hastalarımızın taleplerini değerlendiriyor, ilgili sağlık kuruluşlarıyla
                  iletişimlerini koordine ediyor, tedavi planlaması ve seyahat organizasyonu konusunda destek
                  sağlıyoruz. Tedavi sonrasında da gerekli bilgilendirme ve takip süreçlerinde iletişimin devam
                  etmesine yardımcı oluyoruz.
                </p>
                <p>
                  Medical Center Turkey olarak şeffaf iletişime, hasta memnuniyetine, kişisel verilerin gizliliğine ve
                  etik değerlere önem veriyoruz. Tıbbi değerlendirme ve tedavi kararlarının yetkili sağlık
                  profesyonelleri tarafından verilmesini esas alıyoruz.
                </p>
                <p className="text-sm text-gray-400">
                  Medical Center Turkey, Sağlık Turizmi Yetki Belgesi AK-1494 ve TÜRSAB üyelik numarası 18274 ile
                  faaliyet göstermektedir.
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAboutExpanded((v) => !v)}
            aria-expanded={aboutExpanded}
            className="mt-6 mx-auto flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-brand transition-colors"
          >
            {aboutExpanded ? "Daha Az Göster" : "Devamını Oku"}
            <ChevronDown size={16} className={`transition-transform duration-200 ${aboutExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </section>

      <div id="surec">
        <MedicalTourismTurkeyProcess />
      </div>

      {/* Consultation + FAQ */}
      <section
        id="iletisim"
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0f6ff 0%, #f5feff 100%)" }}
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#1b5fa8" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#1ab3c8" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

            {/* Form */}
            <div className="bg-white rounded-3xl shadow-xl shadow-brand/5 p-8 sm:p-10 flex flex-col h-full">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-3">Ücretsiz Danışmanlık</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-2">Ücretsiz Tedavi Planınızı Alın</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Formu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin. Başvuru herhangi bir tedavi
                yükümlülüğü oluşturmaz.
              </p>

              <ConsultationForm source="Medical Tourism Turkey (TR)" locale="tr" />
            </div>

            {/* FAQ */}
            <div id="sss" className="bg-white rounded-3xl shadow-xl shadow-brand/5 p-8 sm:p-10 flex flex-col h-full">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-3">SSS</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-8">Sıkça Sorulan Sorular</h2>

              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div
                    key={faq.q}
                    className={`rounded-2xl overflow-hidden transition-all border ${openFaq === i ? "border-teal/30 bg-white shadow-md shadow-teal/5" : "border-transparent bg-white/60 hover:bg-white"}`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className={`text-sm font-semibold transition-colors ${openFaq === i ? "text-brand" : "text-gray-700"}`}>{faq.q}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${openFaq === i ? "bg-teal" : "bg-gray-100"}`}>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${openFaq === i ? "rotate-180 text-white" : "text-gray-400"}`}
                        />
                      </div>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                        <p className="pt-3">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-10 text-center text-sm text-gray-500 space-y-1">
            <p>Barbaros Mah. Al Zambak Sk. Varyap Meridian Grand Tower A Blok No:2 D:226, Ataşehir / İstanbul</p>
            <p>
              <a href="tel:+908508888911" className="text-brand font-semibold hover:text-teal">+90 850 888 89 11</a>
              {" · "}
              <MailtoWithReference address="hello@medicalcenterturkey.com" subject="Medical Tourism Inquiry" className="text-brand font-semibold hover:text-teal">hello@medicalcenterturkey.com</MailtoWithReference>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
