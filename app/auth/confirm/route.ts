import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_NEXT = "/partner-portal/set-password";

// Only ever redirect to an in-site path — never an absolute URL or a
// protocol-relative one (`//evil.com`), which would be an open redirect.
function isSafeNextPath(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next");
  const next = isSafeNextPath(rawNext) ? rawNext : DEFAULT_NEXT;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }

    console.error("verifyOtp failed:", { type, name: error.name, message: error.message, status: error.status });

    const failureUrl = new URL(DEFAULT_NEXT, origin);
    failureUrl.searchParams.set("error", error.name || "verification_failed");
    failureUrl.searchParams.set(
      "error_description",
      error.message || "This link is invalid or has expired."
    );
    return NextResponse.redirect(failureUrl);
  }

  const failureUrl = new URL(DEFAULT_NEXT, origin);
  failureUrl.searchParams.set("error", "missing_params");
  failureUrl.searchParams.set("error_description", "This link is missing required parameters.");
  return NextResponse.redirect(failureUrl);
}
