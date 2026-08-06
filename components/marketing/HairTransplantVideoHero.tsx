"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

/**
 * HairTransplantVideoHero
 * -------------------------------------------------------------
 * Premium, glassmorphism video section for the Hair Transplant
 * Packages page. Drop this above (or as part of) the packages
 * section on /hair-transplant-turkey.
 *
 * USAGE:
 *   <HairTransplantVideoHero
 *     videoSrc="/videos/hair-transplant-promo.mp4"
 *     posterSrc="/treatments/hair-transplant/landing/video-poster.jpg"
 *   />
 *
 * NOTES FOR CLAUDE CODE / INTEGRATION:
 * - Replace videoSrc/posterSrc with the real asset paths once the
 *   MP4 is placed in /public/videos/.
 * - Colors reference existing Tailwind config tokens (brand-blue,
 *   brand-teal) — swap to your actual token names if different.
 * - Uses next/dynamic-safe browser APIs only (IntersectionObserver,
 *   matchMedia) guarded behind useEffect, so it's safe in a
 *   Next.js App Router client component.
 * - Autoplay-muted-on-desktop / tap-to-play-on-mobile follows
 *   platform convention and avoids mobile data/battery complaints.
 */

interface HairTransplantVideoHeroProps {
  videoSrc?: string; // defaults to /videos/hair-transplant-promo.mp4
  posterSrc?: string; // defaults to /videos/video-poster.jpg
  whatsappNumber?: string; // defaults to MCT's number
  onCtaClick?: () => void; // e.g. scroll to #consultation or open modal
}

export default function HairTransplantVideoHero({
  videoSrc = "/videos/hair-transplant-promo.mp4",
  posterSrc = "/videos/video-poster.jpg",
  whatsappNumber = "908508888911",
  onCtaClick,
}: HairTransplantVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Detect viewport class (desktop = autoplay candidate)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lazy-trigger: only load/play once the section is actually visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay muted on desktop once visible; mobile stays paused (poster + tap to play)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView && isDesktop) {
      video.muted = true;
      setIsMuted(true);
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {
          // Autoplay blocked (rare with muted, but handle gracefully)
          setIsPlaying(false);
        });
    } else if (!isInView && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isInView, isDesktop]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Hair transplant journey — promotional video"
      className="relative w-full py-12 md:py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a1830] to-[#0f2647] overflow-hidden"
    >
      {/* Ambient background glow — subtle, on-brand */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #1ab3c8 0%, #1b5fa8 45%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center mb-8 md:mb-10">
        <span className="inline-block text-xs md:text-sm font-semibold tracking-widest uppercase text-[#1ab3c8] mb-3">
          Your Journey, Filmed
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
          Experience Your Complete
          <br className="hidden md:block" /> Hair Transplant Journey
        </h2>
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From airport pickup to your final aftercare check-in — every step
          of your Istanbul experience, planned and supported by your
          dedicated coordinator.
        </p>
      </div>

      {/* Glassmorphism video card — footage is native 9:16 portrait, so the
          card is a narrow centered column rather than a full-width 16:9 block */}
      <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <div
          className="relative rounded-2xl md:rounded-[2rem] p-1.5 md:p-2 backdrop-blur-xl border border-white/10 shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          }}
        >
          <div className="relative rounded-xl md:rounded-[1.6rem] overflow-hidden aspect-[9/16] bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              // Lazy: only fetch metadata until in-view logic decides to play
              preload="metadata"
              poster={posterSrc}
              playsInline
              muted={isMuted}
              loop
              controls={hasStarted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Custom play overlay — shown until first play (esp. mobile) */}
            {!hasStarted && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              >
                <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full backdrop-blur-md bg-white/15 border border-white/30 group-hover:scale-105 transition-transform">
                  <Play
                    className="w-7 h-7 md:w-8 md:h-8 text-white ml-1"
                    fill="currentColor"
                  />
                </span>
              </button>
            )}

            {/* Minimal control bar (mute + play/pause) once started, desktop autoplay case */}
            {hasStarted && (
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="w-9 h-9 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/55 border border-white/20 flex items-center justify-center transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className="w-9 h-9 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/55 border border-white/20 flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="relative max-w-4xl mx-auto mt-8 md:mt-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onCtaClick}
          className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-white text-base md:text-lg shadow-lg shadow-[#1b5fa8]/30 hover:shadow-xl hover:shadow-[#1b5fa8]/40 hover:-translate-y-0.5 transition-all"
          style={{
            background: "linear-gradient(135deg, #1b5fa8, #1ab3c8)",
          }}
        >
          Get Free Hair Analysis
        </button>

        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm md:text-base font-medium text-white/90 bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[#25D366]"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.32-1.39a9.87 9.87 0 0 0 4.67 1.19h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.16 0 4.2.84 5.73 2.37a8.07 8.07 0 0 1 2.38 5.75c0 4.48-3.65 8.13-8.13 8.13a8.1 8.1 0 0 1-4.14-1.13l-.3-.17-3.16.83.84-3.08-.19-.32a8.09 8.09 0 0 1-1.24-4.32c0-4.48 3.65-8.06 8.21-8.06zm-4.7 4.6c-.16 0-.42.06-.64.31s-.85.83-.85 2.02.87 2.35.99 2.51c.12.16 1.7 2.6 4.13 3.64 2.04.87 2.46.7 2.9.66.44-.04 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28s-1.42-.7-1.64-.78-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.18 7.2 7.2 0 0 1-1.33-1.65c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.75-1.8-.2-.47-.4-.4-.54-.41z" />
          </svg>
          Message us on WhatsApp
        </a>
      </div>
    </section>
  );
}
