/**
 * Core type definitions for PsychePedia
 */

export interface ArticleMeta {
  title: string;
  description: string;
  domain: string;
  topic: string;
  lastModified: string;
  author?: string;
  keywords?: string[];
  readingTime?: number;
}

export interface Article extends ArticleMeta {
  slug: string;
  content: string;
  headings: Heading[];
  prerequisites?: string[];
  experiment?: string;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  isExpanded?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  domain: string;
  topic: string;
  href: string;
  score?: number;
  matches?: SearchMatch[];
  type?: "article" | "experiment";
}

export interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

export interface Breadcrumb {
  label: string;
  href: string;
  current?: boolean;
}

export interface Reference {
  id: string;
  authors: string;
  year: number;
  title: string;
  source: string;
  url?: string;
  doi?: string;
}

export interface KeyConcept {
  term: string;
  definition: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children?: TableOfContentsItem[];
}

// Navigation structure for sidebar
export interface NavigationStructure {
  domains: DomainNavigation[];
}

export interface DomainNavigation {
  id: string;
  title: string;
  icon: string;
  href: string;
  topics: TopicNavigation[];
}

export interface TopicNavigation {
  id: string;
  title: string;
  href: string;
}

// Search index item for Fuse.js
export interface SearchIndexItem {
  id: string;
  title: string;
  description: string;
  domain: string;
  domainTitle: string;
  topic: string;
  keywords: string[];
  content: string;
  href: string;
  type?: "article" | "experiment"; // Optional type field
}

// Component prop types
export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export interface ArticleLayoutProps {
  article: Article;
  children: React.ReactNode;
}

export interface BreadcrumbProps {
  items: Breadcrumb[];
}

export interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TableOfContentsProps {
  headings: Heading[];
  activeId?: string;
}

export interface KeyConceptsProps {
  concepts: KeyConcept[];
  title?: string;
}

export interface ReferencesProps {
  references: Reference[];
}

export interface CiteButtonProps {
  title: string;
  domain: string;
  topic: string;
}

export interface ArticleCardProps {
  title: string;
  description: string;
  domain: string;
  topic: string;
  href: string;
  lastModified?: string;
  readingTime?: number;
}
