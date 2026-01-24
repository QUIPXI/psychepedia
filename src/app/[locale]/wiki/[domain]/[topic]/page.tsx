import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Calendar, User } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { KeyConcepts } from "@/components/wiki/KeyConcepts";
import { References } from "@/components/wiki/References";
import { ArticleContentToggle } from "@/components/wiki/ArticleContentToggle";
import { getArticle, loadArticles } from "@/lib/articles";
import { locales } from "@/i18n/config";

interface TopicPageProps {
  params: Promise<{ locale: string; domain: string; topic: string }>;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { locale, domain, topic } = await params;
  const article = await getArticle(locale, domain, topic);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; domain: string; topic: string }> = [];

  for (const locale of locales) {
    const articles = await loadArticles(locale);

    for (const domain of Object.keys(articles)) {
      for (const topic of Object.keys(articles[domain])) {
        params.push({ locale, domain, topic });
      }
    }
  }

  return params;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { locale, domain, topic } = await params;
  setRequestLocale(locale);

  const article = await getArticle(locale, domain, topic);
  const t = await getTranslations("article");
  const tDomains = await getTranslations("domains");

  if (!article) {
    notFound();
  }

  const domainTitle = tDomains(`${domain}.title` as never) || domain;

  const breadcrumbs = [
    { label: locale === "ar" ? "الموسوعة" : "Wiki", href: "/wiki" },
    { label: domainTitle, href: `/wiki/${domain}` },
    { label: article.title, href: `/wiki/${domain}/${topic}`, current: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          <Breadcrumb items={breadcrumbs} className="mb-6" />

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-muted-foreground mb-4 font-serif">
              {article.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t("readingTime", { minutes: article.readingTime })}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {t("lastUpdated", {
                  date: new Date(article.lastModified).toLocaleDateString(
                    locale === "ar" ? "ar-SA" : "en-US"
                  ),
                })}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author}
              </span>
            </div>
          </header>

          {/* Key Concepts */}
          <KeyConcepts concepts={article.keyConcepts} title={t("keyConcepts")} />

          {/* Article Content with Toggle and TOC */}
          <ArticleContentToggle 
            article={article} 
            shortLabel={t("shortVersion")}
            fullLabel={t("fullVersion")}
            readingFullText={t("readingFull")}
            readingShortText={t("readingShort")}
            minText={t("min")}
            tocTitle={t("tableOfContents")}
            locale={locale}
          />

          {/* References */}
          <References references={article.references} title={t("references")} />
        </div>
      </div>
    </div>
  );
}
