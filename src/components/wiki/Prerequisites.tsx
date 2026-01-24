"use client";

import * as React from "react";
import { ArrowRight, BookMarked } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface PrerequisitesProps {
  prerequisites: string[]; // Format: "domain/topic"
  locale?: string;
  className?: string;
  // Map of topic IDs to titles (passed from parent)
  topicTitles?: Record<string, string>;
}

export function Prerequisites({ 
  prerequisites, 
  locale = "en", 
  className,
  topicTitles = {}
}: PrerequisitesProps) {
  if (!prerequisites || prerequisites.length === 0) return null;

  const isRtl = locale === "ar";

  return (
    <div className={cn("p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30", className)}>
      <div className="flex items-center gap-2 mb-3">
        <BookMarked className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <h3 className="font-semibold text-amber-800 dark:text-amber-300">
          {isRtl ? "المتطلبات السابقة" : "Prerequisites"}
        </h3>
      </div>
      <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
        {isRtl 
          ? "للحصول على أفضل استيعاب، يُنصح بقراءة هذه المقالات أولاً:"
          : "For best understanding, we recommend reading these articles first:"
        }
      </p>
      <ul className="space-y-2">
        {prerequisites.map((prereq) => {
          const [domain, topic] = prereq.split("/");
          const title = topicTitles[prereq] || topic?.replace(/-/g, " ") || prereq;
          
          return (
            <li key={prereq}>
              <Link
                href={`/wiki/${domain}/${topic}`}
                className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 hover:underline transition-colors"
              >
                <ArrowRight className={cn("h-4 w-4", isRtl && "rotate-180")} />
                <span className="capitalize">{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Prerequisites;
