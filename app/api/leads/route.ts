import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const ADMIN_RECIPIENT = "hello@medicalcenterturkey.com";
const WHATSAPP_LINK = "https://wa.me/908508888911";

// Best-effort in-memory rate limiting. This resets on cold start and isn't
// shared across serverless instances — acceptable for blocking a bot
// hammering the same warm instance, not a substitute for a real rate
// limiter, but keeps things dependency-free per the "no new env vars" ask.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function brandEmailShell(bodyHtml: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">
            <tr>
              <td style="background:linear-gradient(135deg,#0d2d52,#1b5fa8);padding:28px 40px;text-align:center;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.02em;">Medical Center Turkey</span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 40px;background-color:#f9fafb;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:11px;">
                  Medical Center Turkey &middot; International Patient Center
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

type LeadPayload = {
  source: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  treatment?: string;
  message?: string;
  details?: Record<string, unknown>;
  page_url?: string;
  consent?: boolean;
};

function buildAdminEmail(lead: LeadPayload & { id: string }) {
  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Email", lead.email || "—"],
    ["Phone / WhatsApp", lead.phone || "—"],
    ["Country", lead.country || "—"],
    ["Treatment", lead.treatment || "—"],
    ["Source", lead.source],
    ["Page", lead.page_url || "—"],
    ["Consent", lead.consent ? "Yes" : "No"],
  ];

  const detailsEntries = Object.entries(lead.details || {}).filter(([, v]) => v !== undefined && v !== "");

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:14px;">${escapeHtml(String(value))}</td>
        </tr>`
    )
    .join("");

  const detailsHtml =
    detailsEntries.length > 0
      ? `
        <h3 style="margin:24px 0 8px;color:#0d2d52;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Calculator / Extra Details</h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${detailsEntries
            .map(
              ([key, value]) => `
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;white-space:nowrap;">${escapeHtml(humanizeKey(key))}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:14px;">${escapeHtml(String(value))}</td>
              </tr>`
            )
            .join("")}
        </table>`
      : "";

  const messageHtml = lead.message
    ? `
      <h3 style="margin:24px 0 8px;color:#0d2d52;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Message</h3>
      <p style="margin:0;color:#1f2937;font-size:14px;line-height:1.6;white-space:pre-line;">${escapeHtml(lead.message)}</p>`
    : "";

  const html = brandEmailShell(`
    <p style="margin:0 0 4px;color:#1ab3c8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">New Lead</p>
    <h1 style="margin:0 0 20px;color:#0d2d52;font-size:20px;font-weight:800;">${escapeHtml(lead.treatment || "General Inquiry")} — ${escapeHtml(lead.name)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${rowsHtml}
    </table>
    ${detailsHtml}
    ${messageHtml}
    <p style="margin:24px 0 0;color:#9ca3af;font-size:11px;">Lead ID: ${escapeHtml(lead.id)}</p>
  `);

  const text = [
    `New Lead: ${lead.treatment || "General Inquiry"} — ${lead.name} (${lead.country || "unknown country"})`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    detailsEntries.length > 0 ? "Calculator / Extra Details:" : "",
    ...detailsEntries.map(([key, value]) => `  ${humanizeKey(key)}: ${value}`),
    "",
    lead.message ? `Message:\n${lead.message}` : "",
    "",
    `Lead ID: ${lead.id}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    subject: `New Lead: ${lead.treatment || "General Inquiry"} — ${lead.name} (${lead.country || "Unknown"})`,
    text,
    html,
  };
}

function buildPatientEmail(name: string) {
  const html = brandEmailShell(`
    <p style="margin:0 0 4px;color:#1ab3c8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Thank You</p>
    <h1 style="margin:0 0 20px;color:#0d2d52;font-size:20px;font-weight:800;">We've Received Your Request</h1>
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      Thank you for reaching out to Medical Center Turkey. We've received your request and one of our
      patient coordinators will get back to you within 48 hours.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px;">
      <tr>
        <td style="border-radius:999px;background-color:#25D366;">
          <a href="${WHATSAPP_LINK}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:999px;">
            Message Us on WhatsApp
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;line-height:1.6;">
      If you didn't submit this request, you can safely ignore this email.
    </p>
  `);

  const text = [
    `Hi ${name},`,
    "",
    "Thank you for reaching out to Medical Center Turkey. We've received your request and one of our patient coordinators will get back to you within 48 hours.",
    "",
    `Message us on WhatsApp: ${WHATSAPP_LINK}`,
    "",
    "If you didn't submit this request, you can safely ignore this email.",
  ].join("\n");

  return {
    subject: "We've Received Your Request — Medical Center Turkey",
    text,
    html,
  };
}

export async function POST(req: NextRequest) {
  let body: LeadPayload & { website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot — bots tend to fill every field. Respond success without doing
  // anything real, so the bot doesn't learn it was detected.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const source = (body.source || "").trim();

  if (!source || !name) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json({ error: "Please provide an email or a phone number." }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: inserted, error: insertError } = await adminSupabase
    .from("leads")
    .insert({
      source,
      name,
      email: email || null,
      phone: phone || null,
      country: body.country || null,
      treatment: body.treatment || null,
      message: body.message || null,
      details: body.details || {},
      page_url: body.page_url || null,
      consent: !!body.consent,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("Lead insert error:", insertError);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Emails are best-effort from here — a failure must never undo the saved lead.
  try {
    const adminEmail = buildAdminEmail({ ...body, source, name, email, phone, id: inserted.id });
    await sendEmail({
      to: ADMIN_RECIPIENT,
      subject: adminEmail.subject,
      text: adminEmail.text,
      html: adminEmail.html,
      replyTo: email || undefined,
    });

    if (email) {
      const patientEmail = buildPatientEmail(name);
      await sendEmail({ to: email, subject: patientEmail.subject, text: patientEmail.text, html: patientEmail.html });
    }
  } catch (err) {
    console.error("Lead email send exception:", err);
  }

  return NextResponse.json({ ok: true, id: inserted.id });
}
