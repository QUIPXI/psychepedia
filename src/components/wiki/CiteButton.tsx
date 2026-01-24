"use client";

import * as React from "react";
import { Quote, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateCitations, CitationFormat } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CiteButtonProps {
  title: string;
  domain: string;
  topic: string;
  locale?: string;
}

const formatLabels: Record<CitationFormat, { en: string; ar: string }> = {
  apa: { en: "APA 7th", ar: "APA السابع" },
  mla: { en: "MLA 9th", ar: "MLA التاسع" },
  chicago: { en: "Chicago 17th", ar: "شيكاغو السابع عشر" },
};

export function CiteButton({ title, domain, topic, locale = "en" }: CiteButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState<CitationFormat | null>(null);
  const [selectedFormat, setSelectedFormat] = React.useState<CitationFormat>("apa");

  const citations = generateCitations(title, domain, topic);

  const handleCopy = async (format: CitationFormat) => {
    try {
      await navigator.clipboard.writeText(citations[format]);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  const isRtl = locale === "ar";

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Quote className="h-4 w-4" />
        {isRtl ? "استشهاد" : "Cite This"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onClose={() => setIsOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5" />
              {isRtl ? "استشهاد بهذا المقال" : "Cite This Article"}
            </DialogTitle>
            <DialogDescription>
              {isRtl 
                ? "اختر تنسيق الاستشهاد وانسخه"
                : "Choose your citation format and copy"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Format Tabs */}
            <div className="flex gap-2 border-b border-border pb-2">
              {(Object.keys(formatLabels) as CitationFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    selectedFormat === format
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {formatLabels[format][isRtl ? "ar" : "en"]}
                </button>
              ))}
            </div>

            {/* Citation Display */}
            <div className="relative">
              <div className="p-4 bg-muted rounded-lg text-sm font-serif leading-relaxed min-h-[100px]">
                {citations[selectedFormat]}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(selectedFormat)}
              >
                {copied === selectedFormat ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                    {isRtl ? "تم النسخ!" : "Copied!"}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    {isRtl ? "نسخ" : "Copy"}
                  </>
                )}
              </Button>
            </div>

            {/* Quick Copy All */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground w-full mb-1">
                {isRtl ? "نسخ سريع:" : "Quick copy:"}
              </span>
              {(Object.keys(formatLabels) as CitationFormat[]).map((format) => (
                <Button
                  key={format}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleCopy(format)}
                >
                  {copied === format ? (
                    <Check className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {formatLabels[format][isRtl ? "ar" : "en"]}
                </Button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              <strong>{isRtl ? "ملاحظة:" : "Note:"}</strong>{" "}
              {isRtl 
                ? "تأكد من مراجعة الاستشهاد وفقًا لمتطلبات مؤسستك."
                : "Please verify the citation meets your institution's requirements."
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CiteButton;
