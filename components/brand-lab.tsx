"use client";

import { useState } from "react";
import { BrandMark, type MarkMotion, type MarkVariant } from "./brand-mark";
import { Lockup } from "./lockup";

const marks: { id: MarkVariant; name: string; idea: string }[] = [
  { id: "shared", name: "M1 · Shared foot", idea: "A의 오른발과 X의 왼쪽 아래 끝이 한 점. 가로획은 A 안에 있습니다." },
  { id: "connector", name: "M2 · Connector bar", idea: "액센트 가로획이 A에서 X의 교차점까지 이어져 둘을 '연결'합니다. (업무 → 시스템)" },
  { id: "axis", name: "M3 · Axis", idea: "두 글자가 하나의 기준선(axis) 위에 서 있습니다." },
  { id: "frame", name: "M4 · Frame", idea: "뷰파인더/프레임 모서리로 'build'를 암시합니다. 가장 장식적입니다." },
];

const motions: { id: MarkMotion; name: string; idea: string; ms: string }[] = [
  { id: "draw", name: "Motion 1 · Draw", idea: "네 획이 순서대로 그려집니다.", ms: "850ms" },
  { id: "assemble", name: "Motion 2 · Assemble", idea: "A와 X가 양옆에서 다가와 맞물린 뒤 가로획이 그어집니다.", ms: "720ms" },
  { id: "connect", name: "Motion 3 · Connect", idea: "A·X가 나타나고 액센트 바가 A에서 X로 이어진 뒤, 워드마크 자간이 정착합니다.", ms: "750ms" },
];

const sizes = [16, 20, 24, 32, 48, 96];

export function BrandLab() {
  const [runs, setRuns] = useState<Record<string, number>>({});
  const [mv, setMv] = useState<MarkVariant>("connector");
  const replay = (id: string) => setRuns((r) => ({ ...r, [id]: (r[id] ?? 0) + 1 }));

  return (
    <>
      <section className="block" aria-labelledby="b-marks">
        <div className="sec-h"><h2 id="b-marks">1 · Mark 후보</h2><p>같은 구조, 다른 아이디어. 작은 크기에서는 획이 자동으로 굵어집니다.</p></div>
        <div className="brand-grid">
          {marks.map((m) => (
            <div key={m.id} className="brand-card">
              <div className="brand-stage scope-dark"><BrandMark variant={m.id} size={120} /></div>
              <div className="brand-stage scope-light"><BrandMark variant={m.id} size={120} /></div>
              <h3>{m.name}</h3>
              <p>{m.idea}</p>
              <div className="ladder scope-dark">
                {sizes.map((s) => <BrandMark key={s} variant={m.id} size={s} />)}
              </div>
              <div className="ladder scope-light">
                {sizes.map((s) => <BrandMark key={s} variant={m.id} size={s} />)}
              </div>
              <p className="mono">{sizes.join(" · ")} px</p>
            </div>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="b-lock">
        <div className="sec-h">
          <h2 id="b-lock">2 · 락업</h2>
          <p>
            Mark:{" "}
            {marks.map((m) => (
              <button key={m.id} type="button" className={`chip ${mv === m.id ? "on" : ""}`} onClick={() => setMv(m.id)} aria-pressed={mv === m.id}>
                {m.id}
              </button>
            ))}
          </p>
        </div>
        <div className="lock-grid">
          {(["scope-dark", "scope-light"] as const).map((scope) => (
            <div key={scope} className={`lock-panel ${scope}`}>
              <Lockup layout="horizontal" variant={mv} size={44} />
              <Lockup layout="stacked" variant={mv} size={64} />
              <Lockup layout="compact" variant={mv} size={32} />
            </div>
          ))}
        </div>
        <ul className="spec">
          <li><b>Clear space</b> — mark 높이의 ½ 이상을 사방에 비웁니다.</li>
          <li><b>최소 크기</b> — mark 단독 16px, 가로 락업 mark 24px(전체 폭 약 150px) 이상.</li>
          <li><b>이름 표기</b> — 항상 "AX Builder" 뒤에 "by sysmetrix"를 보조로. 한글 병기 락업은 만들지 않습니다.</li>
          <li><b>색</b> — 액센트 바는 항상 현재 테마의 액센트(다크 버밀리언 · 라이트 코발트). 다른 색 금지. 테마별 액센트는 통일할 수 없습니다: 버밀리언은 라이트 배경에서 2.88:1, 코발트는 다크 배경에서 2.77:1로 둘 다 3:1 미만입니다.</li>
          <li><b>금지</b> — 그라디언트, 그림자, 회전, 획 비율 변경.</li>
        </ul>
      </section>

      <section className="block" aria-labelledby="b-motion">
        <div className="sec-h"><h2 id="b-motion">3 · 모션 (1회 재생)</h2><p>선택한 mark({mv})로 재생됩니다. reduced-motion에서는 완성 상태로 즉시 표시됩니다.</p></div>
        <div className="motion-grid">
          {motions.map((m) => (
            <div key={m.id} className="brand-card">
              <div className="brand-stage scope-dark" key={`${m.id}-${runs[m.id] ?? 0}-${mv}`}>
                <Lockup layout="horizontal" variant={mv} motion={m.id} size={56} />
              </div>
              <h3>{m.name} <span className="mono">{m.ms}</span></h3>
              <p>{m.idea}</p>
              <button type="button" className="chip on" onClick={() => replay(m.id)}>▶ 다시 재생</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
