import { getTranslations, setRequestLocale } from "next-intl/server";
import StroopTest from "@/components/experiments/StroopTest";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { locales } from "@/i18n/config";

interface StroopPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: StroopPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "experiments" });

    return {
        title: t("stroopTest.title"),
        description: t("stroopTest.description"),
    };
}

export default async function StroopPage({ params }: StroopPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("experiments.stroopTest");

    const breadcrumbs = [
        { label: locale === "ar" ? "التجارب" : "Experiments", href: "/experiments" },
        { label: t("title"), href: "/experiments/stroop", current: true },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumb items={breadcrumbs} className="mb-6" />

            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
                <p className="text-xl text-muted-foreground font-serif max-w-2xl mx-auto">
                    {t("description")}
                </p>
            </header>

            <StroopTest />
        </div>
    );
}
