"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, User, Info, Brain, Heart, Shield, BookOpen, Briefcase, Users, ChevronDown, GraduationCap } from "lucide-react";
import { useLocale } from "next-intl";
import { TestOverview } from "./TestOverview";
import { AcknowledgmentDialog } from "./AcknowledgmentDialog";
import { TeachingFeedback } from "./TeachingFeedback";

interface BigFiveQuestion {
  text: string;
  key: string;
  reverse?: boolean;
}

interface BigFiveTrait {
  facets: string[];
  questions: BigFiveQuestion[];
  description: {
    en: string;
    ar: string;
  };
  highDescription: {
    en: string;
    ar: string;
  };
  lowDescription: {
    en: string;
    ar: string;
  };
  careers: {
    high: string[];
    low: string[];
  };
  relationships: {
    en: string;
    ar: string;
  };
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
    ],
    description: {
      en: "Reflects imagination, creativity, and preference for variety and new experiences.",
      ar: "يعكس الخيال والإبداع وتفضيل التنوع والتجارب الجديدة."
    },
    highDescription: {
      en: "You have a rich inner world and love exploring new ideas, art, and experiences. You're curious, creative, and open to unconventional perspectives.",
      ar: "لديك عالم داخلي غني وتحب استكشاف الأفكار والفن والتجارب الجديدة. أنت فضولي ومبدع ومنفتح على وجهات النظر غير التقليدية."
    },
    lowDescription: {
      en: "You prefer practical solutions and familiar routines. You focus on concrete facts and may find abstract thinking challenging.",
      ar: "تفضل الحلول العملية والروتين المألوف. تركز على الحقائق الملموسة وقد تجد التفكير التجريدي صعباً."
    },
    careers: {
      high: ["Artist", "Writer", "Scientist", "Designer", "Researcher", "Philosopher"],
      low: ["Accountant", "Manager", "Administrator", "Security Officer", "Quality Control"]
    },
    relationships: {
      en: "You appreciate partners who share your intellectual interests and enjoy trying new activities together.",
      ar: "تتقد伙伴 الذين يشاركونك اهتماماتك الفكرية ويستمتعون بتجربة أنشطة جديدة معاً."
    }
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
    ],
    description: {
      en: "Reflects self-discipline, organization, and goal-directed behavior.",
      ar: "يعكس الانضباط الذاتي والتنظيم والسلوك الموجّه نحو الأهداف."
    },
    highDescription: {
      en: "You're organized, responsible, and achievement-oriented. You plan ahead, meet deadlines, and take your commitments seriously.",
      ar: "منظم ومسؤول وموجه نحو الإنجاز. تخطط للمستقبل وتلتزم بالمواعيد النهائية وتأخذ التزاماتك على محمل الجد."
    },
    lowDescription: {
      en: "You're flexible and spontaneous, but may struggle with deadlines and organization. You prefer to keep your options open.",
      ar: "مرن وعفوي، لكن قد تواجه صعوبة في المواعيد النهائية والتنظيم. تفضل إبقاء خياراتك مفتوحة."
    },
    careers: {
      high: ["Executive", "Surgeon", "Project Manager", "Accountant", "Engineer", "Lawyer"],
      low: ["Artist", "Entrepreneur", "Consultant", "Travel Guide", "Freelancer"]
    },
    relationships: {
      en: "You value reliability and keep your promises. Partners appreciate your stability.",
      ar: "تتقد الموثوقية وتفي بوعودك. يقدرك партнерات على ثباتك."
    }
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
    ],
    description: {
      en: "Reflects sociability, energy, and tendency to seek stimulation from others.",
      ar: "يعكس الاجتماعية والطاقة والميل إلى البحث عن التحفيز من الآخرين."
    },
    highDescription: {
      en: "You're energetic, outgoing, and draw energy from social interactions. You enjoy being around people and are comfortable in group settings.",
      ar: "نشط و общиم وتجذب الطاقة من التفاعلات الاجتماعية. تستمتع Being around people and are comfortable in group settings."
    },
    lowDescription: {
      en: "You prefer quieter environments and one-on-one interactions. You may find large gatherings draining but value deep connections.",
      ar: "تفضل البيئات الهادئة والتفاعلات الثنائية. قد تجد التجمعات الكبيرة مُنهكة لكنك تقدر الروابط العميقة."
    },
    careers: {
      high: ["Salesperson", "Politician", "Teacher", "Manager", "PR Specialist", "Marketing"],
      low: ["Writer", "Researcher", "Librarian", "Accountant", "Software Developer", "Artist"]
    },
    relationships: {
      en: "You thrive on social interaction and may need partners who can match your energy.",
      ar: "تزدهر على التفاعل الاجتماعي وقد تحتاج إلى شركاء يمكنهم مواكبة طاقتك."
    }
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
    ],
    description: {
      en: "Reflects tendency to be compassionate, cooperative, and trusting toward others.",
      ar: "يعكس الميل إلى التعاطف والتعاون والثقة تجاه الآخرين."
    },
    highDescription: {
      en: "You're warm, empathetic, and value harmony in relationships. You go out of your way to help others and avoid conflict.",
      ar: "دافئ ومتempatique وتقدر الانسجام في العلاقات. تبذل جهداً إضافي لمساعدة الآخرين وتتجنب الصراعات."
    },
    lowDescription: {
      en: "You're direct and competitive. You prioritize your own goals and aren't afraid to engage in healthy debate.",
      ar: "مباشر وتنافسي. تعطي الأولوية لأهدافك ولا تخشى المشاركة في نقاش صحي."
    },
    careers: {
      high: ["Counselor", "Nurse", "Social Worker", "Teacher", "Human Resources", "Volunteer Coordinator"],
      low: ["Lawyer", "Judge", "Business Executive", "Military Officer", "Critic"]
    },
    relationships: {
      en: "You value cooperation and compromise. Partners appreciate your empathy.",
      ar: "تتقد التعاون والتنازل. يقدرك партнерات على تعاطفك."
    }
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
    ],
    description: {
      en: "Reflects emotional instability and tendency to experience negative emotions.",
      ar: "يعكس عدم الاستقرار العاطفي والميل إلى experiencing المشاعر السلبية."
    },
    highDescription: {
      en: "You're emotionally sensitive and may experience mood swings, anxiety, or stress more intensely. You have rich emotional experiences.",
      ar: "حساس عاطفياً وقد تعاني من تقلبات المزاج والقلق أو التوتر بشكل أكثر كثافة. لديك تجارب عاطفية غنية."
    },
    lowDescription: {
      en: "You're emotionally stable and resilient. You handle stress well and don't get easily upset by setbacks.",
      ar: "مستقر عاطفياً ومرن. تتعامل مع التوتر جيداً ولا تنزعج بسهولة من الانتكاسات."
    },
    careers: {
      high: ["Artist", "Writer", "Counselor", "Therapist", "Creative Professional", "Caregiver"],
      low: ["Surgeon", "Pilot", "Emergency Responder", "Judge", "Executive", "Engineer"]
    },
    relationships: {
      en: "You may need partners who understand your emotional needs and provide support during difficult times.",
      ar: "قد تحتاج إلى شركاء يفهمون احتياجاتك العاطفية ويقدمون الدعم خلال الأوقات الصعبة."
    }
  }
};

const responseOptions: { value: number; label: { en: string; ar: string } }[] = [
  { value: 1, label: { en: "Strongly Disagree", ar: "أعارض بشدة" } },
  { value: 2, label: { en: "Disagree a Little", ar: "أعارض قليلاً" } },
  { value: 3, label: { en: "Neutral", ar: "محايد" } },
  { value: 4, label: { en: "Agree a Little", ar: "أوافق قليلاً" } },
  { value: 5, label: { en: "Agree Strongly", ar: "أوافق بشدة" } },
];

const traitIcons: Record<string, React.ReactNode> = {
  Openness: <Brain className="w-5 h-5" />,
  Conscientiousness: <Shield className="w-5 h-5" />,
  Extraversion: <Heart className="w-5 h-5" />,
  Agreeableness: <Users className="w-5 h-5" />,
  Neuroticism: <Heart className="w-5 h-5" />,
};

// Big Five Test Overview Data
const bigFiveOverviewData = {
  testName: {
    en: "Big Five Personality Inventory",
    ar: "مقياس السمات الخمس الكبرى للشخصية"
  },
  testAbbreviation: "Big Five",
  purpose: {
    en: "Comprehensive personality assessment measuring five major dimensions of human personality. The most widely validated model in personality psychology, also known as OCEAN (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).",
    ar: "تقييم شامل للشخصية يقيس الأبعاد الخمسة الرئيسية للشخصية البشرية. النموذج الأكثر تحققاً في علم نفس الشخصية، المعروف أيضاً بـ OCEAN."
  },
  targetPopulation: {
    en: "Adults (18+) for personality assessment in research, clinical, and organizational settings. Not validated for clinical diagnosis of personality disorders.",
    ar: "البالغون (18+) لتقييم الشخصية في البيئات البحثية والسريرية والتنظيمية. لم يتم التحقق منه للتشخيص السريري لاضطرابات الشخصية."
  },
  administration: {
    time: "10-15 minutes",
    format: "Self-administered questionnaire",
    items: "50 items (10 per trait)"
  },
  scoring: {
    range: "0-100% per trait (composite score)",
    interpretationBands: [
      { range: "0-20%", label: { en: "Very Low", ar: "منخفض جداً" }, description: { en: "Extremely low on this trait dimension", ar: "منخفض جداً على هذا البعد من السمات" } },
      { range: "21-40%", label: { en: "Low", ar: "منخفض" }, description: { en: "Below average on this trait dimension", ar: "أقل من المتوسط على هذا البعد" } },
      { range: "41-60%", label: { en: "Average", ar: "متوسط" }, description: { en: "Average range on this trait dimension", ar: "نطاق متوسط على هذا البعد" } },
      { range: "61-80%", label: { en: "High", ar: "مرتفع" }, description: { en: "Above average on this trait dimension", ar: "أعلى من المتوسط على هذا البعد" } },
      { range: "81-100%", label: { en: "Very High", ar: "مرتفع جداً" }, description: { en: "Extremely high on this trait dimension", ar: "مرتفع جداً على هذا البعد" } }
    ],
    notes: {
      en: "Scores should be interpreted as continuous dimensions, not categories. Each trait exists on a spectrum.",
      ar: "يجب تفسير الدرجات كأبعاد مستمرة، وليس فئات. كل سمة موجودة على طيف."
    }
  },
  strengths: {
    en: [
      "Most validated personality model in psychological research",
      "Captures broad personality dimensions",
      "Useful across cultures when properly adapted",
      "Predicts various life outcomes (job performance, relationships, health)",
      "Comprehensive yet efficient"
    ],
    ar: [
      "النموذج الأكثر تحققاً للشخصية في البحث النفسي",
      "يلقط أبعاد الشخصية الرئيسية",
      "مفيد عبر الثقافات عند التكييف المناسب",
      "يتنبأ بنتائج الحياة المختلفة",
      "شامل وفعال"
    ]
  },
  limitations: {
    en: [
      "Does not capture all personality dimensions (e.g., honesty-humility from HEXACO)",
      "Self-report bias",
      "May not reflect actual behavior",
      "Not a diagnostic tool for personality disorders",
      "Cultural differences in trait expression"
    ],
    ar: [
      "لا يلتقط جميع أبعاد الشخصية",
      "تحيز التقرير الذاتي",
      "قد لا يعكس السلوك الفعلي",
      "ليست أداة تشخيصية لاضطرابات الشخصية",
      "اختلافات ثقافية في تعبير السمات"
    ]
  },
  wikiLinks: [
    { en: "Personality Psychology", ar: "علم نفس الشخصية", href: "/wiki/foundations/personality" },
    { en: "Personality Traits", ar: "سمات الشخصية", href: "/wiki/social-personality/traits" },
    { en: "Psychological Assessment", ar: "التقييم النفسي", href: "/wiki/clinical/assessment" }
  ]
};

const bigFiveFeedbackData = {
  exampleInterpretation: {
    en: "A profile showing high Openness (85%), moderate Conscientiousness (55%), high Extraversion (78%), moderate Agreeableness (52%), and low Neuroticism (35%) suggests someone who is creative, curious, organized, socially confident, cooperative, and emotionally stable. In clinical interpretation, this pattern is associated with openness to experience and emotional stability.",
    ar: "ملف شخصي يُظهر انفتاحاً عالياً (85%)، ضميرية معتدلة (55%)، انفتاحاً اجتماعياً عالياً (78%)، توافقاً معتدلاً (52%)، وعصابية منخفضة (35%) يقترح شخصاً مبدعاً، فضولياً، منظماً، واثقاً اجتماعياً، متعاوناً، ومستقراً عاطفياً."
  },
  commonMistakes: {
    en: [
      "Interpreting scores as fixed personality types rather than dimensions",
      "Forgetting to reverse-score negatively-keyed items",
      "Interpreting single traits in isolation without considering the full profile",
      "Assuming high/low scores are inherently better/worse",
      "Using for employment decisions without considering legal/ethical implications"
    ],
    ar: [
      "تفسير الدرئات كأنواع شخصية ثابتة بدلاً من الأبعاد",
      "نسيان عكس تسجيل البنود سلبية التوجيه",
      "تفسير السمات المفردة بمعزل عن الملف الكامل",
      "افتراض أن الدرجات العالية/المنخفضة أفضل/أسوأ بطبيعتها",
      "الاستخدام لقرارات التوظيف دون النظر في الآثار القانونية والأخلاقية"
    ]
  },
  clinicalInappropriatenessNotes: {
    en: "Big Five is inappropriate for clinical use when: (1) Used as sole assessment for personality disorders, (2) Making high-stakes personnel decisions without validation, (3) Ignoring cultural differences in response patterns, (4) Diagnosing mental illness based on trait profiles, (5) Using without proper training in psychological assessment.",
    ar: "يُعد Big Five غير مناسب للاستخدام السريري عندما: (1) يُستخدم كالتقييم الوحيد لاضطرابات الشخصية، (2) اتخاذ قرارات شخصية عالية المخاطر، (3) تجاهل الاختلافات الثقافية، (4) تشخيص الأمراض النفسية بناءً على ملفات السمات، (5) الاستخدام بدون التدريب المناسب."
  }
};

export default function BigFivePersonality() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [showOverview, setShowOverview] = useState(true);
  const [isAcknowledgmentOpen, setIsAcknowledgmentOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentTrait, setCurrentTrait] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [responseTimes, setResponseTimes] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const traits = Object.keys(bigFiveStructure);
  const currentTraitName = traits[currentTrait];
  const currentQuestions = bigFiveStructure[currentTraitName].questions;
  const totalQuestions = Object.values(bigFiveStructure).reduce((sum, t) => sum + t.questions.length, 0);
  const currentQuestionIndex = traits.slice(0, currentTrait).reduce((sum, t) => sum + bigFiveStructure[t].questions.length, 0) + currentQuestion;

  const handleStart = () => {
    setIsAcknowledgmentOpen(true);
  };

  const handleAcknowledgmentConfirm = () => {
    setShowOverview(false);
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
    setShowOverview(true);
    setIsStarted(false);
    setCurrentTrait(0);
    setCurrentQuestion(0);
    setResponses({});
    setResponseTimes({});
    setShowResult(false);
    setShowDetail(null);
  };

  // Calculate trait scores (simple percentage 0-100)
  const traitScores = useMemo(() => {
    const scores: Record<string, { percentage: number; label: string; level: 'high' | 'average' | 'low' }> = {};

    for (const trait of traits) {
      const traitResponses = bigFiveStructure[trait].questions.map((q: BigFiveQuestion, i: number) => {
        const value = responses[`${trait}-${i}`];
        const finalValue = q.reverse ? (value ? 6 - value : 3) : value;
        return finalValue || 3;
      });

      // Calculate raw mean (1-5 scale) then convert to percentage
      const raw = traitResponses.reduce((a: number, b: number) => a + b, 0) / traitResponses.length;
      const percentage = Math.round((raw / 5) * 100);

      // Get level based on percentage
      let level: 'high' | 'average' | 'low' = 'average';
      let label = "Average";
      if (percentage >= 75) {
        level = 'high';
        label = "Very High";
      } else if (percentage >= 60) {
        level = 'high';
        label = "High";
      } else if (percentage >= 40) {
        level = 'average';
        label = "Average";
      } else if (percentage >= 25) {
        level = 'low';
        label = "Low";
      } else {
        level = 'low';
        label = "Very Low";
      }

      scores[trait] = { percentage, label, level };
    }

    return scores;
  }, [responses, traits]);

  // Calculate completion time
  const completionTime = useMemo(() => {
    const times = Object.values(responseTimes);
    if (times.length === 0) return 0;
    return Math.round((Math.max(...times) - startTime) / 1000 / 60);
  }, [responseTimes, startTime]);

  // Get dominant traits
  const dominantTraits = useMemo(() => {
    return Object.entries(traitScores)
      .sort((a, b) => b[1].percentage - a[1].percentage)
      .slice(0, 2)
      .map(([trait, data]) => ({ trait, ...data }));
  }, [traitScores]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AcknowledgmentDialog
        open={isAcknowledgmentOpen}
        onOpenChange={setIsAcknowledgmentOpen}
        testName={bigFiveOverviewData.testName}
        testAbbreviation={bigFiveOverviewData.testAbbreviation}
        onConfirm={handleAcknowledgmentConfirm}
      />

      {showOverview ? (
        <div className="space-y-6 py-4">
          {/* Header */}
          <div className="text-center border-b border-border pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                {isRtl ? bigFiveOverviewData.testName.ar : bigFiveOverviewData.testName.en} ({bigFiveOverviewData.testAbbreviation})
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {isRtl ? "محاكاة تعليمية للطلاب" : "Educational Simulation for Students"}
            </p>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <Button onClick={handleStart} className="gap-2 px-8">
              <GraduationCap className="w-4 h-4" />
              {isRtl ? "ابدأ المحاكاة التعليمية" : "Start Educational Simulation"}
            </Button>
          </div>

          <TestOverview {...bigFiveOverviewData} />
        </div>
      ) : isStarted && !showResult ? (
        /* Questions */
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex justify-between items-center text-sm border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                {traitIcons[currentTraitName]}
              </div>
              <span className="font-medium">{currentTraitName}</span>
            </div>
            <span className="text-muted-foreground">
              {isRtl ? `السؤال ${currentQuestionIndex + 1} من ${totalQuestions}` : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Trait Progress */}
          <div className="flex gap-1 justify-center">
            {traits.map((trait, traitIndex) => {
              const traitQuestions = bigFiveStructure[trait].questions.length;
              const traitStartIndex = traits.slice(0, traitIndex).reduce((sum, t) => sum + bigFiveStructure[t].questions.length, 0);
              const isCompleted = traitIndex < currentTrait;
              const isCurrent = traitIndex === currentTrait;

              return (
                <div key={trait} className="flex flex-col items-center">
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(traitQuestions, 5) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isCompleted ? "bg-primary" :
                          isCurrent && (traitStartIndex + i) < currentQuestionIndex ? "bg-primary" :
                          isCurrent && (traitStartIndex + i) === currentQuestionIndex ? "bg-primary/60" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Question */}
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="font-medium text-base mb-6 leading-relaxed">
              {currentQuestions[currentQuestion].text}
            </p>

            <div className="space-y-2">
              {responseOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-3 text-left border border-border rounded hover:bg-muted hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium text-sm">{option.value}. </span>
                  <span className="text-sm">{isRtl ? option.label.ar : option.label.en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b border-border pb-4">
            <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-1">
              {isRtl ? "نتيجة الاختبار" : "Test Results"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRtl
                ? `وقت الإكمال: ${completionTime} دقيقة`
                : `Completion time: ${completionTime} minutes`}
            </p>
          </div>

          {/* Dominant Traits */}
          {dominantTraits.length > 0 && (
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {isRtl ? "السمات البارزة" : "Dominant Traits"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {dominantTraits.map(({ trait, percentage, label }) => (
                  <div key={trait} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      {traitIcons[trait]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{isRtl ? trait : trait}</p>
                      <p className="text-xs text-muted-foreground">{label} ({percentage}%)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trait Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              {isRtl ? "تفاصيل السمات" : "Trait Details"}
            </h4>
            {Object.entries(traitScores).map(([trait, data]) => (
              <div key={trait} className="bg-card border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowDetail(showDetail === trait ? null : trait)}
                  className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {traitIcons[trait]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{isRtl ? trait : trait}</p>
                        <p className="text-sm font-medium">{data.percentage}%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDetail === trait ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {showDetail === trait && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                    {/* Description */}
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">
                        {data.level === 'high'
                          ? (isRtl ? bigFiveStructure[trait as keyof typeof bigFiveStructure].highDescription.ar : bigFiveStructure[trait as keyof typeof bigFiveStructure].highDescription.en)
                          : data.level === 'low'
                          ? (isRtl ? bigFiveStructure[trait as keyof typeof bigFiveStructure].lowDescription.ar : bigFiveStructure[trait as keyof typeof bigFiveStructure].lowDescription.en)
                          : (isRtl ? bigFiveStructure[trait as keyof typeof bigFiveStructure].description.ar : bigFiveStructure[trait as keyof typeof bigFiveStructure].description.en)
                        }
                      </p>
                    </div>

                    {/* Facets */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        <span className="font-medium">{isRtl ? "الجوانب الفرعية:" : "Facets:"}</span> {bigFiveStructure[trait as keyof typeof bigFiveStructure].facets.join(", ")}
                      </p>
                    </div>

                    {/* Career Paths */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/30 rounded-lg p-2">
                        <p className="text-xs font-medium mb-1">{isRtl ? "عند الدرجة العالية:" : "High Score:"}</p>
                        <p className="text-xs text-muted-foreground">
                          {bigFiveStructure[trait as keyof typeof bigFiveStructure].careers.high.join(", ")}
                        </p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2">
                        <p className="text-xs font-medium mb-1">{isRtl ? "عند الدرجة المنخفضة:" : "Low Score:"}</p>
                        <p className="text-xs text-muted-foreground">
                          {bigFiveStructure[trait as keyof typeof bigFiveStructure].careers.low.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Relationships */}
                    <div className="bg-muted/30 rounded-lg p-2">
                      <p className="text-xs font-medium mb-1">{isRtl ? "في العلاقات:" : "In Relationships:"}</p>
                      <p className="text-xs text-muted-foreground">
                        {isRtl ? bigFiveStructure[trait as keyof typeof bigFiveStructure].relationships.ar : bigFiveStructure[trait as keyof typeof bigFiveStructure].relationships.en}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <p className="text-xs text-muted-foreground text-justify leading-relaxed">
              {isRtl
                ? "هذا الاختبار يقيس السمات الشخصية بناءً على التقرير الذاتي. قد تختلف النتائج حسب الحالة المزاجية والسياق. للحصول على تقييم احترافي، يرجى استشارة أخصائي صحة نفسية مرخص."
                : "This test measures personality traits based on self-report. Results may vary depending on mood and context. For a comprehensive professional assessment, please consult a licensed mental health professional."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
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
