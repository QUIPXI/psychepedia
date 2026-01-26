import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight, Brain, FlaskConical } from "lucide-react";
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
        {
            id: "brain",
            title: t("brainExplorer.title"),
            description: t("brainExplorer.description"),
            icon: Brain,
            href: "/experiments/brain",
            color: "bg-pink-100 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400",
            border: "hover:border-pink-500",
        },
        {
            id: "stroop",
            title: t("stroopTest.title"),
            description: t("stroopTest.description"),
            icon: FlaskConical,
            href: "/experiments/stroop",
            color: "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
            border: "hover:border-blue-500",
        },
    ];

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
                        className={`group relative p-6 bg-card rounded-xl border transition-all duration-300 hover:shadow-lg ${exp.border}`}
                    >
                        <div className={`w-12 h-12 rounded-lg ${exp.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <exp.icon className="w-6 h-6" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {exp.title}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {exp.description}
                        </p>

                        <div className={`flex items-center text-sm font-medium ${isRtl ? "flex-row-reverse" : ""}`}>
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
