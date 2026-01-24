"use client";

import * as React from "react";
import { Table } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleComparison } from "@/lib/articles";

interface ComparisonTablesProps {
  comparisons: ArticleComparison[];
  locale?: string;
  className?: string;
}

export function ComparisonTables({ 
  comparisons, 
  locale = "en",
  className 
}: ComparisonTablesProps) {
  const isRtl = locale === "ar";

  if (!comparisons || comparisons.length === 0) return null;

  return (
    <div className={cn("my-8 space-y-8", className)}>
      {comparisons.map((comparison, index) => (
        <div key={index} className="overflow-hidden">
          {/* Title */}
          <div className="flex items-center gap-2 mb-3">
            <Table className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{comparison.title}</h3>
          </div>
          
          {comparison.description && (
            <p className="text-sm text-muted-foreground mb-4">{comparison.description}</p>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold border-b border-border"></th>
                  {comparison.headers.map((header, i) => (
                    <th 
                      key={i} 
                      className="px-4 py-3 text-left font-semibold border-b border-border min-w-[150px]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={cn(
                      "transition-colors hover:bg-muted/30",
                      rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <td className="px-4 py-3 font-medium border-b border-border bg-muted/30">
                      {row.label}
                    </td>
                    {row.values.map((value, valueIndex) => (
                      <td 
                        key={valueIndex} 
                        className="px-4 py-3 border-b border-border text-muted-foreground"
                      >
                        {value || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ComparisonTables;
