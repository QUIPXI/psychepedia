"use client";

import * as React from "react";
import { FileText, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ArticleCaseStudy } from "@/lib/articles";

interface CaseStudiesProps {
  caseStudies: ArticleCaseStudy[];
  title?: string;
  locale?: string;
  className?: string;
}

export function CaseStudies({ 
  caseStudies, 
  title,
  locale = "en",
  className 
}: CaseStudiesProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  
  const isRtl = locale === "ar";

  if (!caseStudies || caseStudies.length === 0) return null;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={cn("my-8", className)}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">
          {title || (isRtl ? "دراسات حالة" : "Case Studies")}
        </h3>
      </div>

      <div className="space-y-4">
        {caseStudies.map((caseStudy, index) => (
          <div 
            key={index}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggleExpand(index)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="text-left">
                <h4 className="font-medium">{caseStudy.title}</h4>
                <p className="text-sm text-muted-foreground">{caseStudy.description}</p>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {/* Expanded Content */}
            {expandedIndex === index && (
              <div className="p-4 pt-0 border-t border-border">
                {/* Scenario */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {isRtl ? "السيناريو" : "Scenario"}
                  </h5>
                  <p className="text-sm leading-relaxed font-serif bg-muted/30 p-4 rounded-lg">
                    {caseStudy.scenario}
                  </p>
                </div>

                {/* Analysis */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {isRtl ? "التحليل" : "Analysis"}
                  </h5>
                  <p className="text-sm leading-relaxed font-serif">
                    {caseStudy.analysis}
                  </p>
                </div>

                {/* Key Takeaways */}
                {caseStudy.keyTakeaways && caseStudy.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <h5 className="text-sm font-semibold text-primary">
                        {isRtl ? "الدروس المستفادة" : "Key Takeaways"}
                      </h5>
                    </div>
                    <ul className="space-y-2">
                      {caseStudy.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CaseStudies;
