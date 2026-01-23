import * as React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { cn, titleCase, getDomainColorClass } from "@/lib/utils";
import type { SearchResult } from "@/lib/types";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  className?: string;
}

export function SearchResults({
  results,
  query,
  className,
}: SearchResultsProps) {
  if (results.length === 0 && query) {
    return (
      <div className={cn("text-center py-12", className)}>
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No results found</h3>
        <p className="text-muted-foreground mt-1">
          No articles match &ldquo;{query}&rdquo;. Try different keywords.
        </p>
      </div>
    );
  }

  // Group results by domain
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.domain]) {
        acc[result.domain] = [];
      }
      acc[result.domain].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  return (
    <div className={cn("space-y-8", className)}>
      <p className="text-sm text-muted-foreground">
        Found {results.length} result{results.length !== 1 ? "s" : ""} for
        &ldquo;{query}&rdquo;
      </p>

      {Object.entries(groupedResults).map(([domain, domainResults]) => (
        <section key={domain}>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                getDomainColorClass(domain)
              )}
            />
            {titleCase(domain)}
          </h2>
          <ul className="space-y-2">
            {domainResults.map((result) => (
              <li key={result.id}>
                <Link
                  href={result.href}
                  className="block p-4 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {result.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {result.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {result.href}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default SearchResults;
