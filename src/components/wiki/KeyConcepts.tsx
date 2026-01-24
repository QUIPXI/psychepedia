"use client";

import * as React from "react";
import { Lightbulb, Eye, EyeOff, Shuffle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ArticleKeyConcept } from "@/lib/articles";

interface KeyConceptsProps {
  concepts: ArticleKeyConcept[];
  title?: string;
  className?: string;
  locale?: string;
}

export function KeyConcepts({
  concepts,
  title = "Key Concepts",
  className,
  locale = "en",
}: KeyConceptsProps) {
  const [studyMode, setStudyMode] = React.useState(false);
  const [revealedTerms, setRevealedTerms] = React.useState<Set<number>>(new Set());
  const [shuffledConcepts, setShuffledConcepts] = React.useState(concepts);

  const isRtl = locale === "ar";

  React.useEffect(() => {
    setShuffledConcepts(concepts);
  }, [concepts]);

  if (concepts.length === 0) {
    return null;
  }

  const toggleReveal = (index: number) => {
    setRevealedTerms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const revealAll = () => {
    setRevealedTerms(new Set(shuffledConcepts.map((_, i) => i)));
  };

  const hideAll = () => {
    setRevealedTerms(new Set());
  };

  const shuffleTerms = () => {
    const shuffled = [...shuffledConcepts].sort(() => Math.random() - 0.5);
    setShuffledConcepts(shuffled);
    setRevealedTerms(new Set());
  };

  const resetOrder = () => {
    setShuffledConcepts(concepts);
    setRevealedTerms(new Set());
  };

  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-primary/20 bg-primary/5 p-5",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary">{title}</h3>
        </div>
        <Button
          variant={studyMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStudyMode(!studyMode);
            if (!studyMode) hideAll();
          }}
          className="text-xs"
        >
          {studyMode 
            ? (isRtl ? "إنهاء الدراسة" : "Exit Study Mode")
            : (isRtl ? "وضع الدراسة" : "Study Mode")
          }
        </Button>
      </div>

      {/* Study Mode Controls */}
      {studyMode && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-primary/20">
          <Button variant="outline" size="sm" onClick={revealAll} className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            {isRtl ? "إظهار الكل" : "Reveal All"}
          </Button>
          <Button variant="outline" size="sm" onClick={hideAll} className="text-xs">
            <EyeOff className="h-3 w-3 mr-1" />
            {isRtl ? "إخفاء الكل" : "Hide All"}
          </Button>
          <Button variant="outline" size="sm" onClick={shuffleTerms} className="text-xs">
            <Shuffle className="h-3 w-3 mr-1" />
            {isRtl ? "خلط" : "Shuffle"}
          </Button>
          <Button variant="outline" size="sm" onClick={resetOrder} className="text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            {isRtl ? "إعادة ضبط" : "Reset"}
          </Button>
          <span className="text-xs text-muted-foreground ml-auto self-center">
            {revealedTerms.size}/{shuffledConcepts.length} {isRtl ? "مكشوف" : "revealed"}
          </span>
        </div>
      )}

      <dl className="space-y-3">
        {shuffledConcepts.map((concept, index) => (
          <div 
            key={`${concept.term}-${index}`} 
            className={cn(
              "grid grid-cols-1 gap-1",
              studyMode && "cursor-pointer hover:bg-primary/10 rounded-md p-2 -mx-2 transition-colors"
            )}
            onClick={() => studyMode && toggleReveal(index)}
          >
            <dt className="font-medium text-foreground">{concept.term}</dt>
            <dd 
              className={cn(
                "text-sm pl-4 border-l-2 border-primary/30 transition-all",
                studyMode && !revealedTerms.has(index)
                  ? "text-transparent bg-muted/50 rounded select-none blur-sm"
                  : "text-muted-foreground"
              )}
            >
              {concept.definition}
              {studyMode && !revealedTerms.has(index) && (
                <span className="text-muted-foreground text-xs block mt-1 blur-none">
                  {isRtl ? "انقر للكشف" : "Click to reveal"}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {studyMode && (
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-primary/20">
          💡 {isRtl 
            ? "نصيحة: حاول تذكر التعريف قبل الكشف عنه لتعزيز الاحتفاظ بالذاكرة."
            : "Tip: Try to recall the definition before revealing it to strengthen memory retention."
          }
        </p>
      )}
    </div>
  );
}

// Simple callout component for inline use in MDX
interface CalloutProps {
  type?: "info" | "warning" | "tip" | "note";
  title?: string;
  children: React.ReactNode;
}

export function Callout({
  type = "info",
  title,
  children,
}: CalloutProps) {
  const styles = {
    info: "border-blue-500/30 bg-blue-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    tip: "border-green-500/30 bg-green-500/5",
    note: "border-slate-500/30 bg-slate-500/5",
  };

  const iconColors = {
    info: "text-blue-600",
    warning: "text-amber-600",
    tip: "text-green-600",
    note: "text-slate-600",
  };

  return (
    <div
      className={cn(
        "my-6 rounded-lg border-l-4 p-4",
        styles[type]
      )}
    >
      {title && (
        <div className={cn("flex items-center gap-2 mb-2", iconColors[type])}>
          <Lightbulb className="h-4 w-4" />
          <span className="font-semibold text-sm uppercase tracking-wide">
            {title}
          </span>
        </div>
      )}
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  );
}

export default KeyConcepts;
