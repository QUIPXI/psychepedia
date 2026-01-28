"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, FileText } from "lucide-react";
import { useLocale } from "next-intl";

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
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export default function GAD7Screening() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

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
    setIsStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const getSeverity = (score: number) => {
    if (score <= 4) return { label: isRtl ? "لا يوجد قلق" : "None", color: "text-green-600" };
    if (score <= 9) return { label: isRtl ? "قلق خفيف" : "Mild", color: "text-yellow-600" };
    if (score <= 14) return { label: isRtl ? "قلق متوسط" : "Moderate", color: "text-orange-600" };
    return { label: isRtl ? "قلق شديد" : "Severe", color: "text-red-600" };
  };

  const severity = getSeverity(totalScore);

  return (
    <div className="space-y-6">
      {!isStarted ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">GAD-7</h3>
          <p className="text-muted-foreground mb-4">
            {isRtl 
              ? "استبيان لتقييم أعراض القلق خلال الأسبوعين الماضيين"
              : "Screening tool to assess generalized anxiety symptoms over the past two weeks"}
          </p>
          <Button onClick={() => setIsStarted(true)} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ الاستبيان" : "Start Questionnaire"}
          </Button>
        </div>
      ) : !showResult ? (
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
            {isRtl ? "درجة GAD-7 الإجمالية" : "Total GAD-7 Score"}
          </p>
          <div className={`text-xl font-semibold mb-6 ${severity.color}`}>
            {severity.label}
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 mb-4">
            <strong>{isRtl ? "تنبيه:" : "Note:"}</strong> {isRtl ? "هذا فحص ذاتي فقط ولا يحل محل التقييم المهني." : "This is a self-screening only and does not replace professional assessment."}
          </div>

          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {isRtl ? "إعادة الاختبار" : "Retake Test"}
          </Button>
        </div>
      )}
    </div>
  );
}