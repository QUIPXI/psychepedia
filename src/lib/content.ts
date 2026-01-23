import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Article,
  ArticleMeta,
  Domain,
  NavigationStructure,
  SearchIndexItem,
} from "./types";
import { extractHeadings, getReadingTime, slugify } from "./utils";

const contentDirectory = path.join(process.cwd(), "content");
const wikiDirectory = path.join(contentDirectory, "wiki");

/**
 * Get all domains from the navigation structure
 */
export async function getDomains(): Promise<Domain[]> {
  const navPath = path.join(contentDirectory, "metadata", "navigation.json");
  
  try {
    const navContent = fs.readFileSync(navPath, "utf-8");
    const navigation: NavigationStructure = JSON.parse(navContent);
    
    return navigation.domains.map((domain) => ({
      id: domain.id,
      title: domain.title,
      description: getDomainDescription(domain.id),
      icon: domain.icon,
      color: getDomainColor(domain.id),
      topics: domain.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: "",
        slug: topic.id,
      })),
    }));
  } catch {
    console.error("Error loading navigation:", navPath);
    return [];
  }
}

/**
 * Get a single domain by ID
 */
export async function getDomain(domainId: string): Promise<Domain | null> {
  const domains = await getDomains();
  return domains.find((d) => d.id === domainId) || null;
}

/**
 * Get all articles for a domain
 */
export async function getArticlesByDomain(
  domainId: string
): Promise<ArticleMeta[]> {
  const domainPath = path.join(wikiDirectory, domainId);
  
  if (!fs.existsSync(domainPath)) {
    return [];
  }

  const files = fs.readdirSync(domainPath).filter((f) => f.endsWith(".mdx"));
  const articles: ArticleMeta[] = [];

  for (const file of files) {
    const filePath = path.join(domainPath, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    articles.push({
      title: data.title || titleFromSlug(file),
      description: data.description || "",
      domain: domainId,
      topic: file.replace(".mdx", ""),
      lastModified: data.lastModified || new Date().toISOString(),
      author: data.author,
      keywords: data.keywords || [],
      readingTime: getReadingTime(content),
    });
  }

  return articles;
}

/**
 * Get a single article by domain and topic
 */
export async function getArticle(
  domainId: string,
  topicId: string
): Promise<Article | null> {
  const filePath = path.join(wikiDirectory, domainId, `${topicId}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    title: data.title || titleFromSlug(topicId),
    description: data.description || "",
    domain: domainId,
    topic: topicId,
    lastModified: data.lastModified || new Date().toISOString(),
    author: data.author,
    keywords: data.keywords || [],
    readingTime: getReadingTime(content),
    slug: topicId,
    content,
    headings: extractHeadings(content),
  };
}

/**
 * Get all articles for search indexing
 */
export async function getAllArticles(): Promise<Article[]> {
  const domains = await getDomains();
  const articles: Article[] = [];

  for (const domain of domains) {
    const domainPath = path.join(wikiDirectory, domain.id);
    
    if (!fs.existsSync(domainPath)) continue;

    const files = fs.readdirSync(domainPath).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const topicId = file.replace(".mdx", "");
      const article = await getArticle(domain.id, topicId);
      if (article) {
        articles.push(article);
      }
    }
  }

  return articles;
}

/**
 * Build search index from all articles
 */
export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const articles = await getAllArticles();
  const domains = await getDomains();

  return articles.map((article) => {
    const domain = domains.find((d) => d.id === article.domain);
    
    return {
      id: `${article.domain}/${article.topic}`,
      title: article.title,
      description: article.description,
      domain: article.domain,
      domainTitle: domain?.title || article.domain,
      topic: article.topic,
      keywords: article.keywords || [],
      content: article.content.slice(0, 1000), // First 1000 chars for search
      href: `/wiki/${article.domain}/${article.topic}`,
    };
  });
}

/**
 * Get navigation structure
 */
export async function getNavigation(): Promise<NavigationStructure> {
  const navPath = path.join(contentDirectory, "metadata", "navigation.json");
  
  try {
    const navContent = fs.readFileSync(navPath, "utf-8");
    return JSON.parse(navContent);
  } catch {
    return { domains: [] };
  }
}

// Helper functions
function titleFromSlug(slug: string): string {
  return slug
    .replace(".mdx", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getDomainDescription(domainId: string): string {
  const descriptions: Record<string, string> = {
    foundations:
      "Explore the historical development, research methodologies, and ethical principles that form the bedrock of psychological science.",
    biological:
      "Understand how the brain, nervous system, and biological processes influence behavior and mental processes.",
    cognitive:
      "Discover how we think, learn, remember, and process information, including emotion and language.",
    developmental:
      "Study human growth and change across the entire lifespan, from prenatal development to aging.",
    "social-personality":
      "Examine how individuals think about, influence, and relate to others, and what makes each person unique.",
    clinical:
      "Learn about mental health disorders, assessment techniques, and evidence-based therapeutic interventions.",
    applied:
      "Explore practical applications of psychology in forensics, organizations, education, and sports.",
  };
  return descriptions[domainId] || "";
}

function getDomainColor(domainId: string): string {
  const colors: Record<string, string> = {
    foundations: "#1e40af",
    biological: "#047857",
    cognitive: "#7c3aed",
    developmental: "#ea580c",
    "social-personality": "#be185d",
    clinical: "#0891b2",
    applied: "#4f46e5",
  };
  return colors[domainId] || "#64748b";
}
