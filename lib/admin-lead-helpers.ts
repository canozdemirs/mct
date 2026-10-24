import type { SupabaseClient } from "@supabase/supabase-js";
import { isValidEmail } from "@/lib/validation";
import { LEAD_SOURCE_OPTIONS, COUNTRY_DIAL_CODES } from "@/lib/constants";

// Shared by both POST /api/admin/leads/manual (create) and
// PATCH /api/admin/leads/[id] (edit) so the two can never validate or
// de-duplicate leads differently.

export function normalizeDigits(value: string) {
  return value.replace(/[^0-9]/g, "");
}

const DIAL_CODE_DIGITS = new Set(Object.values(COUNTRY_DIAL_CODES).map((code) => normalizeDigits(code)));

// 2026-10-24 follow-up: useCountryDialCode (lib/hooks/use-country-dial-
// code.ts) pre-fills the phone field with "<dial code> " the moment a
// country is picked -- e.g. "+93 " for Afghanistan. A patient with no
// phone, only an email, left that autofill untouched, and the old code
// treated "+93" as a typed-but-invalid phone number ("Please enter a
// valid phone number.") instead of recognizing nothing real had been
// entered. Anything that reduces to just a known calling code (or is
// blank, or just a bare "+") counts as no phone at all -- not run
// through format validation, not written to the database, not used for
// duplicate matching.
export function isPhoneEffectivelyEmpty(phone: string): boolean {
  const trimmed = phone.trim();
  if (trimmed === "" || trimmed === "+") return true;
  const digits = normalizeDigits(phone);
  if (digits === "") return true;
  return DIAL_CODE_DIGITS.has(digits);
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
// one is required to actually reach them.
//
// 2026-10-24 follow-up: there used to be an extra rule requiring a phone
// number specifically for the "WhatsApp"/"Phone" sources (on the
// reasoning that those channels imply phone is the only contact method),
// enforced via LEAD_SOURCES_REQUIRING_PHONE. Removed per report: a staff
// member reached a patient over WhatsApp/phone but the patient only gave
// an email, and saving that patient was blocked outright with no way
// around it. The source describes HOW staff reached the patient, not
// what contact info exists on file, so it should never gate this.
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

  const phoneEmpty = isPhoneEffectivelyEmpty(fields.phone);
  const hasPhone = !phoneEmpty && normalizeDigits(fields.phone).length >= 7;
  const hasEmail = !!fields.email && isValidEmail(fields.email);

  if (!phoneEmpty && !hasPhone) {
    return "Please enter a valid phone number.";
  }
  if (fields.email && !hasEmail) {
    return "Please enter a valid email address.";
  }
  if (!hasPhone && !hasEmail) {
    return "Enter at least a phone number or an email.";
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
  const phoneTail = isPhoneEffectivelyEmpty(phone) ? "" : normalizeDigits(phone).slice(-10);

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
