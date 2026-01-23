import * as React from "react";
import { ExternalLink, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Reference } from "@/lib/types";

interface ReferencesProps {
  references: Reference[];
  title?: string;
  className?: string;
}

export function References({ references, title = "References & Further Reading", className }: ReferencesProps) {
  if (references.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("mt-12 pt-8 border-t border-border", className)}
      aria-labelledby="references-heading"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-muted-foreground" />
        <h2
          id="references-heading"
          className="text-xl font-semibold"
        >
          {title}
        </h2>
      </div>
      <ol className="space-y-3 text-sm">
        {references.map((ref, index) => (
          <li
            key={ref.id || index}
            id={`ref-${ref.id || index}`}
            className="flex gap-3 text-muted-foreground"
          >
            <span className="font-medium text-foreground shrink-0">
              [{index + 1}]
            </span>
            <div className="space-y-0.5">
              <p>
                <span className="text-foreground">{ref.authors}</span>
                {" "}({ref.year}).{" "}
                <em>{ref.title}</em>.{" "}
                {ref.source}.
              </p>
              {(ref.url || ref.doi) && (
                <p className="flex items-center gap-2">
                  {ref.doi && (
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      DOI: {ref.doi}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {ref.url && !ref.doi && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default References;
