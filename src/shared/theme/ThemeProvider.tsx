// src/shared/theme/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);
const KEY = "app_theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement; // <html>
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(KEY);
  if (saved === "dark" || saved === "light") return saved;
  // optional: theo hệ điều hành
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(KEY, t);
    applyTheme(t);
  };

  const toggle = () => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(KEY, next);
      applyTheme(next);
      return next;
    });
  };

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme phải dùng trong ThemeProvider");
  return ctx;
}
