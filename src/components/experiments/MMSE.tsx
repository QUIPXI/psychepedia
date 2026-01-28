"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Brain, Check, X } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface MMSEQuestion {
  q: string;
  answer: string;
  image?: string;
}

interface MMSESection {
  title: string;
  questions: MMSEQuestion[];
}

const mmseSections: MMSESection[] = [
  {
    title: "Orientation (9 points)",
    questions: [
      { q: "What year is it?", answer: "" },
      { q: "What season is it?", answer: "" },
      { q: "What is the date today?", answer: "" },
      { q: "What day of the week is it?", answer: "" },
      { q: "What country are we in?", answer: "" },
      { q: "What province/state are we in?", answer: "" },
      { q: "What city/town are we in?", answer: "" },
      { q: "What is the address?", answer: "" },
      { q: "What floor are we on?", answer: "" },
    ],
  },
  {
    title: "Registration (3 points)",
    questions: [
      { q: "I am going to name three objects. After I say them, repeat them back to me. (Apple, Penny, Table) - Did they repeat all 3 correctly?", answer: "" },
    ],
  },
  {
    title: "Attention & Calculation (5 points)",
    questions: [
      { q: "Subtract 7 from 100. Then keep subtracting 7 from each new number. (93, 86, 79, 72, 65) - How many correct? (5, 4, 3, 2, 1, 0)", answer: "" },
    ],
  },
  {
    title: "Recall (3 points)",
    questions: [
      { q: "What were the three objects I asked you to remember? (3, 2, 1, 0)", answer: "" },
    ],
  },
  {
    title: "Naming (2 points)",
    questions: [
      { q: "What is this called?", answer: "", image: "watch" },
      { q: "What is this called?", answer: "", image: "pencil" },
    ],
  },
  {
    title: "Repetition (1 point)",
    questions: [
      { q: "Repeat this phrase: 'No ifs, ands, or buts' - Was it repeated correctly?", answer: "" },
    ],
  },
  {
    title: "Comprehension (3 points)",
    questions: [
      { q: "Listen: 'Take this paper in your right hand, fold it in half, put on floor.' - Points (3=all, 2=2, 1=1, 0=none)", answer: "" },
    ],
  },
  {
    title: "Reading (1 point)",
    questions: [
      { q: "Read and do: 'Close your eyes' - Did they close their eyes?", answer: "" },
    ],
  },
  {
    title: "Writing (1 point)",
    questions: [
      { q: "Write a complete sentence. - Is it a complete sentence?", answer: "" },
    ],
  },
  {
    title: "Drawing (1 point)",
    questions: [
      { q: "Copy this design: (Intersecting pentagons) - Is the copy acceptable?", answer: "", image: "pentagons" },
    ],
  },
];

export default function MMSE() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isStarted, setIsStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [tempScores, setTempScores] = useState<{ [key: string]: number }>({});
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    setCurrentSection(0);
    setCurrentQuestion(0);
    setTempScores({});
    setShowResult(false);
  };

  const handleScore = (points: number) => {
    const key = `${currentSection}-${currentQuestion}`;
    setTempScores(prev => ({ ...prev, [key]: points }));
  };

  const handleNext = () => {
    const key = `${currentSection}-${currentQuestion}`;
    if (tempScores[key] === undefined) {
      setTempScores(prev => ({ ...prev, [key]: 0 }));
    }

    if (currentQuestion < mmseSections[currentSection].questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      if (currentSection < mmseSections.length - 1) {
        setCurrentSection(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        setShowResult(true);
      }
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setCurrentSection(0);
    setCurrentQuestion(0);
    setTempScores({});
    setShowResult(false);
  };

  const totalScore = Object.values(tempScores).reduce((a, b) => a + b, 0);
  const currentKey = `${currentSection}-${currentQuestion}`;
  const currentScore = tempScores[currentKey];
  const maxScore = 20;

  const getInterpretation = (score: number) => {
    if (score >= 18) return { label: isRtl ? "طبيعي" : "Normal", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 14) return { label: isRtl ? "ضعف إدراكي خفيف" : "Mild Cognitive Impairment", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (score >= 7) return { label: isRtl ? "خرف متوسط" : "Moderate Dementia", color: "text-orange-600", bg: "bg-orange-100" };
    return { label: isRtl ? "خرف شديد" : "Severe Dementia", color: "text-red-600", bg: "bg-red-100" };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      {!isStarted ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">MMSE</h3>
          <p className="text-muted-foreground mb-4">
            {isRtl
              ? "فحص الإدراك المصغر - تقييم موجز للوظائف الإدراكية"
              : "Mini-Mental State Examination - Brief cognitive assessment"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {isRtl
              ? `يتكون من ${maxScore} نقطة`
              : `Consists of ${maxScore} points`}
          </p>
          <Button onClick={handleStart} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ الفحص" : "Start Assessment"}
          </Button>
        </div>
      ) : !showResult ? (
        <div className="space-y-4">
          {/* Scoreboard */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{isRtl ? "الدرجة" : "Score"}</span>
              <span className="text-lg font-bold">{totalScore}/{maxScore}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(totalScore / maxScore) * 100}%` }}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {mmseSections.map((section, i) => {
                const sectionMax = section.questions.reduce((sum, q) => sum + (q.answer === "" ? 1 : parseInt(q.answer.split(/[(),]/)[1] || "1") || 1), 0);
                return (
                  <div
                    key={i}
                    className={cn(
                      "px-2 py-1 rounded text-xs transition-colors",
                      i === currentSection ? "bg-primary text-primary-foreground" : "bg-background"
                    )}
                    title={`${section.title}: ${sectionMax}pts`}
                  >
                    {section.title.split(" ")[0]}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{mmseSections[currentSection].title}</span>
            <span>
              {isRtl ? "السؤال" : "Q"} {currentQuestion + 1}/{mmseSections[currentSection].questions.length}
            </span>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-lg mb-4">
              {mmseSections[currentSection].questions[currentQuestion].q}
            </p>

            {/* Image display */}
            {mmseSections[currentSection].questions[currentQuestion].image && (
              <div className="mb-4 p-4 bg-white rounded-lg border flex items-center justify-center min-h-[200px]">
                <img
                  src={`/images/experiments/mmse/${mmseSections[currentSection].questions[currentQuestion].image}.png`}
                  alt={mmseSections[currentSection].questions[currentQuestion].image}
                  className="max-h-[300px] object-contain"
                />
              </div>
            )}

            <div className="flex gap-3 mb-4">
              <Button
                variant={currentScore === 1 ? "default" : "outline"}
                onClick={() => handleScore(1)}
                className={cn(
                  "flex-1 gap-2",
                  currentScore === 1 && "bg-green-600 hover:bg-green-700"
                )}
              >
                <Check className="w-4 h-4" />
                {isRtl ? "صحيح" : "Correct"}
              </Button>
              <Button
                variant={currentScore === 0 ? "destructive" : "outline"}
                onClick={() => handleScore(0)}
                className="flex-1 gap-2"
              >
                <X className="w-4 h-4" />
                {isRtl ? "خطأ" : "Incorrect"}
              </Button>
            </div>

            <Button onClick={handleNext} className="w-full">
              {isRtl ? "التالي" : "Next"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl font-bold mb-2">{totalScore}/{maxScore}</div>
          <p className="text-muted-foreground mb-2">
            {isRtl ? "درجة MMSE" : "MMSE Score"}
          </p>
          <div className={cn("text-xl font-semibold mb-6 px-4 py-2 rounded-lg inline-block", interpretation.bg, interpretation.color)}>
            {interpretation.label}
          </div>

          {/* Section breakdown */}
          <div className="text-left max-w-md mx-auto p-4 bg-muted/30 rounded-lg space-y-2 text-sm mb-6">
            <p className="font-medium">{isRtl ? "تفسير الدرجة:" : "Score Interpretation:"}</p>
            <p>18-20: {isRtl ? "طبيعي" : "Normal"}</p>
            <p>14-17: {isRtl ? "ضعف إدراكي خفيف" : "Mild Cognitive Impairment"}</p>
            <p>7-13: {isRtl ? "خرف متوسط" : "Moderate Dementia"}</p>
            <p>&lt;7: {isRtl ? "خرف شديد" : "Severe Dementia"}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {isRtl ? "(المجموع الأقصى 20 نقطة)" : "(Max score is 20 points)"}
            </p>
          </div>

          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {isRtl ? "إعادة الفحص" : "Retake Assessment"}
          </Button>
        </div>
      )}
    </div>
  );
}