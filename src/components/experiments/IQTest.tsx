"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, User, Info, Clock, Brain, Eye, Zap, FileText, ChevronRight, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { useLocale } from "next-intl";

interface IQQuestion {
  id: number;
  type: 'verbal' | 'pattern' | 'numeric' | 'sequence' | 'spatial';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface IQSection {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  questions: IQQuestion[];
  timeLimit?: number; // in seconds, 0 = no limit
  pointsPerQuestion: number;
}

// Verbal Comprehension Questions
const verbalQuestions: IQQuestion[] = [
  {
    id: 1,
    type: 'verbal',
    question: "Which word is most similar in meaning to 'PRECIPITOUS'?",
    options: ["Careful", "Steep", "Slow", "Safe", "Quiet"],
    correctAnswer: 1,
    explanation: "Precipitous means steep or sheer, like a precipice. It can also mean done suddenly without preparation."
  },
  {
    id: 2,
    type: 'verbal',
    question: "Complete the analogy: BOOK is to AUTHOR as PAINTING is to _______",
    options: ["Canvas", "Museum", "Artist", "Frame", "Color"],
    correctAnswer: 2,
    explanation: "An author creates a book, just as an artist creates a painting."
  },
  {
    id: 3,
    type: 'verbal',
    question: "Which word does NOT belong?",
    options: ["Oak", "Pine", "Birch", "Rose", "Cedar"],
    correctAnswer: 3,
    explanation: "Oak, Pine, Birch, and Cedar are all trees. Rose is a flowering plant."
  },
  {
    id: 4,
    type: 'verbal',
    question: "Select the pair that best completes: DWARF is to GIANT as WHISPER is to ______",
    options: ["Speak", "Shout", "Talk", "Murmur", "Silence"],
    correctAnswer: 1,
    explanation: "Dwarf and giant are opposites in size. Whisper and shout are opposites in volume. Both pairs represent extremes on a spectrum."
  },
  {
    id: 5,
    type: 'verbal',
    question: "What is the opposite of 'OBSTINATE'?",
    options: ["Flexible", "Stubborn", "Hard", "Rigid", "Strong"],
    correctAnswer: 0,
    explanation: "Obstinate means stubbornly refusing to change one's opinion. Flexible means willing to change or compromise."
  },
  {
    id: 6,
    type: 'verbal',
    question: "If all BLOOMS are FLOWERS, and some FLOWERS are ROSES, which must be true?",
    options: ["Some BLOOMS are ROSES", "Some ROSES are BLOOMS", "All ROSES are BLOOMS", "No BLOOMS are ROSES", "Cannot be determined"],
    correctAnswer: 4,
    explanation: "We know blooms are a subset of flowers and roses overlap with flowers, but we cannot determine if roses and blooms overlap. The roses could be flowers that are not blooms."
  },
  {
    id: 7,
    type: 'verbal',
    question: "Which sentence uses the word 'BEAR' with a different meaning?",
    options: ["The zoo has a polar bear", "He couldn't bear the pain", "The bear market worried investors", "The bear lumbered through the forest", "She had to bear responsibility"],
    correctAnswer: 2,
    explanation: "In options 1 and 4, 'bear' refers to the animal. In 2 and 5, it means 'to endure.' In 3, 'bear market' refers to a falling market."
  },
  {
    id: 8,
    type: 'verbal',
    question: "Complete the series: SILENT, QUIET, MUTE, _____, TALKATIVE",
    options: ["Loud", "Noisy", "Vocal", "Speechless", "Boisterous"],
    correctAnswer: 2,
    explanation: "The series progresses from silent to talkative (more communicative). Vocal fits between mute (unable to speak) and talkative."
  }
];

// Perceptual Reasoning / Pattern Questions (fixed)
const patternQuestions: IQQuestion[] = [
  {
    id: 1,
    type: 'pattern',
    question: "What comes next in the sequence: 3, 6, 12, 24, ____?",
    options: ["36", "42", "48", "54", "60"],
    correctAnswer: 2,
    explanation: "Each number is doubled: 3×2=6, 6×2=12, 12×2=24, 24×2=48."
  },
  {
    id: 2,
    type: 'pattern',
    question: "What is the next number: 2, 3, 5, 7, 11, ____?",
    options: ["12", "13", "14", "15", "16"],
    correctAnswer: 1,
    explanation: "These are prime numbers in order: 2, 3, 5, 7, 11, next is 13."
  },
  {
    id: 3,
    type: 'pattern',
    question: "Complete the pattern: AZ, BY, CX, DW, ____",
    options: ["EV", "FU", "GT", "HS", "IR"],
    correctAnswer: 0,
    explanation: "First letters go forward (A, B, C, D, E) and second letters go backward (Z, Y, X, W, V)."
  },
  {
    id: 4,
    type: 'pattern',
    question: "What is the next number: 1, 1, 2, 3, 5, 8, ____?",
    options: ["11", "12", "13", "14", "15"],
    correctAnswer: 2,
    explanation: "This is the Fibonacci sequence: each number is the sum of the two previous (1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13)."
  },
  {
    id: 5,
    type: 'pattern',
    question: "Find the odd one out: 4, 9, 16, 25, 36, 49, 50",
    options: ["4", "9", "16", "25", "50"],
    correctAnswer: 4,
    explanation: "4, 9, 16, 25, 36, 49 are all perfect squares (2², 3², 4², 5², 6², 7²). 50 is not a perfect square."
  },
  {
    id: 6,
    type: 'pattern',
    question: "If 2+3=10, 6+5=66, 4+4=32, then 7+3=____?",
    options: ["70", "72", "74", "76", "78"],
    correctAnswer: 0,
    explanation: "Pattern: (first + second) × first = result. 7+3=10, 10×7=70."
  },
  {
    id: 7,
    type: 'pattern',
    question: "What letter comes next: A, D, G, J, ____?",
    options: ["K", "L", "M", "N", "O"],
    correctAnswer: 2,
    explanation: "Each letter is 3 positions forward: A→D (+3), D→G (+3), G→J (+3), J→M (+3)."
  },
  {
    id: 8,
    type: 'pattern',
    question: "Complete the series: 1, 4, 9, 16, 25, ____, 49",
    options: ["30", "36", "40", "42", "45"],
    correctAnswer: 1,
    explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6²=36, 7²=49."
  }
];

// Numeric/Mathematical Reasoning Questions
const numericQuestions: IQQuestion[] = [
  {
    id: 1,
    type: 'numeric',
    question: "If a clock shows 3:15, what is the angle between the hour and minute hands?",
    options: ["0 degrees", "7.5 degrees", "15 degrees", "22.5 degrees", "30 degrees"],
    correctAnswer: 1,
    explanation: "Minute hand at 15 minutes = 90° from 12. Hour hand at 3:15 = 3×30 + 15×0.5 = 97.5°. Difference: 97.5-90=7.5°."
  },
  {
    id: 2,
    type: 'numeric',
    question: "A bat and a ball cost $1.10 total. The bat costs $1.00 more than the ball. How much does the ball cost?",
    options: ["$0.01", "$0.05", "$0.10", "$0.50", "$1.00"],
    correctAnswer: 1,
    explanation: "Let ball = x, bat = x+1.00. x + (x+1.00) = 1.10. 2x + 1.00 = 1.10. 2x = 0.10. x = 0.05."
  },
  {
    id: 3,
    type: 'numeric',
    question: "If 5 machines take 5 minutes to make 5 widgets, how long would 100 machines take to make 100 widgets?",
    options: ["5 minutes", "10 minutes", "20 minutes", "50 minutes", "100 minutes"],
    correctAnswer: 0,
    explanation: "Each machine makes 1 widget in 5 minutes. 100 machines making 100 widgets still takes 5 minutes (each machine makes one)."
  },
  {
    id: 4,
    type: 'numeric',
    question: "In a lake, there is a patch of lily pads that doubles in size every day. It takes 48 days to cover the entire lake. How long to cover half the lake?",
    options: ["12 days", "24 days", "36 days", "47 days", "48 days"],
    correctAnswer: 3,
    explanation: "Since it doubles daily, the day before it covers the whole lake, it must cover half the lake. So 47 days."
  },
  {
    id: 5,
    type: 'numeric',
    question: "You have 3 coins, one is fair (50-50), one always lands heads, one always lands tails. Pick one randomly, flip it, get heads. What's probability it was the fair coin?",
    options: ["1/6", "1/5", "1/4", "1/3", "1/2"],
    correctAnswer: 3,
    explanation: "P(fair|heads) = P(heads|fair)×P(fair) / P(heads) = (0.5×1/3) / (0.5×1/3 + 1×1/3 + 0×1/3) = (1/6) / (1/6 + 1/3) = (1/6)/(1/2) = 1/3."
  }
];

// Sequence/Logical Reasoning Questions
const sequenceQuestions: IQQuestion[] = [
  {
    id: 1,
    type: 'sequence',
    question: "What comes next: J, F, M, A, M, J, ____?",
    options: ["J", "A", "S", "O", "N"],
    correctAnswer: 0,
    explanation: "First letters of months: January, February, March, April, May, June, July."
  },
  {
    id: 2,
    type: 'sequence',
    question: "Complete: SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, ____?",
    options: ["FRIDAY", "SATURDAY", "SUNDAY", "WEEKDAY", "HOLIDAY"],
    correctAnswer: 0,
    explanation: "Days of the week in order. After Thursday comes Friday (FRIDAY)."
  },
  {
    id: 3,
    type: 'sequence',
    question: "What letter should replace the question mark: A, C, E, G, I, K, M, ?, Q",
    options: ["N", "O", "P", "R", "S"],
    correctAnswer: 1,
    explanation: "Pattern: every other letter (odd positions): A(1), C(3), E(5), G(7), I(9), K(11), M(13), O(15), Q(17). The answer is O."
  },
  {
    id: 4,
    type: 'sequence',
    question: "Complete: 64, 32, 16, 8, 4, ____, 1",
    options: ["1", "2", "3", "4", "6"],
    correctAnswer: 1,
    explanation: "Each number is halved: 64÷2=32, 32÷2=16, 16÷2=8, 8÷2=4, 4÷2=2, 2÷2=1."
  }
];

// Spatial Reasoning Questions (simplified for text-based)
const spatialQuestions: IQQuestion[] = [
  {
    id: 1,
    type: 'spatial',
    question: "Imagine a cube. If you paint all six faces and cut it into 27 smaller cubes, how many have paint on exactly 3 faces?",
    options: ["1", "6", "8", "12", "27"],
    correctAnswer: 2,
    explanation: "Only corner cubes have 3 faces painted. A cube has 8 corners, so 8 small cubes have 3 painted faces."
  },
  {
    id: 2,
    type: 'spatial',
    question: "If you look at a standard six-sided die (dice) and place it so 6 is on top, which number is on the bottom?",
    options: ["1", "2", "3", "4", "5"],
    correctAnswer: 0,
    explanation: "On a standard die, opposite faces always sum to 7. So if 6 is on top, then 1 (7-6=1) is on the bottom."
  },
  {
    id: 3,
    type: 'spatial',
    question: "A cube has all faces painted. If you cut it into 8 smaller equal cubes, how many have paint on exactly 1 face?",
    options: ["0", "1", "2", "4", "6"],
    correctAnswer: 0,
    explanation: "When cutting a cube into 8 smaller cubes (2×2×2), all 8 cubes are corner cubes. Each corner cube has exactly 3 painted faces. Therefore, 0 cubes have exactly 1 painted face."
  }
];

// Working Memory / Digit Span Questions
const memoryQuestions: IQQuestion[] = [
  {
    id: 1,
    type: 'sequence',
    question: "Remember this sequence: 7-2-9-4-3. Type it in reverse order:",
    options: ["3-4-9-2-7", "7-2-9-4-3", "3-4-9-2-8", "7-2-9-4-2", "9-7-3-4-2"],
    correctAnswer: 0,
    explanation: "The sequence was 7, 2, 9, 4, 3. Reversed: 3, 4, 9, 2, 7."
  },
  {
    id: 2,
    type: 'sequence',
    question: "Remember this sequence: 4-8-1-5-2-9. What was the third number?",
    options: ["4", "8", "1", "5", "2"],
    correctAnswer: 2,
    explanation: "The sequence was 4, 8, 1, 5, 2, 9. The third number is 1."
  },
  {
    id: 3,
    type: 'sequence',
    question: "Remember these letters: P-Q-R-S-T. Now spell it backward:",
    options: ["T-S-R-Q-P", "T-S-R-Q", "P-Q-R-S", "S-T-R-Q-P", "T-R-Q-P-S"],
    correctAnswer: 0,
    explanation: "Original: P, Q, R, S, T. Backward: T, S, R, Q, P."
  }
];

// Processing Speed / Simple Math Questions
const speedQuestions: IQQuestion[] = [
  {
    id: 1,
    type: 'numeric',
    question: "Quick: 7 × 8 = ?",
    options: ["54", "56", "58", "62", "64"],
    correctAnswer: 1
  },
  {
    id: 2,
    type: 'numeric',
    question: "Quick: 12 + 8 - 5 = ?",
    options: ["10", "13", "15", "17", "20"],
    correctAnswer: 2
  },
  {
    id: 3,
    type: 'numeric',
    question: "Quick: 15 ÷ 3 + 4 = ?",
    options: ["5", "6", "7", "8", "9"],
    correctAnswer: 2
  },
  {
    id: 4,
    type: 'numeric',
    question: "Quick: 9 × 6 = ?",
    options: ["48", "52", "54", "56", "58"],
    correctAnswer: 2
  },
  {
    id: 5,
    type: 'numeric',
    question: "Quick: 20 - 7 + 3 = ?",
    options: ["13", "14", "15", "16", "17"],
    correctAnswer: 3
  }
];

// Test Sections
const testSections: IQSection[] = [
  {
    id: 'verbal',
    name: { en: "Verbal Comprehension", ar: "الفهم اللفظي" },
    description: {
      en: "Measures vocabulary, verbal reasoning, and understanding of verbal concepts",
      ar: "يقيس المفردات والتفكير اللفظي وفهم المفاهيم اللفظية"
    },
    questions: verbalQuestions,
    timeLimit: 0,
    pointsPerQuestion: 3
  },
  {
    id: 'pattern',
    name: { en: "Pattern Recognition", ar: "التعرف على الأنماط" },
    description: {
      en: "Tests ability to recognize patterns, sequences, and logical relationships",
      ar: "يختبر القدرة على التعرف على الأنماط والتسلسلات والعلاقات المنطقية"
    },
    questions: patternQuestions,
    timeLimit: 0,
    pointsPerQuestion: 3
  },
  {
    id: 'numeric',
    name: { en: "Numerical Reasoning", ar: "التفكير الرياضي" },
    description: {
      en: "Assesses mathematical reasoning and problem-solving abilities",
      ar: "يقيم التفكير الرياضي وقدرات حل المشكلات"
    },
    questions: [...numericQuestions, ...sequenceQuestions],
    timeLimit: 0,
    pointsPerQuestion: 4
  },
  {
    id: 'memory',
    name: { en: "Working Memory", ar: "الذاكرة العاملة" },
    description: {
      en: "Tests short-term memory and sequence recall",
      ar: "يختبر الذاكرة قصيرة المدى وتذكر التسلسلات"
    },
    questions: memoryQuestions,
    timeLimit: 0,
    pointsPerQuestion: 2
  },
  {
    id: 'spatial',
    name: { en: "Spatial Reasoning", ar: "التفكير المكاني" },
    description: {
      en: "Measures ability to visualize and manipulate objects in space",
      ar: "يقيس القدرة على التصور والتعامل مع الأشياء في الفضاء"
    },
    questions: spatialQuestions,
    timeLimit: 0,
    pointsPerQuestion: 4
  },
  {
    id: 'speed',
    name: { en: "Processing Speed", ar: "سرعة المعالجة" },
    description: {
      en: "Simple calculations to measure processing speed (no time limit here)",
      ar: "حسابات بسيطة لقياس سرعة المعالجة (بدون حد زمني هنا)"
    },
    questions: speedQuestions,
    timeLimit: 0,
    pointsPerQuestion: 1
  }
];

export default function IQTest() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const [testState, setTestState] = useState<'intro' | 'active' | 'completed'>('intro');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [sectionStartTime, setSectionStartTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

  const sections = testSections;
  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const currentQuestionIndex = sections.slice(0, currentSection).reduce((sum, s) => sum + s.questions.length, 0) + currentQuestion;

  const handleStart = () => {
    setTestState('active');
    setStartTime(Date.now());
    setSectionStartTime(Date.now());
    setResponses({});
    setTimeSpent({});
    setCurrentSection(0);
    setCurrentQuestion(0);
  };

  const handleAnswer = useCallback((value: number) => {
    const questionKey = `${currentSectionData.id}-${currentQuestion}`;
    const timeSpentOnQuestion = Math.round((Date.now() - sectionStartTime) / 1000);
    
    setResponses(prev => ({ ...prev, [questionKey]: value }));
    setTimeSpent(prev => ({ ...prev, [questionKey]: timeSpentOnQuestion }));

    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSectionStartTime(Date.now());
    } else {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
        setCurrentQuestion(0);
        setSectionStartTime(Date.now());
      } else {
        setTestState('completed');
      }
    }
  }, [currentSection, currentQuestion, currentSectionData, sectionStartTime]);

  const handleReset = () => {
    setTestState('intro');
    setCurrentSection(0);
    setCurrentQuestion(0);
    setResponses({});
    setTimeSpent({});
    setShowDetail(null);
  };

  // Calculate scores
  const results = useMemo(() => {
    const sectionScores: Record<string, { correct: number; total: number; percentage: number; time: number }> = {};
    let totalCorrect = 0;
    let totalPoints = 0;
    let totalEarned = 0;
    let totalTime = 0;

    for (const section of sections) {
      let correct = 0;
      let earned = 0;
      let sectionTime = 0;
      
      for (let i = 0; i < section.questions.length; i++) {
        const key = `${section.id}-${i}`;
        const answer = responses[key];
        const correctAnswer = section.questions[i].correctAnswer;
        
        if (answer === correctAnswer) {
          correct++;
          earned += section.pointsPerQuestion;
        }
        sectionTime += timeSpent[key] || 0;
      }
      
      sectionScores[section.id] = {
        correct,
        total: section.questions.length,
        percentage: Math.round((correct / section.questions.length) * 100),
        time: sectionTime
      };
      
      totalCorrect += correct;
      totalEarned += earned;
      totalPoints += section.questions.length * section.pointsPerQuestion;
      totalTime += sectionTime;
    }

    // IQ Calculation (simplified estimation)
    // Standard IQ tests are normalized with mean=100, SD=15
    // This is a simplified estimation based on performance
    const rawScore = Math.round((totalCorrect / totalQuestions) * 100);
    const estimatedIQ = Math.round(85 + (rawScore * 0.3)); // Simplified formula
    
    // Clamp IQ to reasonable range
    const clampedIQ = Math.max(70, Math.min(145, estimatedIQ));

    return {
      sectionScores,
      totalCorrect,
      totalQuestions,
      totalEarned,
      totalPoints,
      totalTime,
      rawScore,
      estimatedIQ: clampedIQ,
      percentile: Math.round(normalCDF((clampedIQ - 100) / 15) * 100)
    };
  }, [responses, sections, timeSpent, totalQuestions]);

  // Normal CDF function for percentile calculation
  function normalCDF(x: number): number {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return 0.5 * (1.0 + sign * y);
  }

  const getIQCategory = (iq: number) => {
    if (iq >= 130) return { 
      en: "Very Superior", 
      ar: "ممتاز جداً",
      color: "text-green-600 bg-green-50 border-green-200" 
    };
    if (iq >= 120) return { 
      en: "Superior", 
      ar: "ممتاز",
      color: "text-blue-600 bg-blue-50 border-blue-200" 
    };
    if (iq >= 110) return { 
      en: "High Average", 
      ar: "فوق المتوسط",
      color: "text-cyan-600 bg-cyan-50 border-cyan-200" 
    };
    if (iq >= 90) return { 
      en: "Average", 
      ar: "متوسط",
      color: "text-gray-600 bg-gray-50 border-gray-200" 
    };
    if (iq >= 80) return { 
      en: "Low Average", 
      ar: "تحت المتوسط",
      color: "text-amber-600 bg-amber-50 border-amber-200" 
    };
    return { 
      en: "Below Average", 
      ar: "ضعيف",
      color: "text-red-600 bg-red-50 border-red-200" 
    };
  };

  const iqCategory = getIQCategory(results.estimatedIQ);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center border-b border-border pb-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">
            {isRtl ? "اختبار الذكاء" : "IQ Test"}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm">
          {isRtl
            ? "قيّم قدراتك المعرفية عبر أبعاد متعددة"
            : "Assess your cognitive abilities across multiple dimensions"}
        </p>
      </div>

      {testState === 'intro' ? (
        /* Intro Screen */
        <div className="space-y-6 py-4">
          {/* Overview */}
          <div className="bg-muted/30 border border-border rounded-lg p-5">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              {isRtl ? "حول الاختبار" : "About This Test"}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {isRtl
                ? "هذا الاختبار يقيس القدرات المعرفية عبر ستة أبعاد رئيسية: الفهم اللفظي، التعرف على الأنماط، التفكير الرياضي، الذاكرة العاملة، التفكير المكاني، وسرعة المعالجة. يتضمن 35 سؤالاً مصممة لتقييم جوانب مختلفة من الذكاء."
                : "This test measures cognitive abilities across six major dimensions: verbal comprehension, pattern recognition, numerical reasoning, working memory, spatial reasoning, and processing speed. It includes 35 questions designed to assess different aspects of intelligence."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-card border border-border rounded p-2 text-center">
                <div className="font-semibold">35</div>
                <div className="text-muted-foreground">{isRtl ? "أسئلة" : "Questions"}</div>
              </div>
              <div className="bg-card border border-border rounded p-2 text-center">
                <div className="font-semibold">6</div>
                <div className="text-muted-foreground">{isRtl ? "أقسام" : "Sections"}</div>
              </div>
              <div className="bg-card border border-border rounded p-2 text-center">
                <div className="font-semibold">~25</div>
                <div className="text-muted-foreground">{isRtl ? "دقيقة" : "Minutes"}</div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{isRtl ? "أقسام الاختبار" : "Test Sections"}</h4>
            <div className="grid grid-cols-1 gap-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-card border border-border rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {sections.indexOf(section) + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{isRtl ? section.name.ar : section.name.en}</p>
                        <p className="text-xs text-muted-foreground">
                          {isRtl ? section.description.ar : section.description.en}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      <div>{section.questions.length} {isRtl ? "سؤال" : "Qs"}</div>
                      <div>×{section.pointsPerQuestion} {isRtl ? "نقطة" : "pts"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-sm">{isRtl ? "تعليمات" : "Instructions"}</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {isRtl ? "أجب على جميع الأسئلة بأفضل ما يمكنك" : "Answer all questions to the best of your ability"}</li>
              <li>• {isRtl ? "لا توجد عقوبة للإجابات الخاطئة، لذا خمن إذا لم تكن متأكداً" : "No penalty for wrong answers, so guess if unsure"}</li>
              <li>• {isRtl ? "يمكنك العودة لتغيير الإجابات خلال كل قسم" : "You can go back to change answers within each section"}</li>
              <li>• {isRtl ? "النتائج تقريبية ولأغراض تعليمية فقط" : "Results are approximate and for educational purposes only"}</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-xs text-amber-700 dark:text-amber-300 text-justify leading-relaxed">
              {isRtl
                ? "⚠️ تنبيه مهم: هذا محاكاة تعليمية لتقيس القدرات المعرفية. لا يُستخدم لتشخيص أي حالة. للحصول على تقييم دقيق، استشر أخصائياً مرخصاً."
                : "⚠️ Important Notice: This is an educational simulation designed to measure cognitive abilities. It is not a diagnostic tool and should not be used for clinical purposes. For accurate assessment, consult a licensed professional."}
            </p>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <Button onClick={handleStart} className="gap-2 px-8">
              <Play className="w-4 h-4" />
              {isRtl ? "ابدأ الاختبار" : "Start Test"}
            </Button>
          </div>
        </div>
      ) : testState === 'active' ? (
        /* Questions */
        <div className="space-y-4">
          {/* Section Progress */}
          <div className="flex items-center justify-between text-sm border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isRtl ? "القسم" : "Section"} {currentSection + 1}/{sections.length}:
              </span>
              <span className="font-medium">
                {isRtl ? currentSectionData.name.ar : currentSectionData.name.en}
              </span>
            </div>
            <span className="text-muted-foreground">
              {isRtl ? `السؤال ${currentQuestionIndex + 1} من ${totalQuestions}` : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Section Progress Indicators */}
          <div className="flex gap-1 justify-center flex-wrap">
            {sections.map((section, idx) => {
              const sectionQuestions = section.questions.length;
              const sectionStartIdx = sections.slice(0, idx).reduce((sum, s) => sum + s.questions.length, 0);
              const completed = idx < currentSection || (idx === currentSection && currentQuestion >= sectionQuestions);
              const isCurrent = idx === currentSection;
              const progress = isCurrent ? currentQuestion : completed ? sectionQuestions : 0;

              return (
                <div key={section.id} className="flex flex-col items-center mx-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(sectionQuestions, 4) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          completed ? "bg-primary" :
                          isCurrent && i < progress ? "bg-primary" :
                          isCurrent && i === progress ? "bg-primary/60" : "bg-muted"
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
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                {currentQuestionIndex + 1}
              </div>
              <p className="font-medium text-base leading-relaxed">
                {currentQuestionData.question}
              </p>
            </div>

            <div className="space-y-2 ml-11">
              {currentQuestionData.options.map((option, idx) => {
                const questionKey = `${currentSectionData.id}-${currentQuestion}`;
                const isSelected = responses[questionKey] === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-3 text-left border rounded transition-colors ${
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-muted hover:border-primary/30"
                    }`}
                  >
                    <span className="font-medium text-sm">{String.fromCharCode(65 + idx)}. </span>
                    <span className="text-sm">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(prev => prev - 1);
                } else if (currentSection > 0) {
                  setCurrentSection(prev => prev - 1);
                  setCurrentQuestion(sections[currentSection - 1].questions.length - 1);
                }
              }}
              disabled={currentSection === 0 && currentQuestion === 0}
            >
              {isRtl ? "السابق" : "Previous"}
            </Button>
            
            <span className="text-muted-foreground text-xs self-center">
              {isRtl ? "انقر للإجابة" : "Click to answer"}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const questionKey = `${currentSectionData.id}-${currentQuestion}`;
                if (responses[questionKey] !== undefined) {
                  if (currentQuestion < currentSectionData.questions.length - 1) {
                    setCurrentQuestion(prev => prev + 1);
                  } else if (currentSection < sections.length - 1) {
                    setCurrentSection(prev => prev + 1);
                    setCurrentQuestion(0);
                  } else {
                    setTestState('completed');
                  }
                }
              }}
              disabled={responses[`${currentSectionData.id}-${currentQuestion}`] === undefined}
            >
              {currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1
                ? (isRtl ? "إنهاء" : "Finish")
                : (isRtl ? "التالي" : "Next")}
            </Button>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b border-border pb-4">
            <div className="w-20 h-20 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {isRtl ? "نتيجتك" : "Your Results"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRtl
                ? `أتم الاختبار في ${Math.round(results.totalTime / 60)} دقيقة`
                : `Completed in ${Math.round(results.totalTime / 60)} minutes`}
            </p>
          </div>

          {/* IQ Score */}
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/5 border-4 border-primary/20 mb-4">
              <div>
                <div className="text-4xl font-bold text-primary">{results.estimatedIQ}</div>
                <div className="text-xs text-muted-foreground">{isRtl ? "IQ" : "IQ Score"}</div>
              </div>
            </div>
            <div className={`inline-block px-4 py-2 rounded-lg border ${iqCategory.color}`}>
              <p className="font-medium">{isRtl ? iqCategory.ar : iqCategory.en}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isRtl
                ? `المئيني: ${results.percentile}% (متوسط IQ = 100)`
                : `Percentile: ${results.percentile}% (average IQ = 100)`}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              {isRtl ? "تفصيل النتائج" : "Score Breakdown"}
            </h4>
            {sections.map((section) => {
              const score = results.sectionScores[section.id];
              return (
                <div key={section.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowDetail(showDetail === section.id ? null : section.id)}
                    className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium text-sm">
                          {sections.indexOf(section) + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {isRtl ? section.name.ar : section.name.en}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {score.correct}/{score.total} {isRtl ? "صحيح" : "correct"} ({score.percentage}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{score.percentage}%</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(score.time / 60)}m
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDetail === section.id ? "rotate-180" : ""}`} />
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${score.percentage}%` }}
                      />
                    </div>
                  </button>

                  {showDetail === section.id && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      {/* Questions Review */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {isRtl ? "مراجعة الإجابات" : "Question Review"}
                        </p>
                        {section.questions.map((q, idx) => {
                          const questionKey = `${section.id}-${idx}`;
                          const userAnswer = responses[questionKey];
                          const isCorrect = userAnswer === q.correctAnswer;
                          
                          return (
                            <div key={idx} className={`p-2 rounded text-xs ${
                              isCorrect ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"
                            }`}>
                              <div className="flex items-center gap-2">
                                {isCorrect 
                                  ? <CheckCircle className="w-3 h-3 text-green-600" />
                                  : <XCircle className="w-3 h-3 text-red-600" />
                                }
                                <span className="font-medium">{idx + 1}.</span>
                                <span>{q.question.substring(0, 50)}...</span>
                              </div>
                              {!isCorrect && q.explanation && (
                                <p className="mt-1 text-muted-foreground ml-5">
                                  {isRtl ? "الشرح: " : "Explanation: "}{q.explanation}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="bg-muted/20 border border-border rounded-lg p-4">
            <h4 className="font-medium mb-3 text-sm">
              {isRtl ? "إحصائيات" : "Statistics"}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-semibold">{results.totalCorrect}/{results.totalQuestions}</div>
                <p className="text-xs text-muted-foreground">{isRtl ? "إجابات صحيحة" : "Correct Answers"}</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">{results.rawScore}%</div>
                <p className="text-xs text-muted-foreground">{isRtl ? "النسبة المئوية" : "Percentage"}</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">{results.totalEarned}/{results.totalPoints}</div>
                <p className="text-xs text-muted-foreground">{isRtl ? "النقاط" : "Points"}</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">{Math.round(results.totalTime / 60)}</div>
                <p className="text-xs text-muted-foreground">{isRtl ? "دقائق" : "Minutes"}</p>
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-sm">
              {isRtl ? "ماذا تعني هذه النتيجة؟" : "What Does This Mean?"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isRtl
                ? `معدل الذكاء المقدر هو ${results.estimatedIQ}. هذا يعني أداءً ${iqCategory.ar.toLowerCase()} مقارنة بالمعيار السكاني. تذكر أن هذا اختبار تقريبي وأن الذكاء له أبعاد متعددة لا يمكن لاختبار واحد قياسها جميعاً.`
                : `Your estimated IQ of ${results.estimatedIQ} indicates ${iqCategory.en.toLowerCase()} performance compared to the population norm. Remember that this is an approximation and intelligence has multiple dimensions that no single test can fully measure.`}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-xs text-amber-700 dark:text-amber-300 text-justify leading-relaxed">
              {isRtl
                ? "⚠️ هذا اختبار ترفيهي تقريبي. لا يُستخدم للتشخيص أو التوظيف أو القرارات المهمة. IQ الحقيقي يتطلب تقييماً مهنياً كاملاً من أخصائي مرخص باستخدام أدوات معيارية."
                : "⚠️ This is an approximate entertainment test. It should not be used for diagnosis, employment, or important decisions. Real IQ requires a comprehensive professional assessment using standardized tools."}
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
