"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "psychepedia_reading_positions";

interface ReadingPosition {
  scrollY: number;
  scrollPercent: number;
  sectionId?: string;
  timestamp: number;
  isFullVersion?: boolean;
}

interface ReadingPositionContextType {
  savePosition: (articleId: string, isFullVersion?: boolean) => void;
  getPosition: (articleId: string) => ReadingPosition | null;
  clearPosition: (articleId: string) => void;
  resumePosition: (articleId: string) => void;
  hasPosition: (articleId: string) => boolean;
}

const ReadingPositionContext = createContext<ReadingPositionContextType | undefined>(undefined);

export function ReadingPositionProvider({ children }: { children: React.ReactNode }) {
  const [positions, setPositions] = useState<Record<string, ReadingPosition>>({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPositions(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load reading positions:", e);
    }
  }, []);

  // Save to localStorage when positions change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
      } catch (e) {
        console.error("Failed to save reading positions:", e);
      }
    }
  }, [positions, mounted]);

  const savePosition = useCallback((articleId: string, isFullVersion?: boolean) => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0;

    // Find current section
    const sections = document.querySelectorAll("section[id]");
    let currentSectionId: string | undefined;
    
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150) {
        currentSectionId = section.id;
      }
    }

    // Don't save if at the very top or very bottom
    if (scrollPercent < 5 || scrollPercent > 95) {
      return;
    }

    setPositions(prev => ({
      ...prev,
      [articleId]: {
        scrollY,
        scrollPercent,
        sectionId: currentSectionId,
        timestamp: Date.now(),
        isFullVersion,
      },
    }));
  }, []);

  const getPosition = useCallback((articleId: string): ReadingPosition | null => {
    return positions[articleId] || null;
  }, [positions]);

  const clearPosition = useCallback((articleId: string) => {
    setPositions(prev => {
      const next = { ...prev };
      delete next[articleId];
      return next;
    });
  }, []);

  const resumePosition = useCallback((articleId: string) => {
    const pos = positions[articleId];
    if (pos) {
      window.scrollTo({ top: pos.scrollY, behavior: "smooth" });
    }
  }, [positions]);

  const hasPosition = useCallback((articleId: string): boolean => {
    return !!positions[articleId];
  }, [positions]);

  return (
    <ReadingPositionContext.Provider
      value={{
        savePosition,
        getPosition,
        clearPosition,
        resumePosition,
        hasPosition,
      }}
    >
      {children}
    </ReadingPositionContext.Provider>
  );
}

export function useReadingPosition() {
  const context = useContext(ReadingPositionContext);
  if (context === undefined) {
    throw new Error("useReadingPosition must be used within a ReadingPositionProvider");
  }
  return context;
}
