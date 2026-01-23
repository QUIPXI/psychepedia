import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto" />
          <div className="h-3 w-24 bg-muted rounded animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
