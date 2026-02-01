"use client";

import * as React from "react";
import { BookOpen, FileText, List, ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollSpy, useScrollToHeading, useFontSize } from "@/lib/hooks";
import type { Article } from "@/lib/articles";
import { useHighlights } from "@/context/HighlightContext";
import { HIGHLIGHT_COLORS } from "@/context/HighlightContext";
import { useReadingPosition } from "@/context/ReadingPositionContext";
import Link from "next/link";

interface ArticleContentToggleProps {
  article: Article;
  shortLabel: string;
  fullLabel: string;
  readingFullText: string;
  readingShortText: string;
  minText: string;
  tocTitle?: string;
  locale?: string;
  domain?: string;
  topic?: string;
}

// Helper to convert section title to URL-friendly ID
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Table of Contents Component with Scroll Spy
function TableOfContents({
  sections,
  title,
  isRtl,
}: {
  sections: Article["sections"];
  title: string;
  isRtl: boolean;
}) {
  const headingIds = sections.map((s) => slugify(s.title));
  const activeId = useScrollSpy(headingIds);
  const scrollToHeading = useScrollToHeading();

  if (sections.length === 0) return null;

  return (
    <nav
      className={cn(
        "hidden lg:block sticky top-24 w-64 shrink-0 self-start",
        isRtl ? "ml-8" : "ml-8"
      )}
      aria-label="Table of contents"
    >
      <div className="p-4 rounded-lg border border-border bg-card">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
          <List className="h-4 w-4" />
          {title}
        </h2>
        <ul className="space-y-1 text-sm">
          {sections.map((section) => {
            const id = slugify(section.title);
            return (
              <li key={id}>
                  <button
                    onClick={() => scrollToHeading(id)}
                    className={cn(
                      "block w-full text-left py-1.5 px-2 rounded-md transition-colors hover:text-foreground hover:bg-muted/50",
                      activeId === id
                        ? isRtl 
                          ? "text-primary font-medium bg-primary/5 border-r-2 border-primary" 
                          : "text-primary font-medium bg-primary/5 border-l-2 border-primary"
                        : "text-muted-foreground"
                    )}
                >
                  {section.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

// Mobile TOC (collapsible)
function MobileTOC({
  sections,
  title,
}: {
  sections: Article["sections"];
  title: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollToHeading = useScrollToHeading();

  if (sections.length === 0) return null;

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full p-3 rounded-lg border border-border bg-card"
      >
        <List className="h-4 w-4" />
        {title}
        <span className="ml-auto text-xs">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-1 p-3 rounded-lg border border-border bg-card">
          {sections.map((section) => {
            const id = slugify(section.title);
            return (
              <li key={id}>
                <button
                  onClick={() => {
                    scrollToHeading(id);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-1.5 px-2 text-sm rounded-md transition-colors hover:text-foreground hover:bg-muted/50 text-muted-foreground"
                >
                  {section.title}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ArticleContent({ sections, articleId, locale }: { sections: Article["sections"]; articleId: string; locale: string }) {
  const { fontSizeClass, mounted } = useFontSize();
  const { getHighlights } = useHighlights();
  const isRtl = locale === "ar";

  // Font size mapping for prose content
  const proseSize = mounted ? {
    "text-sm": "prose-sm",
    "text-base": "prose-base",
    "text-lg": "prose-lg",
    "text-xl": "prose-xl",
  }[fontSizeClass] || "prose-base" : "prose-base";

  // Default font family for content
  const fontFamily = "font-serif";

  // Counter for unique keys
  const keyCounter = React.useRef(0);
  const getUniqueKey = () => `seg-${keyCounter.current++}`;

  // Robust segmentation-based rendering
  const renderSegmentedText = (originalText: string, sectionTitle: string, paragraphIndex: number): React.ReactNode => {
    // 1. Preprocessing: Identify Bold Ranges in Plain Text
    // We need to map positions in originalText (with **) to positions in plainText (without **)
    const plainTextBuilder: string[] = [];
    const boldRanges: { start: number; end: number }[] = [];
    
    let originalIdx = 0;
    let plainIdx = 0;
    
    const boldRegex = /(\*\*[^*]+\*\*)/g;
    let match;
    let lastMatchEnd = 0;
    
    // Find all bold matches
    while ((match = boldRegex.exec(originalText)) !== null) {
      // Add text before match
      const textBefore = originalText.slice(lastMatchEnd, match.index);
      plainTextBuilder.push(textBefore);
      plainIdx += textBefore.length;
      
      // Add match content (without **)
      const content = match[0].slice(2, -2);
      const boldStart = plainIdx;
      plainTextBuilder.push(content);
      plainIdx += content.length;
      const boldEnd = plainIdx;
      
      boldRanges.push({ start: boldStart, end: boldEnd });
      
      lastMatchEnd = match.index + match[0].length;
      originalIdx = lastMatchEnd;
    }
    
    // Add remaining text
    const remaining = originalText.slice(lastMatchEnd);
    plainTextBuilder.push(remaining);
    
    const plainText = plainTextBuilder.join("");
    
    // 2. Identify Highlights on Plain Text
    const contextHighlights = getHighlights(articleId, sectionTitle, paragraphIndex);
    const highlightRanges: { start: number; end: number; color: string }[] = [];
    
    if (contextHighlights.length > 0) {
      // Sort highlights by length (longest first) to prioritize specific matches
      const sortedHighlights = [...contextHighlights].sort((a, b) => b.text.length - a.text.length);
      
      for (const highlight of sortedHighlights) {
        const highlightText = highlight.text.trim();
        if (!highlightText) continue;

        // Escape regex special characters
        const escapedText = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedText, 'gi');
        let hMatch;

        while ((hMatch = regex.exec(plainText)) !== null) {
            const start = hMatch.index;
            const end = start + hMatch[0].length;
            
            // basic overlap check - if this range is already fully covered don't add
            // (A more complex merge logic could be added if we supported overlapping highlights of different colors, 
            // but for now simplest wins or we can merge overlapping same-colored ones)
             const isOverlapping = highlightRanges.some(
              (m) => (start >= m.start && start < m.end) || (end > m.start && end <= m.end) || (start <= m.start && end >= m.end)
            );

            if (!isOverlapping) {
               highlightRanges.push({ start, end, color: highlight.color });
            }
        }
      }
    }

    // 3. Segmentation
    // Collect all boundaries
    const boundaries = new Set<number>();
    boundaries.add(0);
    boundaries.add(plainText.length);
    
    boldRanges.forEach(r => {
        boundaries.add(r.start);
        boundaries.add(r.end);
    });
    
    highlightRanges.forEach(r => {
        boundaries.add(r.start);
        boundaries.add(r.end);
    });
    
    const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
    
    // Create Segments
    const result: React.ReactNode[] = [];
    
    for (let i = 0; i < sortedBoundaries.length - 1; i++) {
        const start = sortedBoundaries[i];
        const end = sortedBoundaries[i+1];
        if (start >= end) continue;
        
        const segmentText = plainText.slice(start, end);
        
        // Determine styles
        const isBold = boldRanges.some(r => start >= r.start && end <= r.end);
        const highlight = highlightRanges.find(r => start >= r.start && end <= r.end);
        
        const key = getUniqueKey();
        
        let content: React.ReactNode = segmentText;
        let wrapperClass = "";
        let wrapperStyle = {};
        
        if (isBold) {
            wrapperClass += "font-bold text-foreground ";
        }
        
        if (highlight) {
            wrapperClass += "rounded px-0.5 ";
            wrapperStyle = { backgroundColor: highlight.color };
        }
        
        if (isBold || highlight) {
             result.push(
                <span key={key} className={wrapperClass} style={wrapperStyle}>
                    {content}
                </span>
             );
        } else {
            result.push(<React.Fragment key={key}>{content}</React.Fragment>);
        }
    }
    
    return <>{result}</>;
  };

  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", proseSize, fontFamily)}>
      {sections.map((section, index) => {
        const id = slugify(section.title);
        return (
          <section key={index} id={id} className="mb-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-border">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.content.map((paragraph, pIndex) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Check if it's a list (starts with - or *)
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  const items = trimmed.split("\n").map(item => item.replace(/^[-*]\s*/, "").trim());
                  return (
                    <ul key={pIndex} className="list-disc pl-6 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed text-foreground/90">
                          {renderSegmentedText(item, section.title, pIndex)}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={pIndex}
                    className="leading-relaxed text-foreground/90"
                  >
                    {renderSegmentedText(trimmed, section.title, pIndex)}
                  </p>
                );
              })}
              
              {/* Render practice link button if present */}
              {section.practiceLink && (
                <div className="mt-6 pt-4 border-t border-border">
                  <Link href={`/${locale}${section.practiceLink.href}`}>
                    <div className="group bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-lg p-4 transition-all cursor-pointer">
                      <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FlaskConical className="w-5 h-5 text-primary" />
                        </div>
                        <div className={cn("flex-1", isRtl && "text-right")}>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {isRtl ? section.practiceLink.label.ar : section.practiceLink.label.en}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isRtl ? section.practiceLink.description.ar : section.practiceLink.description.en}
                          </p>
                        </div>
                        <ArrowRight className={cn("w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors", isRtl && "rotate-180")} />
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ArticleContentToggle({
  article,
  shortLabel,
  fullLabel,
  readingFullText,
  readingShortText,
  minText,
  tocTitle = "On This Page",
  locale = "en",
  domain,
  topic,
}: ArticleContentToggleProps) {
  // Check URL for version=full query param
  const [showFull, setShowFull] = React.useState(false);
  const { savePosition } = useReadingPosition();
  const hasFullVersion = article.fullSections && article.fullSections.length > 0;
  const isRtl = locale === "ar";

  // Create articleId from domain and topic props
  const articleId = React.useMemo(() => {
    return `${domain || "unknown"}/${topic || "unknown"}`;
  }, [domain, topic]);

  // Check for version=full in URL on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("version") === "full") {
        setShowFull(true);
      }
    }
  }, []);

  // Save position with isFullVersion when toggling
  const handleToggleFull = React.useCallback((value: boolean) => {
    setShowFull(value);
    // Save position with full version state
    if (articleId && articleId !== "unknown/unknown") {
      savePosition(articleId, value);
    }
  }, [articleId, savePosition]);

  const currentSections = showFull && hasFullVersion 
    ? article.fullSections! 
    : article.sections;
  
  const currentReadingTime = showFull && hasFullVersion
    ? article.readingTime
    : article.shortReadingTime || article.readingTime;

  return (
    <div>
      {/* Version Toggle */}
      {hasFullVersion && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {showFull ? (
                <>{readingFullText} ({article.readingTime} {minText})</>
              ) : (
                <>{readingShortText} ({article.shortReadingTime} {minText})</>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFull ? "outline" : "default"}
              size="sm"
              onClick={() => handleToggleFull(false)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {shortLabel}
            </Button>
            <Button
              variant={showFull ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleFull(true)}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {fullLabel}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile TOC */}
      <MobileTOC sections={currentSections} title={tocTitle} />
      
      {/* Content with Desktop TOC */}
      <div className={cn("flex", isRtl ? "flex-row-reverse" : "flex-row")}>
        <div className="flex-1 min-w-0">
          <ArticleContent sections={currentSections} articleId={articleId} locale={locale} />
        </div>
        
        {/* Desktop TOC Sidebar */}
        <TableOfContents 
          sections={currentSections} 
          title={tocTitle}
          isRtl={isRtl}
        />
      </div>
    </div>
  );
}
