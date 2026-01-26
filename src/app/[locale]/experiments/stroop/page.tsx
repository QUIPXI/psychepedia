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
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Breadcrumb items={breadcrumbs} className="mb-8" />

            <div className="bg-background rounded-xl shadow-sm border p-8">
                <StroopTest />
            </div>
        </div>
    );
}
