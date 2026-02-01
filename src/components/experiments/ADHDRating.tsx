"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Target, GraduationCap } from "lucide-react";
import { useLocale } from "next-intl";
import { TestOverview } from "./TestOverview";
import { AcknowledgmentDialog } from "./AcknowledgmentDialog";

const adhdOverviewData = {
  testName: { en: "Adult ADHD Self-Report Scale", ar: "مقياس التقييم الذاتي لاضطراب فرط الحركة ونقص الانتباه للبالغين" },
  testAbbreviation: "ASRS",
  purpose: {
    en: "Screening tool for attention-deficit/hyperactivity disorder symptoms in adults, assessing inattention, hyperactivity, and impulsivity.",
    ar: "أداة فحص لأعراض اضطراب نقص الانتباه وفرط النشاط لدى البالغين، تقيّم عدم الانتباه وفرط النشاط والاندفاعية."
  },
  targetPopulation: {
    en: "Adults (18+) for ADHD screening.",
    ar: "البالغون (18+) لفحص اضطراب فرط الحركة ونقص الانتباه."
  },
  administration: { time: "5-10 minutes", format: "Self-report questionnaire", items: "12 items" },
  scoring: {
    range: "0-48 points",
    interpretationBands: [
      { range: "0-17", label: { en: "Within Normal Range", ar: "ضمن النطاق الطبيعي" }, description: { en: "Unlikely ADHD symptoms", ar: "أعراض اضطراب فرط الحركة غير مرجحة" } },
      { range: "18-23", label: { en: "Mild Symptoms", ar: "أعراض خفيفة" }, description: { en: "Some attention difficulties", ar: "بعض صعوبات الانتباه" } },
      { range: "24-31", label: { en: "Moderate Symptoms", ar: "أعراض متوسطة" }, description: { en: "Consider professional evaluation", ar: "يُنصح بالتقييم المهني" } },
      { range: "32-48", label: { en: "Significant Symptoms", ar: "أعراض شديدة" }, description: { en: "Professional evaluation recommended", ar: "يوصى بالتقييم المهني" } }
    ],
    notes: { en: "This is a screening tool only, not a diagnostic instrument.", ar: "هذه أداة فحص فقط، وليست أداة تشخيصية." }
  },
  strengths: {
    en: ["Quick and easy", "WHO-developed", "Good sensitivity", "Available in multiple languages"],
    ar: ["سريع وسهل", "طوّرته منظمة الصحة العالمية", "حساسية جيدة", "متاح بلغات متعددة"]
  },
  limitations: {
    en: ["Self-report bias", "Not diagnostic", "Does not assess severity comprehensively", "Cultural factors may affect scores"],
    ar: ["تحيز التقرير الذاتي", "ليس تشخيصياً", "لا يقيّم الشدة بشكل شامل", "العوامل الثقافية قد تؤثر على الدرجات"]
  },
  wikiLinks: [
    { en: "ADHD", ar: "اضطراب فرط الحركة ونقص الانتباه", href: "/wiki/clinical/neurodevelopmental" },
    { en: "Attention Disorders", ar: "اضطرابات الانتباه", href: "/wiki/cognitive/attention-memory" }
  ]
};

const adhdQuestions = [
  "How often do you have trouble wrapping up the final details of a project, once the challenging parts are done?",
  "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
  "How often do you have problems remembering appointments or obligations?",
  "How often do you avoid or delay getting started on tasks that require a lot of thought?",
  "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
  "How often do you feel overly active and compelled to do things, as if driven by a motor?",
  "How often do you make careless mistakes?",
  "How often do you have trouble keeping your attention when you are doing boring or repetitive work?",
  "How often do you have difficulty keeping your attention in conversations?",
  "How often do you misplace things?",
  "How often are you distracted by activity or noise around you?",
  "How often do you leave your seat in meetings or situations where you are expected to remain seated?",
];

const adhdOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Very Often" },
];

export default function ADHDRating() {
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

    if (currentQuestion < adhdQuestions.length - 1) {
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
  const getSeverity = (score: number) => {
    if (score <= 17) return { label: isRtl ? "طبيعي" : "Within Normal Range", color: "text-green-600" };
    if (score <= 23) return { label: isRtl ? "علامات خفيفة" : "Mild Symptoms", color: "text-yellow-600" };
    if (score <= 31) return { label: isRtl ? "علامات متوسطة" : "Moderate Symptoms", color: "text-orange-600" };
    return { label: isRtl ? "علامات شديدة" : "Significant Symptoms", color: "text-red-600" };
  };

  const severity = getSeverity(totalScore);

  return (
    <div className="space-y-6">
      <AcknowledgmentDialog
        open={isAcknowledgmentOpen}
        onOpenChange={setIsAcknowledgmentOpen}
        testName={adhdOverviewData.testName}
        testAbbreviation={adhdOverviewData.testAbbreviation}
        onConfirm={handleAcknowledgmentConfirm}
      />

      {showOverview ? (
        <div className="space-y-6 py-4">
          <div className="text-center border-b border-border pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                {isRtl ? adhdOverviewData.testName.ar : adhdOverviewData.testName.en} ({adhdOverviewData.testAbbreviation})
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {isRtl ? "محاكاة تعليمية للطلاب" : "Educational Simulation for Students"}
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleStart} className="gap-2 px-8">
              <GraduationCap className="w-4 h-4" />
              {isRtl ? "ابدأ المحاكاة التعليمية" : "Start Educational Simulation"}
            </Button>
          </div>

          <TestOverview {...adhdOverviewData} />
        </div>
      ) : !isStarted ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">{isRtl ? "مقياس ADHD" : "ADHD Rating Scale"}</h3>
          <p className="text-muted-foreground mb-4">
            {isRtl 
              ? "تقييم أعراض اضطراب نقص الانتباه مع فرط النشاط"
              : "Screening for attention-deficit/hyperactivity disorder symptoms"}
          </p>
          <Button onClick={() => setIsStarted(true)} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ التقييم" : "Start Assessment"}
          </Button>
        </div>
      ) : !showResult ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{isRtl ? "السؤال" : "Question"} {currentQuestion + 1} {isRtl ? "من" : "of"} {adhdQuestions.length}</span>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestion / adhdQuestions.length) * 100}%` }}
            />
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-lg mb-4">{adhdQuestions[currentQuestion]}</p>

            <div className="space-y-2">
              {adhdOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-3 text-left border rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl font-bold mb-2">{totalScore}</div>
          <p className="text-muted-foreground mb-2">
            {isRtl ? "الدرجة الإجمالية" : "Total Score"}
          </p>
          <div className={`text-xl font-semibold mb-6 ${severity.color}`}>
            {severity.label}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 mb-4">
            <strong>{isRtl ? "ملاحظة:" : "Note:"}</strong> {isRtl ? "هذا تقييم ذاتي فقط. استشر مختصاً للحصول على تشخيص دقيق." : "This is a self-assessment only. Consult a professional for accurate diagnosis."}
          </div>

          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {isRtl ? "إعادة التقييم" : "Retake Assessment"}
          </Button>
        </div>
      )}
    </div>
  );
}