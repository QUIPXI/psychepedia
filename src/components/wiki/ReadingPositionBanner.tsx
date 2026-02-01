"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReadingPosition } from "@/context/ReadingPositionContext";
import { useTranslations } from "next-intl";

interface ReadingPositionBannerProps {
  articleId: string;
  locale?: string;
  domain?: string;
  topic?: string;
}

export function ReadingPositionBanner({ articleId, locale = "en", domain, topic }: ReadingPositionBannerProps) {
  const { getPosition, resumePosition, clearPosition, hasPosition, savePosition } = useReadingPosition();
  const [showBanner, setShowBanner] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("experiments.readingPosition");

  const isRtl = locale === "ar";
  const position = getPosition(articleId);

  // Show banner ONLY on initial mount if there's a saved position
  const hasCheckedPosition = React.useRef(false);
  React.useEffect(() => {
    // Only check once on mount, not on every position change
    if (!hasCheckedPosition.current && !dismissed) {
      hasCheckedPosition.current = true;
      if (hasPosition(articleId)) {
        // Small delay to let the page render first
        const timer = setTimeout(() => setShowBanner(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [articleId, dismissed]); // Removed hasPosition from dependencies

  // Auto-save position on scroll (debounced)
  React.useEffect(() => {
    const handleScroll = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        savePosition(articleId);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [articleId, savePosition]);

  const handleResume = () => {
    // If they were reading the full version, navigate to it with version=full
    if (position?.isFullVersion && domain && topic) {
      const currentPath = pathname || `/${locale}/wiki/${domain}/${topic}`;
      // Check if already on full version
      if (currentPath.includes("version=full")) {
        // Already on full version, just scroll
        resumePosition(articleId);
      } else {
        // Navigate to full version
        const separator = currentPath.includes("?") ? "&" : "?";
        const fullVersionUrl = `${currentPath}${separator}version=full`;
        router.push(fullVersionUrl);
      }
      setShowBanner(false);
    } else {
      // Regular resume on current page
      resumePosition(articleId);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    clearPosition(articleId);
  };

  if (!showBanner || !position) {
    return null;
  }

  const timeAgo = getTimeAgo(position.timestamp, locale);

  return (
    <div
      className={cn(
        "fixed bottom-20 z-40 mx-4 max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300",
        isRtl ? "left-4" : "right-4"
      )}
    >
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {t("title")}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {t("complete", { percent: position.scrollPercent })} • {getTimeAgo(position.timestamp, locale)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleResume}
            className="h-8"
          >
            {t("resume")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number, locale: string): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const t = (key: string, params?: Record<string, number>) => {
    const translations: Record<string, string> = {
      justNow: locale === "ar" ? "الآن" : "just now",
      minutesAgo: locale === "ar" ? "منذ {minutes} دقيقة" : "{minutes}m ago",
      hoursAgo: locale === "ar" ? "منذ {hours} ساعة" : "{hours}h ago",
      daysAgo: locale === "ar" ? "منذ {days} يوم" : "{days}d ago",
    };
    const template = translations[key] || key;
    if (params) {
      return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] || ""));
    }
    return template;
  };

  if (seconds < 60) {
    return t("justNow");
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return t("minutesAgo", { minutes });
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return t("hoursAgo", { hours });
  }
  
  const days = Math.floor(hours / 24);
  return t("daysAgo", { days });
}
