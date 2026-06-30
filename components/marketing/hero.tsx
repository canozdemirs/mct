import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/istanbul_hero.webp"
        alt="Istanbul, Turkey"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            World-Class Healthcare in Turkey.
            <br />
            <span className="text-teal">Every Detail Managed.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl">
            Your International Patient Center — managing your entire treatment journey across
            our network of Ministry of Health certified hospitals, from first consultation to
            your safe return home.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
