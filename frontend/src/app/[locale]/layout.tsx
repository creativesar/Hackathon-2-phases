import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow - Modern Task Management",
    template: "%s | TaskFlow",
  },
  description:
    "A beautifully crafted task management app with secure authentication, real-time updates, and a delightful user experience.",
  keywords: [
    "todo",
    "task management",
    "productivity",
    "Next.js",
    "FastAPI",
    "full-stack",
    "modern",
  ],
  authors: [{ name: "TaskFlow Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TaskFlow",
    title: "TaskFlow - Modern Task Management",
    description:
      "A beautifully crafted task management app with secure authentication, real-time updates, and a delightful user experience.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ur' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
              <Navbar />
              <div className="pt-16">
                {children}
              </div>
            </div>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
