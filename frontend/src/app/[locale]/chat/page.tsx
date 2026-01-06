'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthUser } from '@/lib/auth';
import ChatInterface from '@/components/ChatInterface';
import { useTranslations } from 'next-intl';
import {
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { signOut } from '@/lib/auth';

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const t = useTranslations("HomePage");

  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated()) {
      router.push('/signin');
      return;
    }

    const authUser = getAuthUser();
    if (!authUser) {
      router.push('/signin');
      return;
    }

    setUser(authUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-56 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="h-16 bg-white/[0.03] border border-white/5 rounded-2xl mb-6 animate-pulse" />

          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-white/5 rounded-lg" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated()) {
    router.push('/signin');
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning");
    if (hour < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24 sm:pb-8 relative overflow-hidden">
      {/* Animated background with aurora effect */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        {/* Pulsating orbs with morphing */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-morph-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-morph-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] animate-breathe" />
        {/* Moving gradient beam */}
        <div className="absolute inset-0 bg-gradient-conic from-violet-500/10 via-transparent to-fuchsia-500/10 animate-spin-very-slow" style={{ animationDuration: '20s' }} />
      </div>

      {/* Enhanced floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float-enhanced ${i % 3 === 0 ? 'bg-violet-400/40 w-1.5 h-1.5' : i % 3 === 1 ? 'bg-fuchsia-400/30 w-1 h-1' : 'bg-pink-400/20 w-2 h-2'}`}
            style={{
              left: `${5 + (i * 7) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 4)}s`
            }}
          />
        ))}
        {/* Sparkle particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-0.5 h-0.5 bg-white/60 rounded-full animate-twinkle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Animated grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] animate-grid-pulse"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & User */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-xl bg-violet-500/30 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">{getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{user.name || user.email}</span>!</h1>
                <p className="text-sm text-white/40 hidden sm:block">
                  {t("list.getProductive")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSwitcher />

              <button
                onClick={() => router.push('/')}
                className="p-2.5 rounded-xl text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-300 hover:scale-105"
                aria-label="Home"
                title="Home"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
                aria-label={t("nav.logout")}
                title={t("nav.logout")}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-xl bg-violet-500/30 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
            <h1 className="text-2xl font-bold text-white">
              AI Todo Assistant
            </h1>
          </div>
          <p className="text-white/40">
            Manage your tasks with natural language
          </p>
        </div>
        <ChatInterface />
      </main>
    </div>
  );
}