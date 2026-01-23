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
import { generateCitation } from "@/lib/utils";

interface CiteButtonProps {
  title: string;
  domain: string;
  topic: string;
}

export function CiteButton({ title, domain, topic }: CiteButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const citation = generateCitation(title, domain, topic);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Quote className="h-4 w-4" />
        Cite This
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onClose={() => setIsOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5" />
              Cite This Article
            </DialogTitle>
            <DialogDescription>
              Copy the citation below in APA format
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="relative">
              <div className="p-4 bg-muted rounded-lg text-sm font-serif leading-relaxed">
                {citation}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              <strong>Note:</strong> This citation follows APA 7th edition format.
              Adjust as needed for other citation styles.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CiteButton;
