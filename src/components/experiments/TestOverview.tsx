"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Clock, Users, FileText, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterpretationBand {
  range: string;
  label: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

interface TestOverviewProps {
  testName: {
    en: string;
    ar: string;
  };
  testAbbreviation: string;
  purpose: {
    en: string;
    ar: string;
  };
  targetPopulation: {
    en: string;
    ar: string;
  };
  administration: {
    time: string;
    format: string;
    items: string;
  };
  scoring: {
    range: string;
    interpretationBands: InterpretationBand[];
    notes?: {
      en: string;
      ar: string;
    };
  };
  strengths: {
    en: string[];
    ar: string[];
  };
  limitations: {
    en: string[];
    ar: string[];
  };
  wikiLinks?: {
    en: string;
    ar: string;
    href: string;
  }[];
  modifiedVersion?: {
    en: string;
    ar: string;
  };
}

export function TestOverview({
  testName,
  testAbbreviation,
  purpose,
  targetPopulation,
  administration,
  scoring,
  strengths,
  limitations,
  wikiLinks,
  modifiedVersion
}: TestOverviewProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {isRtl ? testName.ar : testName.en} ({testAbbreviation})
            </h3>
            {modifiedVersion && (
              <p className="text-sm text-amber-600 mt-1">
                {isRtl ? modifiedVersion.ar : modifiedVersion.en}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Purpose & Population */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            {isRtl ? "الغرض والتطبيق السريري" : "Purpose & Clinical Context"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isRtl ? purpose.ar : purpose.en}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            {isRtl ? "السكان المستهدفون" : "Target Population"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isRtl ? targetPopulation.ar : targetPopulation.en}
          </p>
        </div>
      </div>

      {/* Administration */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          {isRtl ? "طريقة التطبيق" : "Administration Method"}
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-muted/30 rounded">
            <p className="font-medium">{administration.time}</p>
            <p className="text-muted-foreground">{isRtl ? "المدة" : "Duration"}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded">
            <p className="font-medium">{administration.format}</p>
            <p className="text-muted-foreground">{isRtl ? "الصيغة" : "Format"}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded">
            <p className="font-medium">{administration.items}</p>
            <p className="text-muted-foreground">{isRtl ? "عدد البنود" : "Items"}</p>
          </div>
        </div>
      </div>

      {/* Scoring */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-primary" />
          {isRtl ? "قواعد التفسير" : "Scoring & Interpretation"}
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          {isRtl ? "نطاق الدرجات:" : "Score range:"} {scoring.range}
        </p>

        <div className="space-y-2">
          {scoring.interpretationBands.map((band, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg text-sm",
                "bg-muted/30"
              )}
            >
              <span className="font-mono font-medium min-w-[60px]">
                {band.range}
              </span>
              <div>
                <p className="font-medium">
                  {isRtl ? band.label.ar : band.label.en}
                </p>
                <p className="text-muted-foreground text-xs">
                  {isRtl ? band.description.ar : band.description.en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {scoring.notes && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="font-medium text-blue-800 mb-1">
              {isRtl ? "ملاحظات إضافية:" : "Additional Notes:"}
            </p>
            <p className="text-blue-700">
              {isRtl ? scoring.notes.ar : scoring.notes.en}
            </p>
          </div>
        )}
      </div>

      {/* Strengths & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-600" />
            {isRtl ? "نقاط القوة" : "Strengths"}
          </h4>
          <ul className="space-y-2">
            {(isRtl ? strengths.ar : strengths.en).map((strength, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {isRtl ? "القيود" : "Limitations"}
          </h4>
          <ul className="space-y-2">
            {(isRtl ? limitations.ar : limitations.en).map((limitation, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                {limitation}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Wiki Links */}
      {wikiLinks && wikiLinks.length > 0 && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
          <h4 className="font-medium mb-3">
            {isRtl ? "المقالات ذات الصلة" : "Related Wiki Articles"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {wikiLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                {isRtl ? link.ar : link.en}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestOverview;
