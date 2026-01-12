"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

/**
 * Language Switcher Component
 * Simple toggle button to switch between English and Urdu
 */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleLanguage = () => {
    const newLocale = locale === "en" ? "ur" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  const currentLanguage = locale === "en" ? "English" : "اردو";

  return (
    <button
      onClick={handleToggleLanguage}
      className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] backdrop-blur border border-white/10 text-white/80 hover:text-white hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-300 outline-none"
      aria-label="Toggle language"
      title={`Switch to ${locale === "en" ? "Urdu" : "English"}`}
    >
      <GlobeAltIcon className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
      <span className="text-sm font-medium">{currentLanguage}</span>
    </button>
  );
}
