"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RequestNewLinkForm() {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setSending(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/partner-portal/set-password`,
    });

    setSending(false);

    if (resetError) {
      setError(resetError.message || "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm text-center">
        If an account exists for that email, a new link has been sent. Please check your inbox.
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <p className="text-sm text-gray-500 mb-3 text-center">Enter your email to request a new link.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all"
        />
        {error && <p className="text-sm text-red-700 text-center">{error}</p>}
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-brand text-white rounded-full py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Me a New Link"}
        </button>
      </form>
    </div>
  );
}
