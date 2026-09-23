"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/agency");
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-brand hover:text-brand transition-colors"
    >
      Sign Out
    </button>
  );
}
