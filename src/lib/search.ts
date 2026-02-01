import Fuse, { IFuseOptions } from "fuse.js";
import type { SearchIndexItem, SearchResult } from "./types";

// Fuse.js configuration for optimal search
const fuseOptions: IFuseOptions<SearchIndexItem> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "description", weight: 0.25 },
    { name: "keywords", weight: 0.2 },
    { name: "content", weight: 0.1 },
    { name: "domainTitle", weight: 0.05 },
  ],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
  useExtendedSearch: true,
};

let fuseInstance: Fuse<SearchIndexItem> | null = null;
let searchIndex: SearchIndexItem[] = [];

/**
 * Initialize the search index
 */
export function initializeSearch(index: SearchIndexItem[]): void {
  searchIndex = index;
  fuseInstance = new Fuse(searchIndex, fuseOptions);
}

/**
 * Get the current search index
 */
export function getSearchIndex(): SearchIndexItem[] {
  return searchIndex;
}

/**
 * Search articles using Fuse.js
 */
export function searchArticles(
  query: string,
  limit: number = 10
): SearchResult[] {
  if (!fuseInstance || !query.trim()) {
    return [];
  }

  const results = fuseInstance.search(query, { limit });

  return results.map((result) => ({
    id: result.item.id,
    title: result.item.title,
    description: result.item.description,
    domain: result.item.domain,
    topic: result.item.topic,
    href: result.item.href,
    score: result.score,
    matches: result.matches?.map((match) => ({
      key: match.key || "",
      value: match.value || "",
      indices: match.indices as [number, number][],
    })),
    type: (result.item as any).type,
  }));
}

/**
 * Search within a specific domain
 */
export function searchByDomain(
  query: string,
  domainId: string,
  limit: number = 10
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const domainItems = searchIndex.filter((item) => item.domain === domainId);
  const domainFuse = new Fuse(domainItems, fuseOptions);
  const results = domainFuse.search(query, { limit });

  return results.map((result) => ({
    id: result.item.id,
    title: result.item.title,
    description: result.item.description,
    domain: result.item.domain,
    topic: result.item.topic,
    href: result.item.href,
    score: result.score,
    matches: result.matches?.map((match) => ({
      key: match.key || "",
      value: match.value || "",
      indices: match.indices as [number, number][],
    })),
    type: (result.item as any).type,
  }));
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(
  query: string,
  limit: number = 5
): string[] {
  if (!fuseInstance || query.length < 2) {
    return [];
  }

  const results = fuseInstance.search(query, { limit });
  return results.map((result) => result.item.title);
}

/**
 * Highlight matched text in search results
 */
export function highlightMatches(
  text: string,
  indices: [number, number][]
): string {
  if (!indices || indices.length === 0) {
    return text;
  }

  let result = "";
  let lastIndex = 0;

  // Sort indices by start position
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

  for (const [start, end] of sortedIndices) {
    // Add text before match
    result += text.slice(lastIndex, start);
    // Add highlighted match
    result += `<mark class="search-highlight">${text.slice(start, end + 1)}</mark>`;
    lastIndex = end + 1;
  }

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}

/**
 * Group search results by domain
 */
export function groupResultsByDomain(
  results: SearchResult[]
): Record<string, SearchResult[]> {
  return results.reduce(
    (groups, result) => {
      const domain = result.domain;
      if (!groups[domain]) {
        groups[domain] = [];
      }
      groups[domain].push(result);
      return groups;
    },
    {} as Record<string, SearchResult[]>
  );
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem("psychepedia-recent-searches");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a search to recent searches
 */
export function addRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) {
    return;
  }

  try {
    const recent = getRecentSearches();
    const filtered = recent.filter((s) => s !== query);
    const updated = [query, ...filtered].slice(0, 5);
    localStorage.setItem("psychepedia-recent-searches", JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem("psychepedia-recent-searches");
  } catch {
    // Ignore localStorage errors
  }
}
