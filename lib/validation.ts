// Shared client + server validation for every lead form on the site, so
// "required" and "valid" mean exactly the same thing everywhere.

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Requires a leading "+" and 7-15 digits after it (E.164-ish). Spaces and
// dashes are allowed for readability but stripped before counting digits.
export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed.startsWith("+")) return false;
  const digits = trimmed.slice(1).replace(/[^0-9]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export type RequiredLeadFields = {
  name: string;
  email: string;
  phone: string;
  country: string;
};

export type LeadFieldErrors = Partial<Record<keyof RequiredLeadFields, string>>;

export function validateRequiredLeadFields(fields: RequiredLeadFields): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (!fields.name.trim()) {
    errors.name = "Please enter your full name.";
  }
  if (!fields.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!isValidEmail(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!isValidPhone(fields.phone)) {
    errors.phone = "Please enter a valid international phone number, starting with +.";
  }
  if (!fields.country.trim()) {
    errors.country = "Please select your country.";
  }

  return errors;
}
