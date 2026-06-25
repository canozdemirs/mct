const steps = [
  {
    number: "01",
    title: "Contact Us",
    description:
      "Tell us your treatment needs. We assess your case, answer every question, and explain your options — no pressure, no commitment.",
  },
  {
    number: "02",
    title: "We Plan Everything",
    description:
      "We design your complete package: hospital selection, appointment scheduling, transfers, accommodation, and full coordination.",
  },
  {
    number: "03",
    title: "You Fly to Istanbul",
    description:
      "Arrive knowing every detail is handled. Your dedicated coordinator is with you from landing to departure — and through aftercare.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-3">
            Your Treatment Journey, Simplified
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Three steps. Zero confusion. One coordinator managing everything from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
          <div
            className="hidden md:block absolute top-10 left-[calc(16.66%+2.5rem)] right-[calc(16.66%+2.5rem)] h-px"
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
              <h3 className="text-xl font-bold text-brand mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            animation: ticker 25s linear infinite;
          }
        `}</style>
        <div className="mt-16 rounded-2xl border border-teal/20 bg-white py-3" style={{ overflow: "hidden" }}>
          <div className="ticker-track flex w-max">
            {[...Array(2)].map((_, copy) =>
              ["FREE COORDINATION","FREE CONSULTATION","NO HIDDEN FEES","FREE HOSPITAL MATCHING","FREE QUOTE","FREE TRANSFER ARRANGEMENT","FREE AFTERCARE SUPPORT","FREE ACCOMMODATION ARRANGEMENT"].map((text, i) => (
                <span key={`${copy}-${i}`} className="inline-flex items-center gap-3 px-6">
                  <span className="text-xs font-bold tracking-widest text-brand uppercase whitespace-nowrap">{text}</span>
                  <span className="text-teal font-bold">·</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
