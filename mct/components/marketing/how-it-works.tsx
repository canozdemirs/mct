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
      "We design your complete package: hospital selection, appointment scheduling, flights, transfers, accommodation, and full coordination.",
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://wa.me/908508888911"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:underline"
          >
            Start your journey today →
          </a>
        </div>
      </div>
    </section>
  );
}
