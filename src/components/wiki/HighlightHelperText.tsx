"use client";

import { useHighlights } from "@/context/HighlightContext";
import { useLocale } from "next-intl";

export function HighlightHelperText() {
    const { isHighlightEnabled } = useHighlights();

    if (!isHighlightEnabled) return null;

    return null; // Hidden - bold text highlighting now works seamlessly
}
