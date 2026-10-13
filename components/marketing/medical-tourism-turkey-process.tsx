// Turkish-only "Hizmet Sürecimiz" section for /medical-tourism-turkey.
// Visual pattern mirrors components/marketing/how-it-works.tsx (numbered
// circles + connecting gradient line) — that English component is left
// untouched; this is a separate file so nothing about the homepage changes.

const steps = [
  { number: "01", title: "Ön Görüşme", description: "İhtiyaçlarınızı dinliyoruz, sorularınızı yanıtlıyoruz ve seçeneklerinizi netleştiriyoruz." },
  { number: "02", title: "Tedavi Planı", description: "Uzmanlarımız durumunuza özel bir tedavi planı hazırlar." },
  { number: "03", title: "Organizasyon", description: "Ulaşım, konaklama ve randevularınızı sizin için organize ediyoruz." },
  { number: "04", title: "Tedavi", description: "Anlaşmalı sağlık kuruluşlarımızda tedaviniz gerçekleştirilir." },
  { number: "05", title: "Taburcu", description: "Son kontroller tamamlanır, güvenle ülkenize dönersiniz." },
];

export function MedicalTourismTurkeyProcess() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-3">Hizmet Sürecimiz</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 relative">
          <div
            className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px"
            style={{ background: "linear-gradient(to right, #1b5fa8, #1ab3c8)" }}
          />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 relative z-10 shadow-lg"
                style={{ background: "linear-gradient(135deg, #1b5fa8, #1ab3c8)" }}
              >
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-brand mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
