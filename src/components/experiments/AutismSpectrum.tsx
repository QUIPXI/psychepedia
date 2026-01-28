"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Brain } from "lucide-react";
import { useLocale } from "next-intl";

const autismQuestions = [
  "I prefer to do things with others rather than on my own.",
  "I prefer to do things the same way over and over again.",
  "If I try to imagine something, I find it very easy to create a picture in my mind.",
  "I frequently get strongly absorbed in one interest.",
  "I make eye contact with other people.",
  "I know how to tell if someone listening to me is getting bored.",
  "When I'm reading a story, I can easily imagine what the characters might look like.",
  "I am fascinated by dates.",
  "I can easily tell if someone else is interested or bored.",
  "I find it easy to read other people's facial expressions.",
  "I find it difficult to work out people's intentions.",
  "I usually notice details that others do not notice.",
  "If there is an interruption, I can switch back to what I was doing very quickly.",
  "I like to collect information about categories of things.",
  "I find it hard to understand other people's feelings.",
  "I often notice small sounds when others do not.",
  "I do not usually notice small changes in a situation.",
  "I like to plan any activities I do carefully.",
  "I find it hard to make conversation.",
  "I am good at social chitchat.",
  "When I was young, I used to enjoy playing games involving pretending with other children.",
  "I find it difficult to work out what is happening in social situations.",
  "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
  "I find it difficult to work out the intentions of others.",
  "I do not usually notice subtle changes in a situation.",
  "If there is a change in a plan, I get upset.",
  "I am good at planning my activities.",
  "I find it difficult to make friends.",
  "I find it hard to understand social rules.",
  "I avoid eye contact.",
];

const autismOptions = [
  { value: 0, label: "Definitely Agree" },
  { value: 1, label: "Slightly Agree" },
  { value: 2, label: "Slightly Disagree" },
  { value: 3, label: "Definitely Disagree" },
];

export default function AutismSpectrum() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < autismQuestions.length - 1) {
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
  const getInterpretation = (score: number) => {
    if (score < 32) return { label: isRtl ? "درجة منخفضة" : "Low Probability", color: "text-green-600" };
    if (score < 50) return { label: isRtl ? "درجة متوسطة" : "Medium Score", color: "text-yellow-600" };
    return { label: isRtl ? "درجة مرتفعة" : "High Probability", color: "text-orange-600" };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      {!isStarted ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">{isRtl ? "مقياس طيف التوحد (AQ)" : "Autism Spectrum Quotient (AQ)"}</h3>
          <p className="text-muted-foreground mb-4">
            {isRtl 
              ? "أداة فحص لتقييم سمات التوحد لدى البالغين"
              : "Screening tool to assess autistic traits in adults"}
          </p>
          <Button onClick={() => setIsStarted(true)} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ الفحص" : "Start Assessment"}
          </Button>
        </div>
      ) : !showResult ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{isRtl ? "السؤال" : "Question"} {currentQuestion + 1} {isRtl ? "من" : "of"} {autismQuestions.length}</span>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestion / autismQuestions.length) * 100}%` }}
            />
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-lg mb-4">{autismQuestions[currentQuestion]}</p>

            <div className="space-y-2">
              {autismOptions.map((option) => (
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
            {isRtl ? "درجة AQ الإجمالية" : "Total AQ Score"}
          </p>
          <div className={`text-xl font-semibold mb-6 ${interpretation.color}`}>
            {interpretation.label}
          </div>

          <div className="text-left max-w-md mx-auto p-4 bg-muted/30 rounded-lg space-y-2 text-sm mb-6">
            <p className="font-medium">{isRtl ? "ملاحظة:" : "Note:"}</p>
            <p>{isRtl ? "• درجة 32 أو أقل: احتمالية منخفضة" : "• Score 32 or below: Low probability"}</p>
            <p>{isRtl ? "• درجة 33-49: درجة متوسطة" : "• Score 33-49: Medium score"}</p>
            <p>{isRtl ? "• درجة 50 أو أعلى: احتمالية مرتفعة" : "• Score 50 or above: High probability"}</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 mb-4">
            <strong>{isRtl ? "تنبيه:" : "Note:"}</strong> {isRtl ? "هذا فحص ذاتي فقط. استشر مختصاً للحصول على تقييم شامل." : "This is a self-screening only. Consult a professional for comprehensive assessment."}
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