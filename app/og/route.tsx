import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";

// Served only from explicitly indexable metadata. Route copy comes from the site's own known titles.
const pretendard = readFile(
  new URL("../../node_modules/pretendard/dist/public/static/Pretendard-SemiBold.otf", import.meta.url),
).then((font) => font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength) as ArrayBuffer);

const ogSize = { width: 1200, height: 630 };

function clean(value: string | null, fallback: string, maxLength: number) {
  return (value?.replace(/\s+/g, " ").trim() || fallback).slice(0, maxLength);
}

export async function GET(request: NextRequest) {
  const title = clean(request.nextUrl.searchParams.get("title"), "I build systems for better public work.", 84);
  const eyebrow = clean(request.nextUrl.searchParams.get("eyebrow"), "AX Builder by sysmetrix", 64);
  const brandName = eyebrow.toLowerCase().includes("youth worker") ? "Youth Worker by sysmetrix" : "AX Builder by sysmetrix";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0c0c0b",
          color: "#efece4",
          fontFamily: "Pretendard",
        }}
      >
        <svg width="150" height="100" viewBox="0 0 60 40" fill="none" strokeWidth="3.2">
          <path d="M3 37 L17 3 L31 37" stroke="#efece4" />
          <path d="M31 3 L57 37" stroke="#efece4" />
          <path d="M31 37 L57 3" stroke="#efece4" />
          <path d="M10 20 H44" stroke="#ef5b3a" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 38 ? 70 : 84, fontWeight: 650, lineHeight: 1.12, letterSpacing: -2, maxWidth: 1040 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 28, color: "#a8a59c" }}>
          <span>{eyebrow}</span><span>{brandName}</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Pretendard", data: await pretendard, weight: 600, style: "normal" }] },
  );
}
