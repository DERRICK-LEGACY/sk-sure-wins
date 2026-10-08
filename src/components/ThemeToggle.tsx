"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-foreground shadow-sm transition-all hover:scale-105 hover:bg-card-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary backdrop-blur-md"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-[#D4AF37]" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-slate-300" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
