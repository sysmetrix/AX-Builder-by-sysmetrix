"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function YouthIntro() {
  useEffect(() => {
    const root = document.documentElement;
    const key = "axb-youth-intro-seen";
    try {
      if (sessionStorage.getItem(key) === "1") root.dataset.intro = "seen";
      else sessionStorage.setItem(key, "1");
    } catch { /* animation remains a safe fallback */ }
    const timeout = window.setTimeout(() => { root.dataset.intro = "seen"; }, 900);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="hero youth-hero" aria-labelledby="youth-hero-title">
      <div className="hero-brand fade">
        <BrandMark motion="connect" className="mark-hero" />
        <span><b>Youth Worker</b><small>by sysmetrix</small></span>
      </div>
      <p className="mono fade">Youth Work × Programs × Policy × Data</p>
      <h1 id="youth-hero-title" className="display youth-display">
        <span className="ln">더 나은 청소년 현장을 위한</span>{" "}
        <span className="ln"><em>사업과 시스템</em>을 만듭니다.</span>
      </h1>
      <div className="cols">
        <p>청소년 현장과 사업에서 출발해 프로그램을 기획하고 운영하며, 정책·성과·데이터·AX를 연결해 현장의 문제를 해결합니다.</p>
        <div className="hero-paths">
          <ul aria-label="Youth Worker 주요 관점">
            <li><span>Field & Programs</span><small>청소년 현장과 사업</small></li>
            <li><span>Policy & Evaluation</span><small>정책·성과·평가</small></li>
            <li><span>Systems for Practice</span><small>현장을 돕는 시스템</small></li>
          </ul>
          <Link className="primary-cta" href="#youth-work">현장 작업 살펴보기 ↓</Link>
        </div>
      </div>
    </section>
  );
}
