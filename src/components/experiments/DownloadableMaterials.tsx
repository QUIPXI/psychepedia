"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Download, FileText, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscaleScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  interpretation: {
    en: string;
    ar: string;
  };
}

interface TestDetails {
  purpose: {
    en: string;
    ar: string;
  };
  targetPopulation: {
    en: string;
    ar: string;
  };
  administration: {
    time: string;
    format: string;
    items: string;
  };
  scoring: {
    range: string;
    interpretationBands: {
      range: string;
      label: {
        en: string;
        ar: string;
      };
      description: {
        en: string;
        ar: string;
      };
    }[];
    notes?: {
      en: string;
      ar: string;
    };
  };
  strengths: {
    en: string[];
    ar: string[];
  };
  limitations: {
    en: string[];
    ar: string[];
  };
  wikiLinks?: {
    en: string;
    ar: string;
    href: string;
  }[];
}

interface DownloadableMaterialsProps {
  testName: {
    en: string;
    ar: string;
  };
  testAbbreviation: string;
  rawScore: number;
  maxScore: number;
  interpretation: {
    label: {
      en: string;
      ar: string;
    };
    description: {
      en: string;
      ar: string;
    };
  };
  subscales?: SubscaleScore[];
  testDetails?: TestDetails;
  commonMistakes?: {
    en: string[];
    ar: string[];
  };
  clinicalNotes?: {
    en: string;
    ar: string;
  };
}

export function DownloadableMaterials({
  testName,
  testAbbreviation,
  rawScore,
  maxScore,
  interpretation,
  subscales,
  testDetails,
  commonMistakes,
  clinicalNotes
}: DownloadableMaterialsProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const generatePDF = async (type: "manual" | "cheatsheet" | "results") => {
    setIsGenerating(type);

    // Simulate PDF generation - in production, use a library like jsPDF or react-pdf
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create downloadable content
    const content = generateDownloadContent(type);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${testAbbreviation}_${type}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(null);
  };

  const generateDownloadContent = (type: string): string => {
    const percentage = Math.round((rawScore / maxScore) * 100);
    const date = new Date().toLocaleDateString();
    const border = "=".repeat(60);
    const halfBorder = "=".repeat(30);

    if (type === "manual") {
      const purpose = testDetails?.purpose ? (isRtl ? testDetails.purpose.ar : testDetails.purpose.en) : `${testName.en} is a standardized psychological assessment designed to measure specific cognitive or psychological constructs.`;
      const population = testDetails?.targetPopulation ? (isRtl ? testDetails.targetPopulation.ar : testDetails.targetPopulation.en) : "Adults in clinical or research settings.";
      const time = testDetails?.administration?.time || "10-15 minutes";
      const format = testDetails?.administration?.format || "Standardized assessment";
      const items = testDetails?.administration?.items || `${maxScore} items`;
      const scoringRange = testDetails?.scoring?.range || `0-${maxScore}`;

      const strengths = testDetails?.strengths ? testDetails.strengths.en.join("\n- ") : "- Standardized procedures\n- Objective measurement";
      const limitations = testDetails?.limitations ? testDetails.limitations.en.join("\n- ") : "- Educational use only\n- Not for clinical diagnosis";

      return `
${border}
${testName.en.toUpperCase()} - STUDENT MANUAL (EDUCATIONAL USE ONLY)
${border}

Test: ${testName.en} (${testAbbreviation})
PsychePedia - Psychology Education Platform

${border}
INSTRUMENT OVERVIEW
${border}

Purpose:
${purpose}

Target Population:
${population}

Administration:
- Time: ${time}
- Format: ${format}
- Items: ${items}

Scoring:
- Range: ${scoringRange}
- Total score is sum of all item scores
- Higher scores indicate greater presence of the measured construct

${border}
ADMINISTRATION GUIDELINES
${border}

1. Environment: Quiet, well-lit room with minimal distractions
2. Materials: Standardized forms, writing materials, stopwatch if timed
3. Rapport: Establish trust and explain the process before beginning
4. Instructions: Read verbatim from the manual or as shown in simulation
5. Timing: Start timer when instructions are complete (if applicable)
6. Recording: Note responses accurately and any observations
7. Professionalism: Maintain neutral demeanor throughout

${border}
SCORING RULES
${border}

Each item/section has specific scoring criteria:
- Score based on standard criteria for each response
- Partial credit may be available for some items (follow manual)
- Document any unusual responses or behaviors
- Total score is sum of all item scores

${border}
STRENGTHS
${border}

- ${strengths}

${border}
LIMITATIONS
${border}

- ${limitations}

${border}
REFERENCES
${border}

- Original instrument citation and development history
- Standardization sample and population norms
- Validity and reliability studies

${border}
EDUCATIONAL USE ONLY
${border}

This material is for educational purposes only.
It is NOT a validated clinical instrument.
For clinical use, consult the official manual and qualified professionals.

© PsychePedia - Psychology Education Platform
      `.trim();
    } else if (type === "cheatsheet") {
      const time = testDetails?.administration?.time || "varies";
      const format = testDetails?.administration?.format || "Standardized assessment";
      const items = testDetails?.administration?.items || maxScore;
      const scoringRange = testDetails?.scoring?.range || `0-${maxScore}`;

      const mistakes = commonMistakes?.en && commonMistakes.en.length > 0
        ? commonMistakes.en.map(m => `• ${m}`).join("\n")
        : "• Not reading instructions verbatim\n• Inconsistent scoring\n• Forgetting to establish rapport";

      return `
${border}
${testAbbreviation} QUICK REFERENCE - STUDY GUIDE
${border}

${testName.en}
Psychology Student Reference

${border}
AT A GLANCE
${border}

• Items: ${items}
• Time: ${time}
• Format: ${format}
• Scoring: ${scoringRange}

${border}
KEY ADMINISTRATION POINTS
${border}

□ Establish rapport with participant
□ Read instructions verbatim from manual
□ Record responses accurately and completely
□ Note any unusual behaviors or responses
□ Thank participant for their participation

${border}
COMMON ADMINISTRATION MISTAKES
${border}

${mistakes}

${border}
IMPORTANT NOTES
${border}

• This is an EDUCATIONAL SIMULATION only
• Refer to official manual for clinical protocols
• Practice administration with classmates
• Review scoring criteria before each use
• Interpretation is based on total score only

${border}
EDUCATIONAL USE ONLY - NOT FOR CLINICAL USE
${border}

© PsychePedia - Psychology Education Platform
      `.trim();
    } else {
      // Results summary
      let content = `
${border}
${testName.en.toUpperCase()} - SIMULATION RESULTS SUMMARY
${border}

Test: ${testName.en} (${testAbbreviation})
Date: ${date}
Generated by: PsychePedia Educational Platform

${border}
SCORE SUMMARY
${border}

Raw Score: ${rawScore}/${maxScore} (${percentage}%)
Interpretation: ${isRtl ? interpretation.label.ar : interpretation.label.en}

${isRtl ? interpretation.description.ar : interpretation.description.en}
`;

      if (subscales && subscales.length > 0) {
        content += `
${border}
SUBSCALE SCORES
${border}

`;
        subscales.forEach(subscale => {
          content += `${subscale.name}: ${subscale.score}/${subscale.maxScore} (${subscale.percentage}%)\n`;
          content += `  → ${isRtl ? subscale.interpretation.ar : subscale.interpretation.en}\n\n`;
        });
      }

      content += `
${border}
IMPORTANT DISCLAIMER
${border}

This is a SIMULATION RESULT for educational purposes only.
It is NOT a clinical assessment and should NOT be used for:
- Clinical decision-making
- Diagnostic purposes
- Treatment planning
- Employment decisions

For clinical assessment, consult a licensed mental health professional.
`;

      if (clinicalNotes) {
        content += `
${border}
CLINICAL CONSIDERATIONS
${border}

${isRtl ? clinicalNotes.ar : clinicalNotes.en}
`;
      }

      content += `
${border}
LEARNING OUTCOMES
${border}

This simulation helps you practice:
□ Test administration procedures
□ Accurate score calculation
□ Proper interpretation guidelines
□ Understanding assessment limitations

${border}
NEXT STEPS
${border}

• Review the Test Manual for detailed information
• Practice with different scenarios
• Study the interpretation guidelines
• Explore related wiki articles

${border}
© PsychePedia - Psychology Education Platform
EDUCATIONAL USE ONLY
      `.trim();

      return content;
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        {isRtl ? "تحميل المواد" : "Download Materials"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {isRtl ? "خيارات التحميل" : "Download Options"}
            </DialogTitle>
            <DialogDescription>
              {isRtl
                ? `مواد تعليمية لـ ${testName.ar} (${testAbbreviation})`
                : `Educational materials for ${testName.en} (${testAbbreviation})`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Test Manual */}
            <button
              onClick={() => generatePDF("manual")}
              disabled={isGenerating !== null}
              className={cn(
                "w-full flex items-center gap-4 p-4 border border-border rounded-lg",
                "hover:bg-muted/50 transition-colors text-left",
                isGenerating && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {isRtl ? "دليل الاختبار (النسخة الطلابية)" : "Test Manual (Student Version)"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "إرشادات التطبيق والت scoring" : "Administration and scoring guidelines"}
                </p>
              </div>
              {isGenerating === "manual" && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </button>

            {/* Cheat Sheet */}
            <button
              onClick={() => generatePDF("cheatsheet")}
              disabled={isGenerating !== null}
              className={cn(
                "w-full flex items-center gap-4 p-4 border border-border rounded-lg",
                "hover:bg-muted/50 transition-colors text-left",
                isGenerating && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {isRtl ? "مرجع سريع (ورقة غش)" : "Quick Reference (Cheat Sheet)"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "ملخص التفسير والتطبيق" : "Interpretation and administration summary"}
                </p>
              </div>
              {isGenerating === "cheatsheet" && (
                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              )}
            </button>

            {/* Results Summary */}
            <button
              onClick={() => generatePDF("results")}
              disabled={isGenerating !== null}
              className={cn(
                "w-full flex items-center gap-4 p-4 border border-border rounded-lg",
                "hover:bg-muted/50 transition-colors text-left",
                isGenerating && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {isRtl ? "ملخص نتائج المحاكاة" : "Simulation Results Summary"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "درجاتك والملاحظات التعليمية" : "Your scores and educational notes"}
                </p>
              </div>
              {isGenerating === "results" && (
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DownloadableMaterials;
