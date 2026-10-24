"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MessageCircle, Send, ArrowRight } from "lucide-react";
import { useLandingLeadForm } from "@/lib/hooks/use-landing-lead-form";
import { CountrySelect } from "@/components/marketing/country-select";
import { PhoneInput } from "@/components/marketing/phone-input";
import { FieldError } from "@/components/marketing/field-error";
import { FormSuccessMessage } from "@/components/marketing/form-success-message";
import { WhatsAppLink } from "@/components/marketing/whatsapp-link";
import { BeforeAfterGallery, type BeforeAfterPhoto } from "@/components/marketing/before-after-gallery";
import { packages, recoveryTimeline, testimonials, whyMCT } from "@/components/marketing/hair-transplant-landing";

// Reuses the exact color tokens / card styling already established in
// hair-transplant-landing.tsx (the packages page) -- #053980 brand,
// #5788AC mid-blue, #A3C6CF light accent, #F4F8FB section background,
// #6B7C8D body gray -- so this page reads as the same product, not a
// different design language.

const GALLERY_DIR = "/blog/hair-transplant-surgery-before-and-after-turkey";
// The original post had 19 images total; 13 are genuine before/after
// result composites (confirmed by inspecting each) -- the other 6 are an
// Instagram promo banner, a Trustpilot promo banner, two plain review-
// text screenshots with no photos at all, the Treatment Cost Calculator
// banner, and the old "Request a FREE Consultation" banner. Only the 13
// real result photos are shown here.
const GALLERY_PHOTOS: BeforeAfterPhoto[] = [
  "10-1", "2", "8-1", "3", "7-1", "4", "13-1", "5", "12-1", "6", "11-1", "1", "9-1",
].map((n, i) => ({
  src: `${GALLERY_DIR}/${n}.png`,
  alt: `Hair transplant before and after – Medical Center Turkey patient ${i + 1}`,
}));

const WHY_MCT_SLUGS = ["Dedicated GO Coordinator", "Warranty Certificate", "Ministry of Health Authorized", "Fast Recovery"];
const WHY_MCT_CARDS = whyMCT.filter((item) => WHY_MCT_SLUGS.includes(item.title));

const faqs = [
  {
    q: "Are these real patients?",
    a: "Yes. Every photo on this page is a real Medical Center Turkey patient, shared with their permission. No filters, no touch-ups beyond what's in the original image.",
  },
  {
    q: "When will I see final results?",
    a: "Hair transplant results develop gradually. In the first 2–4 weeks, the transplanted hairs will shed — this is completely normal and expected. New growth begins around months 3–4. By month 6 you will see significant improvement, and your final, full result is typically visible at 12 months. This is why our aftercare support runs for a full year — we check in with you at 1 month, 3 months, and 12 months to monitor your progress.",
  },
  {
    q: "Will my result look natural?",
    a: "Our team pays meticulous attention to hairline design and density so your new hairline blends seamlessly with your existing hair — the goal on every case is a result that looks like it was never transplanted.",
  },
  {
    q: "Is the result permanent?",
    a: "Yes. Grafts are taken from the back/sides of the head, an area naturally resistant to hair loss, and keep that same resistance once transplanted.",
  },
  {
    q: "How do I find out if I'm a good candidate?",
    a: "Send us a few photos of your hair for a free hair analysis — we'll review your case and reply within 48 hours with honest advice on what to expect, at no cost and no commitment.",
  },
];

export function HairTransplantBeforeAfterLanding() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { form, setForm, agreed, setAgreed, submitting, succeeded, error, fieldError, markTouched, handleWhatsApp, handleEmail } =
    useLandingLeadForm("Hair Transplant");

  function scrollToForm() {
    document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #053980, #031e46)", padding: "56px 20px 44px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 14 }}>
            Hair Transplant Before &amp; After in Turkey
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.75)", marginBottom: 28 }}>
            Real Medical Center Turkey patients. Natural hairlines, no filters.
          </p>

          <div className="flex justify-center flex-wrap gap-2.5 mb-8">
            {["5,000+ International Patients", "★ 4.9 Trustpilot", "Ministry of Health Authorized", "12 Months Aftercare"].map((label) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                {label}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={scrollToForm}
              style={{ background: "#053980", border: "2px solid #A3C6CF", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              Get Your Free Hair Analysis <ArrowRight size={16} />
            </button>
            <WhatsAppLink
              message="Hi, I'd like to send photos for a free hair transplant analysis."
              className="inline-flex items-center justify-center gap-2"
            >
              <span style={{ background: "#25D366", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <MessageCircle size={16} /> WhatsApp Us
              </span>
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* ── 2. GALLERY — immediately below the hero ────────────── */}
      <section style={{ background: "#F4F8FB", padding: "48px 20px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <BeforeAfterGallery photos={GALLERY_PHOTOS} />
        </div>
      </section>

      {/* ── 3. MID CTA BAND ─────────────────────────────────────── */}
      <section style={{ background: "#053980", padding: "44px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "clamp(16px,2.4vw,20px)", fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.5 }}>
            Wondering what your result could look like? Send us 4 photos of your hair — we&apos;ll review your case for free and reply within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={scrollToForm}
              style={{ background: "#fff", color: "#053980", padding: "13px 26px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}
            >
              Get Your Free Hair Analysis
            </button>
            <WhatsAppLink message="Hi, I'd like to send 4 photos of my hair for a free analysis.">
              <span style={{ background: "#25D366", color: "#fff", padding: "13px 26px", borderRadius: 8, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <MessageCircle size={15} /> WhatsApp
              </span>
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* ── 4. RECOVERY TIMELINE ────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "72px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Recovery</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#053980", marginBottom: 10 }}>What to Expect After Your Transplant</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {recoveryTimeline.map((r) => (
              <div key={r.val} style={{ background: "#F4F8FB", borderRadius: 10, padding: 20, textAlign: "center", borderTop: "3px solid #5788AC" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#053980", marginBottom: 6 }}>{r.val}</div>
                <div style={{ fontSize: 12, color: "#6B7C8D" }}>{r.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#F4F8FB", border: "1px solid rgba(87,136,172,0.18)", borderRadius: 12, padding: "24px 28px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#053980", marginBottom: 8 }}>When will I see final results?</h3>
            <p style={{ fontSize: 14, color: "#6B7C8D", lineHeight: 1.7 }}>{faqs[1].a}</p>
          </div>
        </div>
      </section>

      {/* ── 5. PACKAGES TEASER ──────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "72px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>All-Inclusive Packages</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#053980", marginBottom: 10 }}>Get Results Like These</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {packages.filter((p) => p.name !== "Exclusive Package").map((pkg) => (
              <div key={pkg.name} style={{ background: "#fff", borderRadius: 16, border: pkg.highlight ? "2px solid #5788AC" : "1px solid rgba(87,136,172,0.18)", overflow: "hidden" }}>
                <div style={{ padding: "26px 24px 20px", background: pkg.highlight ? "#053980" : "#fff" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: pkg.highlight ? "#fff" : "#053980", marginBottom: 10 }}>{pkg.name}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: pkg.highlight ? "#fff" : "#053980" }}>
                    <sup style={{ fontSize: 18, fontWeight: 600, verticalAlign: "super" }}>€</sup>{pkg.price}
                  </div>
                  <div style={{ fontSize: 12, color: pkg.highlight ? "rgba(255,255,255,0.6)" : "#6B7C8D", marginTop: 6 }}>{pkg.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 32 }}>
            <Link
              href="/hair-transplant-packages"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#053980", color: "#fff", borderRadius: 100, padding: "13px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              See Full Package Details <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. REVIEWS ───────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "72px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>Patient Reviews</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#053980", marginBottom: 10 }}>What Our Patients Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((r) => (
              <div key={r.name} style={{ background: "#F4F8FB", border: "1px solid rgba(87,136,172,0.15)", borderRadius: 16, padding: 24 }}>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 15 }}>★</span>)}
                </div>
                <p style={{ fontSize: 13, color: "#1A2A3A", lineHeight: 1.7, marginBottom: 16 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#053980" }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#6B7C8D", marginTop: 2 }}>{r.source}</div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 28 }}>
            <a href="https://www.trustpilot.com/review/medicalcenterturkey.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: "#5788AC" }}>
              See all reviews on Trustpilot →
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. WHY MCT ───────────────────────────────────────────── */}
      <section style={{ background: "#053980", padding: "72px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#A3C6CF", marginBottom: 14 }}>Why Us</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>Why Patients Choose Medical Center Turkey</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_MCT_CARDS.map((item) => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "22px 20px" }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────── */}
      <section style={{ background: "#F4F8FB", padding: "72px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#5788AC", marginBottom: 14 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#053980" }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(87,136,172,0.15)", borderRadius: 10, overflow: "hidden" }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                  style={{ padding: "16px 20px", cursor: "pointer", background: "none", border: "none" }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#053980" }}>{faq.q}</span>
                  <span style={{ fontSize: 20, color: "#5788AC", transform: faqOpen === i ? "rotate(45deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: "0 20px 16px", fontSize: 13, color: "#6B7C8D", lineHeight: 1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CONSULTATION FORM ─────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #053980, #031e46)", padding: "72px 20px" }}>
        <div id="consultation" style={{ maxWidth: 560, margin: "0 auto", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", scrollMarginTop: 80 }}>
          <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Get Your Free Hair Analysis</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>We&apos;ll respond within 48 hours</div>
          </div>
          {succeeded ? (
            <FormSuccessMessage variant="dark" name={form.name} email={form.email} />
          ) : (
            <form style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Full Name *</label>
                  <input type="text" placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={() => markTouched("name")}
                    style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none" }} />
                  <FieldError variant="dark" message={fieldError("name")} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Country *</label>
                  <CountrySelect variant="dark" value={form.country} onChange={(v) => setForm({ ...form, country: v })} onBlur={() => markTouched("country")} />
                  <FieldError variant="dark" message={fieldError("country")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Email Address *</label>
                  <input type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => markTouched("email")}
                    style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none" }} />
                  <FieldError variant="dark" message={fieldError("email")} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>WhatsApp / Phone *</label>
                  <PhoneInput variant="dark" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} onBlur={() => markTouched("phone")} />
                  <FieldError variant="dark" message={fieldError("phone")} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Which package are you interested in?</label>
                <select value={form.pkg} onChange={(e) => setForm({ ...form, pkg: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none" }}>
                  <option value="" style={{ color: "#000" }}>Select a package...</option>
                  <option value="Premium Package — From €1,550" style={{ color: "#000" }}>Premium Package — From €1,550</option>
                  <option value="Gold Package — From €1,840" style={{ color: "#000" }}>Gold Package — From €1,840</option>
                  <option value="Hassle-Free Package — From €1,940" style={{ color: "#000" }}>Hassle-Free Package — From €1,940</option>
                  <option value="Exclusive Package — From €3,500" style={{ color: "#000" }}>Exclusive Package — From €3,500</option>
                  <option value="Not sure yet" style={{ color: "#000" }}>Not sure yet</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "block", marginBottom: 6 }}>Your Message (optional)</label>
                <textarea rows={3} placeholder="Tell us about your hair loss situation..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none", resize: "vertical" }} />
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: "#1ab3c8", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                  I agree to Medical Center Turkey&apos;s{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>Terms and Conditions</a>
                  , I have read the{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>Privacy Policy</a>
                  {" "}and I agree that my given details including health data may be processed by Medical Center Turkey for the purpose of obtaining quotes.
                </span>
              </label>
              {error && <p style={{ fontSize: 12, color: "#fca5a5", fontWeight: 600 }}>{error}</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={handleWhatsApp} disabled={!agreed || submitting}
                  style={{ flex: 1, background: "#25D366", color: "#fff", padding: "14px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: agreed ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: agreed ? 1 : 0.4 }}>
                  <MessageCircle size={16} /> {submitting ? "Sending..." : "Send via WhatsApp"}
                </button>
                <button type="button" onClick={handleEmail} disabled={submitting || !agreed}
                  style={{ flex: 1, background: "#2884C0", color: "#fff", padding: "14px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: agreed ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: agreed ? 1 : 0.4 }}>
                  <Send size={16} /> {submitting ? "Sending..." : "Send My Consultation Request"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>No commitment required · No spam · We reply within 48 hours</p>
            </form>
          )}
        </div>
      </section>

      {/* ── 10. BACKGROUND ARTICLE ──────────────────────────────── */}
      <section style={{ background: "#fff", padding: "64px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#053980", marginBottom: 20 }}>Hair Transplant in Turkey — Background</h2>
          <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }} className="space-y-4">
            <p>
              Hair transplantation is a surgical procedure that restores thinning or shed hair using a graft taken from the back of the head — an area naturally resistant to hair loss — and transferred to the area that needs it. It&apos;s a common procedure for people affected by hair loss due to genetics, age, or other causes, regardless of age range.
            </p>
            <p>
              Turkey has become a leading destination for hair restoration thanks to experienced surgeons, modern medical facilities, and consistently high-quality standards across the industry. Patients travel from around the world for natural-looking results at a fraction of the cost of the UK or USA, with advantages that include:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5">
              <li>Experienced surgeons</li>
              <li>Advanced medical facilities</li>
              <li>Cost-effective treatment</li>
              <li>Natural-looking results</li>
              <li>Quick recovery</li>
              <li>High patient satisfaction</li>
            </ul>
            <p>
              Medical Center Turkey coordinates every part of the journey — from your first consultation through surgery, hotel, transfers, and aftercare — with a dedicated English-speaking coordinator by your side throughout your stay in Istanbul. Every procedure is backed by a warranty certificate, and we work exclusively with hospitals and clinics approved by the Turkish Ministry of Health.
            </p>
            <p>
              If you have more questions, see our full{" "}
              <Link href="/frequently-asked-questions-in-hair-transplant" style={{ color: "#5788AC", textDecoration: "underline" }}>
                hair transplant FAQ
              </Link>
              , or send us your photos above for a free, no-commitment hair analysis.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
