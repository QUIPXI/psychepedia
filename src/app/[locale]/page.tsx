"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Users,
  Heart,
  Briefcase,
  Lightbulb,
  ArrowRight,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { openSearchDialog } from "@/lib/events";

const domainIcons = {
  foundations: GraduationCap,
  biological: Brain,
  cognitive: Lightbulb,
  developmental: Users,
  "social-personality": Heart,
  clinical: BookOpen,
  applied: Briefcase,
  "new-and-now": Sparkles,
};

const domainColors = {
  foundations: "text-slate-600 dark:text-slate-400",
  biological: "text-emerald-600 dark:text-emerald-400",
  cognitive: "text-indigo-600 dark:text-indigo-400",
  developmental: "text-amber-600 dark:text-amber-400",
  "social-personality": "text-rose-600 dark:text-rose-400",
  clinical: "text-teal-600 dark:text-teal-400",
  applied: "text-violet-600 dark:text-violet-400",
  "new-and-now": "text-orange-600 dark:text-orange-400",
};

const domainKeys = [
  "foundations",
  "biological",
  "cognitive",
  "developmental",
  "social-personality",
  "clinical",
  "applied",
  "new-and-now",
] as const;

export default function HomePage() {
  const t = useTranslations("home");
  const tDomains = useTranslations("domains");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 font-serif">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg" asChild>
              <Link href="/wiki" className="flex items-center justify-center gap-2">
                <span>{t("hero.cta")}</span>
                <ArrowRight className={`${locale === "ar" ? "rotate-180" : ""} h-5 w-5`} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={openSearchDialog} className="w-full sm:w-auto px-8 py-6 text-lg flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              <span>{tNav("search")}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Domains Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("domains.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("domains.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {domainKeys.map((domainKey) => {
              const Icon = domainIcons[domainKey];
              const color = domainColors[domainKey];
              return (
                <Link key={domainKey} href={`/wiki/${domainKey}`} className="group">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20 group-hover:-translate-y-1">
                    <CardHeader>
                      <Icon className={`h-8 w-8 mb-4 ${color}`} />
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {tDomains(`${domainKey}.title`)}
                      </CardTitle>
                      <CardDescription>{tDomains(`${domainKey}.description`)}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("features.comprehensive.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.comprehensive.description")}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("features.academic.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.academic.description")}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("features.accessible.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.accessible.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg" asChild>
            <Link href="/wiki" className="flex items-center justify-center gap-2">
              <span>{t("hero.browse")}</span>
              <ArrowRight className={`${locale === "ar" ? "rotate-180" : ""} h-5 w-5`} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
