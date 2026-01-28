"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useHighlights, HIGHLIGHT_COLORS } from "@/context/HighlightContext";
import { Button } from "@/components/ui/button";
import { Highlighter, X } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface HighlightToolbarProps {
    articleId: string;
}

export function HighlightToolbar({ articleId }: HighlightToolbarProps) {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const { selectedColor, setSelectedColor, addHighlight, selectedText, setSelectedText, isHighlightEnabled } = useHighlights();

    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [hasSelection, setHasSelection] = useState(false);

    // Handle text selection
    const handleSelectionChange = useCallback(() => {
        if (!isHighlightEnabled) {
            setPosition(null);
            setHasSelection(false);
            return;
        }

        const selection = window.getSelection();

        // Check if we have a valid selection within the document
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.startContainer;
            
            // Check if selection is in an editable area or proper content
            if (!container.textContent) {
                if (hasSelection) {
                    setHasSelection(false);
                    setPosition(null);
                }
                return;
            }

            const selectionStr = selection.toString().trim();

            // Only proceed if we have actual text selected
            if (selectionStr.length > 0) {
                setSelectedText(selectionStr);
                setHasSelection(true);

                // Get the bounding rect of the selection
                try {
                    const rect = range.getBoundingClientRect();

                    // Calculate toolbar position above the selection
                    setPosition({
                        top: rect.top - 48, // Position above the selection
                        left: rect.left + (rect.width / 2) - 100, // Center horizontally
                    });
                } catch (e) {
                    // Fallback if we can't get the range
                    setPosition(null);
                }
            } else if (hasSelection) {
                // Clear selection when no text is selected
                setHasSelection(false);
                setPosition(null);
            }
        } else if (hasSelection) {
            // No valid range - clear selection
            setHasSelection(false);
            setPosition(null);
        }
    }, [isHighlightEnabled, hasSelection, setSelectedText]);

    // Set up selection change listener
    useEffect(() => {
        if (!isHighlightEnabled) return;

        // Use a timeout to debounce rapid selection changes
        let timeoutId: NodeJS.Timeout | null = null;

        const handleChange = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // Slightly longer timeout for smoother selection experience
            timeoutId = setTimeout(() => {
                handleSelectionChange();
            }, 50);
        };

        document.addEventListener("selectionchange", handleChange);

        return () => {
            document.removeEventListener("selectionchange", handleChange);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isHighlightEnabled, handleSelectionChange]);

    // Clear selection and hide toolbar
    const handleClearSelection = useCallback(() => {
        setSelectedText(null);
        setHasSelection(false);
        setPosition(null);
        window.getSelection()?.removeAllRanges();
    }, [setSelectedText]);

    // Apply highlight with selected color
    const handleHighlight = useCallback((color: string) => {
        if (selectedText) {
            // Strip ** markers if present (user selected bold text)
            const cleanText = selectedText.replace(/\*\*/g, '').trim();
            if (cleanText) {
                // Find the section and paragraph context from the selection
                const selection = window.getSelection();
                let sectionTitle = "";
                let paragraphIndex = 0;

                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const node = range.startContainer;

                    // Find the closest section and paragraph
                    const sectionEl = node.parentElement?.closest('section');
                    const paragraphEl = node.parentElement?.closest('p, li');

                    if (sectionEl) {
                        const heading = sectionEl.querySelector('h2');
                        sectionTitle = heading?.textContent || "";
                    }

                    if (paragraphEl) {
                        const parentSection = paragraphEl.closest('section');
                        if (parentSection) {
                            const paragraphs = parentSection.querySelectorAll('p, li');
                            for (let i = 0; i < paragraphs.length; i++) {
                                if (paragraphs[i] === paragraphEl) {
                                    paragraphIndex = i;
                                    break;
                                }
                            }
                        }
                    }
                }

                addHighlight(articleId, cleanText, color, sectionTitle, paragraphIndex);
            }
            handleClearSelection();
        }
    }, [articleId, selectedText, addHighlight, handleClearSelection]);

    // Don't render if highlight mode is disabled
    if (!isHighlightEnabled) return null;

    // Show hint when no selection
    if (!hasSelection || !position) {
        return (
            <div
                className="fixed top-20 z-50 bg-background rounded-lg shadow-lg border p-2 flex items-center gap-2"
                style={{
                    [isRtl ? "right" : "left"]: "1rem",
                }}
            >
                <Highlighter className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground mr-2">
                    {isRtl ? "حدد نصاً للتظليل" : "Select text to highlight"}
                </span>
            </div>
        );
    }

    // Show color picker when selection exists
    return (
        <>
            {/* Color picker toolbar */}
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
                        className={cn(
                            "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                            selectedColor === color.hex ? "border-foreground scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                    />
                ))}

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleClearSelection}
                    title={isRtl ? "إلغاء" : "Cancel"}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </>
    );
}
