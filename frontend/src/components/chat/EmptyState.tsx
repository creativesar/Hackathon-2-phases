"use client";

import { ChatBubbleLeftRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  userName?: string;
  greeting?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

/**
 * EmptyState Component
 * Highly animated, engaging version that fits perfectly without scrolling
 */
export default function EmptyState({ userName, greeting = "Hello", onSuggestionClick }: EmptyStateProps) {
  const t = useTranslations("HomePage");

  const suggestions = [
    t("chat.example1"),
    t("chat.example2"),
  ];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative max-w-md w-full animate-scale-in">
        {/* Animated gradient background with stronger pulse */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/30 to-pink-500/30 rounded-3xl blur-3xl animate-pulse" style={{ animationDuration: '2s' }} />

        <div className="relative bg-white/[0.03] backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 text-center overflow-hidden hover:border-violet-500/30 transition-all duration-500 hover:scale-[1.02]">
          {/* Animated mesh gradient overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-600/30 via-transparent to-fuchsia-600/30 animate-gradient-shift" />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-violet-400/40 rounded-full animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* Highly animated icon */}
            <div className="relative inline-block mb-4">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-violet-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 rounded-2xl bg-fuchsia-500/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
              </div>

              {/* Main icon container with levitation */}
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/50 animate-levitate">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white animate-pulse" />
              </div>

              {/* Orbiting sparkles */}
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '8s' }}>
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-500/50 animate-pulse" />
              </div>
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-500/50 animate-pulse" />
              </div>

              {/* Corner badge with bounce */}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-xl shadow-pink-500/50 animate-bounce-gentle">
                <SparklesIcon className="h-3 w-3 text-white animate-spin-slow" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            {/* Animated text */}
            <h3 className="text-lg font-bold text-white mb-1.5 animate-fade-in-up">
              <span className="inline-block animate-gradient-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                {t("chat.welcome")}
              </span>
            </h3>
            <p className="text-white/40 mb-4 text-xs animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t("chat.welcomeDesc")}
            </p>

            {/* Animated Clickable Suggestions */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center gap-1.5 mb-2.5 text-xs text-white/40">
                <SparklesIcon className="w-3 h-3 animate-pulse" />
                <span className="font-medium">{t("chat.welcomeDesc")}</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className="group relative w-full flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-white/[0.03] to-white/[0.02] hover:from-violet-500/20 hover:to-fuchsia-500/20 transition-all duration-300 border border-white/10 hover:border-violet-500/50 cursor-pointer overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/20 active:translate-y-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <SparklesIcon className="h-3.5 w-3.5 text-violet-400 flex-shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors text-left relative z-10">"{suggestion}"</span>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-xl" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
