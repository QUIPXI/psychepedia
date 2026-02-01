"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Brain, GraduationCap } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { TestOverview } from "./TestOverview";
import { AcknowledgmentDialog } from "./AcknowledgmentDialog";

const stroopOverviewData = {
  testName: { en: "Stroop Color-Word Test", ar: "اختبار ستروب للألوان والكلمات" },
  testAbbreviation: "Stroop",
  purpose: {
    en: "Measures selective attention, cognitive flexibility, and processing speed by asking participants to name the ink color of color words.",
    ar: "يقيس الانتباه الانتقائي والمرونة المعرفية وسرعة المعالجة من خلال مطالبة المشاركين بتسمية لون الحبر لكلمات الألوان."
  },
  targetPopulation: {
    en: "Children (6+) and adults for cognitive assessment and research.",
    ar: "الأطفال (6+) والبالغون للتقييم المعرفي والبحث."
  },
  administration: { time: "5-10 minutes", format: "Computer-based", items: "10 trials" },
  scoring: {
    range: "Reaction time in milliseconds",
    interpretationBands: [
      { range: "<500ms", label: { en: "Excellent", ar: "ممتاز" }, description: { en: "Very fast processing", ar: "معالجة سريعة جداً" } },
      { range: "500-800ms", label: { en: "Average", ar: "متوسط" }, description: { en: "Normal processing speed", ar: "سرعة معالجة طبيعية" } },
      { range: ">800ms", label: { en: "Below Average", ar: "أقل من المتوسط" }, description: { en: "Slower processing", ar: "معالجة أبطأ" } }
    ],
    notes: { en: "Lower times indicate better performance.", ar: "الأوقات المنخفضة تشير إلى أداء أفضل." }
  },
  strengths: {
    en: ["Quick and easy to administer", "Well-established validity", "Sensitive to attention deficits", "Cross-cultural applicability"],
    ar: ["سريع وسهل التطبيق", "صدق راسخ", "حساس لعجز الانتباه", "قابلية التطبيق عبر الثقافات"]
  },
  limitations: {
    en: ["Practice effects possible", "Color blindness affects results", "Not diagnostic alone"],
    ar: ["تأثيرات التمرين ممكنة", "عمى الألوان يؤثر على النتائج", "ليس تشخيصياً بمفرده"]
  },
  wikiLinks: [
    { en: "Cognitive Psychology", ar: "علم النفس المعرفي", href: "/wiki/cognitive/cognitive-psychology" },
    { en: "Attention", ar: "الانتباه", href: "/wiki/cognitive/attention-memory" }
  ]
};

const COLORS = [
    { name: "red", hex: "#EF4444", label: { en: "RED", ar: "أحمر" } },
    { name: "blue", hex: "#3B82F6", label: { en: "BLUE", ar: "أزرق" } },
    { name: "green", hex: "#22C55E", label: { en: "GREEN", ar: "أخضر" } },
    { name: "yellow", hex: "#EAB308", label: { en: "YELLOW", ar: "أصفر" } },
];

export default function StroopTest() {
    const locale = useLocale();
    const isRtl = locale === "ar";

    const [showOverview, setShowOverview] = useState(true);
    const [isAcknowledgmentOpen, setIsAcknowledgmentOpen] = useState(false);
    const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
    const [currentRound, setCurrentRound] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [results, setResults] = useState<number[]>([]);
    const [currentStimulus, setCurrentStimulus] = useState<{ text: string; color: string; colorName: string } | null>(null);

    const TOTAL_ROUNDS = 10;

    const generateStimulus = useCallback(() => {
        const textIndex = Math.floor(Math.random() * COLORS.length);
        const textObj = COLORS[textIndex];

        let colorIndex;
        if (Math.random() > 0.5) {
            colorIndex = textIndex;
        } else {
            do {
                colorIndex = Math.floor(Math.random() * COLORS.length);
            } while (colorIndex === textIndex);
        }
        const colorObj = COLORS[colorIndex];

        setCurrentStimulus({
            text: isRtl ? textObj.label.ar : textObj.label.en,
            color: colorObj.hex,
            colorName: colorObj.name
        });
        setStartTime(Date.now());
    }, [isRtl]);

    const handleStart = () => {
        setIsAcknowledgmentOpen(true);
    };

    const handleAcknowledgmentConfirm = () => {
        setShowOverview(false);
        setGameState("playing");
        setResults([]);
        setCurrentRound(0);
        generateStimulus();
    };

    const startGame = () => {
        setGameState("playing");
        setResults([]);
        setCurrentRound(0);
        generateStimulus();
    };

    const handleAnswer = (selectedColorName: string) => {
        if (!currentStimulus) return;

        if (selectedColorName === currentStimulus.colorName) {
            const reactionTime = Date.now() - startTime;
            const newResults = [...results, reactionTime];
            setResults(newResults);

            if (currentRound + 1 >= TOTAL_ROUNDS) {
                setGameState("finished");
            } else {
                setCurrentRound(prev => prev + 1);
                generateStimulus();
            }
        }
    };

    const handleReset = () => {
        setShowOverview(true);
        setGameState("idle");
        setResults([]);
        setCurrentRound(0);
        setCurrentStimulus(null);
    };

    const averageTime = results.length > 0
        ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
        : 0;

    // Reset state when component unmounts or game restarts
    useEffect(() => {
        if (gameState === "idle") {
            setResults([]);
            setCurrentRound(0);
        }
    }, [gameState]);

    return (
        <div className="space-y-6">
            <AcknowledgmentDialog
                open={isAcknowledgmentOpen}
                onOpenChange={setIsAcknowledgmentOpen}
                testName={stroopOverviewData.testName}
                testAbbreviation={stroopOverviewData.testAbbreviation}
                onConfirm={handleAcknowledgmentConfirm}
            />

            {showOverview ? (
                <div className="space-y-6 py-4">
                    <div className="text-center border-b border-border pb-4">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                {isRtl ? stroopOverviewData.testName.ar : stroopOverviewData.testName.en} ({stroopOverviewData.testAbbreviation})
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {isRtl ? "محاكاة تعليمية للطلاب" : "Educational Simulation for Students"}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <Button onClick={handleStart} className="gap-2 px-8">
                            <GraduationCap className="w-4 h-4" />
                            {isRtl ? "ابدأ المحاكاة التعليمية" : "Start Educational Simulation"}
                        </Button>
                    </div>

                    <TestOverview {...stroopOverviewData} />
                </div>
            ) : gameState === "playing" && currentStimulus ? (
                <div className="space-y-4">
                    {/* Scoreboard */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{isRtl ? "الجولة" : "Round"}</span>
                            <span className="text-lg font-bold">{currentRound + 1}/{TOTAL_ROUNDS}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${((currentRound + 1) / TOTAL_ROUNDS) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Stimulus */}
                    <div className="p-12 bg-muted/30 rounded-lg text-center">
                        <div 
                            className="text-6xl font-black select-none"
                            style={{ color: currentStimulus.color }}
                        >
                            {currentStimulus.text}
                        </div>
                    </div>

                    {/* Color options */}
                    <div className="grid grid-cols-2 gap-3">
                        {COLORS.map((c) => (
                            <Button
                                key={c.name}
                                variant="outline"
                                onClick={() => handleAnswer(c.name)}
                                className="h-14 gap-2"
                            >
                                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }}></span>
                                {isRtl ? c.label.ar : c.label.en}
                            </Button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-6xl font-bold mb-2">{averageTime}ms</div>
                    <p className="text-muted-foreground mb-2">
                        {isRtl ? "متوسط ​​وقت الاستجابة" : "Avg Reaction Time"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        {isRtl ? `${results.length} محاولات` : `${results.length} trials`}
                    </p>

                    <div className="text-left max-w-md mx-auto p-4 bg-muted/30 rounded-lg space-y-2 text-sm mb-6">
                        <p className="font-medium">{isRtl ? "تأثير ستروب:" : "The Stroop Effect:"}</p>
                        <p className="text-muted-foreground">
                            {isRtl 
                                ? "يستغرق الأمر وقتًا أطول لتسمية لون الحبر عندما يتعارض مع معنى الكلمة. هذا لأن الدماغ يعالج الكلمات بشكل أسرع من الألوان."
                                : "It takes longer to name the ink color when it conflicts with the word meaning. This is because the brain processes words faster than colors."}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button onClick={handleReset} variant="outline" className="gap-2">
                            <RotateCcw className="w-4 h-4" />
                            {isRtl ? "إعادة المحاولة" : "Try Again"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}