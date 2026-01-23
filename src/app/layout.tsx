import type { Metadata } from "next";
import { Inter, Merriweather, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PsychePedia - The Psychology Encyclopedia",
    template: "%s | PsychePedia",
  },
  description:
    "A comprehensive academic wiki for psychology students. Explore foundational concepts, clinical applications, and research methods across all domains of psychological science.",
  keywords: [
    "psychology",
    "encyclopedia",
    "academic",
    "clinical psychology",
    "cognitive psychology",
    "developmental psychology",
    "social psychology",
    "neuropsychology",
    "psychotherapy",
    "DSM-5",
    "research methods",
  ],
  authors: [{ name: "PsychePedia Editorial Team" }],
  openGraph: {
    type: "website",
    siteName: "PsychePedia",
    title: "PsychePedia - The Psychology Encyclopedia",
    description:
      "A comprehensive academic wiki for psychology students covering all domains of psychological science.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PsychePedia - The Psychology Encyclopedia",
    description:
      "A comprehensive academic wiki for psychology students covering all domains of psychological science.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('psychepedia-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} ${notoSansArabic.variable} antialiased min-h-screen bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
