import { AdminNav } from "@/components/admin/admin-nav";

// Scoped to app/(dashboard)/admin/** only -- a sibling route segment to
// partner-portal within the (dashboard) route group, so this nav never
// renders for partner-portal pages.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
