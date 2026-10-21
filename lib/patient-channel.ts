// Single source of truth for the Patients list "Channel" value -- used
// both server-side (filtering, building the filter dropdown's option
// list) and client-side (display in leads-table.tsx). A partner-owned
// patient didn't arrive through any of these web channels at all; a
// WhatsApp/email-added one has no utm_source/referrer_domain on its own
// row (those only ever get set by the public form's insert), so it's
// detected from the `source` label instead (auto-filled to "WhatsApp"/
// "Email" by add-manual-lead-form.tsx's "Add from WhatsApp" lookup).
export function computePatientChannel(lead: {
  owner_type: "mct" | "partner";
  source: string;
  utm_source?: string | null;
  referrer_domain?: string | null;
}): string {
  if (lead.owner_type === "partner") return "Partner";
  const source = lead.source || "";
  if (/^whatsapp/i.test(source)) return "WhatsApp";
  if (/^email/i.test(source)) return "Email";
  if (lead.utm_source) return lead.utm_source;
  if (lead.referrer_domain) return lead.referrer_domain;
  return "Direct";
}
