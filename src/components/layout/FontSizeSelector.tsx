"use client";

import * as React from "react";
import { Type, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFontSize, FontSize } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface FontSizeSelectorProps {
  locale?: string;
  className?: string;
}

const sizes: FontSize[] = ["small", "medium", "large", "xlarge"];

export function FontSizeSelector({ locale = "en", className }: FontSizeSelectorProps) {
  const { fontSize, setFontSize, fontSizeLabels, mounted } = useFontSize();

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground w-8 text-center">
          <Type className="h-4 w-4 mx-auto" />
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const currentIndex = sizes.indexOf(fontSize);

  const decrease = () => {
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const increase = () => {
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const label = fontSizeLabels[fontSize][locale === "ar" ? "ar" : "en"];

  return (
    <div className={cn("flex items-center gap-1", className)} title={locale === "ar" ? "حجم الخط" : "Font Size"}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={decrease}
        disabled={currentIndex === 0}
        aria-label={locale === "ar" ? "تصغير الخط" : "Decrease font size"}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="text-xs text-muted-foreground min-w-[60px] text-center">
        {label}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={increase}
        disabled={currentIndex === sizes.length - 1}
        aria-label={locale === "ar" ? "تكبير الخط" : "Increase font size"}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
