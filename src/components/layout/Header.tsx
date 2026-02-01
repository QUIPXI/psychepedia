"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, Moon, Sun, BookOpen, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeSelector } from "@/components/layout/ThemeSelector";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Search index for articles
const articleSearchIndex = [
  { id: "foundations/history-and-systems", title: "History & Systems", titleAr: "التاريخ والمدارس", description: "Historical development of psychology", descriptionAr: "التطور التاريخي لعلم النفس", domain: "foundations", domainTitle: "Foundations", topic: "history-and-systems", keywords: ["history", "systems", "schools"], content: "", href: "/wiki/foundations/history-and-systems" },
  { id: "foundations/research-methods", title: "Research Methods", titleAr: "مناهج البحث", description: "Scientific methods in psychology", descriptionAr: "المناهج العلمية في علم النفس", domain: "foundations", domainTitle: "Foundations", topic: "research-methods", keywords: ["research", "methods", "science"], content: "", href: "/wiki/foundations/research-methods" },
  { id: "foundations/ethics", title: "Ethics", titleAr: "الأخلاقيات", description: "Ethical principles in psychology", descriptionAr: "المبادئ الأخلاقية في علم النفس", domain: "foundations", domainTitle: "Foundations", topic: "ethics", keywords: ["ethics", "principles"], content: "", href: "/wiki/foundations/ethics" },
  { id: "biological/neuropsychology", title: "Neuropsychology", titleAr: "علم النفس العصبي", description: "Brain and behavior relationships", descriptionAr: "العلاقة بين الدماغ والسلوك", domain: "biological", domainTitle: "Biological", topic: "neuropsychology", keywords: ["brain", "neuroscience"], content: "", href: "/wiki/biological/neuropsychology" },
  { id: "biological/sensation-perception", title: "Sensation & Perception", titleAr: "الإحساس والإدراك", description: "How we sense and perceive the world", descriptionAr: "كيف نحس وندرك العالم", domain: "biological", domainTitle: "Biological", topic: "sensation-perception", keywords: ["sensation", "perception", "senses"], content: "", href: "/wiki/biological/sensation-perception" },
  { id: "biological/psychopharmacology", title: "Psychopharmacology", titleAr: "علم الأدوية النفسية", description: "Drugs and behavior", descriptionAr: "الأدوية والسلوك", domain: "biological", domainTitle: "Biological", topic: "psychopharmacology", keywords: ["drugs", "medication", "pharmacology"], content: "", href: "/wiki/biological/psychopharmacology" },
  { id: "cognitive/cognitive-psychology", title: "Cognitive Psychology", titleAr: "علم النفس المعرفي", description: "Memory, attention, and thinking", descriptionAr: "الذاكرة والانتباه والتفكير", domain: "cognitive", domainTitle: "Cognitive", topic: "cognitive-psychology", keywords: ["memory", "attention", "thinking"], content: "", href: "/wiki/cognitive/cognitive-psychology" },
  { id: "cognitive/emotion-motivation", title: "Emotion & Motivation", titleAr: "الانفعال والدافعية", description: "Emotions and what drives behavior", descriptionAr: "الانفعالات وما يحرك السلوك", domain: "cognitive", domainTitle: "Cognitive", topic: "emotion-motivation", keywords: ["emotion", "motivation", "feelings"], content: "", href: "/wiki/cognitive/emotion-motivation" },
  { id: "developmental/child-psychology", title: "Child Psychology", titleAr: "علم نفس الطفل", description: "Development in childhood", descriptionAr: "النمو في مرحلة الطفولة", domain: "developmental", domainTitle: "Developmental", topic: "child-psychology", keywords: ["child", "development", "childhood"], content: "", href: "/wiki/developmental/child-psychology" },
  { id: "developmental/adolescent-psychology", title: "Adolescent Psychology", titleAr: "علم نفس المراهقة", description: "Development in adolescence", descriptionAr: "النمو في مرحلة المراهقة", domain: "developmental", domainTitle: "Developmental", topic: "adolescent-psychology", keywords: ["adolescent", "teenager", "development"], content: "", href: "/wiki/developmental/adolescent-psychology" },
  { id: "social-personality/social-psychology", title: "Social Psychology", titleAr: "علم النفس الاجتماعي", description: "Social behavior and influence", descriptionAr: "السلوك الاجتماعي والتأثير", domain: "social-personality", domainTitle: "Social", topic: "social-psychology", keywords: ["social", "behavior", "influence"], content: "", href: "/wiki/social-personality/social-psychology" },
  { id: "social-personality/personality-theories", title: "Personality Theories", titleAr: "نظريات الشخصية", description: "Understanding personality", descriptionAr: "فهم الشخصية", domain: "social-personality", domainTitle: "Social", topic: "personality-theories", keywords: ["personality", "theories", "traits"], content: "", href: "/wiki/social-personality/personality-theories" },
  { id: "clinical/psychopathology", title: "Psychopathology", titleAr: "علم النفس المرضي", description: "Mental disorders and abnormal psychology", descriptionAr: "الاضطرابات النفسية وعلم النفس الشاذ", domain: "clinical", domainTitle: "Clinical", topic: "psychopathology", keywords: ["disorders", "abnormal", "mental health"], content: "", href: "/wiki/clinical/psychopathology" },
  { id: "clinical/assessment", title: "Psychological Assessment", titleAr: "التقييم النفسي", description: "Testing and evaluation", descriptionAr: "الاختبارات والتقييم", domain: "clinical", domainTitle: "Clinical", topic: "assessment", keywords: ["testing", "assessment", "evaluation"], content: "", href: "/wiki/clinical/assessment" },
  { id: "clinical/evidence-based-therapies", title: "Evidence-Based Therapies", titleAr: "العلاجات المبنية على الأدلة", description: "CBT, DBT, and other treatments", descriptionAr: "العلاج المعرفي السلوكي وغيره", domain: "clinical", domainTitle: "Clinical", topic: "evidence-based-therapies", keywords: ["therapy", "CBT", "DBT", "treatment"], content: "", href: "/wiki/clinical/evidence-based-therapies" },
  { id: "applied/forensic-psychology", title: "Forensic Psychology", titleAr: "علم النفس الجنائي", description: "Psychology and the legal system", descriptionAr: "علم النفس والنظام القانوني", domain: "applied", domainTitle: "Applied", topic: "forensic-psychology", keywords: ["forensic", "legal", "crime"], content: "", href: "/wiki/applied/forensic-psychology" },
  { id: "applied/industrial-organizational", title: "I/O Psychology", titleAr: "علم النفس التنظيمي", description: "Psychology in the workplace", descriptionAr: "علم النفس في مكان العمل", domain: "applied", domainTitle: "Applied", topic: "industrial-organizational", keywords: ["workplace", "organizational", "work"], content: "", href: "/wiki/applied/industrial-organizational" },
  { id: "new-and-now/ai-mental-health", title: "AI in Mental Health", titleAr: "الذكاء الاصطناعي في الصحة النفسية", description: "The rise of AI chatbots, diagnostics, and ethical considerations in therapy.", descriptionAr: "صعود روبوتات الدردشة، والتشخيص بالذكاء الاصطناعي، والاعتبارات الأخلاقية.", domain: "new-and-now", domainTitle: "New & Now", topic: "ai-mental-health", keywords: ["AI", "tech", "chatbots", "therapy"], content: "", href: "/wiki/new-and-now/ai-mental-health" },
  { id: "new-and-now/psychedelic-therapy", title: "Psychedelic-Assisted Therapy", titleAr: "العلاج بمساعدة المخدر", description: "Regulatory milestones and therapeutic mechanisms of MDMA and Psilocybin.", descriptionAr: "المعالم التنظيمية والآليات العلاجية لـ MDMA والسيلوسيبين.", domain: "new-and-now", domainTitle: "New & Now", topic: "psychedelic-therapy", keywords: ["psychedelic", "MDMA", "psilocybin", "therapy"], content: "", href: "/wiki/new-and-now/psychedelic-therapy" },
  { id: "new-and-now/eco-anxiety", title: "Eco-Anxiety & Climate Psychology", titleAr: "القلق البيئي وعلم النفس المناخي", description: "Understanding the psychological impact of the climate crisis.", descriptionAr: "فهم التأثير النفسي لأزمة المناخ.", domain: "new-and-now", domainTitle: "New & Now", topic: "eco-anxiety", keywords: ["climate", "anxiety", "environment", "psychology"], content: "", href: "/wiki/new-and-now/eco-anxiety" },
  { id: "new-and-now/algorithmic-impact", title: "The Impact of Algorithmic Feeds", titleAr: "تأثير الخلاصات الخوارزمية", description: "How TikTok and Reels affect attention and self-image.", descriptionAr: "كيف يؤثر TikTok و Reels على الانتباه والصورة الذاتية.", domain: "new-and-now", domainTitle: "New & Now", topic: "algorithmic-impact", keywords: ["social media", "algorithms", "tiktok", "attention"], content: "", href: "/wiki/new-and-now/algorithmic-impact" },
];

// Search index for interactive experiments/tests
const experimentSearchIndex = [
  { id: "big-five", type: "experiment", title: "Big Five Personality Test", titleAr: "اختبار السمات الخمس الكبرى", description: "Assess your personality across five major dimensions", descriptionAr: "قيّم شخصيتك عبر خمسة أبعاد رئيسية", domain: "experiments", domainTitle: "Interactive", topic: "personality", keywords: ["personality", "traits", "OCEAN", "psychology test"], content: "", href: "/experiments/big-five" },
  { id: "iq", type: "experiment", title: "IQ Test", titleAr: "اختبار الذكاء", description: "Measure your cognitive abilities across multiple dimensions", descriptionAr: "قِس قدراتك المعرفية عبر أبعاد متعددة", domain: "experiments", domainTitle: "Interactive", topic: "intelligence", keywords: ["IQ", "intelligence", "cognitive", "reasoning"], content: "", href: "/experiments/iq" },
  { id: "stroop", type: "experiment", title: "Stroop Effect Test", titleAr: "تأثير ستروب", description: "Test your focus and reaction speed", descriptionAr: "اختبر تركيزك وسرعة رد فعلك", domain: "experiments", domainTitle: "Interactive", topic: "attention", keywords: ["Stroop", "attention", "reaction", "cognitive flexibility"], content: "", href: "/experiments/stroop" },
  { id: "motion", type: "experiment", title: "Motion Detection Test", titleAr: "اختبار اكتشاف الحركة", description: "Assess your visual motion perception", descriptionAr: "قيّم إدراكك البصري للحركة", domain: "experiments", domainTitle: "Interactive", topic: "perception", keywords: ["motion", "perception", "visual", "attention"], content: "", href: "/experiments/motion" },
  { id: "finger-tapping", type: "experiment", title: "Finger Tapping Test", titleAr: "اختبار النقر بالأصابع", description: "Measure your motor speed and coordination", descriptionAr: "قِس سرعتك وتنسيقك الحركي", domain: "experiments", domainTitle: "Interactive", topic: "motor", keywords: ["motor", "coordination", "speed", "neuroscience"], content: "", href: "/experiments/finger-tapping" },
  { id: "phq9", type: "experiment", title: "PHQ-9 Depression Screening", titleAr: "فحص الاكتئاب (PHQ-9)", description: "Brief screening for depressive symptoms", descriptionAr: "فحص موجز لأعراض الاكتئاب", domain: "experiments", domainTitle: "Interactive", topic: "depression", keywords: ["depression", "PHQ", "mental health", "screening"], content: "", href: "/experiments/phq9" },
  { id: "gad7", type: "experiment", title: "GAD-7 Anxiety Screening", titleAr: "فحص القلق (GAD-7)", description: "Brief screening for anxiety symptoms", descriptionAr: "فحص موجز لأعراض القلق", domain: "experiments", domainTitle: "Interactive", topic: "anxiety", keywords: ["anxiety", "GAD", "mental health", "screening"], content: "", href: "/experiments/gad7" },
  { id: "mmse", type: "experiment", title: "MMSE Cognitive Screening", titleAr: "فحص الإدراك (MMSE)", description: "Brief cognitive assessment for orientation and memory", descriptionAr: "تقييم معرفي موجز للتوجه والذاكرة", domain: "experiments", domainTitle: "Interactive", topic: "cognition", keywords: ["MMSE", "cognitive", "screening", "dementia"], content: "", href: "/experiments/mmse" },
  { id: "adhd", type: "experiment", title: "ADHD Rating Scale", titleAr: "مقياس ADHD", description: "Screen for attention-deficit/hyperactivity symptoms", descriptionAr: "فحص أعراض اضطراب فرط الحركة ونقص الانتباه", domain: "experiments", domainTitle: "Interactive", topic: "attention", keywords: ["ADHD", "attention", "hyperactivity", "screening"], content: "", href: "/experiments/adhd" },
  { id: "autism", type: "experiment", title: "Autism Spectrum Screening", titleAr: "فحص طيف التوحد", description: "Screen for autistic traits in adults", descriptionAr: "فحص سمات التوحد لدى البالغين", domain: "experiments", domainTitle: "Interactive", topic: "autism", keywords: ["autism", "ASD", "screening", "neurodevelopmental"], content: "", href: "/experiments/autism" },
  { id: "depth-perception", type: "experiment", title: "Depth Perception Test", titleAr: "اختبار إدراك العمق", description: "Assess your depth perception abilities", descriptionAr: "قيّم قدرتك على إدراك العمق", domain: "experiments", domainTitle: "Interactive", topic: "perception", keywords: ["depth", "perception", "visual", "spatial"], content: "", href: "/experiments/depth-perception" },
];

// Combined search index
const searchIndex = [...articleSearchIndex, ...experimentSearchIndex];

import { OPEN_SEARCH_EVENT } from "@/lib/events";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener(OPEN_SEARCH_EVENT, handleOpenSearch);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(OPEN_SEARCH_EVENT, handleOpenSearch);
    };
  }, []);

  // Transform search index based on locale
  const localizedSearchIndex = searchIndex.map(item => ({
    ...item,
    title: locale === "ar" ? item.titleAr : item.title,
    description: locale === "ar" ? item.descriptionAr : item.description,
  }));

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg me-6"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block">
              {locale === "ar" ? "سايكوبيديا" : "PsychePedia"}
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/wiki"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("wiki")}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ms-auto">
            {/* Search button - NO keyboard shortcut indicator */}
            <Button
              variant="outline"
              className={cn(
                "relative h-9 w-9 p-0 md:h-9 md:w-64 md:justify-start md:px-3 md:py-2"
              )}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 md:me-2" />
              <span className="hidden md:inline-flex text-muted-foreground">
                {t("searchPlaceholder")}
              </span>
            </Button>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme selector */}
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchIndex={localizedSearchIndex}
      />
    </>
  );
}

export default Header;
