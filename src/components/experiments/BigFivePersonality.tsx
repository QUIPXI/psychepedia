"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, User, Info } from "lucide-react";
import { useLocale } from "next-intl";

interface BigFiveQuestion {
  text: string;
  key: string;
  reverse?: boolean;
}

interface BigFiveTrait {
  facets: string[];
  questions: BigFiveQuestion[];
}

// Trait and facet structure following Big Five best practices
const bigFiveStructure: Record<string, BigFiveTrait> = {
  Openness: {
    facets: ["Openness to Experience", "Intellectual Curiosity", "Aesthetic Sensitivity"],
    questions: [
      { text: "I have a vivid imagination.", key: "positive" },
      { text: "I am not interested in abstract ideas.", key: "negative", reverse: true },
      { text: "I have excellent ideas.", key: "positive" },
      { text: "I have difficulty understanding abstract ideas.", key: "negative", reverse: true },
      { text: "I am full of ideas.", key: "positive" },
      { text: "I do not have a good imagination.", key: "negative", reverse: true },
      { text: "I am quick to understand things.", key: "positive" },
      { text: "I use difficult words.", key: "positive" },
      { text: "I spend time reflecting on things.", key: "positive" },
      { text: "I am not interested in art or music.", key: "negative", reverse: true },
    ]
  },
  Conscientiousness: {
    facets: ["Self-Efficacy", "Orderliness", "Achievement Striving", "Self-Discipline"],
    questions: [
      { text: "I get chores done right away.", key: "positive" },
      { text: "I often forget to put things back in their proper place.", key: "negative", reverse: true },
      { text: "I like order.", key: "positive" },
      { text: "I make a mess of things.", key: "negative", reverse: true },
      { text: "I get things done quickly.", key: "positive" },
      { text: "I need a push to get going.", key: "negative", reverse: true },
      { text: "I strive for excellence.", key: "positive" },
      { text: "I feel competent.", key: "positive" },
      { text: "I am efficient.", key: "positive" },
      { text: "I often leave things undone.", key: "negative", reverse: true },
    ]
  },
  Extraversion: {
    facets: ["Friendliness", "Gregariousness", "Assertiveness", "Activity Level"],
    questions: [
      { text: "I am the life of the party.", key: "positive" },
      { text: "I don't talk a lot.", key: "negative", reverse: true },
      { text: "I feel comfortable around people.", key: "positive" },
      { text: "I keep in the background.", key: "negative", reverse: true },
      { text: "I start conversations.", key: "positive" },
      { text: "I have little to say.", key: "negative", reverse: true },
      { text: "I talk to a lot of different people at parties.", key: "positive" },
      { text: "I don't like to draw attention to myself.", key: "negative", reverse: true },
      { text: "I don't mind being the center of attention.", key: "positive" },
      { text: "I am quiet around strangers.", key: "negative", reverse: true },
    ]
  },
  Agreeableness: {
    facets: ["Trust", "Straightforwardness", "Altruism", "Compliance"],
    questions: [
      { text: "I am interested in people.", key: "positive" },
      { text: "I insult people.", key: "negative", reverse: true },
      { text: "I sympathize with others' feelings.", key: "positive" },
      { text: "I am not interested in other people's problems.", key: "negative", reverse: true },
      { text: "I have a soft heart.", key: "positive" },
      { text: "I am not really interested in others.", key: "negative", reverse: true },
      { text: "I take time out for others.", key: "positive" },
      { text: "I feel others' emotions.", key: "positive" },
      { text: "I make people feel at ease.", key: "positive" },
      { text: "I tend to be critical of others.", key: "negative", reverse: true },
    ]
  },
  Neuroticism: {
    facets: ["Anxiety", "Depression", "Self-Consciousness", "Vulnerability"],
    questions: [
      { text: "I am not easily disturbed.", key: "negative", reverse: true },
      { text: "I get stressed out easily.", key: "positive" },
      { text: "I worry about things.", key: "positive" },
      { text: "I am relaxed most of the time.", key: "negative", reverse: true },
      { text: "I seldom feel blue.", key: "negative", reverse: true },
      { text: "I am easily disturbed.", key: "positive" },
      { text: "I get irritated easily.", key: "positive" },
      { text: "I often feel blue.", key: "positive" },
      { text: "I am alarmed by negative events.", key: "positive" },
      { text: "I handle stress well.", key: "negative", reverse: true },
    ]
  }
};

const responseOptions: { value: number; label: { en: string; ar: string } }[] = [
  { value: 1, label: { en: "Strongly Disagree", ar: "أعارض بشدة" } },
  { value: 2, label: { en: "Disagree a Little", ar: "أعارض قليلاً" } },
  { value: 3, label: { en: "Neutral", ar: "محايد" } },
  { value: 4, label: { en: "Agree a Little", ar: "أوافق قليلاً" } },
  { value: 5, label: { en: "Agree Strongly", ar: "أوافق بشدة" } },
];

export default function BigFivePersonality() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isStarted, setIsStarted] = useState(false);
  const [currentTrait, setCurrentTrait] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [responseTimes, setResponseTimes] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);

  const traits = Object.keys(bigFiveStructure);
  const currentTraitName = traits[currentTrait];
  const currentQuestions = bigFiveStructure[currentTraitName].questions;
  const totalQuestions = Object.values(bigFiveStructure).reduce((sum, t) => sum + t.questions.length, 0);
  const currentQuestionIndex = traits.slice(0, currentTrait).reduce((sum, t) => sum + bigFiveStructure[t].questions.length, 0) + currentQuestion;

  const handleStart = () => {
    setIsStarted(true);
    setResponses({});
    setResponseTimes({});
    setCurrentTrait(0);
    setCurrentQuestion(0);
    setShowResult(false);
    setStartTime(Date.now());
  };

  const handleAnswer = useCallback((value: number) => {
    const questionKey = `${currentTraitName}-${currentQuestion}`;
    const now = Date.now();
    const timeKey = `${questionKey}-time`;
    
    setResponses(prev => ({ ...prev, [questionKey]: value }));
    setResponseTimes(prev => ({ ...prev, [timeKey]: now }));

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      if (currentTrait < traits.length - 1) {
        setCurrentTrait(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        setShowResult(true);
      }
    }
  }, [currentTrait, currentQuestion, currentQuestions.length, currentTraitName]);

  const handleReset = () => {
    setIsStarted(false);
    setCurrentTrait(0);
    setCurrentQuestion(0);
    setResponses({});
    setResponseTimes({});
    setShowResult(false);
  };

  // Calculate trait scores (simple percentage 0-100)
  const traitScores = useMemo(() => {
    const scores: Record<string, { percentage: number; label: string }> = {};
    
    for (const trait of traits) {
      const traitResponses = bigFiveStructure[trait].questions.map((q: BigFiveQuestion, i: number) => {
        const value = responses[`${trait}-${i}`];
        const finalValue = q.reverse ? (value ? 6 - value : 3) : value;
        return finalValue || 3;
      });

      // Calculate raw mean (1-5 scale) then convert to percentage
      const raw = traitResponses.reduce((a: number, b: number) => a + b, 0) / traitResponses.length;
      const percentage = Math.round((raw / 5) * 100);

      // Get label based on percentage
      let label = "Low";
      if (percentage >= 80) label = "Very High";
      else if (percentage >= 65) label = "High";
      else if (percentage >= 45) label = "Average";
      else if (percentage >= 35) label = "Low";

      scores[trait] = { percentage, label };
    }

    return scores;
  }, [responses, traits]);

  // Calculate completion time
  const completionTime = useMemo(() => {
    const times = Object.values(responseTimes);
    if (times.length === 0) return 0;
    return Math.round((Math.max(...times) - startTime) / 1000 / 60);
  }, [responseTimes, startTime]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <User className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">
          {isRtl ? "اختبار السمات الخمس الكبرى" : "Big Five Personality Test"}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isRtl 
            ? "قيّم شخصيتك على الأبعاد الخمسة الرئيسية بناءً على عينة معيارية"
            : "Assess your personality on the five major dimensions based on a normative sample"}
        </p>
      </div>

      {!isStarted ? (
        /* Start Screen */
        <div className="text-center py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {traits.map((trait) => (
              <div key={trait} className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">{isRtl ? trait : trait}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {bigFiveStructure[trait as keyof typeof bigFiveStructure].questions.length} {isRtl ? "أسئلة" : "questions"}
                </p>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {isRtl 
              ? "يتكون الاختبار من 50 سؤالاً ويستغرق حوالي 10 دقائق. أجب بصدق عن كل سؤال."
              : "The test consists of 50 questions and takes approximately 10 minutes. Answer each question honestly."}
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg max-w-lg mx-auto">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-200 text-left">
                <strong>{isRtl ? "ملاحظة مهمة:" : "Important Note:"}</strong><br/>
                {isRtl 
                  ? "النتائج تمثل تقديرات سمة الشخصية بناءً على استجاباتك. هذا اختبار ذاتي ولا يشمل تشخيص أي حالة صحية نفسية."
                  : "Results represent trait estimates based on your responses. This is a self-report tool and does not diagnose any psychological condition."}
              </p>
            </div>
          </div>

          <Button onClick={handleStart} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ الاختبار" : "Start Test"}
          </Button>
        </div>
      ) : !showResult ? (
        /* Questions */
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{currentTraitName}</span>
            <span>{isRtl ? "السؤال" : "Q"} {currentQuestionIndex + 1} {isRtl ? "من" : "of"} {totalQuestions}</span>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="p-6 bg-muted/30 rounded-lg">
            <p className="font-semibold text-lg mb-6">
              {currentQuestions[currentQuestion].text}
            </p>

            <div className="space-y-2">
              {responseOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left border rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span className="font-medium">{option.value}. </span>
                  {isRtl ? option.label.ar : option.label.en}
                </button>
              ))}
            </div>
          </div>

          {/* Progress indicator for current trait */}
          <div className="flex gap-1 justify-center">
            {currentQuestions.map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < currentQuestion ? "bg-primary" : 
                  i === currentQuestion ? "bg-primary/50" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              {isRtl ? "نتيجة شخصيتك" : "Your Personality Result"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRtl 
                ? `وقت الإكمال: ${completionTime} دقيقة`
                : `Completion time: ${completionTime} minutes`}
            </p>
          </div>

          {/* Trait Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {Object.entries(traitScores).map(([trait, data]) => (
              <div key={trait} className="p-5 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium">{isRtl ? trait : trait}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{data.percentage}%</p>
                  </div>
                </div>

                {/* Percentage bar */}
                <div className="relative mb-2">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-200 text-justify">
                {isRtl 
                  ? "هذا الاختبار يقيس سمات الشخصية الذاتية. للحصول على تقييم احترافي، يرجى استشارة أخصائي صحة نفسية مرخص."
                  : "This test measures self-reported personality traits. For professional assessment, please consult a licensed mental health professional."}
              </p>
            </div>
          </div>

          {/* Retake */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {isRtl ? "إعادة الاختبار" : "Retake Test"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}