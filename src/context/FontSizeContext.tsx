"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type FontSize = "small" | "medium" | "large" | "xlarge";

const FONT_SIZE_KEY = "psychepedia-font-size";

export const fontSizeClasses: Record<FontSize, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  xlarge: "text-xl",
};

export const fontSizeLabels: Record<FontSize, { en: string; ar: string }> = {
  small: { en: "Small", ar: "صغير" },
  medium: { en: "Medium", ar: "متوسط" },
  large: { en: "Large", ar: "كبير" },
  xlarge: { en: "Extra Large", ar: "كبير جداً" },
};

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontSizeClass: string;
  fontSizeLabels: Record<FontSize, { en: string; ar: string }>;
  mounted: boolean;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
    if (saved && fontSizeClasses[saved]) {
      setFontSizeState(saved);
    }
  }, []);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem(FONT_SIZE_KEY, size);
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize,
        fontSizeClass: fontSizeClasses[fontSize],
        fontSizeLabels,
        mounted,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSizeContext() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSizeContext must be used within a FontSizeProvider");
  }
  return context;
}
