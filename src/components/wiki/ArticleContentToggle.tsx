"use client";

import * as React from "react";
import { BookOpen, FileText, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollSpy, useScrollToHeading, useFontSize } from "@/lib/hooks";
import type { Article } from "@/lib/articles";
import { useHighlights } from "@/context/HighlightContext";
import { HIGHLIGHT_COLORS } from "@/context/HighlightContext";

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

function ArticleContent({ sections, articleId }: { sections: Article["sections"]; articleId: string }) {
  const { fontSizeClass, mounted } = useFontSize();
  const { getHighlights } = useHighlights();

  // Font size mapping for prose content
  const proseSize = mounted ? {
    "text-sm": "prose-sm",
    "text-base": "prose-base",
    "text-lg": "prose-lg",
    "text-xl": "prose-xl",
  }[fontSizeClass] || "prose-base" : "prose-base";

  // Counter for unique keys
  const keyCounter = React.useRef(0);
  const getUniqueKey = () => `hl-${keyCounter.current++}`;

  // Helper to apply highlighting to content (handles **bold** markers)
  const applyHighlighting = (text: string, sectionTitle: string, paragraphIndex: number): React.ReactNode => {
    // Get highlights specific to this section and paragraph
    const contextHighlights = getHighlights(articleId, sectionTitle, paragraphIndex);
    
    // If no context-specific highlights, just render text normally
    if (contextHighlights.length === 0) {
      return renderTextWithBold(text);
    }

    // Use only context-specific highlights for matching
    const sortedHighlights = [...contextHighlights].sort((a, b) => b.text.length - a.text.length);

    // Find all matches and their positions
    const matches: { start: number; end: number; color: string; text: string }[] = [];

    for (const highlight of sortedHighlights) {
      const highlightText = highlight.text.trim();
      if (!highlightText) continue;

      // Create regex for exact phrase match (case-insensitive)
      const escapedText = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedText, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Check if this position is already covered by a longer match
        const isOverlapping = matches.some(
          (m) => match!.index >= m.start && match!.index < m.end
        );

        if (!isOverlapping) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            color: highlight.color,
            text: match[0],
          });
        }
      }
    }

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Build the result with highlighted segments
    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      // Add non-highlighted text before this match
      if (match.start > lastIndex) {
        result.push(
          <React.Fragment key={getUniqueKey()}>
            {text.slice(lastIndex, match.start)}
          </React.Fragment>
        );
      }

      // Add highlighted text
      result.push(
        <span
          key={getUniqueKey()}
          className="rounded px-0.5"
          style={{ backgroundColor: match.color }}
        >
          {text.slice(match.start, match.end)}
        </span>
      );

      lastIndex = match.end;
    });

    // Add remaining text after last match
    if (lastIndex < text.length) {
      result.push(
        <React.Fragment key={getUniqueKey()}>
          {text.slice(lastIndex)}
        </React.Fragment>
      );
    }

    // Apply bold formatting and return
    return renderWithBold(result, text);
  };

  // Render the highlighted content with **bold** formatting
  const renderWithBold = (highlightedParts: React.ReactNode[], originalText: string): React.ReactNode => {
    // Find bold ranges in original text
    const boldRanges: { start: number; end: number; content: string }[] = [];
    const regex = /(\*\*[^*]+\*\*)/g;
    let match;

    while ((match = regex.exec(originalText)) !== null) {
      boldRanges.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[0].slice(2, -2),
      });
    }

    if (boldRanges.length === 0) {
      return <>{highlightedParts}</>;
    }

    // Build result by walking through text and highlighting
    const result: React.ReactNode[] = [];
    let currentPos = 0;

    boldRanges.forEach((bold, i) => {
      // Add text before bold section
      if (bold.start > currentPos) {
        const textBefore = originalText.slice(currentPos, bold.start);
        result.push(<span key={`normal-${i}`}>{textBefore}</span>);
      }

      // Add bold section with highlights
      const boldWithHighlights = applyHighlightsToText(bold.content, highlightedParts);
      result.push(<strong key={`bold-${i}`} className="font-bold text-foreground">{boldWithHighlights}</strong>);

      currentPos = bold.end;
    });

    // Add remaining text
    if (currentPos < originalText.length) {
      const textAfter = originalText.slice(currentPos);
      result.push(<span key={`normal-end`}>{textAfter}</span>);
    }

    return <>{result}</>;
  };

  // Apply highlights from the pool to text content
  const applyHighlightsToText = (text: string, highlightedParts: React.ReactNode[]): React.ReactNode => {
    const result: React.ReactNode[] = [];
    let remainingText = text;
    let partIndex = 0;

    while (remainingText.length > 0 && highlightedParts.length > 0) {
      const next = highlightedParts[0];
      
      if (next && typeof next === 'object' && 'props' in next) {
        // It's a highlighted span
        const spanText = (next as any).props.children;
        if (typeof spanText === 'string' && remainingText.includes(spanText)) {
          const parts = remainingText.split(spanText);
          result.push(<span key={`hl-${partIndex++}`}>{parts[0]}</span>);
          result.push(next);
          highlightedParts.shift();
          remainingText = parts.slice(1).join(spanText);
        } else if (remainingText.startsWith(spanText)) {
          result.push(next);
          highlightedParts.shift();
          remainingText = remainingText.slice(spanText.length);
        } else {
          const idx = remainingText.indexOf(spanText);
          if (idx > 0) {
            result.push(<span key={`hl-${partIndex++}`}>{remainingText.slice(0, idx)}</span>);
            remainingText = remainingText.slice(idx);
          } else {
            break;
          }
        }
      } else {
        break;
      }
    }

    // Add remaining text
    if (remainingText.length > 0) {
      result.push(<span key={`hl-${partIndex++}`}>{remainingText}</span>);
    }

    // Consume any remaining highlighted parts
    while (highlightedParts.length > 0) {
      result.push(highlightedParts.shift());
    }

    return <>{result}</>;
  };

  // Simple render with bold only (no highlighting - highlights are already applied)
  const renderTextWithBold = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          return <React.Fragment key={i}>{part}</React.Fragment>;
        })}
      </>
    );
  };

  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", proseSize)}>
      {sections.map((section, index) => {
        const id = slugify(section.title);
        return (
          <section key={index} id={id} className="mb-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-border">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.content.split("\n\n").map((paragraph, pIndex) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Check if it's a list (starts with - or *)
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  const items = trimmed.split("\n").map(item => item.replace(/^[-*]\s*/, "").trim());
                  return (
                    <ul key={pIndex} className="list-disc pl-6 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed text-foreground/90 font-serif">
                          {applyHighlighting(item, section.title, pIndex)}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={pIndex}
                    className="leading-relaxed text-foreground/90 font-serif"
                  >
                    {applyHighlighting(trimmed, section.title, pIndex)}
                  </p>
                );
              })}
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
  const [showFull, setShowFull] = React.useState(false);
  const hasFullVersion = article.fullSections && article.fullSections.length > 0;
  const isRtl = locale === "ar";

  const currentSections = showFull && hasFullVersion 
    ? article.fullSections! 
    : article.sections;
  
  const currentReadingTime = showFull && hasFullVersion
    ? article.readingTime
    : article.shortReadingTime || article.readingTime;

  // Create articleId from domain and topic props
  const articleId = React.useMemo(() => {
    return `${domain || "unknown"}/${topic || "unknown"}`;
  }, [domain, topic]);

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
              onClick={() => setShowFull(false)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {shortLabel}
            </Button>
            <Button
              variant={showFull ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFull(true)}
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
          <ArticleContent sections={currentSections} articleId={articleId} />
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
