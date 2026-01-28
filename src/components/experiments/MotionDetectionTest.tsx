"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Eye } from "lucide-react";
import { useLocale } from "next-intl";

export default function MotionDetectionTest() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [trials, setTrials] = useState(0);
  const [hasMotion, setHasMotion] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateTrial = () => {
    setHasMotion(Math.random() > 0.5);
    setFeedback(null);
  };

  const handleStart = () => {
    setIsStarted(true);
    setScore(0);
    setTrials(0);
    setShowResult(false);
    generateTrial();
  };

  const handleResponse = (detected: boolean) => {
    const correct = detected === hasMotion;
    setFeedback(correct ? "correct" : "incorrect");
    setScore(prev => correct ? prev + 1 : prev);
    setTrials(prev => prev + 1);

    if (trials >= 9) {
      setShowResult(true);
    } else {
      setTimeout(generateTrial, 1000);
    }
  };

  useEffect(() => {
    if (isStarted && !showResult) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationId: number;
      let dots: { x: number; y: number; vx: number; vy: number }[] = [];
      const numDots = 50;

      const initDots = () => {
        dots = [];
        for (let i = 0; i < numDots; i++) {
          dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: hasMotion ? (Math.random() - 0.5) * 0.5 : 0,
            vy: hasMotion ? (Math.random() - 0.5) * 0.5 : 0,
          });
        }
      };

      const animate = () => {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
          dot.x += dot.vx;
          dot.y += dot.vy;

          if (dot.x < 0) dot.x = canvas.width;
          if (dot.x > canvas.width) dot.x = 0;
          if (dot.y < 0) dot.y = canvas.height;
          if (dot.y > canvas.height) dot.y = 0;

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        animationId = requestAnimationFrame(animate);
      };

      initDots();
      animate();

      return () => cancelAnimationFrame(animationId);
    }
  }, [isStarted, hasMotion, showResult]);

  const accuracy = trials > 0 ? Math.round((score / trials) * 100) : 0;

  return (
    <div className="space-y-6">
      {!isStarted ? (
        <div className="text-center py-8">
          <Eye className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">
            {isRtl ? "اختبار اكتشاف الحركة" : "Motion Detection Test"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isRtl 
              ? "اختبر قدرتك على اكتشاف الحركة في الأنماط البصرية"
              : "Test your ability to detect motion in visual patterns"}
          </p>
          <Button onClick={handleStart} className="gap-2">
            <Play className="w-4 h-4" />
            {isRtl ? "ابدأ الاختبار" : "Start Test"}
          </Button>
        </div>
      ) : !showResult ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">
              {isRtl ? "الدرجة:" : "Score:"} {score}/{trials}
            </span>
            <span className="text-sm text-muted-foreground">
              {isRtl ? "المحاولات:" : "Trials:"} {trials}/10
            </span>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleResponse(true)}
              className={feedback === "incorrect" ? "opacity-50" : ""}
              disabled={feedback !== null}
            >
              {isRtl ? "أرى حركة" : "I See Motion"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleResponse(false)}
              className={feedback === "incorrect" ? "opacity-50" : ""}
              disabled={feedback !== null}
            >
              {isRtl ? "لا أرى حركة" : "No Motion"}
            </Button>
          </div>

          {feedback && (
            <div className={`text-center p-2 rounded ${
              feedback === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {isRtl 
                ? (feedback === "correct" ? "✓ إجابة صحيحة" : "✗ إجابة خاطئة")
                : (feedback === "correct" ? "✓ Correct" : "✗ Incorrect")}
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full h-64 rounded-lg border bg-neutral-900"
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl font-bold mb-2">{accuracy}%</div>
          <p className="text-muted-foreground mb-4">
            {isRtl ? "دقة اكتشاف الحركة" : "Motion Detection Accuracy"}
          </p>
          <Button onClick={handleStart} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {isRtl ? "إعادة المحاولة" : "Try Again"}
          </Button>
        </div>
      )}
    </div>
  );
}