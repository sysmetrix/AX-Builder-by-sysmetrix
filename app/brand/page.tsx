import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandLab } from "@/components/brand-lab";

// Working page for the Logo/Motion Gate — not part of the public site.
export const metadata: Metadata = { title: "Brand lab", robots: { index: false, follow: false } };

export default function BrandPage() {
  // Working page for the Logo/Motion Gate. Never shipped: 404 in production builds.
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="wrap">
      <header className="page-head">
        <p className="mono">Logo / Motion Gate · internal</p>
        <h1>AX mark, 락업, 모션 후보.</h1>
        <p className="lede">
          같은 구조(A와 X가 한 점을 공유)에서 4개의 mark와 3개의 모션을 비교합니다. 이 페이지는 검토용이며 공개 사이트에는 링크되지 않습니다.
        </p>
      </header>
      <BrandLab />
    </div>
  );
}
