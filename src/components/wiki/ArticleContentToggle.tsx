"use client";

import * as React from "react";
import { BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/lib/articles";

interface ArticleContentToggleProps {
  article: Article;
  shortLabel: string;
  fullLabel: string;
  readingFullText: string;
  readingShortText: string;
  minText: string;
}

function ArticleContent({ sections }: { sections: Article["sections"] }) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {sections.map((section, index) => (
        <section key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-border">
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.content.split("\n\n").map((paragraph, pIndex) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

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
      ))}
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
}: ArticleContentToggleProps) {
  const [showFull, setShowFull] = React.useState(false);
  const hasFullVersion = article.fullSections && article.fullSections.length > 0;
  
  const currentSections = showFull && hasFullVersion 
    ? article.fullSections! 
    : article.sections;
  
  const currentReadingTime = showFull && hasFullVersion
    ? article.readingTime
    : article.shortReadingTime || article.readingTime;

  return (
    <div>
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
      
      <ArticleContent sections={currentSections} />
    </div>
  );
}
