"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, FileText, GraduationCap } from "lucide-react";
import { useLocale } from "next-intl";
import { TestOverview } from "./TestOverview";
import { AcknowledgmentDialog } from "./AcknowledgmentDialog";
import { TeachingFeedback } from "./TeachingFeedback";

const gad7Questions = [
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop or control worrying?",
  "Worrying too much about different things?",
  "Trouble relaxing?",
  "Being so restless that it's hard to sit still?",
  "Becoming easily annoyed or irritable?",
  "Feeling afraid as if something awful might happen?",
];

const gad7Options = [
  { value: 0, label: { en: "Not at all", ar: "إطلاقاً" } },
  { value: 1, label: { en: "Several days", ar: "عدة أيام" } },
  { value: 2, label: { en: "More than half the days", ar: "أكثر من نصف الأيام" } },
  { value: 3, label: { en: "Nearly every day", ar: "تقريباً كل يوم" } },
];

// GAD-7 Test Overview Data
const gad7OverviewData = {
  testName: {
    en: "Generalized Anxiety Disorder-7",
    ar: "مقياس القلق العام-7"
  },
  testAbbreviation: "GAD-7",
  purpose: {
    en: "Brief screening tool for generalized anxiety disorder in primary care settings.",
    ar: "أداة فحص موجزة لاضطراب القلق العام في الرعاية الأولية."
  },
  targetPopulation: {
    en: "Adults (18+) in primary care settings for anxiety screening.",
    ar: "البالغون (18+) في إعدادات الرعاية الأولية."
  },
  administration: {
    time: "2-3 minutes",
    format: "Self-administered questionnaire",
    items: "7 items"
  },
  scoring: {
    range: "0-21 points",
    interpretationBands: [
      { range: "0-4", label: { en: "Minimal", ar: "طفيف" }, description: { en: "Minimal anxiety", ar: "قلق طفيف" } },
      { range: "5-9", label: { en: "Mild", ar: "خفيف" }, description: { en: "Mild anxiety", ar: "قلق خفيف" } },
      { range: "10-14", label: { en: "Moderate", ar: "متوسط" }, description: { en: "Moderate anxiety", ar: "قلق متوسط" } },
      { range: "15-21", label: { en: "Severe", ar: "شديد" }, description: { en: "Severe anxiety", ar: "قلق شديد" } }
    ],
    notes: {
      en: "Scores of 10+ suggest possible GAD.",
      ar: "الدرجات 10+ تشير إلى احتمال وجود اضطراب القلق العام."
    }
  },
  strengths: {
    en: ["Brief and efficient", "Validated for GAD screening", "Easy to administer"],
    ar: ["قصير وفعال", "تم التحقق منه", "سهل التطبيق"]
  },
  limitations: {
    en: ["Does not assess all anxiety disorders", "Self-report bias", "Not a diagnostic tool"],
    ar: ["لا يقيّم جميع اضطرابات القلق", "تحيز التقرير الذاتي", "ليست أداة تشخيصية"]
  },
  wikiLinks: [
    { en: "Anxiety Disorders", ar: "اضطرابات القلق", href: "/wiki/clinical/anxiety-disorders" }
  ]
};

const gad7FeedbackData = {
  exampleInterpretation: {
    en: "A score of 12 indicates moderate anxiety, warranting clinical consideration.",
    ar: "درجة 12 تشير إلى قلق متوسط يستحقconsideration سريرية."
  },
  commonMistakes: {
    en: ["Confusing with depression screening", "Using as sole diagnostic criterion"],
    ar: ["الخلط مع فحص الاكتئاب", "الاستخدام كمعيار تشخيصي وحيد"]
  },
  clinicalInappropriatenessNotes: {
    en: "Inappropriate when used as sole diagnostic tool or without clinical follow-up.",
    ar: "غير مناسب عندما يُستخدم كأداة تشخيصية وحيد أو بدون متابعة سريرية."
  }
};

export default function GAD7Screening() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [showOverview, setShowOverview] = useState(true);
  const [isAcknowledgmentOpen, setIsAcknowledgmentOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    setIsAcknowledgmentOpen(true);
  };

  const handleAcknowledgmentConfirm = () => {
    setShowOverview(false);
    setIsStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < gad7Questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setShowOverview(true);
    setIsStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = 21;

  const getInterpretation = (score: number) => {
    if (score <= 4) return {
      label: { en: "Minimal", ar: "طفيف" },
      description: { en: "Minimal anxiety symptoms", ar: "أعراض قلق طفيفة" }
    };
    if (score <= 9) return {
      label: { en: "Mild", ar: "خفيف" },
      description: { en: "Mild anxiety symptoms", ar: "أعراض قلق خفيفة" }
    };
    if (score <= 14) return {
      label: { en: "Moderate", ar: "متوسط" },
      description: { en: "Moderate anxiety", ar: "قلق متوسط" }
    };
    return {
      label: { en: "Severe", ar: "شديد" },
      description: { en: "Severe anxiety", ar: "قلق شديد" }
    };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <AcknowledgmentDialog
        open={isAcknowledgmentOpen}
        onOpenChange={setIsAcknowledgmentOpen}
        testName={gad7OverviewData.testName}
        testAbbreviation={gad7OverviewData.testAbbreviation}
        onConfirm={handleAcknowledgmentConfirm}
      />

      {showOverview ? (
        <div className="space-y-6">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">
              {isRtl ? gad7OverviewData.testName.ar : gad7OverviewData.testName.en} ({gad7OverviewData.testAbbreviation})
            </h3>
            <p className="text-muted-foreground mb-4">
              {isRtl ? "محاكاة تعليمية للطلاب" : "Educational Simulation for Students"}
            </p>
            <Button onClick={handleStart} className="gap-2">
              <GraduationCap className="w-4 h-4" />
              {isRtl ? "ابدأ المحاكاة التعليمية" : "Start Educational Simulation"}
            </Button>
          </div>
          <TestOverview {...gad7OverviewData} />
        </div>
      ) : isStarted && !showResult ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{isRtl ? "السؤال" : "Question"} {currentQuestion + 1} {isRtl ? "من" : "of"} {gad7Questions.length}</span>
            <span>{isRtl ? "التقدم:" : "Progress:"} {Math.round((currentQuestion / gad7Questions.length) * 100)}%</span>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestion / gad7Questions.length) * 100}%` }}
            />
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-4">
              {isRtl ? "خلال الأسبوعين الماضيين، كم مرة أزعجتك المشاكل التالية؟" : "Over the past two weeks, how often have you been bothered by the following problems?"}
            </h4>
            <p className="font-semibold text-lg mb-4">{gad7Questions[currentQuestion]}</p>

            <div className="space-y-2">
              {gad7Options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-3 text-left border rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {isRtl ? option.label.ar : option.label.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <TeachingFeedback
          testName={gad7OverviewData.testName}
          testAbbreviation={gad7OverviewData.testAbbreviation}
          rawScore={totalScore}
          maxScore={maxScore}
          interpretation={interpretation}
          exampleInterpretation={gad7FeedbackData.exampleInterpretation}
          commonMistakes={gad7FeedbackData.commonMistakes}
          clinicalInappropriatenessNotes={gad7FeedbackData.clinicalInappropriatenessNotes}
          onReset={handleReset}
          wikiLinks={gad7OverviewData.wikiLinks}
          testDetails={{
            purpose: gad7OverviewData.purpose,
            targetPopulation: gad7OverviewData.targetPopulation,
            administration: gad7OverviewData.administration,
            scoring: gad7OverviewData.scoring,
            strengths: gad7OverviewData.strengths,
            limitations: gad7OverviewData.limitations,
            wikiLinks: gad7OverviewData.wikiLinks
          }}
        />
      )}
    </div>
  );
}