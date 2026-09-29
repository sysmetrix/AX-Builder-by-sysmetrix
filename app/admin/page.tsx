import type { Metadata } from "next";
import { CareerAdmin } from "@/components/admin/career-admin";

// Owner-only editor. The page is public code with no data: everything is read from and written to
// GitHub with the owner's own token (see lib/github-store.ts). Never indexed.
export const metadata: Metadata = {
  title: "이력 관리",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="wrap">
      <CareerAdmin />
    </div>
  );
}
