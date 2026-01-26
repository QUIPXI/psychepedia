"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { Locale, locales, localeNames } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    // Remove current locale from path and add new one
    const segments = pathname.split("/").filter(Boolean);

    // Check if first segment is a locale
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newPath = `/${segments.join("/")}`;
    setIsOpen(false);
    router.push(newPath);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted ${isOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="Switch language"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
      </button>

      <div
        className={`absolute end-0 top-full mt-1 py-1 bg-card border border-border rounded-md shadow-lg transition-all duration-200 min-w-[120px] z-50 ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
          }`}
      >
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`w-full px-4 py-2 text-sm text-start hover:bg-muted transition-colors ${loc === locale ? "text-primary font-medium" : "text-foreground"
              }`}
          >
            {localeNames[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}
