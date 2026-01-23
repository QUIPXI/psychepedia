import fs from "fs";
import path from "path";
import { getReadingTime } from "./utils";

export interface ArticleSection {
  title: string;
  content: string;
}

export interface ArticleReference {
  id: string;
  authors: string;
  year: number;
  title: string;
  source: string;
  doi?: string;
}

export interface ArticleKeyConcept {
  term: string;
  definition: string;
}

export interface Article {
  title: string;
  description: string;
  lastModified: string;
  author: string;
  readingTime: number;
  shortReadingTime?: number;
  sections: ArticleSection[];
  fullSections?: ArticleSection[];
  keyConcepts: ArticleKeyConcept[];
  references: ArticleReference[];
}

export interface DomainArticles {
  [topicId: string]: Article;
}

export interface AllArticles {
  [domainId: string]: DomainArticles;
}

// Cache for loaded articles
const articleCache: Map<string, AllArticles> = new Map();

export async function loadArticles(locale: string): Promise<AllArticles> {
  // Check cache first
  if (articleCache.has(locale)) {
    return articleCache.get(locale)!;
  }

  const articlesDir = path.join(process.cwd(), "content", "articles", locale);
  const articles: AllArticles = {};

  // Check if directory exists
  if (!fs.existsSync(articlesDir)) {
    // Fall back to English if locale not found
    if (locale !== "en") {
      return loadArticles("en");
    }
    return {};
  }

  // Read all domain files
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const domainId = file.replace(".json", "");
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const domainData = JSON.parse(content);
    
    // Handle nested structure (domain key inside file)
    let domainArticlesData = domainData[domainId] ? domainData[domainId] : domainData;

    // Calculate reading time dynamically
    Object.keys(domainArticlesData).forEach(key => {
      const article = domainArticlesData[key];
      if (article.sections) {
        const shortContent = article.sections.map((s: any) => s.content).join(" ");
        article.shortReadingTime = getReadingTime(shortContent);
        
        if (article.fullSections) {
          const fullContent = article.fullSections.map((s: any) => s.content).join(" ");
          article.readingTime = getReadingTime(fullContent);
        } else {
          article.readingTime = article.shortReadingTime;
        }
      }
    });

    articles[domainId] = domainArticlesData;
  }

  // Cache the result
  articleCache.set(locale, articles);

  return articles;
}

export async function getArticle(
  locale: string,
  domain: string,
  topic: string
): Promise<Article | null> {
  const articles = await loadArticles(locale);
  
  // Try locale first, then fall back to English
  const article = articles[domain]?.[topic];
  
  if (!article && locale !== "en") {
    const enArticles = await loadArticles("en");
    return enArticles[domain]?.[topic] || null;
  }
  
  return article || null;
}

export async function getDomainTopics(
  locale: string,
  domain: string
): Promise<{ id: string; title: string; description: string }[]> {
  const articles = await loadArticles(locale);
  const domainArticles = articles[domain];
  
  if (!domainArticles) {
    // Fall back to English
    if (locale !== "en") {
      const enArticles = await loadArticles("en");
      const enDomainArticles = enArticles[domain];
      if (!enDomainArticles) return [];
      return Object.entries(enDomainArticles).map(([id, article]) => ({
        id,
        title: article.title,
        description: article.description,
      }));
    }
    return [];
  }
  
  return Object.entries(domainArticles).map(([id, article]) => ({
    id,
    title: article.title,
    description: article.description,
  }));
}

export async function getAllTopicsForSearch(locale: string): Promise<
  {
    id: string;
    title: string;
    description: string;
    domain: string;
    topic: string;
    href: string;
  }[]
> {
  const articles = await loadArticles(locale);
  const topics: {
    id: string;
    title: string;
    description: string;
    domain: string;
    topic: string;
    href: string;
  }[] = [];

  for (const [domainId, domainArticles] of Object.entries(articles)) {
    for (const [topicId, article] of Object.entries(domainArticles)) {
      topics.push({
        id: `${domainId}/${topicId}`,
        title: article.title,
        description: article.description,
        domain: domainId,
        topic: topicId,
        href: `/wiki/${domainId}/${topicId}`,
      });
    }
  }

  return topics;
}
