"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Eye } from "lucide-react";
import { useLocale } from "next-intl";

export default function DepthPerceptionTest() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [trials, setTrials] = useState(0);
  const [phase, setPhase] = useState<"static" | "moving">("static");
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [objects, setObjects] = useState<{ x: number; y: number; z: number; size: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateObjects = () => {
    const newObjects = [];
    const numObjects = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numObjects; i++) {
      newObjects.push({
        x: Math.random() * 0.6 + 0.2,
        y: Math.random() * 0.4 + 0.3,
        z: Math.random(), // 0 = close, 1 = far
        size: 0.05 + Math.random() * 0.03,
      });
    }
    setObjects(newObjects);
  };

  const handleStart = () => {
    setIsStarted(true);
    setScore(0);
    setTrials(0);
    setShowResult(false);
    generateObjects();
  };

  const handleGuess = (closerIndex: number) => {
    const closer = objects.reduce((min, obj, i) => obj.z < objects[min].z ? i : min, 0);
    const correct = closerIndex === closer;
    setFeedback(correct ? "correct" : "incorrect");
    setScore(prev => correct ? prev + 1 : prev);
    setTrials(prev => prev + 1);

    if (trials >= 9) {
      setShowResult(true);
    } else {
      setTimeout(() => {
        setFeedback(null);
        generateObjects();
      }, 1000);
    }
  };

  useEffect(() => {
    if (isStarted && !showResult && objects.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const animate = () => {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw depth gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#cccccc");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw objects with perspective
        const sortedObjects = [...objects].sort((a, b) => b.z - a.z);

        sortedObjects.forEach((obj, i) => {
          const x = obj.x * canvas.width;
          const y = obj.y * canvas.height;
          const size = obj.size * canvas.width * (1 + obj.z);

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${200 + obj.z * 100}, ${60 + obj.z * 20}%, ${70 - obj.z * 30}%)`;
          ctx.fill();
          ctx.strokeStyle = "#333";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Add number
          ctx.fillStyle = "#000";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`${i + 1}`, x, y + 5);
        });

        requestAnimationFrame(animate);
      };

      const animId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animId);
    }
  }, [isStarted, showResult, objects]);

  const accuracy = trials > 0 ? Math.round((score / trials) * 100) : 0;

  return (
    <div className="space-y-6">
      {!isStarted ? (
        <div className="text-center py-8">
          <Eye className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">
            {isRtl ? "اختبار إدراك العمق" : "Depth Perception Test"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isRtl 
              ? "قيّم قدرتك على إدراك العمق والمسافات بين الأجسام"
              : "Evaluate your ability to perceive depth and judge distances between objects"}
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

          <p className="text-center text-sm">
            {isRtl 
              ? "أي جسم يبدو أقرب إليك؟"
              : "Which object appears closer to you?"}
          </p>

          <div className="flex justify-center gap-2 flex-wrap">
            {objects.map((_, i) => (
              <Button
                key={i}
                onClick={() => handleGuess(i)}
                variant="outline"
                disabled={feedback !== null}
                className="w-12 h-12"
              >
                {i + 1}
              </Button>
            ))}
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
            width={500}
            height={350}
            className="w-full h-72 rounded-lg border bg-gray-100"
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl font-bold mb-2">{accuracy}%</div>
          <p className="text-muted-foreground mb-4">
            {isRtl ? "دقة إدراك العمق" : "Depth Perception Accuracy"}
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