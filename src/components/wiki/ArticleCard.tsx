import * as React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn, getDomainColorClass, titleCase } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  description: string;
  domain: string;
  topic: string;
  href: string;
  lastModified?: string;
  readingTime?: number;
}

export function ArticleCard({
  title,
  description,
  domain,
  href,
  lastModified,
  readingTime,
}: ArticleCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/20 group-hover:bg-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white",
                getDomainColorClass(domain)
              )}
            >
              {titleCase(domain)}
            </span>
            {readingTime && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </span>
            )}
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            {lastModified && (
              <span className="text-xs text-muted-foreground">
                Updated: {new Date(lastModified).toLocaleDateString()}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ArticleCard;
