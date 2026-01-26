"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
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

    const startTestText = isRtl ? "ابدأ التجربة" : "Start Experiment";
    const stroopTitle = isRtl ? "تأثير ستروب" : "Stroop Effect";
    const instructionsTitle = isRtl ? "تعليمات" : "Instructions";
    const instructionsText = isRtl
        ? "اختر لون الخط الذي تظهر به الكلمة. تجاهل معنى الكلمة نفسها."
        : "Select the color of the INK, not what the word says. Ignore the meaning of the word.";
    const completeText = isRtl ? "اكتمل الاختبار!" : "Test Complete!";
    const avgTimeText = isRtl ? "متوسط ​​وقت الاستجابة (مللي ثانية)" : "Avg Reaction Time (ms)";
    const tryAgainText = isRtl ? "حاول مرة أخرى" : "Try Again";

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
        <div className="w-full">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{stroopTitle}</h2>
                <p className="text-muted-foreground">
                    {gameState === "idle" ? instructionsText :
                        gameState === "playing" ? `${isRtl ? "الجولة" : "Round"} ${currentRound + 1} / ${TOTAL_ROUNDS}` :
                            completeText}
                </p>
            </div>

            {/* Game Area */}
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-secondary/10 rounded-xl">
                {gameState === "idle" && (
                    <div className="text-center space-y-8">
                        <div className="p-6 bg-background rounded-lg inline-block shadow-lg">
                            <span style={{ color: COLORS[0].hex, fontWeight: "bold", fontSize: "3rem" }}>
                                {isRtl ? COLORS[1].label.ar : COLORS[1].label.en}
                            </span>
                        </div>
                        <div>
                            <Button onClick={startGame} size="lg" className="gap-2">
                                <Play className="w-5 h-5" />
                                {startTestText}
                            </Button>
                        </div>
                    </div>
                )}

                {gameState === "playing" && currentStimulus && (
                    <div className="w-full space-y-12 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-8xl font-black transition-all transform cursor-default select-none py-8" style={{ color: currentStimulus.color }}>
                            {currentStimulus.text}
                        </div>

                        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                            {COLORS.map((c) => (
                                <Button
                                    key={c.name}
                                    variant="outline"
                                    className={cn(
                                        "h-20 text-xl font-bold hover:bg-muted/50 transition-colors border-2",
                                        "hover:scale-105 transform transition-transform"
                                    )}
                                    onClick={() => handleAnswer(c.name)}
                                >
                                    <span className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: c.hex }}></span>
                                    {isRtl ? c.label.ar : c.label.en}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === "finished" && (
                    <div className="text-center space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-7xl font-bold text-primary">
                            {averageTime}ms
                        </div>
                        <p className="text-xl text-muted-foreground">{avgTimeText}</p>
                        <Button onClick={startGame} variant="outline" size="lg" className="gap-2">
                            <RotateCcw className="w-5 h-5" />
                            {tryAgainText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
