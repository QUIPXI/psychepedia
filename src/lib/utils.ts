import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS merge support
 * Handles conditional classes and deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string for display
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Capitalize the first letter of each word
 */
export function titleCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Truncate text to a specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "...";
}

/**
 * Extract headings from markdown/MDX content for TOC
 */
export function extractHeadings(
  content: string
): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Generate citation in APA format
 */
export function generateCitation(
  title: string,
  domain: string,
  topic: string,
  accessDate: Date = new Date()
): string {
  const formattedDate = accessDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  return `PsychePedia. (${new Date().getFullYear()}). ${title}. In PsychePedia: The Psychology Encyclopedia. Retrieved ${formattedDate}, from https://psychepedia.vercel.app/wiki/${domain}/${topic}`;
}

export type CitationFormat = "apa" | "mla" | "chicago";

/**
 * Generate citations in multiple formats
 */
export function generateCitations(
  title: string,
  domain: string,
  topic: string,
  accessDate: Date = new Date()
): Record<CitationFormat, string> {
  const year = new Date().getFullYear();
  const url = `https://psychepedia.vercel.app/wiki/${domain}/${topic}`;
  
  const apaDate = accessDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const mlaDate = accessDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  
  const chicagoDate = accessDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    apa: `PsychePedia. (${year}). ${title}. In PsychePedia: The Psychology Encyclopedia. Retrieved ${apaDate}, from ${url}`,
    mla: `"${title}." PsychePedia: The Psychology Encyclopedia, ${year}, ${url}. Accessed ${mlaDate}.`,
    chicago: `PsychePedia. "${title}." PsychePedia: The Psychology Encyclopedia. Accessed ${chicagoDate}. ${url}.`,
  };
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get reading time estimate
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Domain color mapping for visual differentiation
 */
export const domainColors: Record<string, string> = {
  foundations: "var(--domain-foundations)",
  biological: "var(--domain-biological)",
  cognitive: "var(--domain-cognitive)",
  developmental: "var(--domain-developmental)",
  "social-personality": "var(--domain-social)",
  clinical: "var(--domain-clinical)",
  applied: "var(--domain-applied)",
};

/**
 * Get domain color class
 */
export function getDomainColorClass(domain: string): string {
  const colorMap: Record<string, string> = {
    foundations: "bg-blue-700",
    biological: "bg-emerald-700",
    cognitive: "bg-violet-600",
    developmental: "bg-orange-600",
    "social-personality": "bg-pink-700",
    clinical: "bg-cyan-600",
    applied: "bg-indigo-600",
  };
  return colorMap[domain] || "bg-slate-600";
}
