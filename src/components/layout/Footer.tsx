"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function Footer() {
  const t = useTranslations("footer");
  const tDomains = useTranslations("domains");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{locale === "ar" ? "سايكوبيديا" : "PsychePedia"}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          {/* Domains */}
          <div>
            <h3 className="font-semibold mb-3">{t("domains")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/wiki/foundations" className="hover:text-foreground transition-colors">
                  {tDomains("foundations.title")}
                </Link>
              </li>
              <li>
                <Link href="/wiki/clinical" className="hover:text-foreground transition-colors">
                  {tDomains("clinical.title")}
                </Link>
              </li>
              <li>
                <Link href="/wiki/cognitive" className="hover:text-foreground transition-colors">
                  {tDomains("cognitive.title")}
                </Link>
              </li>
              <li>
                <Link href="/wiki/developmental" className="hover:text-foreground transition-colors">
                  {tDomains("developmental.title")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">{t("resources")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/wiki/clinical/assessment" className="hover:text-foreground transition-colors">
                  {locale === "ar" ? "أدوات التقييم" : "Assessment Tools"}
                </Link>
              </li>
              <li>
                <Link href="/wiki/foundations/research-methods" className="hover:text-foreground transition-colors">
                  {locale === "ar" ? "مناهج البحث" : "Research Methods"}
                </Link>
              </li>
              <li>
                <Link href="/wiki/clinical/evidence-based-therapies" className="hover:text-foreground transition-colors">
                  {locale === "ar" ? "الأساليب العلاجية" : "Therapeutic Approaches"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tests */}
          <div>
            <h3 className="font-semibold mb-3">{t("interactiveTests")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/experiments/iq" className="hover:text-foreground transition-colors">
                  {locale === "ar" ? "اختبار الذكاء" : "IQ Test"}
                </Link>
              </li>
              <li>
                <Link href="/experiments/mmse" className="hover:text-foreground transition-colors">
                  {locale === "ar" ? "فحص الحالة العقلية" : "MMSE"}
                </Link>
              </li>
              <li>
                <Link href="/experiments/gad7" className="hover:text-foreground transition-colors">
                  {locale === "ar" ? "مقياس القلق" : "GAD-7"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>{t("copyright", { year: currentYear })}</p>
            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdCB3eVdMACnFowqjt0SIaZ7Cqkb-_nnMJGwqpUgnMlhwkj5Q/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-3 w-3" />
                {t("feedback")}
              </a>
            </Button>
          </div>
          <p className="text-xs text-center md:text-end">
            {locale === "ar"
              ? "المحتوى لأغراض تعليمية فقط. استشر المختصين دائمًا للقرارات السريرية."
              : "Content is for educational purposes. Always consult qualified professionals for clinical decisions."}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
