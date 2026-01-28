"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, FileText } from "lucide-react";
import { useLocale } from "next-intl";

interface PHQ9Question {
  text: string;
  options: { value: number; label: string }[];
}

const phq9Questions: PHQ9Question[] = [
  {
    text: "Little interest or pleasure in doing things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Feeling down, depressed, or hopeless?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Feeling tired or having little energy?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Poor appetite or overeating?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Feeling bad about yourself - or that you're a failure or have let yourself or your family down?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Trouble concentrating on things, such as reading the newspaper or watching television?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    text: "Thoughts that you would be better off dead or of hurting yourself in some way?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
];

export default function PHQ9Screening() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < phq9Questions.length - 1) {
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

  const getSeverity = (score: number) => {
    if (score <= 4) return { label: isRtl ? "لا يوجد اكتئاب" : "None", color: "text-green-600" };
    if (score <= 9) return { label: isRtl ? "اكتئاب خفيف" : "Mild", color: "text-yellow-600" };
    if (score <= 14) return { label: isRtl ? "اكتئاب متوسط" : "Moderate", color: "text-orange-600" };
    if (score <= 19) return { label: isRtl ? "اكتئاب متوسط-شديد" : "Moderately Severe", color: "text-red-600" };
    return { label: isRtl ? "اكتئاب شديد" : "Severe", color: "text-red-700" };
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const severity = getSeverity(totalScore);

  return (
    <div className="space-y-6">
      {!isStarted ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">PHQ-9</h3>
          <p className="text-muted-foreground mb-4">
            {isRtl 
              ? "استبيان لتقييم أعراض الاكتئاب خلال الأسبوعين الماضيين"
              : "Screening tool to assess depressive symptoms over the past two weeks"}
          </p>
          <div className="text-sm text-muted-foreground mb-4 space-y-2 text-left max-w-md mx-auto">
            <p>{isRtl ? "يتكون هذا الاستبيان من 9 أسئلة." : "This questionnaire consists of 9 questions."}</p>
            <p>{isRtl ? "كل سؤال يطلب منك اختيار مدى تكرار Symptom خلال الأسبوعين الماضيين." : "Each question asks how often you've been bothered by each symptom."}</p>
          </div>
          <Button onClick={() => setIsStarted(true)} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ الاستبيان" : "Start Questionnaire"}
          </Button>
        </div>
      ) : !showResult ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{isRtl ? "السؤال" : "Question"} {currentQuestion + 1} {isRtl ? "من" : "of"} {phq9Questions.length}</span>
            <span>{isRtl ? "التقدم:" : "Progress:"} {Math.round((currentQuestion / phq9Questions.length) * 100)}%</span>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestion / phq9Questions.length) * 100}%` }}
            />
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-4">
              {isRtl ? "خلال الأسبوعين الماضيين، كم مرة أزعجتك المشاكل التالية؟" : "Over the past two weeks, how often have you been bothered by the following problems?"}
            </h4>
            <p className="font-semibold text-lg mb-4">{phq9Questions[currentQuestion].text}</p>

            <div className="space-y-2">
              {phq9Questions[currentQuestion].options.map((option) => (
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
            {isRtl ? "درجة PHQ-9 الإجمالية" : "Total PHQ-9 Score"}
          </p>
          <div className={`text-xl font-semibold mb-6 ${severity.color}`}>
            {severity.label}
          </div>

          <div className="text-left max-w-md mx-auto p-4 bg-muted/30 rounded-lg space-y-2 text-sm mb-6">
            <p className="font-medium">{isRtl ? "تفسير الدرجة:" : "Score Interpretation:"}</p>
            <p>0-4: {isRtl ? "لا يوجد اكتئاب" : "None"}</p>
            <p>5-9: {isRtl ? "اكتئاب خفيف" : "Mild"}</p>
            <p>10-14: {isRtl ? "اكتئاب متوسط" : "Moderate"}</p>
            <p>15-19: {isRtl ? "اكتئاب متوسط-شديد" : "Moderately Severe"}</p>
            <p>20-27: {isRtl ? "اكتئاب شديد" : "Severe"}</p>
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