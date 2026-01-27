"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Highlighter } from "lucide-react";
import { useHighlights } from "@/context/HighlightContext";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function HighlightToggle() {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const { isHighlightEnabled, setIsHighlightEnabled, getHighlights } = useHighlights();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHighlightEnabled(!isHighlightEnabled)}
            className={cn(
                "gap-1.5",
                isHighlightEnabled && "bg-primary/10 text-primary"
            )}
            title={isRtl
                ? (isHighlightEnabled ? "إيقاف التظليل" : "تفعيل التظليل")
                : (isHighlightEnabled ? "Disable highlight" : "Enable highlight")
            }
        >
            <Highlighter className={cn("h-4 w-4", isHighlightEnabled && "text-primary")} />
            <span className="hidden sm:inline">
                {isHighlightEnabled
                    ? (isRtl ? "إيقاف" : "Stop")
                    : (isRtl ? "تظليل" : "Highlight")}
            </span>
        </Button>
    );
}
