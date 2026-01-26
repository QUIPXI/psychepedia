"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Brain,
  Lightbulb,
  Users,
  Heart,
  Briefcase,
  GraduationCap,
  Sparkles,
  CornerDownRight,
  CornerUpLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Icon mapping for domains
const domainIcons: Record<string, React.ReactNode> = {
  foundations: <GraduationCap className="h-4 w-4" />,
  biological: <Brain className="h-4 w-4" />,
  cognitive: <Lightbulb className="h-4 w-4" />,
  developmental: <Users className="h-4 w-4" />,
  "social-personality": <Heart className="h-4 w-4" />,
  clinical: <BookOpen className="h-4 w-4" />,
  applied: <Briefcase className="h-4 w-4" />,
  "new-and-now": <Sparkles className="h-4 w-4" />,
};

// Navigation structure with proper titles for both languages
const navigationItems = [
  {
    id: "foundations",
    href: "/wiki/foundations",
    topics: [
      { id: "history-and-systems", href: "/wiki/foundations/history-and-systems", titleEn: "History & Systems", titleAr: "التاريخ والمدارس" },
      { id: "research-methods", href: "/wiki/foundations/research-methods", titleEn: "Research Methods", titleAr: "مناهج البحث" },
      { id: "ethics", href: "/wiki/foundations/ethics", titleEn: "Ethics", titleAr: "الأخلاقيات" },
    ],
  },
  {
    id: "biological",
    href: "/wiki/biological",
    topics: [
      { id: "neuropsychology", href: "/wiki/biological/neuropsychology", titleEn: "Neuropsychology", titleAr: "علم النفس العصبي" },
      { id: "sensation-perception", href: "/wiki/biological/sensation-perception", titleEn: "Sensation & Perception", titleAr: "الإحساس والإدراك" },
      { id: "psychopharmacology", href: "/wiki/biological/psychopharmacology", titleEn: "Psychopharmacology", titleAr: "علم الأدوية النفسية" },
    ],
  },
  {
    id: "cognitive",
    href: "/wiki/cognitive",
    topics: [
      { id: "cognitive-psychology", href: "/wiki/cognitive/cognitive-psychology", titleEn: "Cognitive Psychology", titleAr: "علم النفس المعرفي" },
      { id: "emotion-motivation", href: "/wiki/cognitive/emotion-motivation", titleEn: "Emotion & Motivation", titleAr: "الانفعال والدافعية" },
      { id: "psycholinguistics", href: "/wiki/cognitive/psycholinguistics", titleEn: "Psycholinguistics", titleAr: "علم اللغة النفسي" },
    ],
  },
  {
    id: "developmental",
    href: "/wiki/developmental",
    topics: [
      { id: "child-psychology", href: "/wiki/developmental/child-psychology", titleEn: "Child Psychology", titleAr: "علم نفس الطفل" },
      { id: "adolescent-psychology", href: "/wiki/developmental/adolescent-psychology", titleEn: "Adolescent Psychology", titleAr: "علم نفس المراهقة" },
      { id: "adult-psychology", href: "/wiki/developmental/adult-psychology", titleEn: "Adult Psychology", titleAr: "علم نفس الرشد" },
      { id: "geriatric-psychology", href: "/wiki/developmental/geriatric-psychology", titleEn: "Geriatric Psychology", titleAr: "علم نفس الشيخوخة" },
    ],
  },
  {
    id: "social-personality",
    href: "/wiki/social-personality",
    topics: [
      { id: "social-psychology", href: "/wiki/social-personality/social-psychology", titleEn: "Social Psychology", titleAr: "علم النفس الاجتماعي" },
      { id: "personality-theories", href: "/wiki/social-personality/personality-theories", titleEn: "Personality Theories", titleAr: "نظريات الشخصية" },
      { id: "cross-cultural", href: "/wiki/social-personality/cross-cultural", titleEn: "Cross-Cultural Psychology", titleAr: "علم النفس عبر الثقافات" },
    ],
  },
  {
    id: "clinical",
    href: "/wiki/clinical",
    topics: [
      { id: "psychopathology", href: "/wiki/clinical/psychopathology", titleEn: "Psychopathology", titleAr: "علم النفس المرضي" },
      { id: "assessment", href: "/wiki/clinical/assessment", titleEn: "Psychological Assessment", titleAr: "التقييم النفسي" },
      { id: "evidence-based-therapies", href: "/wiki/clinical/evidence-based-therapies", titleEn: "Evidence-Based Therapies", titleAr: "العلاجات المبنية على الأدلة" },
    ],
  },
  {
    id: "applied",
    href: "/wiki/applied",
    topics: [
      { id: "forensic-psychology", href: "/wiki/applied/forensic-psychology", titleEn: "Forensic Psychology", titleAr: "علم النفس الجنائي" },
      { id: "industrial-organizational", href: "/wiki/applied/industrial-organizational", titleEn: "I/O Psychology", titleAr: "علم النفس التنظيمي" },
      { id: "educational-school", href: "/wiki/applied/educational-school", titleEn: "Educational Psychology", titleAr: "علم النفس التربوي" },
      { id: "sports-performance", href: "/wiki/applied/sports-performance", titleEn: "Sports Psychology", titleAr: "علم النفس الرياضي" },
    ],
  },
  {
    id: "new-and-now",
    href: "/wiki/new-and-now",
    topics: [
      { id: "ai-mental-health", href: "/wiki/new-and-now/ai-mental-health", titleEn: "AI in Mental Health", titleAr: "الذكاء الاصطناعي في الصحة النفسية" },
      { id: "psychedelic-therapy", href: "/wiki/new-and-now/psychedelic-therapy", titleEn: "Psychedelic-Assisted Therapy", titleAr: "العلاج بمساعدة المخدرات النفسية" },
      { id: "eco-anxiety", href: "/wiki/new-and-now/eco-anxiety", titleEn: "Eco-Anxiety", titleAr: "القلق البيئي" },
      { id: "algorithmic-impact", href: "/wiki/new-and-now/algorithmic-impact", titleEn: "Algorithmic Feeds Impact", titleAr: "تأثير الخلاصات الخوارزمية" },
      { id: "exercise-vs-medication", href: "/wiki/new-and-now/exercise-vs-medication", titleEn: "Exercise as Therapy", titleAr: "التمرين كعلاج" },
      { id: "teen-sleep-patterns", href: "/wiki/new-and-now/teen-sleep-patterns", titleEn: "Teen Sleep Patterns", titleAr: "نوم المراهقين" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean; // Mobile
  onClose: () => void; // Mobile
  isCollapsed?: boolean; // Desktop
  onToggleCollapse?: () => void; // Desktop
}

function SidebarNav({ currentPath, isCollapsed = false, onToggleCollapse }: { currentPath: string; isCollapsed?: boolean; onToggleCollapse?: () => void }) {
  const t = useTranslations("domains");
  const tWiki = useTranslations("wiki");
  const locale = useLocale();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Remove locale prefix from path for comparison
  const cleanPath = currentPath.replace(`/${locale}`, "") || "/";

  // Auto-expand current domain
  React.useEffect(() => {
    const currentDomain = navigationItems.find(
      (item) =>
        cleanPath.startsWith(item.href) ||
        item.topics.some((t) => cleanPath === t.href)
    );
    if (currentDomain && !expandedItems.includes(currentDomain.id)) {
      setExpandedItems((prev) => [...prev, currentDomain.id]);
    }
  }, [cleanPath]);

  const toggleExpanded = (id: string) => {
    if (isCollapsed && onToggleCollapse) {
      onToggleCollapse();
      // Also expand this item
      if (!expandedItems.includes(id)) {
        setExpandedItems((prev) => [...prev, id]);
      }
      return;
    }

    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const isExpanded = expandedItems.includes(item.id);
        const isActive = cleanPath === item.href;
        const hasActiveChild = item.topics.some((topic) => cleanPath === topic.href);

        return (
          <div key={item.id}>
            <button
              onClick={() => toggleExpanded(item.id)}
              className={cn(
                "flex items-center rounded-md transition-colors font-semibold",
                isCollapsed ? "justify-center w-9 h-9 mx-auto" : "w-full justify-between px-2.5 py-1.5 text-sm",
                isActive || hasActiveChild
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isCollapsed ? t(`${item.id}.title`) : undefined}
            >
              <span className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2")}>
                {domainIcons[item.id]}
                <span className={`block transition-all duration-200 ${isCollapsed ? "w-0 overflow-hidden opacity-0" : "flex-1 truncate"}`}>
                  {t(`${item.id}.title`)}
                </span>
              </span>
              {!isCollapsed && (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  locale === "ar" ? <ChevronRight className="h-4 w-4 shrink-0 rotate-180" /> : <ChevronRight className="h-4 w-4 shrink-0" />
                )
              )}
            </button>

            {isExpanded && !isCollapsed && (
              <div className={`mt-1 ${locale === "ar" ? "me-4 border-e pe-4" : "ms-4 border-s ps-4"} space-y-1 border-border`}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tWiki("explore")}
                </Link>
                {item.topics.map((topic) => {
                  const isTopicActive = cleanPath === topic.href;
                  return (
                      <Link
                        key={topic.id}
                        href={topic.href}
                        className={cn(
                          "block rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                          isTopicActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                      {locale === "ar" ? topic.titleAr : topic.titleEn}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:pt-16 md:border-border md:bg-background transition-all duration-300 ease-in-out",
          locale === "ar" ? "md:end-0 md:border-s" : "md:start-0 md:border-e",
          isCollapsed ? "md:w-16" : "md:w-72"
        )}
      >
        <div className="flex items-center justify-end p-2 border-b border-border">
          <button onClick={onToggleCollapse} className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-all duration-300">
            <div className="relative w-4 h-4">
              <div className={`absolute inset-0 transition-all duration-300 transform ${isCollapsed ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}>
                <CornerUpLeft className="h-4 w-4" />
              </div>
              <div className={`absolute inset-0 transition-all duration-300 transform ${isCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                <CornerDownRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 overflow-x-hidden">
          <SidebarNav currentPath={pathname} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={locale === "ar" ? "right" : "left"} onClose={onClose} className="w-80 p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {locale === "ar" ? "سايكوبيديا" : "PsychePedia"}
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto p-4">
            <SidebarNav currentPath={pathname} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Sidebar;
