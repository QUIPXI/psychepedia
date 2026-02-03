"use client";

import * as React from "react";
import { Share2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleDiagram } from "@/lib/articles";

interface InteractiveDiagramsProps {
  diagrams: ArticleDiagram[];
  locale?: string;
  className?: string;
}

export function InteractiveDiagrams({ 
  diagrams, 
  locale = "en",
  className 
}: InteractiveDiagramsProps) {
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  
  const isRtl = locale === "ar";

  if (!diagrams || diagrams.length === 0) return null;

  return (
    <div className={cn("my-8 space-y-8", className)}>
      {diagrams.map((diagram) => (
        <div key={diagram.id} className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{diagram.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{diagram.description}</p>
          </div>

          {/* Diagram Content */}
          <div className="p-6">
            {diagram.type === "flowchart" && (
              <FlowchartDiagram 
                diagram={diagram} 
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
                isRtl={isRtl}
              />
            )}
            {diagram.type === "hierarchy" && (
              <HierarchyDiagram 
                diagram={diagram}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
              />
            )}
            {diagram.type === "cycle" && (
              <CycleDiagram 
                diagram={diagram}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
              />
            )}
            {diagram.type === "comparison" && (
              <ComparisonDiagram 
                diagram={diagram}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
              />
            )}
            {diagram.type === "concept-map" && (
              <ConceptMapDiagram 
                diagram={diagram}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
              />
            )}
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="p-4 border-t border-border bg-primary/5">
              {diagram.nodes.filter(n => n.id === selectedNode).map(node => (
                <div key={node.id}>
                  <h4 className="font-medium text-primary mb-1">{node.label}</h4>
                  {node.description && (
                    <p className="text-sm text-muted-foreground">{node.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Flowchart Diagram Component
function FlowchartDiagram({ 
  diagram, 
  selectedNode, 
  onNodeSelect,
  isRtl 
}: { 
  diagram: ArticleDiagram; 
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
  isRtl: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {diagram.nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          <button
            onClick={() => onNodeSelect(selectedNode === node.id ? null : node.id)}
            className={cn(
              "px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium min-w-[120px]",
              selectedNode === node.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            {node.label}
          </button>
          {index < diagram.nodes.length - 1 && (
            <ChevronRight className={cn(
              "h-5 w-5 text-muted-foreground flex-shrink-0",
              isRtl && "rotate-180"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Hierarchy Diagram Component
function HierarchyDiagram({ 
  diagram, 
  selectedNode, 
  onNodeSelect 
}: { 
  diagram: ArticleDiagram; 
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
}) {
  // Simple tree-like layout
  const root = diagram.nodes[0];
  const children = diagram.nodes.slice(1);
  
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Root Node */}
      <button
        onClick={() => onNodeSelect(selectedNode === root?.id ? null : root?.id)}
        className={cn(
          "px-6 py-3 rounded-lg border-2 transition-all font-medium",
          selectedNode === root?.id
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        {root?.label}
      </button>
      
      {/* Connection Lines */}
      {children.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-start gap-4 flex-wrap justify-center">
            {children.map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <button
                  onClick={() => onNodeSelect(selectedNode === node.id ? null : node.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 transition-all text-sm",
                    selectedNode === node.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  {node.label}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Cycle Diagram Component
function CycleDiagram({ 
  diagram, 
  selectedNode, 
  onNodeSelect 
}: { 
  diagram: ArticleDiagram; 
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {diagram.nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          <button
            onClick={() => onNodeSelect(selectedNode === node.id ? null : node.id)}
            className={cn(
              "px-4 py-3 rounded-full border-2 transition-all text-sm font-medium min-w-[100px]",
              selectedNode === node.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            {node.label}
          </button>
          <span className="text-muted-foreground">→</span>
        </React.Fragment>
      ))}
      <span className="text-xs text-muted-foreground">(cycle repeats)</span>
    </div>
  );
}

// Comparison Diagram Component  
function ComparisonDiagram({ 
  diagram, 
  selectedNode, 
  onNodeSelect 
}: { 
  diagram: ArticleDiagram; 
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {diagram.nodes.map((node) => (
        <button
          key={node.id}
          onClick={() => onNodeSelect(selectedNode === node.id ? null : node.id)}
          className={cn(
            "p-4 rounded-lg border-2 transition-all text-start",
            selectedNode === node.id
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <h4 className="font-medium mb-1">{node.label}</h4>
          {node.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{node.description}</p>
          )}
        </button>
      ))}
    </div>
  );
}

// Concept Map Diagram Component
function ConceptMapDiagram({ 
  diagram, 
  selectedNode, 
  onNodeSelect 
}: { 
  diagram: ArticleDiagram; 
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
}) {
  // Concept map: interconnected nodes with visual connections
  const centerIndex = 0;
  const centerNode = diagram.nodes[centerIndex];
  const otherNodes = diagram.nodes.filter((_, i) => i !== centerIndex);
  
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Central Node */}
      <button
        onClick={() => onNodeSelect(selectedNode === centerNode?.id ? null : centerNode?.id)}
        className={cn(
          "px-6 py-4 rounded-full border-2 transition-all font-semibold text-base min-w-[180px]",
          selectedNode === centerNode?.id
            ? "border-primary bg-primary text-primary-foreground shadow-lg"
            : "border-primary/30 bg-primary/5 text-primary hover:border-primary hover:bg-primary/10"
        )}
      >
        {centerNode?.label}
      </button>
      
      {/* Connection Lines */}
      {otherNodes.length > 0 && (
        <div className="w-px h-6 bg-border" />
      )}
      
      {/* Surrounding Nodes */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {otherNodes.map((node) => (
          <React.Fragment key={node.id}>
            <button
              onClick={() => onNodeSelect(selectedNode === node.id ? null : node.id)}
              className={cn(
                "px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium min-w-[140px]",
                selectedNode === node.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              {node.label}
            </button>
            {/* Visual connector dots */}
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary/40" />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default InteractiveDiagrams; 
