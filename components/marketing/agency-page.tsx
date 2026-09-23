"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_EMAILS } from "@/lib/admin";
import { TREATMENTS } from "@/lib/constants";

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#fff",
  outline: "none",
  width: "100%",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.8)",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  display: "block",
  marginBottom: 6,
};

const PARTNER_TYPES = [
  "Medical Tourism Agency",
  "Doctor",
  "Clinic",
  "Hospital",
  "Healthcare Consultant",
  "Patient Referral Partner",
  "Travel Agency",
  "Corporate Healthcare Partner",
  "Other",
];

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  partner_type: string;
  partner_type_other: string;
  company_name: string;
  website: string;
  social_media: string;
  company_address: string;
  years_in_business: string;
  markets: string;
  monthly_patients: string;
  treatments_interest: string[];
  business_description: string;
  how_heard: string;
  consent: boolean;
};

const defaultForm: FormData = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  partner_type: "",
  partner_type_other: "",
  company_name: "",
  website: "",
  social_media: "",
  company_address: "",
  years_in_business: "",
  markets: "",
  monthly_patients: "",
  treatments_interest: [],
  business_description: "",
  how_heard: "",
  consent: false,
};

function ApplicationForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const errorRef = React.useRef<HTMLDivElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === "consent") {
        setForm((f) => ({ ...f, consent: checked }));
      } else {
        // treatment checkboxes
        setForm((f) => {
          const next = checked
            ? [...f.treatments_interest, value]
            : f.treatments_interest.filter((t) => t !== value);
          return { ...f, treatments_interest: next };
        });
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setSubmitError("Please accept the Terms & Conditions and Privacy Policy to submit your application.");
      document.getElementById("consent-checkbox")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          city: form.city || undefined,
          partner_type: form.partner_type,
          partner_type_other: form.partner_type_other || undefined,
          company_name: form.company_name,
          website: form.website || undefined,
          social_media: form.social_media || undefined,
          company_address: form.company_address || undefined,
          years_in_business: form.years_in_business || undefined,
          markets: form.markets || undefined,
          monthly_patients: form.monthly_patients,
          treatments_interest: form.treatments_interest,
          business_description: form.business_description,
          how_heard: form.how_heard || undefined,
        }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setSubmitError("Something went wrong. Please try again.");
        setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } finally {
      setSubmitting(false);
    }
  }

  const sectionTitle = (text: string) => (
    <div
      style={{
        color: "#1ab3c8",
        fontWeight: 700,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 16,
        marginTop: 28,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        paddingBottom: 8,
      }}
    >
      {text}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ paddingBottom: 32 }}>
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 24,
          padding: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
        Partner Application
      </div>
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 8 }}>
        All fields marked with * are required.
      </div>

      {/* Section 1: Personal */}
      {sectionTitle("01 — Personal Information")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Full Name *</label>
          <input style={inputStyle} name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Your full name" />
        </div>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@company.com" />
        </div>
        <div>
          <label style={labelStyle}>WhatsApp / Phone *</label>
          <input style={inputStyle} type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+1 234 567 8900" />
        </div>
        <div>
          <label style={labelStyle}>Country *</label>
          <input style={inputStyle} name="country" value={form.country} onChange={handleChange} required placeholder="e.g. United Kingdom" />
        </div>
        <div>
          <label style={labelStyle}>City</label>
          <input style={inputStyle} name="city" value={form.city} onChange={handleChange} placeholder="e.g. London" />
        </div>
      </div>

      {/* Section 2: Partnership Type */}
      {sectionTitle("02 — Partnership Type")}
      <div>
        <label style={labelStyle}>Partner Type *</label>
        <select style={inputStyle} name="partner_type" value={form.partner_type} onChange={handleChange} required>
          <option value="">Select partner type...</option>
          {PARTNER_TYPES.map((t) => (
            <option key={t} value={t} style={{ background: "#0d2d52" }}>
              {t}
            </option>
          ))}
        </select>
      </div>
      {form.partner_type === "Other" && (
        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Please describe your business</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            name="partner_type_other"
            value={form.partner_type_other}
            onChange={handleChange}
            placeholder="Describe your business type..."
          />
        </div>
      )}

      {/* Section 3: Business Information */}
      {sectionTitle("03 — Business Information")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Company / Organization Name *</label>
          <input style={inputStyle} name="company_name" value={form.company_name} onChange={handleChange} required placeholder="Your company name" />
        </div>
        <div>
          <label style={labelStyle}>Website</label>
          <input style={inputStyle} type="text" name="website" value={form.website} onChange={handleChange} placeholder="https://yourcompany.com" />
        </div>
        <div>
          <label style={labelStyle}>Instagram / Social Media</label>
          <input style={inputStyle} name="social_media" value={form.social_media} onChange={handleChange} placeholder="@handle or URL" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Company Address</label>
          <input style={inputStyle} name="company_address" value={form.company_address} onChange={handleChange} placeholder="Street, City, Country" />
        </div>
        <div>
          <label style={labelStyle}>Years in Business</label>
          <select style={inputStyle} name="years_in_business" value={form.years_in_business} onChange={handleChange}>
            <option value="">Select...</option>
            {["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map((y) => (
              <option key={y} value={y} style={{ background: "#0d2d52" }}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Main Countries / Markets</label>
          <input style={inputStyle} name="markets" value={form.markets} onChange={handleChange} placeholder="e.g. United Kingdom, Germany, USA" />
        </div>
      </div>

      {/* Section 4: Patient Activity */}
      {sectionTitle("04 — Patient Activity")}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Patient Volume per Month *</label>
        <select style={inputStyle} name="monthly_patients" value={form.monthly_patients} onChange={handleChange} required>
          <option value="">Select volume...</option>
          {["1–5", "6–10", "11–25", "26–50", "50+", "Not currently referring patients"].map((v) => (
            <option key={v} value={v} style={{ background: "#0d2d52" }}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Treatments of Interest *</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 8,
          }}
        >
          {TREATMENTS.map((t) => (
            <label
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "rgba(255,255,255,0.75)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="treatments_interest"
                value={t}
                checked={form.treatments_interest.includes(t)}
                onChange={handleChange}
                style={{ accentColor: "#1ab3c8", width: 15, height: 15 }}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      {/* Section 5: About Your Business */}
      {sectionTitle("05 — About Your Business")}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Business Description *</label>
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
          name="business_description"
          value={form.business_description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Tell us about your business, your clients, and why you'd like to partner with Medical Center Turkey..."
        />
      </div>
      <div>
        <label style={labelStyle}>How did you hear about MCT?</label>
        <select style={inputStyle} name="how_heard" value={form.how_heard} onChange={handleChange}>
          <option value="">Select...</option>
          {["Google", "Social Media", "Existing Partner", "Patient Recommendation", "Event/Conference", "MCT Team", "Other"].map((h) => (
            <option key={h} value={h} style={{ background: "#0d2d52" }}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Consent */}
      <div style={{ marginTop: 24, marginBottom: 20 }}>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            lineHeight: 1.6,
            cursor: "pointer",
          }}
        >
          <input
            id="consent-checkbox"
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
            style={{ accentColor: "#1ab3c8", width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
          />
          <span>
            I confirm that the information provided in this application is accurate and I acknowledge the Medical Center Turkey{" "}
            <Link href="/privacy-policy" target="_blank" style={{ color: "#1ab3c8", textDecoration: "underline" }}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" target="_blank" style={{ color: "#1ab3c8", textDecoration: "underline" }}>
              Terms &amp; Conditions
            </Link>.
          </span>
        </label>
      </div>

      {submitError && (
        <div
          ref={errorRef}
          style={{
            background: "rgba(239,68,68,0.2)",
            border: "1px solid rgba(239,68,68,0.5)",
            borderRadius: 10,
            padding: "14px 18px",
            color: "#fca5a5",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          ⚠️ {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          background: submitting ? "rgba(255,255,255,0.3)" : "#fff",
          color: submitting ? "rgba(255,255,255,0.5)" : "#1b5fa8",
          border: "none",
          borderRadius: 999,
          padding: "15px 24px",
          fontSize: 15,
          fontWeight: 700,
          cursor: submitting ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {submitting ? "Submitting..." : "Submit Partner Application"}
      </button>
    </form>
  );
}

function LeftPanel() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  function handleSuccess() {
    setSubmitted(true);
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      ref={panelRef}
      style={{
        background: "linear-gradient(160deg, #0d2d52 0%, #1b5fa8 60%, #1ab3c8 100%)",
        minHeight: "calc(100vh - 80px)",
        height: "100%",
        overflowY: "auto",
        padding: "56px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      className="order-2 md:order-1"
    >
      <div style={{ maxWidth: 520 }}>
        {/* Success state */}
        {submitted && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(26,179,200,0.2)",
                border: "2px solid #1ab3c8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1ab3c8" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>
              Application Received
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              Thank you for applying to become a Medical Center Turkey Partner. Our team will review your application and get back to you within 2–3 business days.
            </div>
            <Link
              href="/"
              style={{
                display: "inline-block",
                background: "#fff",
                color: "#1b5fa8",
                borderRadius: 999,
                padding: "13px 32px",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Return to Medical Center Turkey
            </Link>
          </div>
        )}

        {/* Application form */}
        {showForm && !submitted && (
          <ApplicationForm onBack={() => setShowForm(false)} onSuccess={handleSuccess} />
        )}

        {/* Landing state */}
        {!showForm && !submitted && (
          <>
            <div
              style={{
                color: "#1ab3c8",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 16,
              }}
            >
              MCT Partner Program
            </div>
            <h1
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Refer. Track. Earn. Grow.
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 17,
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              You bring the patient. We coordinate Türkiye.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 14,
                lineHeight: 1.75,
                marginBottom: 36,
              }}
            >
              Join the Medical Center Turkey Partner Network and connect your patients with trusted healthcare providers in Türkiye. Our international patient team coordinates the entire journey — from initial consultation and hospital coordination to accommodation, airport transfers, and aftercare — so you can focus on what you do best: growing your business.
            </p>

            {/* Benefits */}
            <div style={{ marginBottom: 40 }}>
              {[
                "Dedicated Partner Manager",
                "Patient Referral Tracking",
                "Access to Healthcare Provider Network",
                "International Patient Support in Türkiye",
                "Partner Earnings (eligible partners earn referral commissions)",
              ].map((benefit) => (
                <div
                  key={benefit}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 12,
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <svg
                    style={{ flexShrink: 0, marginTop: 1 }}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1ab3c8"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {benefit}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "#fff",
                color: "#1b5fa8",
                border: "none",
                borderRadius: 999,
                padding: "15px 36px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-block",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.92")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Apply to Become a Partner
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function RightPanel() {
  const router = useRouter();
  const supabase = createClient();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error || !data.user) {
      setLoginError("Invalid email or password. Please try again.");
      setLoginLoading(false);
      return;
    }

    if (ADMIN_EMAILS.includes(data.user.email ?? "")) {
      router.push("/admin/partner-applications");
      return;
    }

    // partners has RLS enabled with no client-readable policies — the status
    // check has to go through a server route using the service role key.
    let statusJson: { found?: boolean; status?: string } = {};
    try {
      const res = await fetch("/api/partner-portal/status");
      statusJson = await res.json();
    } catch {
      setLoginError("Network error. Please try again.");
      await supabase.auth.signOut();
      setLoginLoading(false);
      return;
    }

    if (!statusJson.found) {
      setLoginError(
        "No partner account found. Contact Medical Center Turkey at hello@medicalcenterturkey.com"
      );
      await supabase.auth.signOut();
      setLoginLoading(false);
      return;
    }

    if (statusJson.status === "suspended") {
      setLoginError(
        "Your Partner Portal access is currently unavailable. Please contact Medical Center Turkey."
      );
      await supabase.auth.signOut();
      setLoginLoading(false);
      return;
    }

    router.push("/partner-portal");
  }

  async function handleForgotPassword() {
    if (!loginEmail) {
      setLoginError("Please enter your email address first.");
      return;
    }
    setLoginError("");
    // redirectTo just needs to stay on the Redirect URLs allow-list — the
    // actual link sent is built by the "Reset password" email template from
    // {{ .TokenHash }} (see app/auth/confirm/route.ts), not from this value.
    await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: (process.env.NEXT_PUBLIC_APP_URL || "https://medicalcenterturkey.com") + "/partner-portal/set-password",
    });
    setForgotSent(true);
  }

  return (
    <div
      className="order-1 md:order-2"
      style={{
        background: "#fff",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 48px",
      }}
    >
      <div style={{ maxWidth: 380, margin: "0 auto", width: "100%" }}>
        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <Image src="/mct_logo.png" alt="Medical Center Turkey" width={160} height={44} priority />
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0d2d52", marginBottom: 4 }}>
          Partner Login
        </h2>
        <p style={{ color: "#4b5563", fontSize: 15, marginBottom: 4, fontWeight: 500 }}>
          Welcome back.
        </p>
        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
          Access your Medical Center Turkey Partner Portal to manage referrals and track patient journeys.
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Remember me */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#1b5fa8", width: 15, height: 15 }}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: "none",
                border: "none",
                color: "#6b7280",
                fontSize: 12,
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Forgot your password?
            </button>
          </div>

          {forgotSent && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                color: "#166534",
                marginBottom: 14,
              }}
            >
              Password reset email sent. Please check your inbox.
            </div>
          )}

          {loginError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                color: "#b91c1c",
                marginBottom: 14,
              }}
            >
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-brand text-white rounded-full py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Secure Access
          </span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Security note */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <svg
            style={{ flexShrink: 0, marginTop: 2, color: "#1b5fa8" }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
          </svg>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0d2d52", marginBottom: 3 }}>
              Secure Partner Access
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
              Your data is protected. By accessing this portal you agree to our{" "}
              <Link href="/privacy-policy" style={{ color: "#1b5fa8", textDecoration: "underline" }}>
                Privacy Policy
              </Link>.
            </div>
          </div>
        </div>

        <p style={{ marginTop: 20, fontSize: 11, color: "#9ca3af", lineHeight: 1.6, textAlign: "center" }}>
          Partner access is available only to approved Medical Center Turkey partners.
        </p>
      </div>
    </div>
  );
}

export function AgencyPageClient() {
  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      {/* Left — 55% on desktop, full width on mobile */}
      <div className="w-full md:w-[55%]">
        <LeftPanel />
      </div>
      {/* Right — 45% on desktop, full width on mobile */}
      <div className="w-full md:w-[45%]">
        <RightPanel />
      </div>
    </div>
  );
}
