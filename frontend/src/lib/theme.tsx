import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "platewise_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (saved === "light" || saved === "dark" || saved === "system") {
          return saved;
        }
      } catch {}
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      if (document.documentElement.classList.contains("dark")) {
        return "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let activeTheme: "light" | "dark";
      if (theme === "system") {
        activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        activeTheme = theme;
      }

      setResolvedTheme(activeTheme);

      if (activeTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();

    // Listen for OS color scheme changes when system mode is active
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {}
    }
  };

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback for components rendered outside ThemeProvider
    return {
      theme: "light",
      resolvedTheme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}

export function ThemeToggleButton({
  className = "",
  showLabel = false,
}: {
  className?: string | undefined;
  showLabel?: boolean | undefined;
}) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-xs transition hover:bg-neutral-50 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 active:scale-95 ${className}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-teal-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">{isDark ? "Light" : "Dark"}</span>
      )}
    </button>
  );
}
