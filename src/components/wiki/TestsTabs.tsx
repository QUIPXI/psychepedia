"use client";

import React, { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical, Play, X, ChevronDown, Clock, Info, ArrowRight, Eye, Hand, FileText, Target, User } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArticleExperiment } from "@/lib/articles";
import StroopTest from "@/components/experiments/StroopTest";
import MotionDetectionTest from "@/components/experiments/MotionDetectionTest";
import FingerTappingTest from "@/components/experiments/FingerTappingTest";
import PHQ9Screening from "@/components/experiments/PHQ9Screening";
import GAD7Screening from "@/components/experiments/GAD7Screening";
import MMSE from "@/components/experiments/MMSE";
import ADHDRating from "@/components/experiments/ADHDRating";
import AutismSpectrum from "@/components/experiments/AutismSpectrum";
import BigFivePersonality from "@/components/experiments/BigFivePersonality";

interface TestsTabsProps {
  experiments: ArticleExperiment[];
  locale: string;
}

// Registry of available test components
const testComponents: Record<string, ReactNode> = {
  stroop: <StroopTest />,
  motion: <MotionDetectionTest />,
  motor: <FingerTappingTest />,
  phq9: <PHQ9Screening />,
  gad7: <GAD7Screening />,
  mmse: <MMSE />,
  adhd: <ADHDRating />,
  autism: <AutismSpectrum />,
  personality: <BigFivePersonality />,
};

// Icon mapping for test types (same as experiments page)
const testIcons: Record<string, ReactNode> = {
  personality: <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  stroop: <FlaskConical className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  motion: <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
  motor: <Hand className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
  phq9: <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />,
  gad7: <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
  mmse: <FlaskConical className="w-4 h-4 text-red-600 dark:text-red-400" />,
  adhd: <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
  autism: <FlaskConical className="w-4 h-4 text-pink-600 dark:text-pink-400" />,
};

function TestContent({ type }: { type: string }) {
  return testComponents[type] || (
    <div className="p-8 text-center text-muted-foreground">
      <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>Test not yet implemented</p>
    </div>
  );
}

export function TestsTabs({ experiments, locale }: TestsTabsProps) {
  const isRtl = locale === "ar";
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (!experiments || experiments.length === 0) return null;

  const handleTabClick = (experimentId: string) => {
    if (activeTab === experimentId) {
      setActiveTab(null);
    } else {
      setActiveTab(experimentId);
    }
  };

  const handleViewAllTests = () => {
    router.push(`/${locale}/experiments`);
  };

  return (
    <div className="my-8">
      {/* Collapsed State - Shows available tests */}
      {!expanded && (
        <div
          className="p-4 bg-secondary/30 rounded-xl border border-dashed border-primary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setExpanded(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {isRtl ? "اختبارات تفاعلية" : "Interactive Tests"}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {experiments.length} {isRtl ? "متاح" : "available"}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRtl 
                    ? "انقر لاستكشاف الاختبارات النفسية التفاعلية" 
                    : "Click to explore interactive psychological tests"}
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Expanded State - Shows test tabs */}
      {expanded && (
        <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{isRtl ? "الاختبارات النفسية" : "Psychological Tests"}</h3>
                <p className="text-sm text-muted-foreground">
                  {isRtl 
                    ? "اختر اختبارًا لبدء التجربة التفاعلية" 
                    : "Select a test to start the interactive experience"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAllTests}
                className="gap-1"
              >
                {isRtl ? "جميع الاختبارات" : "All Tests"}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setExpanded(false);
                  setActiveTab(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Test Tabs */}
          <div className="border-b bg-muted/10">
            <div className="flex overflow-x-auto">
              {experiments.map((experiment, index) => (
                <button
                  key={experiment.id}
                  onClick={() => handleTabClick(experiment.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === experiment.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {testIcons[experiment.type] || <Play className="w-4 h-4" />}
                  <span className={cn(
                    activeTab === experiment.id && "text-primary"
                  )}>
                    {experiment.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Test Content */}
          {activeTab && (
            <div className="p-6">
              {experiments.map((experiment) => (
                <div
                  key={experiment.id}
                  className={activeTab === experiment.id ? "block" : "hidden"}
                >
                  {/* Test Info */}
                  <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">{experiment.title}</h4>
                        <p className="text-muted-foreground mb-3">{experiment.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {experiment.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-sm">
                        <span className="font-medium">{isRtl ? "التعليمات: " : "Instructions: "}</span>
                        {experiment.instructions}
                      </p>
                    </div>
                  </div>

                  {/* Test Component */}
                  <TestContent type={experiment.type} />
                </div>
              ))}
            </div>
          )}

          {/* No test selected state */}
          {!activeTab && (
            <div className="p-8 text-center">
              <Info className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {isRtl 
                  ? "اختر اختبارًا من الأعلى لبدء التجربة" 
                  : "Select a test from above to begin"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}