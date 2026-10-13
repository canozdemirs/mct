"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MedicalTourismTurkeyProcess } from "./medical-tourism-turkey-process";
import { ConsultationForm } from "./consultation-form";
import { MEDICAL_TOURISM_TURKEY_FAQS as faqs } from "@/lib/medical-tourism-turkey-content";

// Phase: TR mini-site Hero, final. public/hero-tr.png is a Turkish-localized
// version of the English hero-son.png scene, supplied as a finished asset --
// headline, subheadline, the 4 trust badges and the bottom 5-item feature
// strip are all already baked into it in Turkish. Rendered at its natural
// 1536x1024 ratio (w-full h-auto, same non-cropping pattern components/
// marketing/hero.tsx already uses for the English version) so it is never
// cropped or distorted at any width -- mobile included. No HTML text is
// layered on top of it (would duplicate what's already in the image); the
// two CTA pill shapes baked into the image are instead given real,
// keyboard-focusable <Link>/<a> hit areas positioned over them in percent
// coordinates (measured directly from the image's pixels), so they scale
// together with the image at any viewport width and stay functional.
// The separate HTML trust-badge row that used to sit above this section
// was removed -- the image's own top strip already shows the same 4 badges,
// and keeping both would duplicate them (see the brief's own instruction).
const CTA_HOTSPOTS = [
  { href: "/hospitals-in-turkey", label: "Hastanelerimiz", left: 4, top: 63.3, width: 16.3, height: 7.6, internal: true },
  { href: "#iletisim", label: "İletişime Geçin", left: 22.1, top: 63.3, width: 15.8, height: 7.6, internal: false },
] as const;

export function MedicalTourismTurkeyLanding() {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div lang="tr">
      {/* The in-page anchor nav that used to live here was removed -- it
          duplicated the page header (two stacked nav bars). Its links now
          live in MedicalTourismTurkeyNav's own center nav instead; the
          section ids below (#hero, #hakkimizda, #surec, #sss, #iletisim)
          are unchanged so those header links still scroll correctly. */}

      {/* Hero -- see the file-level comment above for how the CTA hotspots
          are positioned over the image's own baked-in buttons. */}
      <section id="hero" className="relative w-full overflow-hidden bg-brand-dark">
        <Image
          src="/hero-tr.png"
          alt="Türkiye'de Ayrıcalıklı Sağlık Hizmeti — Medical Center Turkey: İstanbul'da doktor ve hasta görüşmesi, Galata Kulesi manzarası, sağlık turizmi yetki belgesi, TÜRSAB üyeliği, JCI akreditasyonlu ortak hastaneler ve VIP hasta koordinasyonu"
          width={1536}
          height={1024}
          priority
          sizes="100vw"
          className="w-full h-auto block"
        />
        {CTA_HOTSPOTS.map((cta) =>
          cta.internal ? (
            <Link
              key={cta.href}
              href={cta.href}
              aria-label={cta.label}
              className="absolute rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              style={{ left: `${cta.left}%`, top: `${cta.top}%`, width: `${cta.width}%`, height: `${cta.height}%` }}
            />
          ) : (
            <a
              key={cta.href}
              href={cta.href}
              aria-label={cta.label}
              className="absolute rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              style={{ left: `${cta.left}%`, top: `${cta.top}%`, width: `${cta.width}%`, height: `${cta.height}%` }}
            />
          )
        )}
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
        </div>
      </section>
    </div>
  );
}
