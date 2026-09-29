"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const themeColors: Record<Theme, string> = { dark: "#0c0c0b", light: "#f1ede3" };

function syncThemeColor(theme: Theme) {
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", themeColors[theme]);
}

function currentTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === "dark" || attr === "light") return attr;
  // dark is always the default; light is opt-in only
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const initial = currentTheme();
    setTheme(initial);
    syncThemeColor(initial);
  }, []);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    syncThemeColor(next);
    setTheme(next);
    try {
      localStorage.setItem("axb-theme", next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "라이트로 보기" : theme === "light" ? "다크로 보기" : "테마 전환"}
    >
      <span aria-hidden="true">{theme === "dark" ? "라이트로 보기" : theme === "light" ? "다크로 보기" : "테마"}</span>
    </button>
  );
}
