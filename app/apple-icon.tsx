import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0b",
          borderRadius: 36,
        }}
      >
        <svg width="148" height="104" viewBox="0 0 60 40" fill="none" strokeWidth="3.2">
          <path d="M3 37 L17 3 L31 37" stroke="#efece4" />
          <path d="M31 3 L57 37" stroke="#efece4" />
          <path d="M31 37 L57 3" stroke="#efece4" />
          <path d="M10 20 H44" stroke="#ef5b3a" />
        </svg>
      </div>
    ),
    size,
  );
}
