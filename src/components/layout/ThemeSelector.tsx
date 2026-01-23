"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";

type Theme = "light" | "light-warm" | "light-cool" | "dark" | "dark-midnight" | "dark-contrast";

const themeConfig: { id: Theme; labelKey: string; icon: React.ReactNode }[] = [
  { id: "light", labelKey: "light", icon: <Sun className="h-4 w-4" /> },
  { id: "light-warm", labelKey: "warm", icon: <Sun className="h-4 w-4 text-orange-500" /> },
  { id: "light-cool", labelKey: "cool", icon: <Sun className="h-4 w-4 text-blue-500" /> },
  { id: "dark", labelKey: "dark", icon: <Moon className="h-4 w-4" /> },
  { id: "dark-midnight", labelKey: "midnight", icon: <Moon className="h-4 w-4 text-indigo-400" /> },
  { id: "dark-contrast", labelKey: "contrast", icon: <Moon className="h-4 w-4" /> },
];

export function ThemeSelector() {
  const t = useTranslations("theme");
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<Theme>("light");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Initialize theme from localStorage or system preference
    const storedTheme = localStorage.getItem("psychepedia-theme") as Theme;
    if (storedTheme && themeConfig.some(t => t.id === storedTheme)) {
      setTheme(storedTheme);
    } else {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }

    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("psychepedia-theme", theme);

    // Reset classes
    document.documentElement.classList.remove("dark", "light-warm", "light-cool", "dark-midnight", "dark-contrast");

    // Add classes
    if (theme === "light") {
      // Default light, no extra class needed
    } else if (theme === "light-warm") {
      document.documentElement.classList.add("light-warm");
    } else if (theme === "light-cool") {
      document.documentElement.classList.add("light-cool");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "dark-midnight") {
      document.documentElement.classList.add("dark", "dark-midnight");
    } else if (theme === "dark-contrast") {
      document.documentElement.classList.add("dark", "dark-contrast");
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("title")}
        className="relative"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 py-1 bg-card border border-border rounded-md shadow-lg min-w-[160px] z-50 animate-fade-in">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("title")}
          </div>
          {themeConfig.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={cn(
                "w-full px-4 py-2 text-sm text-start flex items-center gap-2 hover:bg-muted transition-colors",
                currentTheme === theme.id ? "text-primary font-medium bg-primary/5" : "text-foreground"
              )}
            >
              {theme.icon}
              {t(theme.labelKey as any)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
