import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import GAD7Screening from "@/components/experiments/GAD7Screening";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const breadcrumbs = [
        { label: locale === "ar" ? "التجارب" : "Experiments", href: "/experiments", current: false },
        { label: locale === "ar" ? "فحص القلق" : "GAD-7", href: "/experiments/gad7", current: true },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Breadcrumb items={breadcrumbs} className="mb-8" />
            <div className="bg-background rounded-xl shadow-sm border p-8">
                <GAD7Screening />
            </div>
        </div>
    );
}