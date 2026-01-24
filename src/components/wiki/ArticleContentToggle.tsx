"use client";

import * as React from "react";
import { BookOpen, FileText, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollSpy, useScrollToHeading, useFontSize } from "@/lib/hooks";
import type { Article } from "@/lib/articles";

interface ArticleContentToggleProps {
  article: Article;
  shortLabel: string;
  fullLabel: string;
  readingFullText: string;
  readingShortText: string;
  minText: string;
  tocTitle?: string;
  locale?: string;
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
        isRtl ? "mr-8" : "ml-8"
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
                      ? "text-primary font-medium bg-primary/5 border-l-2 border-primary"
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

function ArticleContent({ sections }: { sections: Article["sections"] }) {
  const { fontSizeClass, mounted } = useFontSize();
  
  // Font size mapping for prose content
  const proseSize = mounted ? {
    "text-sm": "prose-sm",
    "text-base": "prose-base",
    "text-lg": "prose-lg",
    "text-xl": "prose-xl",
  }[fontSizeClass] || "prose-base" : "prose-base";

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
                          {item.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong key={j} className="font-bold text-foreground">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
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
                    {trimmed.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={i} className="font-bold text-foreground">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
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
      <div className={cn("flex", isRtl && "flex-row-reverse")}>
        <div className="flex-1 min-w-0">
          <ArticleContent sections={currentSections} />
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
