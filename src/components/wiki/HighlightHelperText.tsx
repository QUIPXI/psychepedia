"use client";

import { useHighlights } from "@/context/HighlightContext";
import { useLocale } from "next-intl";

export function HighlightHelperText() {
    const { isHighlightEnabled } = useHighlights();
    const locale = useLocale();
    const isRtl = locale === "ar";

    if (!isHighlightEnabled) return null;

    return (
        <span className="text-xs text-muted-foreground ml-2">
            ({isRtl ? "النصوص الغامقة تحتاج لتظليل منفصل" : "Bold texts need to be highlighted separately"})
        </span>
    );
}
