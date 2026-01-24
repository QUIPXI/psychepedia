"use client";

import * as React from "react";
import { GraduationCap, BookOpen, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DifficultyLevel } from "@/lib/articles";

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  locale?: string;
  className?: string;
}

const difficultyConfig: Record<DifficultyLevel, {
  icon: typeof GraduationCap;
  label: { en: string; ar: string };
  color: string;
  bgColor: string;
}> = {
  beginner: {
    icon: BookOpen,
    label: { en: "Beginner", ar: "مبتدئ" },
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  intermediate: {
    icon: GraduationCap,
    label: { en: "Intermediate", ar: "متوسط" },
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  advanced: {
    icon: Brain,
    label: { en: "Advanced", ar: "متقدم" },
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

export function DifficultyBadge({ level, locale = "en", className }: DifficultyBadgeProps) {
  const config = difficultyConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.color,
        config.bgColor,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label[locale === "ar" ? "ar" : "en"]}
    </span>
  );
}

export default DifficultyBadge;
