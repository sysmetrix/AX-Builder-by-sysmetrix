import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "페이지를 찾을 수 없습니다", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="wrap">
      <header className="page-head">
        <p className="mono">404</p>
        <h1>찾으시는 페이지가 없습니다.</h1>
        <Link className="more" href="/">홈으로 돌아가기 →</Link>
      </header>
    </div>
  );
}
