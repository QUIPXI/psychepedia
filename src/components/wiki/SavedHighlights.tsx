"use client";

import React from "react";
import { useHighlights, HIGHLIGHT_COLORS } from "@/context/HighlightContext";
import { Button } from "@/components/ui/button";
import { Trash2, Highlighter, X } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface SavedHighlightsProps {
    articleId: string;
}

export function SavedHighlights({ articleId }: SavedHighlightsProps) {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const { getHighlights, removeHighlight, clearHighlights, isHighlightEnabled, setIsHighlightEnabled } = useHighlights();
    const [isOpen, setIsOpen] = React.useState(false);

    const highlights = getHighlights(articleId);
    const hasHighlights = highlights.length > 0;

    const getColorInfo = (colorHex: string) => {
        return HIGHLIGHT_COLORS.find((c) => c.hex === colorHex) || HIGHLIGHT_COLORS[0];
    };

    const handleClearAll = () => {
        if (confirm(isRtl ? "هل تريد حذف جميع التظليلات؟" : "Delete all highlights?")) {
            clearHighlights(articleId);
        }
    };

    const handleRemove = (id: string) => {
        removeHighlight(id);
    };

    const handleToggleHighlightMode = () => {
        setIsHighlightEnabled(!isHighlightEnabled);
        setIsOpen(false);
    };

    return (
        <>
            {/* Toggle Button */}
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    "fixed top-24 z-40 shadow-md bg-background/80 backdrop-blur-sm border-primary/20",
                    isHighlightEnabled && "bg-primary/10 border-primary",
                    isRtl ? "left-4" : "right-4"
                )}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isRtl ? "التظليلات" : "Highlights"}
            >
                <Highlighter className={`h-5 w-5 ${isHighlightEnabled ? "text-primary" : ""}`} />
                {highlights.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center border-2 border-background">
                        {highlights.length}
                    </span>
                )}
            </Button>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 z-50 w-80 bg-background/95 backdrop-blur shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-border",
                    isRtl ? "left-0 border-l-0 border-r" : "right-0",
                    isOpen ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Highlighter className="h-5 w-5" />
                            {isRtl ? "تظليلاتي" : "My Highlights"}
                        </h3>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Highlight Mode Toggle */}
                    <Button
                        className="w-full mb-4"
                        variant={isHighlightEnabled ? "default" : "outline"}
                        onClick={handleToggleHighlightMode}
                    >
                        <Highlighter className="w-4 h-4 mr-2" />
                        {isHighlightEnabled
                            ? (isRtl ? "إيقاف التظليل" : "Disable Highlight")
                            : (isRtl ? "تفعيل التظليل" : "Enable Highlight")}
                    </Button>

                    {/* Clear All Button */}
                    {hasHighlights && (
                        <div className="flex justify-end mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={handleClearAll}
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {isRtl ? "حذف الكل" : "Clear All"}
                            </Button>
                        </div>
                    )}

                    {/* Highlights List */}
                    <div className="flex-1 overflow-y-auto space-y-3 -mx-2 px-2">
                        {!hasHighlights ? (
                            <div className="text-center text-muted-foreground py-10">
                                <Highlighter className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">
                                    {isRtl
                                        ? "لا توجد تظليلات بعد. قم بتفعيل التظليل وتحديد النص."
                                        : "No highlights yet. Enable highlight mode and select text."}
                                </p>
                            </div>
                        ) : (
                            highlights.map((highlight) => {
                                const colorInfo = getColorInfo(highlight.color);
                                return (
                                    <div
                                        key={highlight.id}
                                        className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm group relative"
                                        style={{
                                            borderLeftWidth: "4px",
                                            borderLeftColor: colorInfo.borderHex,
                                            backgroundColor: `${highlight.color}20`,
                                        }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleRemove(highlight.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>

                                        <p className="text-sm italic pr-6">{highlight.text}</p>

                                        <span className="text-xs text-muted-foreground mt-2 block">
                                            {new Date(highlight.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
