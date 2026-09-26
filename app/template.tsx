import { ViewTransition } from "react";

/**
 * Route crossfade (~260ms, opacity only). Header/footer live in layout.tsx and do not participate.
 * Runs only where the View Transitions API exists; elsewhere navigation is a plain instant swap.
 * See ::view-transition rules in globals.css (disabled under prefers-reduced-motion).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
