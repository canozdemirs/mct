// Shared data for /medical-tourism-turkey — kept separate from the (client)
// landing component so the page.tsx Server Component can also read it for
// FAQPage/Breadcrumb JSON-LD without importing a "use client" module.

export const MEDICAL_TOURISM_TURKEY_FAQS = [
  {
    q: "Sağlık Turizmi Aracı Kuruluşu nedir?",
    a: "Sağlık turizmi aracı kuruluşu, yurt dışından gelen hastaların ulaşım, konaklama ve hastane randevularını koordine eden, T.C. Sağlık Bakanlığı tarafından yetkilendirilmiş bir kurumdur.",
  },
  {
    q: "Tedavi sürecinde tercüman desteği sağlanıyor mu?",
    a: "Evet, tedavi süreciniz boyunca kendi dilinizde tercüman ve refakatçi desteği sağlanır.",
  },
  {
    q: "Hangi şehirlerde hizmet veriyorsunuz?",
    a: "Anlaşmalı hastanelerimiz aracılığıyla İstanbul, Ankara, Antalya ve İzmir'de hizmet veriyoruz.",
  },
  {
    q: "Fiyatlandırma nasıl yapılıyor?",
    a: "Fiyatlandırma; tedavi türü, hastane ve konaklama tercihinize göre kişiye özel olarak belirlenir. Gizli ücret uygulanmaz.",
  },
];
