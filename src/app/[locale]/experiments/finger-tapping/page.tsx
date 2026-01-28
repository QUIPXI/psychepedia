import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import FingerTappingTest from "@/components/experiments/FingerTappingTest";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "experiments" });

    return {
        title: "Finger Tapping Test",
        description: "Measure your motor speed and coordination",
    };
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const breadcrumbs = [
        { label: locale === "ar" ? "التجارب" : "Experiments", href: "/experiments", current: false },
        { label: locale === "ar" ? "النقر بالأصابع" : "Finger Tapping", href: "/experiments/finger-tapping", current: true },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Breadcrumb items={breadcrumbs} className="mb-8" />
            <div className="bg-background rounded-xl shadow-sm border p-8">
                <FingerTappingTest />
            </div>
        </div>
    );
}