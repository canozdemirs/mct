import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SetPasswordForm } from "@/components/partner/set-password-form";
import { RequestNewLinkForm } from "@/components/partner/request-new-link-form";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>;
}) {
  const { error_description } = await searchParams;

  // The session, if any, was already established server-side by
  // /auth/confirm (via verifyOtp) and is present in cookies by the time this
  // page renders — no client-side token parsing needed.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-8 flex justify-center">
          <Image src="/mct_logo.png" alt="Medical Center Turkey" width={160} height={44} priority />
        </div>

        {user ? (
          <SetPasswordForm />
        ) : (
          <div className="text-center">
            <h1 className="text-lg font-bold text-brand-dark mb-2">Link Expired or Invalid</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              {error_description ||
                "This invitation or password reset link is no longer valid."}
            </p>
            <RequestNewLinkForm />
          </div>
        )}
      </div>
    </div>
  );
}
