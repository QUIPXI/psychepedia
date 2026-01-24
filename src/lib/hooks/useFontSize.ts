"use client";

import { useState, useEffect, useCallback } from "react";

export type FontSize = "small" | "medium" | "large" | "xlarge";

const FONT_SIZE_KEY = "psychepedia-font-size";

const fontSizeClasses: Record<FontSize, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  xlarge: "text-xl",
};

const fontSizeLabels: Record<FontSize, { en: string; ar: string }> = {
  small: { en: "Small", ar: "صغير" },
  medium: { en: "Medium", ar: "متوسط" },
  large: { en: "Large", ar: "كبير" },
  xlarge: { en: "Extra Large", ar: "كبير جداً" },
};

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
    if (saved && fontSizeClasses[saved]) {
      setFontSizeState(saved);
    }
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem(FONT_SIZE_KEY, size);
  }, []);

  return {
    fontSize,
    setFontSize,
    fontSizeClass: fontSizeClasses[fontSize],
    fontSizeLabels,
    mounted,
  };
}
