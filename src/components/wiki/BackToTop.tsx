"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackToTopProps {
  locale?: string;
  threshold?: number;
}

export function BackToTop({ locale = "en", threshold = 300 }: BackToTopProps) {
  const [visible, setVisible] = React.useState(false);
  const isRtl = locale === "ar";

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 bg-background/95 backdrop-blur-sm border-2 hover:scale-110",
        isRtl ? "left-6" : "right-6",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label={isRtl ? "العودة للأعلى" : "Back to top"}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
