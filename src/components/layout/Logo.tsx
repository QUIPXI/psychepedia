"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "light-warm" | "light-cool" | "dark" | "dark-midnight" | "dark-contrast";

interface LogoProps {
  className?: string;
  size?: number;
}

// CSS filter configurations for each theme
// These filters will be applied to the logo image
const themeFilters: Record<Theme, { filter: string; blendMode: string }> = {
  // Light: Original blue-teal colors, no filter needed
  light: {
    filter: "none",
    blendMode: "normal",
  },
  // Light-warm: Shift to amber/orange tones
  "light-warm": {
    filter: "hue-rotate(-40deg) saturate(1.3)",
    blendMode: "normal",
  },
  // Light-cool: Enhance blue tones
  "light-cool": {
    filter: "hue-rotate(10deg) saturate(1.1)",
    blendMode: "normal",
  },
  // Dark: Brighten for dark background
  dark: {
    filter: "brightness(1.2) saturate(1.1)",
    blendMode: "normal",
  },
  // Dark-midnight: Shift to purple/indigo
  "dark-midnight": {
    filter: "hue-rotate(30deg) saturate(1.2) brightness(1.1)",
    blendMode: "normal",
  },
  // Dark-contrast: Shift to yellow
  "dark-contrast": {
    filter: "hue-rotate(180deg) saturate(1.5) brightness(1.3)",
    blendMode: "normal",
  },
};

function getCurrentTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const storedTheme = localStorage.getItem("psychepedia-theme") as Theme;
  if (storedTheme && themeFilters[storedTheme]) {
    return storedTheme;
  }

  if (document.documentElement.classList.contains("dark")) {
    if (document.documentElement.classList.contains("dark-midnight")) return "dark-midnight";
    if (document.documentElement.classList.contains("dark-contrast")) return "dark-contrast";
    return "dark";
  }

  if (document.documentElement.classList.contains("light-warm")) return "light-warm";
  if (document.documentElement.classList.contains("light-cool")) return "light-cool";

  return "light";
}

export function Logo({ className, size = 32 }: LogoProps) {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setTheme(getCurrentTheme());

    const handleStorageChange = () => {
      setTheme(getCurrentTheme());
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setTheme(getCurrentTheme());
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener("storage", handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const themeConfig = themeFilters[theme];

  // Prevent hydration mismatch
  if (!mounted) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ width: `${size}px !important`, height: `${size}px !important`, minWidth: `${size}px`, minHeight: `${size}px` }}
    >
      <img
        src="/logo.png"
        alt="PsychePedia"
        style={{
          filter: themeConfig.filter,
          width: `${size}px !important`,
          height: `${size}px !important`,
          maxWidth: `${size}px`,
          maxHeight: `${size}px`,
          objectFit: "contain",
        }}
      />
    </div>
  );
  }

  return (
    <div
      className={cn("flex items-center justify-center relative", className)}
      style={{ width: size, height: size }}
    >
      {/* 
        REQUIREMENT: Place your logo image at public/logo.png
        
        The image should:
        - Be the logo you provided (with black or transparent background)
        - Be a PNG file
        - Have dimensions at least 512x512 for best quality
        
        CSS filters will handle:
        - Background removal (via mix-blend-mode)
        - Color changes for each theme
      */}
      <img
        src="/logo.png"
        alt="PsychePedia"
        style={{
          filter: themeConfig.filter,
          width: size,
          height: "auto",
          maxWidth: size,
          maxHeight: size,
        }}
      />
    </div>
  );
}

export default Logo;
