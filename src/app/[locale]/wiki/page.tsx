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
    color: "bg-blue-700",
    topicCount: 3,
  },
  {
    id: "biological",
    icon: Brain,
    href: "/wiki/biological",
    color: "bg-emerald-700",
    topicCount: 4,
  },
  {
    id: "cognitive",
    icon: Lightbulb,
    href: "/wiki/cognitive",
    color: "bg-violet-600",
    topicCount: 3,
  },
  {
    id: "developmental",
    icon: Users,
    href: "/wiki/developmental",
    color: "bg-orange-600",
    topicCount: 5,
  },
  {
    id: "social-personality",
    icon: Heart,
    href: "/wiki/social-personality",
    color: "bg-pink-700",
    topicCount: 3,
  },
  {
    id: "clinical",
    icon: BookOpen,
    href: "/wiki/clinical",
    color: "bg-cyan-600",
    topicCount: 5,
  },
  {
    id: "applied",
    icon: Briefcase,
    href: "/wiki/applied",
    color: "bg-indigo-600",
    topicCount: 4,
  },
  {
    id: "new-and-now",
    icon: Sparkles,
    href: "/wiki/new-and-now",
    color: "bg-amber-600",
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
                <CardHeader className="flex flex-row items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-lg ${domain.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
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
