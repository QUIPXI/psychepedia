"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Hand } from "lucide-react";
import { useLocale } from "next-intl";

export default function FingerTappingTest() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [phase, setPhase] = useState<"instructions" | "left" | "rest" | "right" | "finished">("instructions");
  const [taps, setTaps] = useState(0);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastTapRef = useRef<number>(0);
  
  // Use refs for timer to keep it independent from React state updates
  const timeLeftRef = useRef(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tapsRef = useRef(0);
  const phaseRef = useRef(phase);

  // Keep phaseRef in sync with phase state
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const handleStart = () => {
    setPhase("left");
    timeLeftRef.current = 10;
    tapsRef.current = 0;
    setTaps(0);
  };

  const handleTap = useCallback(() => {
    if (phaseRef.current !== "left" && phaseRef.current !== "right") return;
    
    const now = Date.now();
    if (now - lastTapRef.current > 50) {
      tapsRef.current += 1;
      setTaps(tapsRef.current);
      lastTapRef.current = now;
    }
  }, []);

  // Timer effect - completely independent from state updates
  useEffect(() => {
    if ((phase === "left" || phase === "right") && timeLeftRef.current > 0) {
      timerRef.current = setInterval(() => {
        timeLeftRef.current -= 1;
        
        if (timeLeftRef.current <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          if (phaseRef.current === "left") {
            setLeftScore(tapsRef.current);
            setPhase("rest");
            timeLeftRef.current = 10;
          } else {
            setRightScore(tapsRef.current);
            setPhase("finished");
          }
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [phase]);

  const handleNextPhase = () => {
    tapsRef.current = 0;
    lastTapRef.current = 0;
    setTaps(0);
    setPhase("right");
    timeLeftRef.current = 10;
  };

  const resetTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setPhase("instructions");
    setLeftScore(0);
    setRightScore(0);
    setTaps(0);
    timeLeftRef.current = 10;
    tapsRef.current = 0;
  };

  return (
    <div className="space-y-6">
      {phase === "instructions" ? (
        <div className="text-center py-8">
          <Hand className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">
            {isRtl ? "اختبار النقر بالأصابع" : "Finger Tapping Test"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isRtl 
              ? "قِس سرعتك وتنسيقك الحركي بالنقر بأصابعك"
              : "Measure your motor speed and coordination by tapping with your fingers"}
          </p>
          <div className="text-sm text-muted-foreground mb-4 space-y-2">
            <p>{isRtl ? "• ستضغط على زر 10 ثوانٍ بيدك اليسرى" : "• You will tap for 10 seconds with your left hand"}</p>
            <p>{isRtl ? "• ثم تستريح لثانية واحدة" : "• Then rest for 1 second"}</p>
            <p>{isRtl ? "• ثم 10 ثوانٍ بيدك اليمنى" : "• Then tap for 10 seconds with your right hand"}</p>
          <p>{isRtl ? "• اضغط بأسرع ما يمكن وبإيقاع ثابت" : "• Tap as fast as possible with a steady rhythm"}</p>
          </div>
          <Button onClick={handleStart} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ الاختبار" : "Start Test"}
          </Button>
        </div>
      ) : phase === "rest" ? (
        <div className="text-center py-8">
          <div className="text-6xl font-bold mb-4">{leftScore}</div>
          <p className="text-muted-foreground mb-4">
            {isRtl ? "نقرة باليد اليسرى" : "Left hand taps"}
          </p>
          <p className="text-sm mb-4">{isRtl ? "استرح لثانية واحدة..." : "Rest for 1 second..."}</p>
          <Button onClick={handleNextPhase} className="gap-2">
            {isRtl ? "استخدم اليد اليمنى" : "Use Right Hand"}
          </Button>
        </div>
      ) : phase === "finished" ? (
        <div className="text-center py-8">
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="text-4xl font-bold text-primary">{leftScore}</div>
              <p className="text-sm text-muted-foreground">
                {isRtl ? "اليد اليسرى" : "Left Hand"}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">{rightScore}</div>
              <p className="text-sm text-muted-foreground">
                {isRtl ? "اليد اليمنى" : "Right Hand"}
              </p>
            </div>
          </div>
          <div className="text-lg font-semibold mb-4">
            {isRtl ? "المجموع:" : "Total:"} {leftScore + rightScore}
          </div>
          <Button onClick={resetTest} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {isRtl ? "إعادة الاختبار" : "Try Again"}
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl font-bold mb-4">{taps}</div>
          <p className="text-muted-foreground mb-2">
            {phase === "left" 
              ? (isRtl ? "اليد اليسرى - اضغط بأسرع ما يمكن!" : "Left Hand - Tap as fast as you can!")
              : (isRtl ? "اليد اليمنى - اضغط بأسرع ما يمكن!" : "Right Hand - Tap as fast as you can!")}
          </p>
          <div className="text-2xl font-bold text-primary mb-4">
            {timeLeftRef.current}s {isRtl ? "متبقية" : "remaining"}
          </div>
          
          <button
            ref={buttonRef}
            onClick={handleTap}
            className="w-48 h-48 rounded-full bg-primary text-primary-foreground text-4xl font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
          >
            {isRtl ? "اضغط" : "TAP"}
          </button>

          <p className="text-sm text-muted-foreground mt-4">
            {isRtl ? "استخدم الفأرة أو اضغط على الشاشة" : "Use mouse click or tap on screen"}
          </p>
        </div>
      )}
    </div>
  );
}