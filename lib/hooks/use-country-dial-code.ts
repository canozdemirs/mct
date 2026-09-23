"use client";

import { useEffect, useRef } from "react";
import { COUNTRY_DIAL_CODES } from "@/lib/constants";

// Watches `country`; whenever it changes, pre-fills `phone` with that
// country's dial code — but only if the phone field is still empty or still
// holds exactly the previously auto-filled code, so it never overwrites
// something the user actually typed.
export function useCountryDialCode(country: string, phone: string, setPhone: (value: string) => void) {
  const lastAutoFilled = useRef("");

  useEffect(() => {
    const dialCode = COUNTRY_DIAL_CODES[country];
    if (!dialCode) return;

    if (phone.trim() === "" || phone === lastAutoFilled.current) {
      const next = `${dialCode} `;
      lastAutoFilled.current = next;
      setPhone(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);
}
