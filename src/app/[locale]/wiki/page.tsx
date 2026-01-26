import Link from "next/link";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Users,
  Heart,
  Briefcase,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wiki" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

const domainConfig = [
  {
    id: "foundations",
    icon: GraduationCap,
    href: "/wiki/foundations",
    color: "text-slate-600 dark:text-slate-400",
    topicCount: 3,
  },
  {
    id: "biological",
    icon: Brain,
    href: "/wiki/biological",
    color: "text-emerald-600 dark:text-emerald-400",
    topicCount: 4,
  },
  {
    id: "cognitive",
    icon: Lightbulb,
    href: "/wiki/cognitive",
    color: "text-indigo-600 dark:text-indigo-400",
    topicCount: 3,
  },
  {
    id: "developmental",
    icon: Users,
    href: "/wiki/developmental",
    color: "text-amber-600 dark:text-amber-400",
    topicCount: 5,
  },
  {
    id: "social-personality",
    icon: Heart,
    href: "/wiki/social-personality",
    color: "text-rose-600 dark:text-rose-400",
    topicCount: 3,
  },
  {
    id: "clinical",
    icon: BookOpen,
    href: "/wiki/clinical",
    color: "text-teal-600 dark:text-teal-400",
    topicCount: 5,
  },
  {
    id: "applied",
    icon: Briefcase,
    href: "/wiki/applied",
    color: "text-violet-600 dark:text-violet-400",
    topicCount: 4,
  },
  {
    id: "new-and-now",
    icon: Sparkles,
    href: "/wiki/new-and-now",
    color: "text-orange-600 dark:text-orange-400",
    topicCount: 4,
  },
];

export default async function WikiIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("wiki");
  const tDomains = await getTranslations("domains");

  const breadcrumbs = [
    { label: locale === "ar" ? "الموسوعة" : "Wiki", href: "/wiki", current: true }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} className="mb-6" />

      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domainConfig.map((domain) => {
          const Icon = domain.icon;
          return (
            <Link key={domain.id} href={domain.href} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Icon className={`h-8 w-8 shrink-0 ${domain.color}`} />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {tDomains(`${domain.id}.title`)}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {tDomains(`${domain.id}.description`)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {domain.topicCount} {t("topics")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                      {t("explore")}
                      <ArrowRight className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
