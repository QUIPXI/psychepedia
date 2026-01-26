"use client";

import { HighlightProvider } from "@/context/HighlightContext";
import { HighlightToolbar } from "@/components/wiki/HighlightToolbar";
import { SavedHighlights } from "@/components/wiki/SavedHighlights";
import { ReactNode } from "react";

interface ArticleHighlighterProps {
    children: ReactNode;
    articleId: string;
}

export function ArticleHighlighter({ children, articleId }: ArticleHighlighterProps) {
    return (
        <HighlightProvider>
            <HighlightToolbar articleId={articleId} />
            <SavedHighlights articleId={articleId} />
            {children}
        </HighlightProvider>
    );
}
