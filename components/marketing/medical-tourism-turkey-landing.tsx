"use client";

import Link from "next/link";
import { ShieldCheck, Award, Eye, Clock3 } from "lucide-react";
import { MedicalTourismTurkeyProcess } from "./medical-tourism-turkey-process";
import { ConsultationForm } from "./consultation-form";
import { MailtoWithReference } from "./mailto-with-reference";
import { MEDICAL_TOURISM_TURKEY_FAQS as faqs } from "@/lib/medical-tourism-turkey-content";

const badges = [
  { icon: ShieldCheck, title: "Yetki Belgesi", subtitle: "AK-1494" },
  { icon: Award, title: "TÜRSAB Üyesi", subtitle: "No: 18274" },
  { icon: Eye, title: "Şeffaf Süreç", subtitle: "Net Maliyetler" },
  { icon: Clock3, title: "7/24 Destek", subtitle: "Her zaman yanınızda" },
];

export function MedicalTourismTurkeyLanding() {
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

      {/* Hero */}
      <section id="hero" style={{ background: "linear-gradient(135deg, #0d2d52, #1b5fa8)" }} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white max-w-3xl mx-auto mb-5">
          Uluslararası Hastalar İçin Sağlık Turizmi Koordinasyonu
        </h1>
        <p className="text-white/70 max-w-xl mx-auto mb-8 text-base">
          İlk görüşmeden ülkenize dönüşünüze kadar tüm süreci sizin için koordine ediyoruz.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
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
      </section>

      {/* Trust badges */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {badges.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <Icon className="text-teal" size={28} />
              <div className="text-sm font-bold text-brand">{title}</div>
              <div className="text-xs text-gray-400">{subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Biz Kimiz? */}
      <section id="hakkimizda" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-5 text-center">Biz Kimiz?</h2>
          <p className="text-gray-600 leading-relaxed text-[15px] text-center">
            Medical Center Turkey, yurt dışından gelen hastaları Türkiye&apos;deki sağlık kuruluşlarıyla buluşturan,
            T.C. Sağlık Bakanlığı tarafından yetkilendirilmiş bir sağlık turizmi aracı kuruluşudur. Amacımız,
            hastalarımıza sadece bir aracı değil, tedavi yolculuklarının her aşamasında güvenilir bir yol arkadaşı
            olmaktır.
          </p>
        </div>
      </section>

      <div id="surec">
        <MedicalTourismTurkeyProcess />
      </div>

      {/* FAQ */}
      <section id="sss" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-10 text-center">Sıkça Sorulan Sorular</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <h3 className="text-base font-bold text-brand mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-2">Ücretsiz Danışmanlık</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand">İletişime Geçin</h2>
            <p className="text-gray-400 text-sm mt-2">Sorularınızı bize iletin, ekibimiz en kısa sürede size dönüş yapacaktır.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <ConsultationForm source="Medical Tourism Turkey (TR)" locale="tr" />
          </div>
          <div className="mt-8 text-center text-sm text-gray-500 space-y-1">
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
