"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Highlight {
    id: string;
    text: string;
    color: string;
    articleId: string;
    sectionTitle: string;
    paragraphIndex: number;
    createdAt: number;
}

interface HighlightContextType {
    highlights: Highlight[];
    isHighlightEnabled: boolean;
    setIsHighlightEnabled: (enabled: boolean) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    addHighlight: (articleId: string, text: string, color: string, sectionTitle?: string, paragraphIndex?: number) => void;
    removeHighlight: (id: string) => void;
    clearHighlights: (articleId: string) => void;
    getHighlights: (articleId: string, sectionTitle?: string, paragraphIndex?: number) => Highlight[];
    selectedText: string | null;
    setSelectedText: (text: string | null) => void;
}

const HIGHLIGHT_COLORS = [
    { name: "yellow", hex: "#FEF08A", borderHex: "#EAB308" },
    { name: "green", hex: "#BBF7D0", borderHex: "#22C55E" },
    { name: "blue", hex: "#BFDBFE", borderHex: "#3B82F6" },
    { name: "pink", hex: "#FBCFE8", borderHex: "#EC4899" },
    { name: "purple", hex: "#DDD6FE", borderHex: "#8B5CF6" },
];

const DEFAULT_COLOR = HIGHLIGHT_COLORS[0].hex;

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export function HighlightProvider({ children }: { children: ReactNode }) {
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isHighlightEnabled, setIsHighlightEnabled] = useState(false);
    const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load highlights from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("psychepedia_highlights");
        if (saved) {
            try {
                setHighlights(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse highlights", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save highlights to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("psychepedia_highlights", JSON.stringify(highlights));
        }
    }, [highlights, isLoaded]);

    const addHighlight = (articleId: string, text: string, color: string, sectionTitle: string = "", paragraphIndex: number = 0) => {
        if (!text.trim()) return;

        // Check if this exact text already exists for this article, section, and paragraph
        const existingIndex = highlights.findIndex(
            (h) => h.articleId === articleId && 
                  h.sectionTitle === sectionTitle && 
                  h.paragraphIndex === paragraphIndex &&
                  h.text.toLowerCase() === text.trim().toLowerCase()
        );

        if (existingIndex >= 0) {
            // Update existing highlight's color
            const updated = [...highlights];
            updated[existingIndex] = {
                ...updated[existingIndex],
                color: color,
            };
            setHighlights(updated);
        } else {
            // Add new highlight with context
            const highlight: Highlight = {
                id: crypto.randomUUID(),
                text: text.trim(),
                color,
                articleId,
                sectionTitle,
                paragraphIndex,
                createdAt: Date.now(),
            };
            setHighlights((prev) => [highlight, ...prev]);
        }

        setSelectedText(null);
    };

    const removeHighlight = (id: string) => {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
    };

    const clearHighlights = (articleId: string) => {
        setHighlights((prev) => prev.filter((h) => h.articleId !== articleId));
    };

    const getHighlights = (articleId: string, sectionTitle?: string, paragraphIndex?: number) => {
        return highlights.filter((h) => {
            if (h.articleId !== articleId) return false;
            if (sectionTitle && h.sectionTitle !== sectionTitle) return false;
            if (paragraphIndex !== undefined && h.paragraphIndex !== paragraphIndex) return false;
            return true;
        });
    };

    return (
        <HighlightContext.Provider
            value={{
                highlights,
                isHighlightEnabled,
                setIsHighlightEnabled,
                selectedColor,
                setSelectedColor,
                addHighlight,
                removeHighlight,
                clearHighlights,
                getHighlights,
                selectedText,
                setSelectedText,
            }}
        >
            {children}
        </HighlightContext.Provider>
    );
}

export function useHighlights() {
    const context = useContext(HighlightContext);
    if (context === undefined) {
        throw new Error("useHighlights must be used within a HighlightProvider");
    }
    return context;
}

export { HIGHLIGHT_COLORS };
