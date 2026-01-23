import * as React from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KeyConcept } from "@/lib/types";

interface KeyConceptsProps {
  concepts: KeyConcept[];
  title?: string;
  className?: string;
}

export function KeyConcepts({
  concepts,
  title = "Key Concepts",
  className,
}: KeyConceptsProps) {
  if (concepts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-primary/20 bg-primary/5 p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-primary">{title}</h3>
      </div>
      <dl className="space-y-3">
        {concepts.map((concept, index) => (
          <div key={index} className="grid grid-cols-1 gap-1">
            <dt className="font-medium text-foreground">{concept.term}</dt>
            <dd className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/30">
              {concept.definition}
            </dd>
          </div>
        ))}
      </dl>
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
