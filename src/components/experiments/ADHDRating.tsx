"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Target } from "lucide-react";
import { useLocale } from "next-intl";

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
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

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
      {!isStarted ? (
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