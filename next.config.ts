import type { NextConfig } from "next";

// Security headers (production only; dev needs eval for fast refresh).
// The site is static, so per-request nonces are not available and inline scripts stay allowed
// (theme bootstrap, Next's RSC payload). The policy's job is to stop data leaving the page:
// every fetch/beacon/image/font may only go to this origin — except /admin, which may also
// talk to api.github.com (the career store). A leaked admin token therefore has no place to be sent.
function csp(connect: string) {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connect}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const common = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Root AGENTS.md is reserved for the project contract (see devpack AGENT/AGENTS.md), not Next boilerplate.
  agentRules: false,
  poweredByHeader: false,
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      // Order matters: the later, more specific rule wins for /admin.
      { source: "/:path*", headers: [...common, { key: "Content-Security-Policy", value: csp("'self'") }] },
      {
        source: "/admin",
        headers: [
          ...common,
          { key: "Content-Security-Policy", value: csp("'self' https://api.github.com") },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
