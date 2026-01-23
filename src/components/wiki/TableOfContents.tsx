"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useScrollSpy, useScrollToHeading } from "@/lib/hooks";
import type { Heading } from "@/lib/types";

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const headingIds = headings.map((h) => h.id);
  const activeId = useScrollSpy(headingIds);
  const scrollToHeading = useScrollToHeading();

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn("space-y-1", className)}
      aria-label="Table of contents"
    >
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
        On This Page
      </h2>
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                "block w-full text-left py-1 px-2 rounded-md transition-colors hover:text-foreground",
                activeId === heading.id
                  ? "text-primary font-medium bg-primary/5"
                  : "text-muted-foreground"
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TableOfContents;
