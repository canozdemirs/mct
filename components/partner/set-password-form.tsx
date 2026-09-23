"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/partner-portal/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok) {
        setSubmitting(false);
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
    } catch {
      setSubmitting(false);
      setError("Network error. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/partner-portal"), 1200);
  }

  if (success) {
    return (
      <div className="text-center">
        <h1 className="text-lg font-bold text-brand-dark mb-2">Password Set</h1>
        <p className="text-sm text-gray-500">Redirecting you to your Partner Portal...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-lg font-bold text-brand-dark mb-1 text-center">Set Your Password</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Choose a password to activate your Medical Center Turkey Partner account.
      </p>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all"
        />
      </div>

      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand text-white rounded-full py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Set Password & Continue"}
      </button>
    </form>
  );
}
