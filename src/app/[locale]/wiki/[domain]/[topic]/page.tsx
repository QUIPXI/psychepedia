import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Calendar, User } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { KeyConcepts } from "@/components/wiki/KeyConcepts";
import { References } from "@/components/wiki/References";
import { ArticleContentToggle } from "@/components/wiki/ArticleContentToggle";
import { DifficultyBadge } from "@/components/wiki/DifficultyBadge";
import { Prerequisites } from "@/components/wiki/Prerequisites";
import { ArticleQuiz } from "@/components/wiki/ArticleQuiz";
import { CaseStudies } from "@/components/wiki/CaseStudies";
import { ComparisonTables } from "@/components/wiki/ComparisonTables";
import { InteractiveDiagrams } from "@/components/wiki/InteractiveDiagrams";
import { CiteButton } from "@/components/wiki/CiteButton";
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
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold">{article.title}</h1>
              {article.difficulty && (
                <DifficultyBadge level={article.difficulty} locale={locale} />
              )}
            </div>
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
              <CiteButton title={article.title} domain={domain} topic={topic} locale={locale} />
            </div>
          </header>

          {/* Prerequisites */}
          {article.prerequisites && article.prerequisites.length > 0 && (
            <Prerequisites 
              prerequisites={article.prerequisites} 
              locale={locale}
              className="mb-8"
            />
          )}

          {/* Key Concepts with Study Mode */}
          <KeyConcepts 
            concepts={article.keyConcepts} 
            title={t("keyConcepts")} 
            locale={locale}
          />

          {/* Interactive Diagrams */}
          {article.diagrams && article.diagrams.length > 0 && (
            <InteractiveDiagrams 
              diagrams={article.diagrams} 
              locale={locale}
            />
          )}

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

          {/* Comparison Tables */}
          {article.comparisons && article.comparisons.length > 0 && (
            <ComparisonTables 
              comparisons={article.comparisons} 
              locale={locale}
            />
          )}

          {/* Case Studies */}
          {article.caseStudies && article.caseStudies.length > 0 && (
            <CaseStudies 
              caseStudies={article.caseStudies} 
              locale={locale}
            />
          )}

          {/* Quiz */}
          {article.quiz && article.quiz.length > 0 && (
            <div className="my-8">
              <ArticleQuiz 
                questions={article.quiz} 
                locale={locale}
              />
            </div>
          )}

          {/* References */}
          <References references={article.references} title={t("references")} />
        </div>
      </div>
    </div>
  );
}
