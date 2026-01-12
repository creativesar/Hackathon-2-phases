"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { getAuthUser, isAuthenticated } from "@/lib/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export default function ChooserPage() {
  const router = useRouter();
  const t = useTranslations("chooser");
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const authUser = getAuthUser();
    if (!authUser) {
      router.push("/signin");
      return;
    }

    setUserName(authUser.name || authUser.email);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden pt-16">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />
      </div>

      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)` ,
          backgroundSize: "50px 50px",
        }}
      />


      <main className="relative z-10">
        {/* Hero */}
        <div className={`max-w-4xl mx-auto px-4 pt-12 pb-8 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2.5 bg-white/[0.05] backdrop-blur border border-white/10 rounded-full px-4 py-1.5 mb-6 hover:bg-white/[0.08] transition-colors">
            <SparklesIcon className="h-4 w-4 text-violet-300" />
            <span className="text-sm font-medium text-white/60">{t("welcomeBack")}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
            <span className="block text-white">{t("chooseWorkspace")}</span>
            <span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 animate-gradient-x [background-size:200%_auto]"
            >
              {userName ? t("greeting", { name: userName }) : ""}
            </span>
          </h1>

          <p className="text-white/55 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Choice cards */}
        <section className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl grid md:grid-cols-2 gap-4 md:gap-5">
            {/* Tasks */}
            <div
              className="group relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/15 hover:-translate-y-1 transition-all duration-300 overflow-hidden opacity-0 animate-slide-in-up [animation-delay:120ms] [animation-fill-mode:forwards]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-colors duration-700" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-600 mb-3 shadow-lg shadow-violet-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                </div>

                <h2 className="text-lg font-display font-bold text-white mb-1.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-fuchsia-300 transition-all duration-300">
                  {t("tasks.title")}
                </h2>

                <p className="text-white/65 text-sm mb-4 leading-relaxed">
                  {t("tasks.description")}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-4" />

                <ul className="space-y-2.5 mb-4">
                  {(t.raw("tasks.features") as string[]).map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-white/80 animate-fade-in"
                    >
                      <div className="h-5 w-5 rounded-md bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span className="text-xs font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/tasks"
                  className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10 text-sm">{t("openTasks")}</span>
                  <ArrowRightIcon className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Chat */}
            <div
              className="group relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-fuchsia-500/40 hover:shadow-xl hover:shadow-fuchsia-500/15 hover:-translate-y-1 transition-all duration-300 overflow-hidden opacity-0 animate-slide-in-up [animation-delay:220ms] [animation-fill-mode:forwards]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-colors duration-700" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 via-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white text-[10px] font-black shadow-lg shadow-orange-500/40">
                    AI
                  </div>
                </div>

                <h2 className="text-lg font-display font-bold text-white mb-1.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-fuchsia-300 group-hover:to-pink-300 transition-all duration-300">
                  {t("chat.title")}
                </h2>

                <p className="text-white/65 text-sm mb-4 leading-relaxed">
                  {t("chat.description")}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-4" />

                <ul className="space-y-2.5 mb-4">
                  {(t.raw("chat.features") as string[]).map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-white/80 animate-fade-in"
                    >
                      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-pink-600/20 flex items-center justify-center flex-shrink-0">
                        <SparklesIcon className="h-4 w-4 text-fuchsia-300" />
                      </div>
                      <span className="text-xs font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/chat"
                  className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/35 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10 text-sm">{t("openChat")}</span>
                  <ArrowRightIcon className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="mt-10 text-center text-xs text-white/35">
            {t("bookmarkTip")}
          </div>
        </section>

        {/* Soft CTA */}
        <section className="max-w-4xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <div className="bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-6 sm:p-8 text-center">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-3 shadow-lg shadow-violet-500/25">
              <CheckCircleSolid className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-1.5">{t("cta.title")}</h3>
            <p className="text-white/55 text-sm mb-4">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                href="/tasks"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white/80 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300"
              >
                {t("openTasks")}
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white/80 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300"
              >
                {t("openChat")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
