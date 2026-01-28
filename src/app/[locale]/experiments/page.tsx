import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight, Brain, FlaskConical, Eye, Hand, FileText, Target, User, Calculator } from "lucide-react";
import { locales } from "@/i18n/config";

interface ExperimentsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ExperimentsPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "experiments" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function ExperimentsPage({ params }: ExperimentsPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("experiments");
    const isRtl = locale === "ar";

    const experiments = [
        { id: "big-five", type: "personality", title: isRtl ? "السمات الخمس الكبرى" : "Big Five", href: "/experiments/big-five" },
        { id: "iq", type: "iq", title: isRtl ? "اختبار الذكاء" : "IQ Test", href: "/experiments/iq" },
        { id: "stroop", type: "stroop", title: isRtl ? "تأثير ستروب" : "Stroop Effect", href: "/experiments/stroop" },
        { id: "motion", type: "motion", title: isRtl ? "اكتشاف الحركة" : "Motion Detection", href: "/experiments/motion" },
        { id: "finger-tapping", type: "motor", title: isRtl ? "النقر بالأصابع" : "Finger Tapping", href: "/experiments/finger-tapping" },
        { id: "phq9", type: "phq9", title: isRtl ? "فحص الاكتئاب" : "PHQ-9", href: "/experiments/phq9" },
        { id: "gad7", type: "gad7", title: isRtl ? "فحص القلق" : "GAD-7", href: "/experiments/gad7" },
        { id: "mmse", type: "mmse", title: isRtl ? "فحص الإدراك" : "MMSE", href: "/experiments/mmse" },
        { id: "adhd", type: "adhd", title: isRtl ? "مقياس ADHD" : "ADHD", href: "/experiments/adhd" },
        { id: "autism", type: "autism", title: isRtl ? "مقياس التوحد" : "Autism", href: "/experiments/autism" },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "personality": return <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
            case "iq": return <Calculator className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
            case "stroop": return <FlaskConical className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
            case "motion": return <Eye className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
            case "motor": return <Hand className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
            case "phq9": return <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />;
            case "gad7": return <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
            case "mmse": return <FlaskConical className="w-6 h-6 text-red-600 dark:text-red-400" />;
            case "adhd": return <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
            case "autism": return <FlaskConical className="w-6 h-6 text-pink-600 dark:text-pink-400" />;
            default: return <Brain className="w-6 h-6 text-gray-600" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
                <p className="text-xl text-muted-foreground font-serif">
                    {t("description")}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiments.map((exp) => (
                    <Link
                        key={exp.id}
                        href={exp.href}
                        className="group relative p-6 bg-card rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 bg-muted">
                            {getIcon(exp.type)}
                        </div>

                        <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {exp.title}
                        </h2>

                        <div className={`flex items-center text-sm font-medium mt-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                            <span className="text-primary group-hover:underline">
                                {t("startExperiment")}
                            </span>
                            <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}