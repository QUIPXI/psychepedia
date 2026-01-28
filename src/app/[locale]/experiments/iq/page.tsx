import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import IQTest from "@/components/experiments/IQTest";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params;
    return {
        title: locale === "ar" ? "اختبار الذكاء" : "IQ Test",
        description: "Assess your cognitive abilities across multiple dimensions",
    };
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const breadcrumbs = [
        { label: locale === "ar" ? "التجارب" : "Experiments", href: "/experiments", current: false },
        { label: locale === "ar" ? "اختبار الذكاء" : "IQ Test", href: "/experiments/iq", current: true },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Breadcrumb items={breadcrumbs} className="mb-8" />
            <div className="bg-background rounded-xl shadow-sm border p-8">
                <IQTest />
            </div>
        </div>
    );
}
