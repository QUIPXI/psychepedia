import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDomainTopics, loadArticles } from "@/lib/articles";
import { locales } from "@/i18n/config";

interface DomainPageProps {
  params: Promise<{ locale: string; domain: string }>;
}

export async function generateMetadata({
  params,
}: DomainPageProps): Promise<Metadata> {
  const { locale, domain } = await params;
  const t = await getTranslations({ locale, namespace: "domains" });

  // Check if domain exists by trying to translate its title
  // If translation returns the key, it likely doesn't exist or is invalid
  // But better to check if it exists in our article file structure
  const articles = await loadArticles(locale);
  if (!articles[domain]) {
    return { title: "Domain Not Found" };
  }

  const title = t(`${domain}.title` as any);
  const description = t(`${domain}.description` as any);

  return {
    title,
    description,
  };
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; domain: string }> = [];

  for (const locale of locales) {
    const articles = await loadArticles(locale);
    for (const domain of Object.keys(articles)) {
      params.push({ locale, domain });
    }
  }

  return params;
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { locale, domain } = await params;
  setRequestLocale(locale);

  const topics = await getDomainTopics(locale, domain);
  const tDomains = await getTranslations("domains");
  const tCommon = await getTranslations("common");

  if (!topics || topics.length === 0) {
    notFound();
  }

  const domainTitle = tDomains(`${domain}.title` as any);
  const domainDescription = tDomains(`${domain}.description` as any);

  const breadcrumbs = [
    { label: locale === "ar" ? "الموسوعة" : "Wiki", href: "/wiki" },
    { label: domainTitle, href: `/wiki/${domain}`, current: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} className="mb-6" />

      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{domainTitle}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {domainDescription}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-6">
        {locale === "ar" ? "المواضيع في هذا المجال" : "Topics in This Domain"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/wiki/${domain}/${topic.id}`}
            className="group"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                  {topic.title}
                  <ArrowRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-all ${locale === "ar" ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`} />
                </CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
