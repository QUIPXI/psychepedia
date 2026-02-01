"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Brain, Check, X, BookOpen, GraduationCap } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { TestOverview } from "./TestOverview";
import { AcknowledgmentDialog } from "./AcknowledgmentDialog";
import { TeachingFeedback } from "./TeachingFeedback";

interface MMSEQuestion {
  q: string;
  answer: string;
  image?: string;
}

interface MMSESection {
  title: string;
  questions: MMSEQuestion[];
  maxPoints: number;
}

const mmseSections: MMSESection[] = [
  {
    title: "Orientation (10 points)",
    maxPoints: 10,
    questions: [
      { q: "What year is it?", answer: "" },
      { q: "What season is it?", answer: "" },
      { q: "What is the date today? (day of month)", answer: "" },
      { q: "What month is it?", answer: "" },
      { q: "What day of the week is it?", answer: "" },
      { q: "What country are we in?", answer: "" },
      { q: "What province/state are we in?", answer: "" },
      { q: "What city/town are we in?", answer: "" },
      { q: "What is the name of this place/building?", answer: "" },
      { q: "What floor are we on?", answer: "" },
    ],
  },
  {
    title: "Registration (3 points)",
    maxPoints: 3,
    questions: [
      { q: "I am going to name three objects. Listen carefully and repeat after me: APPLE. (1 point if correct)", answer: "" },
      { q: "PENNY. (1 point if correct)", answer: "" },
      { q: "TABLE. (1 point if correct)", answer: "" },
    ],
  },
  {
    title: "Attention & Calculation (5 points)",
    maxPoints: 5,
    questions: [
      { q: "Subtract 7 from 100. What is 100 - 7 = ? (93)", answer: "" },
      { q: "Now subtract 7 from 93. What is 93 - 7 = ? (86)", answer: "" },
      { q: "Now subtract 7 from 86. What is 86 - 7 = ? (79)", answer: "" },
      { q: "Now subtract 7 from 79. What is 79 - 7 = ? (72)", answer: "" },
      { q: "Now subtract 7 from 72. What is 72 - 7 = ? (65)", answer: "" },
    ],
  },
  {
    title: "Recall (3 points)",
    maxPoints: 3,
    questions: [
      { q: "What was the first object I asked you to remember? (Apple)", answer: "" },
      { q: "What was the second object? (Penny)", answer: "" },
      { q: "What was the third object? (Table)", answer: "" },
    ],
  },
  {
    title: "Naming (2 points)",
    maxPoints: 2,
    questions: [
      { q: "What is this called?", answer: "", image: "watch" },
      { q: "What is this called?", answer: "", image: "pencil" },
    ],
  },
  {
    title: "Repetition (1 point)",
    maxPoints: 1,
    questions: [
      { q: "Repeat this phrase after me: 'No ifs, ands, or buts'. (1 point if completely correct)", answer: "" },
    ],
  },
  {
    title: "Comprehension - 3-Step Command (3 points)",
    maxPoints: 3,
    questions: [
      { q: "Instruction Part 1: 'Take this paper in your RIGHT hand.' (1 point if performed correctly)", answer: "" },
      { q: "Instruction Part 2: 'Fold it in HALF.' (1 point if performed correctly)", answer: "" },
      { q: "Instruction Part 3: 'Put it on the FLOOR/CHAIR.' (1 point if performed correctly)", answer: "" },
    ],
  },
  {
    title: "Reading (1 point)",
    maxPoints: 1,
    questions: [
      { q: "Read this instruction and do what it says: 'Close your eyes.' (Show written command. 1 point if subject closes eyes)", answer: "" },
    ],
  },
  {
    title: "Writing (1 point)",
    maxPoints: 1,
    questions: [
      { q: "Write a complete sentence. (1 point if sentence has subject and verb, makes sense)", answer: "" },
    ],
  },
  {
    title: "Drawing (1 point)",
    maxPoints: 1,
    questions: [
      { q: "Copy this design: two intersecting pentagons. (1 point if all 10 angles are present and two polygons intersect)", answer: "", image: "pentagons" },
    ],
  },
];

const mmseOverviewData = {
  testName: {
    en: "Mini-Mental State Examination",
    ar: "فحص الحالة العقلية المصغر"
  },
  testAbbreviation: "MMSE",
  purpose: {
    en: "Brief cognitive screening instrument to assess orientation, memory, attention, language, and visuospatial abilities. Widely used for detecting cognitive impairment and dementia.",
    ar: "أداة فحص معرفي موجزة لتقييم التوجه والذاكرة والانتباه واللغة والقدرات البصرية-المكانية. تُستخدم على نطاق واسع لاكتشاف ضعف الإدراك والخرف."
  },
  targetPopulation: {
    en: "Adults, particularly older adults (65+), in clinical settings for cognitive screening.",
    ar: "البالغون، وخاصة كبار السن (65+)، في البيئات السريرية للفحص المعرفي."
  },
  administration: {
    time: "7-10 minutes",
    format: "Face-to-face interview",
    items: "10 sections, 30 items"
  },
  scoring: {
    range: "0-30 points",
    interpretationBands: [
      { range: "24-30", label: { en: "Normal", ar: "طبيعي" }, description: { en: "No cognitive impairment", ar: "لا يوجد ضعف إدراكي" } },
      { range: "18-23", label: { en: "Mild Cognitive Impairment", ar: "ضعف إدراكي خفيف" }, description: { en: "May indicate early cognitive decline", ar: "قد يشير إلى تدهور معرفي مبكر" } },
      { range: "10-17", label: { en: "Moderate Cognitive Impairment", ar: "ضعف إدراكي متوسط" }, description: { en: "Suggests moderate dementia", ar: "يشير إلى خرف متوسط" } },
      { range: "<10", label: { en: "Severe Cognitive Impairment", ar: "ضعف إدراكي شديد" }, description: { en: "Indicates severe dementia", ar: "يشير إلى خرف شديد" } }
    ],
    notes: {
      en: "Cutoffs vary by education level.",
      ar: "تختلف نقاط القطع حسب مستوى التعليم."
    }
  },
  strengths: {
    en: ["Quick and easy to administer", "Standardized procedures", "Widely recognized", "Good for detecting moderate to severe dementia"],
    ar: ["سريع وسهل التطبيق", "إجراءات موحدة", "معترف به على نطاق واسع", "جيد لاكتشاف الخرف المتوسط إلى الشديد"]
  },
  limitations: {
    en: ["Insensitive to mild cognitive impairment", "Education and culture bias", "Not a diagnostic tool", "Does not differentiate dementia types"],
    ar: ["غير حساس لضعف الإدراك الخفيف", "التحيز حسب التعليم والثقافة", "ليست أداة تشخيصية", "لا تميز بين أنواع الخرف"]
  },
  wikiLinks: [
    { en: "Neurocognitive Disorders", ar: "الاضطرابات العصبية المعرفية", href: "/wiki/clinical/neurocognitive-disorders" },
    { en: "Cognitive Assessment", ar: "التقييم المعرفي", href: "/wiki/clinical/assessment" }
  ]
};

const teachingFeedbackData = {
  exampleInterpretation: {
    en: "A score of 22/30 suggests mild cognitive impairment. In coursework terms, this would prompt further neuropsychological assessment to determine the nature and extent of cognitive deficits.",
    ar: "درجة 22/30 تشير إلى ضعف إدراكي خفيف. من الناحية الأكاديمية، هذا يشير إلى الحاجة لمزيد من التقييم العصبي النفسي."
  },
  commonMistakes: {
    en: ["Scoring 'close enough' answers instead of exact responses", "Forgetting to read instructions verbatim", "Using serial 7s for people with math anxiety"],
    ar: ["تصحيح الإجابات القريبة بدلاً من الدقيقة", "نسيان قراءة التعليمات حرفياً", "استخدام طرح 7 للمشخاص الذين يعانون من قلق الرياضيات"]
  },
  clinicalInappropriatenessNotes: {
    en: "Inappropriate when: patients with <8 years education, non-English speakers without validated translation, severe sensory impairments, or as sole criterion for diagnosis.",
    ar: "غير مناسب عندما: المرضى الذين لديهم أقل من 8 سنوات من التعليم، غير الناطقين بالإنجليزية دون ترجمة موثقة، ضعف حسي شديد."
  }
};

export default function MMSE() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [showOverview, setShowOverview] = useState(true);
  const [isAcknowledgmentOpen, setIsAcknowledgmentOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [tempScores, setTempScores] = useState<{ [key: string]: number }>({});
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    setIsAcknowledgmentOpen(true);
  };

  const handleAcknowledgmentConfirm = () => {
    setShowOverview(false);
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
  const maxScore = 30;

  const getInterpretation = (score: number) => {
    if (score >= 24) return {
      label: { en: "Normal", ar: "طبيعي" },
      description: { en: "No cognitive impairment detected", ar: "لم يتم اكتشاف ضعف إدراكي" }
    };
    if (score >= 18) return {
      label: { en: "Mild Cognitive Impairment", ar: "ضعف إدراكي خفيف" },
      description: { en: "May indicate early cognitive decline, further assessment recommended", ar: "قد يشير إلى تدهور معرفي مبكر، يوصى بمزيد من التقييم" }
    };
    if (score >= 10) return {
      label: { en: "Moderate Cognitive Impairment", ar: "ضعف إدراكي متوسط" },
      description: { en: "Suggests moderate dementia, clinical evaluation needed", ar: "يشير إلى خرف متوسط، يلزم تقييم سريري" }
    };
    return {
      label: { en: "Severe Cognitive Impairment", ar: "ضعف إدراكي شديد" },
      description: { en: "Indicates severe dementia, requires immediate clinical attention", ar: "يشير إلى خرف شديد، يتطلب اهتماماً سريرياً فورياً" }
    };
  };

  const interpretation = getInterpretation(totalScore);

  // Calculate section scores for feedback
  const sectionScores = mmseSections.map((section, sectionIndex) => {
    const sectionScore = section.questions.reduce((sum, _, qIndex) => {
      return sum + (tempScores[`${sectionIndex}-${qIndex}`] || 0);
    }, 0);
    return {
      name: section.title,
      score: sectionScore,
      maxScore: section.maxPoints,
      percentage: Math.round((sectionScore / section.maxPoints) * 100)
    };
  });

  return (
    <div className="space-y-6">
      <AcknowledgmentDialog
        open={isAcknowledgmentOpen}
        onOpenChange={setIsAcknowledgmentOpen}
        testName={mmseOverviewData.testName}
        testAbbreviation={mmseOverviewData.testAbbreviation}
        onConfirm={handleAcknowledgmentConfirm}
      />

      {showOverview ? (
        <div className="space-y-6">
          <div className="text-center py-4">
            <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">
              {isRtl ? mmseOverviewData.testName.ar : mmseOverviewData.testName.en} ({mmseOverviewData.testAbbreviation})
            </h3>
            <p className="text-muted-foreground mb-4">
              {isRtl ? "محاكاة تعليمية للطلاب" : "Educational Simulation for Students"}
            </p>
            <Button onClick={handleStart} className="gap-2">
              <GraduationCap className="w-4 h-4" />
              {isRtl ? "ابدأ المحاكاة التعليمية" : "Start Educational Simulation"}
            </Button>
          </div>
          <TestOverview {...mmseOverviewData} />
        </div>
      ) : isStarted && !showResult ? (
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
        <TeachingFeedback
          testName={mmseOverviewData.testName}
          testAbbreviation={mmseOverviewData.testAbbreviation}
          rawScore={totalScore}
          maxScore={maxScore}
          interpretation={interpretation}
          subscales={sectionScores.map(s => ({
            name: s.name,
            score: s.score,
            maxScore: s.maxScore,
            percentage: s.percentage,
            interpretation: {
              en: `${s.score}/${s.maxScore} (${s.percentage}%)`,
              ar: `${s.score}/${s.maxScore} (${s.percentage}%)`
            }
          }))}
          exampleInterpretation={teachingFeedbackData.exampleInterpretation}
          commonMistakes={teachingFeedbackData.commonMistakes}
          clinicalInappropriatenessNotes={teachingFeedbackData.clinicalInappropriatenessNotes}
          onReset={handleReset}
          wikiLinks={mmseOverviewData.wikiLinks}
          testDetails={{
            purpose: mmseOverviewData.purpose,
            targetPopulation: mmseOverviewData.targetPopulation,
            administration: mmseOverviewData.administration,
            scoring: mmseOverviewData.scoring,
            strengths: mmseOverviewData.strengths,
            limitations: mmseOverviewData.limitations,
            wikiLinks: mmseOverviewData.wikiLinks
          }}
        />
      )}
    </div>
  );
}