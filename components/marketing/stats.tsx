"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Star, ThumbsUp } from "lucide-react";

// GEO trust fix (2026-10-14): "Partner Hospitals" (200) removed -- not
// supported by any verifiable site data (lib/hospitals.ts documents 38
// published hospital profiles; business owner confirmed 200 could not be
// confirmed and should not be replaced with 38 either, since that number
// means something different -- published profile count, not a partner
// count). Google/Trustpilot ratings below are confirmed current and left
// unchanged. Grid layout adjusted from 4 to 3 items accordingly (see
// Stats() below) so neither breakpoint is left with an unbalanced slot.
const stats = [
  {
    value: 5000,
    prefix: "",
    suffix: "+",
    label: "Patients Served",
    decimals: 0,
    icon: Users,
    static: false,
  },
  {
    value: 5.0,
    prefix: "",
    suffix: "",
    label: "Google Rating",
    decimals: 1,
    icon: Star,
    static: false,
  },
  {
    value: 4.9,
    prefix: "",
    suffix: "",
    label: "Trustpilot Rating",
    decimals: 1,
    icon: ThumbsUp,
    static: false,
  },
];

function Counter({ value, prefix, suffix, decimals }: { value: number; prefix: string; suffix: string; decimals: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(parseFloat((eased * value).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
            else setDisplay(value);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, decimals]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toLocaleString()}{suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="bg-white pt-0 pb-12 -mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl py-8 grid grid-cols-1 sm:grid-cols-3"
          style={{ background: "linear-gradient(135deg, #1b5fa8 0%, #1ab3c8 100%)" }}
        >
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center gap-2 py-4 px-6 text-center w-full ${idx < stats.length - 1 ? "sm:border-r border-white/20" : ""}`}
            >
              {s.icon && <s.icon size={18} className="text-white/60" />}
              <div className="text-3xl sm:text-4xl font-bold text-white leading-none tabular-nums">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/70 whitespace-nowrap">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
