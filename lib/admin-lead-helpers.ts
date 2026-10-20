import type { SupabaseClient } from "@supabase/supabase-js";
import { isValidEmail } from "@/lib/validation";
import { LEAD_SOURCE_OPTIONS, LEAD_SOURCES_REQUIRING_PHONE } from "@/lib/constants";

// Shared by both POST /api/admin/leads/manual (create) and
// PATCH /api/admin/leads/[id] (edit) so the two can never validate or
// de-duplicate leads differently.

export function normalizeDigits(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export type LeadContactFields = {
  source: string;
  name: string;
  phone: string;
  email: string;
};

// Returns an error message, or null if the fields are valid. Phone and
// email are both nullable on `leads` -- some patients only give one, or
// neither if they declined (hence "Unknown" in the form) -- but at least
// one is required to actually reach them, and WhatsApp/Phone-sourced
// leads specifically need a phone number since that's the only contact
// method those channels implies.
//
// `requireKnownSource` defaults to true for the manual-entry "Add new
// patient" flow, where the admin always picks from LEAD_SOURCE_OPTIONS.
// Editing an EXISTING lead (PATCH /api/admin/leads/[id]) passes false,
// since rows created by the public site's own forms carry free-text
// sources like "Consultation Form" or "Header Get Quote (/)" that were
// never meant to match this fixed list -- editing other fields on one of
// those leads must not be blocked by its pre-existing source value.
export function validateLeadContactFields(
  fields: LeadContactFields,
  requireKnownSource = true
): string | null {
  if (!fields.source) {
    return "Source is required.";
  }
  if (requireKnownSource && !LEAD_SOURCE_OPTIONS.includes(fields.source)) {
    return "Please select a valid source.";
  }
  if (!fields.name) {
    return "Please enter the patient's name.";
  }

  const hasPhone = normalizeDigits(fields.phone).length >= 7;
  const hasEmail = !!fields.email && isValidEmail(fields.email);

  if (fields.phone && !hasPhone) {
    return "Please enter a valid phone number.";
  }
  if (fields.email && !hasEmail) {
    return "Please enter a valid email address.";
  }
  if (LEAD_SOURCES_REQUIRING_PHONE.includes(fields.source) && !hasPhone) {
    return `Phone is required for the "${fields.source}" source.`;
  }
  if (!hasPhone && !hasEmail) {
    return "Please provide at least a phone number or an email address.";
  }

  return null;
}

type ExistingLeadRow = { id: string; name: string; phone: string | null; email: string | null; created_at: string };
export type DuplicateLead = { id: string; name: string; created_at: string };

// Matches on the last 10 digits of the phone number (tolerant of
// formatting/country-code differences) or an exact case-insensitive email
// match. `excludeId` lets an edit check for OTHER leads sharing this
// phone/email without flagging the record being edited as its own
// duplicate.
export async function findDuplicateLead(
  adminSupabase: SupabaseClient,
  phone: string,
  email: string,
  excludeId?: string
): Promise<DuplicateLead | null> {
  const phoneTail = normalizeDigits(phone).slice(-10);

  const [{ data: phoneCandidates }, { data: emailCandidates }] = await Promise.all([
    phoneTail.length >= 7
      ? adminSupabase.from("leads").select("id, name, phone, email, created_at").ilike("phone", `%${phoneTail}%`).limit(5)
      : Promise.resolve({ data: [] as ExistingLeadRow[] }),
    email
      ? adminSupabase.from("leads").select("id, name, phone, email, created_at").ilike("email", email).limit(5)
      : Promise.resolve({ data: [] as ExistingLeadRow[] }),
  ]);

  const candidates = [...(phoneCandidates ?? []), ...(emailCandidates ?? [])] as ExistingLeadRow[];
  const duplicate = candidates.find((c) => {
    if (c.id === excludeId) return false;
    const phoneMatch = !!c.phone && phoneTail.length >= 7 && normalizeDigits(c.phone).slice(-10) === phoneTail;
    const emailMatch = !!email && !!c.email && c.email.toLowerCase() === email.toLowerCase();
    return phoneMatch || emailMatch;
  });

  return duplicate ? { id: duplicate.id, name: duplicate.name, created_at: duplicate.created_at } : null;
}
