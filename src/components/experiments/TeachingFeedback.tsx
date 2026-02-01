"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, BookOpen, RefreshCw, Download } from "lucide-react";
import { DownloadableMaterials } from "./DownloadableMaterials";

interface SubscaleScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  interpretation: {
    en: string;
    ar: string;
  };
}

interface TeachingFeedbackProps {
  testName: {
    en: string;
    ar: string;
  };
  testAbbreviation: string;
  rawScore: number;
  maxScore: number;
  interpretation: {
    label: {
      en: string;
      ar: string;
    };
    description: {
      en: string;
      ar: string;
    };
  };
  subscales?: SubscaleScore[];
  exampleInterpretation: {
    en: string;
    ar: string;
  };
  commonMistakes: {
    en: string[];
    ar: string[];
  };
  clinicalInappropriatenessNotes: {
    en: string;
    ar: string;
  };
  onReset: () => void;
  wikiLinks?: {
    en: string;
    ar: string;
    href: string;
  }[];
  testDetails?: {
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
      interpretationBands: {
        range: string;
        label: {
          en: string;
          ar: string;
        };
        description: {
          en: string;
          ar: string;
        };
      }[];
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
  };
}

export function TeachingFeedback({
  testName,
  testAbbreviation,
  rawScore,
  maxScore,
  interpretation,
  subscales,
  exampleInterpretation,
  commonMistakes,
  clinicalInappropriatenessNotes,
  onReset,
  wikiLinks,
  testDetails
}: TeachingFeedbackProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const percentage = Math.round((rawScore / maxScore) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b border-border pb-4">
        <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-3">
          <FileText className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-1">
          {isRtl ? "نتائج المحاكاة التعليمية" : "Educational Simulation Results"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isRtl ? testName.ar : testName.en} ({testAbbreviation})
        </p>
      </div>

      {/* Raw Score Display */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 text-center">
        <div className="text-5xl font-bold mb-2">
          <span className="text-primary">{rawScore}</span>
          <span className="text-muted-foreground text-2xl">/{maxScore}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {isRtl ? "الدرجة الخام" : "Raw Score"} ({percentage}%)
        </p>
        <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
          <p className="font-medium">
            {isRtl ? interpretation.label.ar : interpretation.label.en}
          </p>
        </div>
      </div>

      {/* Example Interpretation (Coursework Style) */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          {isRtl ? "مثال على التفسير (كما يُدرَّس في المقررات)" : "Interpretation Example (As Taught in Coursework)"}
        </h4>
        <div className="bg-muted/30 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground">
            {isRtl ? exampleInterpretation.ar : exampleInterpretation.en}
          </p>
        </div>
      </div>

      {/* Subscale Scores (if applicable) */}
      {subscales && subscales.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium mb-3">
            {isRtl ? "درجات المقاييس الفرعية" : "Subscale Scores"}
          </h4>
          <div className="space-y-3">
            {subscales.map((subscale, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">
                    {isRtl ? subscale.name : subscale.name}
                  </span>
                  <span className="text-sm font-mono">
                    {subscale.score}/{subscale.maxScore} ({subscale.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${subscale.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRtl ? subscale.interpretation.ar : subscale.interpretation.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Student Mistakes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          {isRtl ? "الأخطاء الشائعة بين الطلاب" : "Common Student Mistakes"}
        </h4>
        <ul className="space-y-2">
          {(isRtl ? commonMistakes.ar : commonMistakes.en).map((mistake, index) => (
            <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              {mistake}
            </li>
          ))}
        </ul>
      </div>

      {/* Clinical Inappropriateness Notes */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          {isRtl ? "متى يكون هذا الاختبار غير مناسب للاستخدام السريري" : "When This Test Is Inappropriate for Clinical Use"}
        </h4>
        <p className="text-sm text-red-700">
          {isRtl ? clinicalInappropriatenessNotes.ar : clinicalInappropriatenessNotes.en}
        </p>
      </div>

      {/* Wiki Links */}
      {wikiLinks && wikiLinks.length > 0 && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
          <h4 className="font-medium mb-3">
            {isRtl ? "تعلم المزيد" : "Learn More"}
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {isRtl ? "إعادة المحاكاة" : "Retake Simulation"}
        </Button>
        <DownloadableMaterials
          testName={testName}
          testAbbreviation={testAbbreviation}
          rawScore={rawScore}
          maxScore={maxScore}
          interpretation={interpretation}
          subscales={subscales}
          testDetails={testDetails}
          commonMistakes={commonMistakes}
          clinicalNotes={clinicalInappropriatenessNotes}
        />
      </div>
    </div>
  );
}

export default TeachingFeedback;
