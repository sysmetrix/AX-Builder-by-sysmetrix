import { ImageResponse } from "next/og";

// Generation structure for the default social card (Latin-only: no Hangul font is bundled here).
// Working placeholder, not the final OG artwork. Served at /og and referenced from metadata ONLY
// when NEXT_PUBLIC_SITE_URL is set (the file-convention opengraph-image would bake in a wrong host).
export const dynamic = "force-static";

const ogSize = { width: 1200, height: 630 };

export function GET() {
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
        }}
      >
        <svg width="150" height="100" viewBox="0 0 60 40" fill="none" strokeWidth="3.2">
          <path d="M3 37 L17 3 L31 37" stroke="#efece4" />
          <path d="M31 3 L57 37" stroke="#efece4" />
          <path d="M31 37 L57 3" stroke="#efece4" />
          <path d="M10 20 H44" stroke="#ef5b3a" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3 }}>
            I build systems
          </div>
          <div style={{ fontSize: 92, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3, color: "#8b8981" }}>
            for better public work.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a8a59c" }}>AX Builder by sysmetrix</div>
      </div>
    ),
    ogSize,
  );
}
