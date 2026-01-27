"use client";

import React, { useEffect, useState } from "react";
import { useHighlights, HIGHLIGHT_COLORS } from "@/context/HighlightContext";
import { Button } from "@/components/ui/button";
import { Highlighter, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface HighlightToolbarProps {
    articleId: string;
}

export function HighlightToolbar({ articleId }: HighlightToolbarProps) {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const { selectedColor, setSelectedColor, addHighlight, selectedText, setSelectedText, getHighlights, removeHighlight, isHighlightEnabled, setIsHighlightEnabled } = useHighlights();
    const [position, setPosition] = useState({ top: 0, left: 0, visible: false });

    const existingHighlights = getHighlights(articleId);
    const hasSelectedText = selectedText && selectedText.trim().length > 0;

    useEffect(() => {
        if (!isHighlightEnabled) {
            setPosition((prev) => ({ ...prev, visible: false }));
            setSelectedText(null);
            window.getSelection()?.removeAllRanges();
            return;
        }

        const handleSelectionChange = () => {
            const selection = window.getSelection();

            if (selection && selection.toString().trim().length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                setSelectedText(selection.toString().trim());

                // Calculate toolbar position
                setPosition({
                    top: rect.top - 50,
                    left: rect.left + (rect.width / 2) - 100,
                    visible: true,
                });
            } else if (!hasSelectedText) {
                setPosition((prev) => ({ ...prev, visible: false }));
            }
        };

        document.addEventListener("selectionchange", handleSelectionChange);
        return () => document.removeEventListener("selectionchange", handleSelectionChange);
    }, [isHighlightEnabled, hasSelectedText, setSelectedText]);

    const handleHighlight = (color: string) => {
        if (selectedText) {
            addHighlight(articleId, selectedText, color);
        }
    };

    const handleClearSelection = () => {
        setSelectedText(null);
        window.getSelection()?.removeAllRanges();
    };

    // Don't render if highlight mode is disabled
    if (!isHighlightEnabled) return null;

    if (!position.visible) {
        return (
            <div
                className="fixed top-24 z-50 bg-background rounded-lg shadow-lg border p-2 flex items-center gap-2"
                style={{
                    [isRtl ? "right" : "left"]: "1rem",
                }}
            >
                <Highlighter className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground mr-2">
                    {isRtl ? "حدد نصاً للتظليل" : "Select text to highlight"}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsHighlightEnabled(false)}
                    className="ml-2"
                >
                    {isRtl ? "إلغاء" : "Cancel"}
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* Highlight Color Toolbar */}
            <div
                className="fixed z-50 bg-background rounded-lg shadow-lg border p-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
                style={{
                    top: Math.max(10, position.top),
                    left: isRtl ? undefined : Math.max(10, position.left),
                    right: isRtl ? Math.max(10, window.innerWidth - position.left - 200) : undefined,
                }}
            >
                <Highlighter className="w-4 h-4 text-muted-foreground" />

                {HIGHLIGHT_COLORS.map((color) => (
                    <button
                        key={color.name}
                        onClick={() => handleHighlight(color.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                            selectedColor === color.hex ? "border-foreground scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                    />
                ))}

                {hasSelectedText && (
                    <>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleClearSelection}
                            title={isRtl ? "إلغاء" : "Cancel"}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </>
                )}
            </div>

            {/* Selected text indicator */}
            {hasSelectedText && (
                <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={handleClearSelection}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
