"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Search, X, Clock, ArrowRight, FlaskConical } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn, titleCase, debounce } from "@/lib/utils";
import {
  searchArticles,
  initializeSearch,
  getRecentSearches,
  addRecentSearch,
} from "@/lib/search";
import type { SearchResult, SearchIndexItem } from "@/lib/types";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  searchIndex: SearchIndexItem[];
}

export function SearchDialog({
  isOpen,
  onClose,
  searchIndex,
}: SearchDialogProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Initialize search index
  React.useEffect(() => {
    if (searchIndex.length > 0) {
      initializeSearch(searchIndex);
    }
  }, [searchIndex]);

  // Load recent searches
  React.useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
    }
  }, [isOpen]);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search
  const performSearch = React.useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim()) {
        const searchResults = searchArticles(searchQuery, 10);
        setResults(searchResults);
        setSelectedIndex(0);
      } else {
        setResults([]);
        setSelectedIndex(0);
      }
    }, 150),
    []
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

  const handleSelect = (result: SearchResult) => {
    addRecentSearch(result.title);
    onClose();
    router.push(result.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  // Keyboard shortcut to open search
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          // This would need to be handled by parent component
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onClose={onClose}
        className="max-w-2xl p-0 overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="relative flex-1 ml-3 mr-6">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 focus-visible:ring-0 text-base h-9 pr-8"
            />
            {query && (
              <button
                onClick={() => handleQueryChange("")}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors",
                  isRtl ? "left-1" : "right-1"
                )}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query && results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full px-4 py-3 text-left flex items-start gap-3 transition-colors",
                      selectedIndex === index
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {result.type === "experiment" ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium flex items-center gap-1">
                            <FlaskConical className="h-3 w-3" />
                            {isRtl ? "اختبار" : "Test"}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {titleCase(result.domain)}
                          </span>
                        )}
                      </div>
                      <p className="font-medium mt-1 truncate">{result.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {result.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            /* Recent searches and suggestions */
            <div className="py-4 px-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Recent Searches
                  </h3>
                  <ul className="space-y-1">
                    {recentSearches.map((search) => (
                      <li key={search}>
                        <button
                          onClick={() => handleQueryChange(search)}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded-md text-left"
                        >
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {search}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Popular Topics
                </h3>
                <ul className="space-y-1">
                  {["Cognitive Psychology", "Psychopathology", "Research Methods", "Neuropsychology"].map(
                    (topic) => (
                      <li key={topic}>
                        <button
                          onClick={() => handleQueryChange(topic)}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded-md text-left"
                        >
                          <Search className="h-3.5 w-3.5 text-muted-foreground" />
                          {topic}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
