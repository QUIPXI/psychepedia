import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import BigFivePersonality from "@/components/experiments/BigFivePersonality";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params;
    return {
        title: "Big Five Personality Test",
        description: "Assess your personality on the five major dimensions",
    };
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const breadcrumbs = [
        { label: locale === "ar" ? "التجارب" : "Experiments", href: "/experiments", current: false },
        { label: locale === "ar" ? "السمات الخمس الكبرى" : "Big Five Personality", href: "/experiments/big-five", current: true },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Breadcrumb items={breadcrumbs} className="mb-8" />
            <div className="bg-background rounded-xl shadow-sm border p-8">
                <BigFivePersonality />
            </div>
        </div>
    );
}