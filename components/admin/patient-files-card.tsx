"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type SignedFile = { name: string; path: string; url: string | null };

// Partner-referral files stay read-only here (the partner's own upload
// form is where those come from); passing `leadId` additionally renders
// an upload control for MCT-direct patients, since there's no
// patient-facing form for those -- an admin is the only one who ever
// adds them, via app/api/admin/leads/[id]/files/route.ts.
export function PatientFilesCard({ files, leadId }: { files: SignedFile[]; leadId?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file: File) {
    if (!leadId) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/admin/leads/${leadId}/files`, { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Failed to upload file.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(path: string) {
    if (!leadId) return;
    if (!confirm("Remove this file?")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/files?path=${encodeURIComponent(path)}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Failed to remove file.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div className="text-xs font-bold text-teal uppercase tracking-widest">Files</div>
        {leadId && (
          <label className="text-xs font-semibold text-brand cursor-pointer hover:underline">
            {uploading ? "Uploading..." : "+ Upload"}
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              disabled={uploading || files.length >= 5}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
      {files.length === 0 ? (
        <p className="text-sm text-gray-400">No files uploaded.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={f.path} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm">
              <span className="text-gray-700 truncate">{f.name}</span>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                {f.url ? (
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold hover:underline">
                    View
                  </a>
                ) : (
                  <span className="text-gray-300">Unavailable</span>
                )}
                {leadId && (
                  <button type="button" onClick={() => handleRemove(f.path)} className="text-red-500 hover:underline">
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
