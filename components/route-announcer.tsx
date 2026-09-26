"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Announces client-side page changes and moves focus past the persistent header. */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    const main = document.getElementById("main");
    const heading = main?.querySelector("h1")?.textContent?.trim();
    setMessage(heading ? `${heading} 페이지` : document.title);
    main?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
