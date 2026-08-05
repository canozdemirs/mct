import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full">
      <Image
        src="/hero-son.png"
        alt="Medical Center Turkey"
        width={1920}
        height={1080}
        className="w-full h-auto"
        priority
      />
    </section>
  );
}
