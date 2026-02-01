"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, FileText, GraduationCap } from "lucide-react";
import { useLocale } from "next-intl";
import { TestOverview } from "./TestOverview";
import { AcknowledgmentDialog } from "./AcknowledgmentDialog";
import { TeachingFeedback } from "./TeachingFeedback";

interface PHQ9Question {
  text: { en: string; ar: string };
}

const phq9Options = [
  { value: 0, label: { en: "Not at all", ar: "إطلاقاً" } },
  { value: 1, label: { en: "Several days", ar: "عدة أيام" } },
  { value: 2, label: { en: "More than half the days", ar: "أكثر من نصف الأيام" } },
  { value: 3, label: { en: "Nearly every day", ar: "تقريباً كل يوم" } },
];

const phq9Questions: PHQ9Question[] = [
  {
    text: { en: "Little interest or pleasure in doing things?", ar: "قلة الاهتمام أو المتعة في القيام بالأشياء؟" },
  },
  {
    text: { en: "Feeling down, depressed, or hopeless?", ar: "الشعور بالإحباط أو الاكتئاب أو اليأس؟" },
  },
  {
    text: { en: "Trouble falling or staying asleep, or sleeping too much?", ar: "صعوبة في النوم أو البقاء نائماً، أو النوم كثيراً؟" },
  },
  {
    text: { en: "Feeling tired or having little energy?", ar: "الشعور بالتعب أو قلة الطاقة؟" },
  },
  {
    text: { en: "Poor appetite or overeating?", ar: "ضعف الشهية أو الإفراط في الأكل؟" },
  },
  {
    text: { en: "Feeling bad about yourself - or that you're a failure or have let yourself or your family down?", ar: "الشعور بالسوء تجاه نفسك - أو أنك فاشل أو خذلت نفسك أو عائلتك؟" },
  },
  {
    text: { en: "Trouble concentrating on things, such as reading the newspaper or watching television?", ar: "صعوبة التركيز على الأشياء، مثل قراءة الجريدة أو مشاهدة التلفزيون؟" },
  },
  {
    text: { en: "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?", ar: "التحرك أو التحدث ببطء شديد لدرجة أن الآخرين لاحظوا ذلك؟ أو العكس - الشعور بالتوتر أو القلق لدرجة التحرك أكثر من المعتاد؟" },
  },
  {
    text: { en: "Thoughts that you would be better off dead or of hurting yourself in some way?", ar: "أفكار بأنك ستكون أفضل حالاً ميتاً أو إيذاء نفسك بطريقة ما؟" },
  },
];

// PHQ-9 Test Overview Data
const phq9OverviewData = {
  testName: {
    en: "Patient Health Questionnaire-9",
    ar: "استبيان صحة المريض-9"
  },
  testAbbreviation: "PHQ-9",
  purpose: {
    en: "Standardized screening tool for detecting and measuring the severity of depression in primary care and general medical settings. Based on DSM criteria for major depressive disorder.",
    ar: "أداة فحص موحدة لاكتشاف وقياس شدة الاكتئاب في الرعاية الأولية والإعدادات الطبية العامة. تعتمد على معايير DSM لاضطراب الاكتئاب الرئيسي."
  },
  targetPopulation: {
    en: "Adults (18+) in primary care and general medical settings. Widely used for depression screening and monitoring treatment response.",
    ar: "البالغون (18+) في الرعاية الأولية والإعدادات الطبية العامة. يُستخدم على نطاق واسع لفحص الاكتئاب ومراقبة الاستجابة للعلاج."
  },
  administration: {
    time: "2-5 minutes",
    format: "Self-administered questionnaire",
    items: "9 items"
  },
  scoring: {
    range: "0-27 points",
    interpretationBands: [
      { range: "0-4", label: { en: "None", ar: "لا يوجد" }, description: { en: "Minimal or no depression symptoms", ar: "أعراض اكتئاب طفيفة أو معدومة" } },
      { range: "5-9", label: { en: "Mild", ar: "خفيف" }, description: { en: "Mild depression symptoms", ar: "أعراض اكتئاب خفيفة" } },
      { range: "10-14", label: { en: "Moderate", ar: "متوسط" }, description: { en: "Moderate depression", ar: "اكتئاب متوسط" } },
      { range: "15-19", label: { en: "Moderately Severe", ar: "متوسط إلى شديد" }, description: { en: "Moderately severe depression", ar: "اكتئاب متوسط إلى شديد" } },
      { range: "20-27", label: { en: "Severe", ar: "شديد" }, description: { en: "Severe depression", ar: "اكتئاب شديد" } }
    ],
    notes: {
      en: "Item 9 requires immediate clinical review if score is 1+.",
      ar: "البند 9 يتطلب مراجعة سريرية فورية إذا كانت الدرجة 1+."
    }
  },
  strengths: {
    en: ["Brief and easy to administer", "Validated in primary care", "Based on DSM criteria", "Good sensitivity and specificity"],
    ar: ["قصير وسهل التطبيق", "تم التحقق منه في الرعاية الأولية", "يعتمد على معايير DSM", "حساسية ونوعية جيدة"]
  },
  limitations: {
    en: ["Self-report measure", "Does not assess symptom duration", "Not a diagnostic tool"],
    ar: ["مقياس التقرير الذاتي", "لا يقيّم مدة الأعراض", "ليست أداة تشخيصية"]
  },
  wikiLinks: [
    { en: "Mood Disorders", ar: "اضطرابات المزاج", href: "/wiki/clinical/mood-disorders" },
    { en: "Depression", ar: "الاكتئاب", href: "/wiki/clinical/major-depressive-disorder" }
  ]
};

const phq9FeedbackData = {
  exampleInterpretation: {
    en: "A score of 14 indicates moderate depression. This would prompt consideration of evidence-based treatments such as CBT or medication.",
    ar: "درجة 14 تشير إلى اكتئاب متوسط. هذا سيدفع للنظر في العلاجات القائمة على الأدلة."
  },
  commonMistakes: {
    en: ["Interpreting as diagnostic tool", "Ignoring item 9 responses", "Using same cutoffs for all populations"],
    ar: ["التفسير كأداة تشخيصية", "تجاهل استجابات البند 9", "استخدام نفس نقاط القطع"]
  },
  clinicalInappropriatenessNotes: {
    en: "Inappropriate when: used as sole diagnostic criterion, without follow-up for positive screens, or item 9 score of 1+ without safety assessment.",
    ar: "غير مناسب عندما: يُستخدم كمعيار تشخيصي وحيد، بدون متابعة، أو درجة البند 9+ بدون تقييم سلامة."
  }
};

export default function PHQ9Screening() {
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

    if (currentQuestion < phq9Questions.length - 1) {
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

  const getInterpretation = (score: number) => {
    if (score <= 4) return {
      label: { en: "None", ar: "لا يوجد" },
      description: { en: "Minimal or no depression symptoms", ar: "أعراض اكتئاب طفيفة أو معدومة" }
    };
    if (score <= 9) return {
      label: { en: "Mild", ar: "خفيف" },
      description: { en: "Mild depression symptoms", ar: "أعراض اكتئاب خفيفة" }
    };
    if (score <= 14) return {
      label: { en: "Moderate", ar: "متوسط" },
      description: { en: "Moderate depression", ar: "اكتئاب متوسط" }
    };
    if (score <= 19) return {
      label: { en: "Moderately Severe", ar: "متوسط إلى شديد" },
      description: { en: "Moderately severe depression", ar: "اكتئاب متوسط إلى شديد" }
    };
    return {
      label: { en: "Severe", ar: "شديد" },
      description: { en: "Severe depression", ar: "اكتئاب شديد" }
    };
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = 27;
  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <AcknowledgmentDialog
        open={isAcknowledgmentOpen}
        onOpenChange={setIsAcknowledgmentOpen}
        testName={phq9OverviewData.testName}
        testAbbreviation={phq9OverviewData.testAbbreviation}
        onConfirm={handleAcknowledgmentConfirm}
      />

      {showOverview ? (
        <div className="space-y-6">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">
              {isRtl ? phq9OverviewData.testName.ar : phq9OverviewData.testName.en} ({phq9OverviewData.testAbbreviation})
            </h3>
            <p className="text-muted-foreground mb-4">
              {isRtl ? "محاكاة تعليمية للطلاب" : "Educational Simulation for Students"}
            </p>
            <div className="text-sm text-muted-foreground mb-4 space-y-2 text-left max-w-md mx-auto">
              <p>{isRtl ? `يتكون هذا الاستبيان من ${phq9Questions.length} أسئلة.` : `This questionnaire consists of ${phq9Questions.length} questions.`}</p>
              <p>{isRtl ? "كل سؤال يطلب منك اختيار مدى تكرار الأعراض خلال الأسبوعين الماضيين." : "Each question asks how often you've been bothered by each symptom over the past two weeks."}</p>
            </div>
            <Button onClick={handleStart} className="gap-2">
              <GraduationCap className="w-4 h-4" />
              {isRtl ? "ابدأ المحاكاة التعليمية" : "Start Educational Simulation"}
            </Button>
          </div>
          <TestOverview {...phq9OverviewData} />
        </div>
      ) : isStarted && !showResult ? (
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
            <p className="font-semibold text-lg mb-4">{isRtl ? phq9Questions[currentQuestion].text.ar : phq9Questions[currentQuestion].text.en}</p>

            <div className="space-y-2">
              {phq9Options.map((option) => (
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
          testName={phq9OverviewData.testName}
          testAbbreviation={phq9OverviewData.testAbbreviation}
          rawScore={totalScore}
          maxScore={maxScore}
          interpretation={interpretation}
          exampleInterpretation={phq9FeedbackData.exampleInterpretation}
          commonMistakes={phq9FeedbackData.commonMistakes}
          clinicalInappropriatenessNotes={phq9FeedbackData.clinicalInappropriatenessNotes}
          onReset={handleReset}
          wikiLinks={phq9OverviewData.wikiLinks}
          testDetails={{
            purpose: phq9OverviewData.purpose,
            targetPopulation: phq9OverviewData.targetPopulation,
            administration: phq9OverviewData.administration,
            scoring: phq9OverviewData.scoring,
            strengths: phq9OverviewData.strengths,
            limitations: phq9OverviewData.limitations,
            wikiLinks: phq9OverviewData.wikiLinks
          }}
        />
      )}
    </div>
  );
}