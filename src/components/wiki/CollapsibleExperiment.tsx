"use client";

import React, { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical, X, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface CollapsibleExperimentProps {
    experimentType: "stroop";
    title: string;
    description: string;
    locale: string;
    children: ReactNode;
}

export function CollapsibleExperiment({ experimentType, title, description, locale, children }: CollapsibleExperimentProps) {
    const isRtl = locale === "ar";
    const [isExpanded, setIsExpanded] = useState(false);

    if (experimentType !== "stroop") return null;

    return (
        <div className="my-8">
            {/* Collapsed State */}
            {!isExpanded && (
                <div
                    className="p-4 bg-secondary/30 rounded-xl border border-dashed border-primary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FlaskConical className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                    {title}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {isRtl ? "تفاعلية" : "Interactive"}
                                    </span>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            )}

            {/* Expanded State */}
            {isExpanded && (
                <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FlaskConical className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{title}</h3>
                                <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
