"use client";

import * as React from "react";
import { CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ArticleQuizQuestion } from "@/lib/articles";

interface ArticleQuizProps {
  questions: ArticleQuizQuestion[];
  title?: string;
  locale?: string;
  className?: string;
}

export function ArticleQuiz({ 
  questions, 
  title,
  locale = "en",
  className 
}: ArticleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [quizComplete, setQuizComplete] = React.useState(false);
  const [answeredQuestions, setAnsweredQuestions] = React.useState<Set<number>>(new Set());

  const isRtl = locale === "ar";

  if (!questions || questions.length === 0) return null;

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;
  const hasAnswered = answeredQuestions.has(currentQuestion);

  const handleAnswer = (index: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion));
    
    if (index === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setAnsweredQuestions(new Set());
  };

  const percentage = Math.round((score / questions.length) * 100);

  if (quizComplete) {
    return (
      <div className={cn("p-6 rounded-lg border border-border bg-card", className)}>
        <div className="text-center">
          <Trophy className={cn(
            "h-16 w-16 mx-auto mb-4",
            percentage >= 80 ? "text-yellow-500" : percentage >= 60 ? "text-slate-400" : "text-amber-700"
          )} />
          <h3 className="text-2xl font-bold mb-2">
            {isRtl ? "اكتمل الاختبار!" : "Quiz Complete!"}
          </h3>
          <p className="text-4xl font-bold text-primary mb-2">
            {score}/{questions.length}
          </p>
          <p className="text-muted-foreground mb-6">
            {percentage}% {isRtl ? "صحيح" : "correct"}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {percentage >= 80 
              ? (isRtl ? "ممتاز! أنت متمكن من هذا الموضوع." : "Excellent! You've mastered this topic.")
              : percentage >= 60 
                ? (isRtl ? "جيد! راجع المفاهيم التي أخطأت فيها." : "Good job! Review the concepts you missed.")
                : (isRtl ? "استمر في الدراسة وحاول مرة أخرى." : "Keep studying and try again.")
            }
          </p>
          <Button onClick={resetQuiz} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {isRtl ? "إعادة الاختبار" : "Retake Quiz"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 rounded-lg border border-border bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">
          {title || (isRtl ? "اختبر معلوماتك" : "Test Your Knowledge")}
        </h3>
        <span className="text-sm text-muted-foreground">
          {currentQuestion + 1}/{questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="text-lg font-medium mb-6">{question.question}</p>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === question.correctIndex;
          
          let buttonClass = "w-full text-left p-4 rounded-lg border transition-all ";
          
          if (showResult) {
            if (isCorrectAnswer) {
              buttonClass += "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300";
            } else if (isSelected && !isCorrectAnswer) {
              buttonClass += "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300";
            } else {
              buttonClass += "border-border bg-muted/50 text-muted-foreground";
            }
          } else {
            buttonClass += isSelected 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50 hover:bg-muted/50";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={hasAnswered}
              className={buttonClass}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrectAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {showResult && isSelected && !isCorrectAnswer && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && question.explanation && (
        <div className="p-4 rounded-lg bg-muted/50 border border-border mb-6">
          <p className="text-sm">
            <strong>{isRtl ? "شرح:" : "Explanation:"}</strong> {question.explanation}
          </p>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <Button onClick={nextQuestion} className="w-full gap-2">
          {currentQuestion < questions.length - 1 
            ? (isRtl ? "السؤال التالي" : "Next Question")
            : (isRtl ? "عرض النتائج" : "See Results")
          }
          <ChevronRight className={cn("h-4 w-4", isRtl && "rotate-180")} />
        </Button>
      )}
    </div>
  );
}

export default ArticleQuiz;
