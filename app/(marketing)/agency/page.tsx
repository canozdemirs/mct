import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { AgencyPageClient } from "@/components/marketing/agency-page";

export const metadata: Metadata = {
  title: "Partner Login | Medical Center Turkey",
  description: "MCT Partner Program — Apply to become a Medical Center Turkey partner or log in to your partner portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AgencyPage() {
  return (
    <>
      <Nav />
      <AgencyPageClient />
    </>
  );
}
