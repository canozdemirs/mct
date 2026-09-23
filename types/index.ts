// Shared TypeScript types

export type ReferralStatus =
  | "new"
  | "contacted"
  | "consultation"
  | "treatment_planned"
  | "treatment_completed"
  | "cancelled_lost";

export const REFERRAL_STATUSES: ReferralStatus[] = [
  "new",
  "contacted",
  "consultation",
  "treatment_planned",
  "treatment_completed",
  "cancelled_lost",
];

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  new: "New",
  contacted: "Contacted",
  consultation: "Consultation",
  treatment_planned: "Treatment Planned",
  treatment_completed: "Treatment Completed",
  cancelled_lost: "Cancelled / Lost",
};

export type ReferralFile = {
  name: string;
  path: string;
  size: number;
  type: string;
};

export type Referral = {
  id: string;
  partner_id: string;
  patient_full_name: string;
  patient_country: string;
  patient_phone: string;
  patient_email: string | null;
  treatment: string;
  notes: string | null;
  patient_consent: boolean;
  files: ReferralFile[];
  status: ReferralStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

// As selected by the admin panel, joined with the owning partner.
export type ReferralWithPartner = Referral & {
  partner: {
    company_name: string | null;
    full_name: string | null;
    email: string | null;
  } | null;
};

export type InstitutionType = "mct_package" | "external_institution";

export const EXTERNAL_INSTITUTIONS = [
  "Memorial",
  "Acıbadem",
  "Koç Üniversitesi Hastanesi",
  "Amerikan Hastanesi",
  "Other",
];

export type Currency = "EUR" | "USD" | "GBP" | "TRY";

export const CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "TRY"];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  TRY: "₺",
};

export type CommissionStatus = "pending" | "paid" | "cancelled";
export type ReconciliationStatus = "none" | "needs_reconciliation" | "resolved";

const MCT_PACKAGE_RATE = 10;
const EXTERNAL_INSTITUTION_RATE = 50;

export function commissionRateFor(institutionType: InstitutionType): number {
  return institutionType === "mct_package" ? MCT_PACKAGE_RATE : EXTERNAL_INSTITUTION_RATE;
}

// Full record — admin only. Partners are only ever granted the columns in
// `CommissionPartnerView` below, enforced at the database column-grant level.
export type Commission = {
  id: string;
  referral_id: string;
  institution_type: InstitutionType;
  institution_name: string | null;
  net_amount: number;
  currency: Currency;
  commission_percentage: number;
  commission_amount: number;
  status: CommissionStatus;
  payment_date: string | null;
  cancelled_reason: string | null;
  reconciliation_status: ReconciliationStatus;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

// What a partner is ever allowed to see (matches the `commissions` column
// grant to the `authenticated` role — see supabase/migrations/commissions.sql).
export type CommissionPartnerView = {
  id: string;
  referral_id: string;
  commission_amount: number;
  currency: Currency;
  status: "pending" | "paid";
  payment_date: string | null;
};
