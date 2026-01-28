"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Brain } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const COLORS = [
    { name: "red", hex: "#EF4444", label: { en: "RED", ar: "أحمر" } },
    { name: "blue", hex: "#3B82F6", label: { en: "BLUE", ar: "أزرق" } },
    { name: "green", hex: "#22C55E", label: { en: "GREEN", ar: "أخضر" } },
    { name: "yellow", hex: "#EAB308", label: { en: "YELLOW", ar: "أصفر" } },
];

export default function StroopTest() {
    const locale = useLocale();
    const isRtl = locale === "ar";

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
            {gameState === "idle" ? (
                <div className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">
                        {isRtl ? "تأثير ستروب" : "Stroop Effect Test"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {isRtl 
                            ? "اختبر تركيزك وسرعة رد فعلك"
                            : "Test your focus and reaction speed"}
                    </p>
                    <div className="text-sm text-muted-foreground mb-4 space-y-2 text-left max-w-md mx-auto">
                        <p>{isRtl ? "• سترى كلمات ألوان مطبوعة بألوان مختلفة" : "• You will see color words printed in different colors"}</p>
                        <p>{isRtl ? "• مهمتك هي الضغط على لون الحبر، وليس معنى الكلمة" : "• Your task is to click the INK COLOR, not the word meaning"}</p>
                        <p>{isRtl ? "• اضغط بأسرع ما يمكنك دون ارتكاب أخطاء" : "• Work as quickly as possible without making mistakes"}</p>
                    </div>
                    <Button onClick={startGame} className="gap-2">
                        <Play className="w-4 h-4" />
                        {isRtl ? "ابدأ الاختبار" : "Start Test"}
                    </Button>
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