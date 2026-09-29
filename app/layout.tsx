import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { RouteAnnouncer } from "@/components/route-announcer";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { indexable, ogImages, siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  // Public canonical/social URLs are emitted only when the URL and indexing opt-in are both configured (see lib/site.ts).
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: siteName, template: `%s — ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: "website", siteName, locale: "ko_KR", title: siteName, description: siteDescription, url: indexable ? siteUrl : undefined, images: ogImages },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription, images: ogImages },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: "#0c0c0b",
};

// Runs before first paint so a stored theme choice never flashes the wrong palette.
const themeInit = `try{var t=localStorage.getItem("axb-theme");if(t!=="light")t="dark";document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="light"?"#f1ede3":"#0c0c0b";if(sessionStorage.getItem("axb-intro-seen")==="1")document.documentElement.dataset.intro="seen"}catch(e){}`;

// The mono face is used only for small labels. Keep the exact locked typeface, but do not
// compete with the hero's Geist Sans preload on a cold connection.
const GeistMonoDeferred = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteJsonLd = indexable && siteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        inLanguage: ["ko", "en"],
      }
    : null;

  return (
    <html
      lang="ko"
      className={`${GeistSans.variable} ${GeistMonoDeferred.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {websiteJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
          />
        )}
        <a className="skip" href="#main">본문으로 건너뛰기</a>
        <SiteHeader />
        <RouteAnnouncer />
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
