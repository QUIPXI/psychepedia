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
import { Shield, GraduationCap, AlertCircle } from "lucide-react";

interface AcknowledgmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testName: {
    en: string;
    ar: string;
  };
  testAbbreviation: string;
  onConfirm: () => void;
}

export function AcknowledgmentDialog({
  open,
  onOpenChange,
  testName,
  testAbbreviation,
  onConfirm
}: AcknowledgmentDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const acknowledgmentText = {
    en: "I understand this is a training simulation for educational purposes only and not a substitute for supervised clinical practice.",
    ar: "أدرك أن هذا محاكاة تدريبية للأغراض التعليمية فقط ولا يُعد بديلاً عن الممارسة السريرية الخاضعة للإشراف."
  };

  const handleConfirm = () => {
    if (isAcknowledged) {
      onConfirm();
      onOpenChange(false);
      setIsAcknowledged(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            {isRtl ? "بدء المحاكاة التعليمية" : "Start Educational Simulation"}
          </DialogTitle>
          <DialogDescription>
            {isRtl
              ? `محاكاة ${testName.ar} (${testAbbreviation}) - للطلاب فقط`
              : `${testName.en} (${testAbbreviation}) Simulation - For Students Only`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Educational Context */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">
                  {isRtl ? "الغرض التعليمي" : "Educational Purpose"}
                </p>
                <p className="text-muted-foreground">
                  {isRtl
                    ? "هذه المحاكاة مصممة لطلاب علم النفس لتعلم بنيةinstrument وال scoring والتفسير. ليست أداة تشخيصية ولا يجب استخدامها لاتخاذ قرارات سريرية."
                    : "This simulation is designed for psychology students to learn the structure, scoring, and interpretation of the instrument. It is not a diagnostic tool and must not be used for clinical decision-making."}
                </p>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <p className="font-medium text-sm mb-2">
              {isRtl ? "أهداف التعلم:" : "Learning Objectives:"}
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {isRtl ? "فهم بنية الاختبار وعدد البنود" : "Understand test structure and item count"}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {isRtl ? "تعلم قواعد scoring وال حساب الدرجات" : "Learn scoring rules and score calculation"}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {isRtl ? "ممارسة تفسير النتائج في السياق التعليمي" : "Practice score interpretation in educational context"}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {isRtl ? "تحديد القيود السريرية للاختبار" : "Identify clinical limitations of the instrument"}
              </li>
            </ul>
          </div>

          {/* Professional Boundaries Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">
                  {isRtl ? "الحدود المهنية" : "Professional Boundaries"}
                </p>
                <p className="text-amber-700">
                  {isRtl
                    ? "لا تستخدم هذه المحاكاة للتقييم السريري الفعلي. للحصول على تقييم سريري، يُرجى استشارة أخصائي صحة نفسية مرخص."
                    : "Do not use this simulation for actual clinical assessment. For clinical assessment, please consult a licensed mental health professional."}
                </p>
              </div>
            </div>
          </div>

          {/* Acknowledgment Checkbox */}
          <label className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={isAcknowledged}
              onChange={(e) => setIsAcknowledged(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-primary text-primary focus:ring-primary"
            />
            <span className="text-sm">
              <span className="font-medium">{isRtl ? "إقرار:" : "Acknowledgment:"}</span>{" "}
              {isRtl ? acknowledgmentText.ar : acknowledgmentText.en}
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setIsAcknowledged(false);
            }}
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isAcknowledged}
            className="gap-2"
          >
            {isRtl ? "أبدأ المحاكاة" : "Start Simulation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AcknowledgmentDialog;
