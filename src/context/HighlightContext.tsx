"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Highlight {
    id: string;
    text: string;
    color: string;
    articleId: string;
    createdAt: number;
}

interface HighlightContextType {
    highlights: Highlight[];
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    addHighlight: (articleId: string, text: string, color: string) => void;
    removeHighlight: (id: string) => void;
    clearHighlights: (articleId: string) => void;
    getHighlights: (articleId: string) => Highlight[];
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

    const addHighlight = (articleId: string, text: string, color: string) => {
        if (!text.trim()) return;

        const highlight: Highlight = {
            id: crypto.randomUUID(),
            text: text.trim(),
            color,
            articleId,
            createdAt: Date.now(),
        };

        setHighlights((prev) => [highlight, ...prev]);
        setSelectedText(null);
    };

    const removeHighlight = (id: string) => {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
    };

    const clearHighlights = (articleId: string) => {
        setHighlights((prev) => prev.filter((h) => h.articleId !== articleId));
    };

    const getHighlights = (articleId: string) => {
        return highlights.filter((h) => h.articleId === articleId);
    };

    return (
        <HighlightContext.Provider
            value={{
                highlights,
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
