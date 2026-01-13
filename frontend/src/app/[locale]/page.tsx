"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FloatingParticles, ParticleTrails, HeadingParticles } from "@/components/ClientOnlyParticles";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export default function Home() {
  const t = useTranslations("HomePage");
  const [mounted, setMounted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const features = [
    {
      icon: CheckCircleIcon,
      title: t("feature.taskManagement"),
      desc: t("feature.taskManagementDesc"),
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: ShieldCheckIcon,
      title: t("feature.secureAuth"),
      desc: t("feature.secureAuthDesc"),
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: DevicePhoneMobileIcon,
      title: t("feature.responsive"),
      desc: t("feature.responsiveDesc"),
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: UserGroupIcon,
      title: t("feature.multiUser"),
      desc: t("feature.multiUserDesc"),
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: BoltIcon,
      title: t("feature.fast"),
      desc: t("feature.fastDesc"),
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const techStack = [
    { name: "Next.js 16", icon: "N" },
    { name: "FastAPI", icon: "F" },
    { name: "PostgreSQL", icon: "P" },
    { name: "TypeScript", icon: "T" },
    { name: "Tailwind", icon: "T" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated mesh gradient background - kept unchanged as requested */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        {/* Animated floating orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Enhanced animated particles with premium movement patterns */}
      <FloatingParticles />

      {/* Premium grid pattern overlay with animated lines */}
      <div
        className="fixed inset-0 opacity-[0.05] animate-grid-move"
        style={{
          backgroundImage: `linear-gradient(rgba(147,51,234,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Premium particle trails */}
      <ParticleTrails />

      {/* Floating geometric shapes for premium feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute w-8 h-8 border border-violet-500/20 animate-spin-slow"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
              animationDuration: `${20 + i * 5}s`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <div
            key={`circle-${i}`}
            className="absolute w-12 h-12 border border-fuchsia-500/20 rounded-full animate-spin-slow"
            style={{
              right: `${10 + i * 30}%`,
              bottom: `${20 + i * 25}%`,
              animationDuration: `${25 + i * 5}s`,
              animationDirection: 'reverse'
            }}
          />
        ))}
      </div>


      {/* Hero Section */}
      <main className="relative z-10">
        <div className={`max-w-5xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/[0.05] backdrop-blur border border-white/10 rounded-full px-5 py-2 mb-8 hover:bg-white/[0.08] transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-white/60">
              {t("techStack")}
            </span>
          </div>

          {/* Main Heading with staggered animation and premium glow effect */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 relative">
            <span
              className={`block text-white transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: '200ms' }}
            >
              {t("title")}
            </span>
            <span
              className={`block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 animate-gradient-x transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: '400ms', backgroundSize: '200% auto' }}
            >
              {t("subtitle")}
            </span>
            {/* Premium glow effect behind the text */}
            <span
              className={`absolute inset-0 bg-gradient-to-r from-violet-400/20 via-fuchsia-400/20 to-pink-400/20 blur-2xl opacity-50 -z-10 transition-all duration-1000 ${mounted ? "opacity-50 scale-110" : "opacity-0 scale-100"}`}
              style={{ transitionDelay: '600ms' }}
            />

            {/* Premium text shimmer effect */}
            <span
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10 transition-all duration-700 ${mounted ? "opacity-30 scale-105" : "opacity-0 scale-95"}`}
              style={{
                transitionDelay: '700ms',
                transform: 'skewX(-12deg) translateX(-100%)',
                animation: mounted ? 'text-shimmer 3s infinite' : 'none'
              }}
            />

            {/* Premium holographic effect */}
            <span
              className={`absolute inset-0 bg-gradient-to-br from-violet-400/10 via-fuchsia-400/5 to-pink-400/10 blur-xl opacity-30 -z-10 transition-all duration-2000 ${mounted ? "opacity-30 scale-150" : "opacity-0 scale-100"}`}
              style={{ transitionDelay: '800ms' }}
            />

            {/* Premium particle trail effect */}
            <span
              className={`absolute inset-0 opacity-20 -z-10 transition-all duration-1000 ${mounted ? "opacity-20" : "opacity-0"}`}
              style={{ transitionDelay: '900ms' }}
            >
              {mounted && <HeadingParticles />}
            </span>
          </h1>

          {/* Subheading */}
          <p
            className={`text-lg sm:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '600ms' }}
          >
            {t("tagline")}
          </p>

          {/* Premium CTA Buttons with advanced effects */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-20 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '800ms' }}
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden isolate"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Enhanced shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Premium pulsing glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-violet-500/20 blur-xl" />

              {/* Particle burst effect on hover */}
              <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/60 rounded-full"
                    style={{
                      left: `${10 + i * 10}%`,
                      top: `${10 + (i % 3) * 20}%`,
                      '--tx': `${(i - 4) * 6.25}px`,
                      '--ty': `${(i - 4) * 6.25}px`,
                      animation: `particle-burst 0.6s ease-out forwards`,
                      animationDelay: `${i * 0.1}s`
                    } as React.CSSProperties}
                  />
                ))}
              </div>

              {/* Icon with enhanced animation */}
              <SparklesIcon className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />

              <span className="relative z-10">{t("startFree")}</span>
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 relative z-10" />

              {/* Corner sparkles */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.2s' }} />
            </Link>
            <Link
              href="/signin"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-white/80 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Subtle particle effect */}
              <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse"
                    style={{
                      left: `${20 + i * 20}%`,
                      top: `${20 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>

              <span className="relative z-10">{t("signIn")}</span>
            </Link>
          </div>

          {/* Premium Stats with enhanced animations and task-focused effects */}
          <div
            className={`grid grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '1000ms' }}
          >
            {[
              { value: "5+", label: "stats.features" },
              { value: "100%", label: "stats.secure" },
              { value: "<50ms", label: "stats.response" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-violet-500/20 hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden"
              >
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Task completion animation */}
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-1000" />

                {/* Floating animation for the value */}
                <div className="text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-1 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 relative z-10 animate-fade-in-up">
                  {stat.value}
                  {/* Value pulsing animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-all duration-1000 rounded-full blur-xl" />
                </div>

                <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {t(stat.label)}
                </div>

                {/* Corner accents */}
                <div className="absolute top-1 right-1 w-1 h-1 bg-violet-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-fuchsia-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.5s' }} />

                {/* Task-focused decorative elements */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ animationDelay: '0.7s' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Features Showcase - Tasks & Chat with Task-focused Animations */}
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
          {/* Animated floating task elements */}
          <div className="absolute top-10 left-10 w-3 h-3 bg-violet-400/60 rounded-full animate-float-enhanced" style={{ animationDelay: '0s', animationDuration: '8s' }} />
          <div className="absolute top-20 right-20 w-2 h-2 bg-fuchsia-400/60 rounded-full animate-float-enhanced" style={{ animationDelay: '1s', animationDuration: '6s' }} />
          <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-emerald-400/60 rounded-full animate-float-enhanced" style={{ animationDelay: '2s', animationDuration: '7s' }} />

          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3 relative inline-block">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> Maximum Productivity</span>
              {/* Animated underline */}
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-fuchsia-500/30" />
            </h2>
            <p className="text-white/60 text-sm max-w-2xl mx-auto">
              Manage your tasks efficiently with our intuitive interface and AI-powered chat assistant
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {/* Tasks Feature Card - Left with Task-Oriented Animations */}
            <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Task completion animation elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 border-2 border-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-300 animate-spin-slow" />
              <div className="absolute -bottom-10 -left-10 w-16 h-16 border-2 border-violet-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-500 animate-spin-slow" style={{ animationDirection: 'reverse' }} />

              <div className="relative z-10">
                {/* Icon with task completion animation */}
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-600 mb-4 shadow-2xl shadow-violet-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden">
                  <ClipboardDocumentListIcon className="h-7 w-7 text-white relative z-10" />
                  {/* Task completion checkmark animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 rounded-xl" />
                </div>

                {/* Title with productivity-focused animation */}
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-fuchsia-300 transition-all duration-300 relative">
                  Task Management
                  {/* Progress bar animation */}
                  <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000" />
                </h3>

                {/* Description with productivity-focused animation */}
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Create, organize, and track your daily tasks with ease. Mark tasks as complete and stay on top of your to-do list.
                </p>

                {/* Animated divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-all duration-1000" style={{ animation: 'shine 2s ease-in-out infinite' }} />
                </div>

                {/* Features List with task-oriented animations */}
                <ul className="space-y-2 mb-5">
                  {[
                    { text: "Create tasks with title and description", delay: 0 },
                    { text: "Mark tasks as complete with one click", delay: 100 },
                    { text: "Filter by status and search tasks", delay: 200 },
                    { text: "Real-time sync across all devices", delay: 300 }
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2.5 text-white/80 group/item hover:text-white transition-colors opacity-100 transition-all duration-500"
                      style={{ animationDelay: `${feature.delay}ms`, animationFillMode: 'forwards' }}
                    >
                      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform relative">
                        <CheckCircleSolid className="h-3.5 w-3.5 text-emerald-400" />
                        {/* Completion animation */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover/item:opacity-100 transition-all duration-500" />
                      </div>
                      <span className="text-xs font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Enhanced CTA Button with task completion animation */}
                <Link
                  href="/tasks"
                  className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10 text-xs">Explore Tasks</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 relative z-10 group-hover/btn:translate-x-2 transition-transform" />

                  {/* Task completion animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                </Link>
              </div>
            </div>

            {/* Chat Feature Card - Right with AI-focused Animations */}
            <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 hover:border-fuchsia-500/40 hover:shadow-2xl hover:shadow-fuchsia-500/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* AI brain-like animation elements */}
              <div className="absolute top-5 right-5 w-8 h-8 border border-fuchsia-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 animate-pulse" />
              <div className="absolute top-10 right-10 w-4 h-4 border border-pink-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-400 animate-pulse" />
              <div className="absolute bottom-5 left-5 w-6 h-6 border border-violet-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-300 animate-pulse" />

              <div className="relative z-10">
                {/* Icon with AI badge and neural network animation */}
                <div className="relative inline-block mb-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 via-fuchsia-500 to-pink-600 shadow-2xl shadow-fuchsia-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden">
                    <ChatBubbleLeftRightIcon className="h-7 w-7 text-white relative z-10" />
                    {/* Neural network animation */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-1000">
                      <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                      <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                    </div>
                  </div>
                  {/* Enhanced AI Badge with pulsing animation */}
                  <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white text-[10px] font-black shadow-xl shadow-orange-500/50 animate-pulse">
                    AI
                  </div>
                </div>

                {/* Title with AI-focused animation */}
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-fuchsia-300 group-hover:to-pink-300 transition-all duration-300 relative">
                  AI Chat Assistant
                  {/* AI processing animation */}
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                </h3>

                {/* Description with AI-focused animation */}
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Manage your tasks using natural language with our AI-powered chatbot. Just tell it what you need!
                </p>

                {/* Animated divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-all duration-1000" style={{ animation: 'shine 2s ease-in-out infinite' }} />
                </div>

                {/* Features List with AI-oriented animations */}
                <ul className="space-y-2 mb-5">
                  {[
                    { text: "Add tasks with natural language", delay: 0 },
                    { text: "Complete, delete, or update tasks by ID", delay: 100 },
                    { text: "View all tasks in real-time sidebar", delay: 200 },
                    { text: "Powered by advanced AI technology", delay: 300 }
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2.5 text-white/80 group/item hover:text-white transition-colors opacity-100 transition-all duration-500"
                      style={{ animationDelay: `${feature.delay}ms`, animationFillMode: 'forwards' }}
                    >
                      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-pink-600/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform relative">
                        <SparklesIcon className="h-3.5 w-3.5 text-fuchsia-400" />
                        {/* AI processing animation */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/0 via-cyan-400/10 to-blue-400/0 opacity-0 group-hover/item:opacity-100 transition-all duration-500" />
                      </div>
                      <span className="text-xs font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Enhanced CTA Button with AI animation */}
                <Link
                  href="/chat"
                  className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 via-fuchsia-500 to-pink-600 shadow-xl shadow-fuchsia-500/30 hover:shadow-2xl hover:shadow-fuchsia-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10 text-xs">Try AI Chat</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 relative z-10 group-hover/btn:translate-x-2 transition-transform" />

                  {/* AI processing animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Section with advanced animations */}
        <section className="max-w-6xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative">
          {/* Floating geometric elements for premium feel */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={`geo-${i}`}
                className="absolute w-16 h-16 border border-violet-500/10 opacity-20 animate-spin-slow"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 12}%`,
                  animationDuration: `${25 + i * 3}s`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
            {[...Array(4)].map((_, i) => (
              <div
                key={`circle-${i}`}
                className="absolute w-24 h-24 border border-fuchsia-500/10 rounded-full opacity-10 animate-spin-slow"
                style={{
                  right: `${15 + i * 20}%`,
                  bottom: `${25 + i * 15}%`,
                  animationDuration: `${30 + i * 5}s`,
                  animationDirection: 'reverse'
                }}
              />
            ))}
          </div>

          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 relative inline-block">
              {t("features.title")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> {t("features.subtitle")}</span>
              {/* Decorative underline with animated gradient */}
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-fuchsia-500/30" />
              {/* Animated wave effect */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-full animate-pulse" />
            </h2>
            <p className="text-white/50 max-w-xl mx-auto relative z-10">
              {t("features.desc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700 blur-xl -z-10`} />

                {/* Premium floating animation */}
                <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 animate-float-slow`}>
                  <f.icon className="h-6 w-6 text-white" />
                  {/* Enhanced glow effect on hover */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.gradient} blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700`} />

                  {/* Pulsing effect */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.gradient} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 animate-pulse`} />

                  {/* Particle burst effect on hover */}
                  <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute w-0.5 h-0.5 bg-white/60 rounded-full"
                        style={{
                          left: `${20 + j * 15}%`,
                          top: `${20 + (j % 3) * 20}%`,
                          animation: `particle-burst 0.8s ease-out forwards`,
                          animationDelay: `${j * 0.1}s`,
                          '--tx': `${(j - 4) * 3.75}px`,
                          '--ty': `${(j - 4) * 3.75}px`
                        } as React.CSSProperties}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-violet-200 transition-colors relative z-10">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/60 transition-colors relative z-10">{f.desc}</p>

                {/* Premium corner accents */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-gradient-to-r from-emerald-400/60 to-cyan-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute top-2 right-2 w-1 h-1 bg-gradient-to-r from-cyan-400/60 to-blue-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-r from-violet-400/60 to-fuchsia-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-gradient-to-r from-fuchsia-400/60 to-pink-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.6s' }} />

                {/* Subtle particle trail */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={`trail-${j}`}
                      className="absolute w-0.5 h-0.5 bg-gradient-to-r from-violet-400/40 to-fuchsia-400/40 rounded-full animate-streak"
                      style={{
                        left: `${(i * 16.67) % 100}%`,
                        top: `${(i * 16.67 + 50) % 100}%`,
                        animationDuration: `${2 + ((i * 0.333) % 2)}s`,
                        animationDelay: `${j * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Tech Stack Section with advanced animations */}
        <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
          {/* Floating orbital elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={`orbital-${i}`}
                className="absolute w-2 h-2 bg-gradient-to-r from-violet-400/40 to-fuchsia-400/40 rounded-full animate-spin-slow"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${25 + i * 8}%`,
                  animationDuration: `${35 + i * 2}s`,
                  animationDelay: `${i * 0.7}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 bg-white/[0.03] backdrop-blur border border-white/5 rounded-3xl p-8 sm:p-10 hover:border-white/10 transition-colors duration-500 overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700 blur-xl -z-10" />

            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-white/40 mb-4 group">
                <BoltIcon className="h-4 w-4 group-hover:text-violet-400 transition-colors animate-pulse" />
                {t("techStack")}

                {/* Lightning bolt animation */}
                <div className="absolute w-1 h-4 bg-gradient-to-t from-violet-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ left: '50%', top: '-10px', transform: 'translateX(-50%)' }} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white group">
                {t("techDesc")}
                {/* Underline animation */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-3 relative z-10">
              {techStack.map((tech, i) => (
                <div
                  key={i}
                  className="group relative flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  <div className="relative z-10">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative overflow-hidden">
                      {tech.icon}

                      {/* Icon glow effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                      {/* Particle explosion on hover */}
                      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {[...Array(4)].map((_, j) => (
                          <div
                            key={j}
                            className="absolute w-0.5 h-0.5 bg-white/60 rounded-full"
                            style={{
                              left: `${25 + j * 25}%`,
                              top: `${25 + (j % 2) * 50}%`,
                              animation: `particle-burst 0.5s ease-out forwards`,
                              animationDelay: `${j * 0.1}s`,
                              '--tx': `${(j - 4) * 2.5}px`,
                              '--ty': `${(j - 4) * 2.5}px`
                            } as React.CSSProperties}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="font-medium text-white/70 group-hover:text-white transition-colors relative z-10">
                      {tech.name}
                    </span>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-gradient-to-r from-emerald-400/60 to-cyan-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                  <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-gradient-to-r from-cyan-400/60 to-blue-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="absolute bottom-1 left-1 w-0.5 h-1 bg-gradient-to-r from-violet-400/60 to-fuchsia-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-gradient-to-r from-fuchsia-400/60 to-pink-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium CTA Section with advanced animations */}
        <section className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={`cta-float-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-r from-violet-400/40 to-fuchsia-400/40 rounded-full animate-float-enhanced"
                style={{
                  left: `${(i * 16.67) % 100}%`,
                  top: `${(i * 16.67 + 50) % 100}%`,
                  animationDelay: `${(i * 0.833) % 5}s`,
                  animationDuration: `${4 + (i * 0.5) % 3}s`
                }}
              />
            ))}
          </div>

          <div className="relative rounded-3xl overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 animate-gradient-x" style={{ backgroundSize: '200% auto' }} />

            {/* Animated grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwSDJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEI0djRIMHYyaDR2NGgyVjZoNFY0SDZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20 animate-grid-move" />

            {/* Particle burst effect */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              {[...Array(12)].map((_, i) => (
                <div
                  key={`burst-${i}`}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  style={{
                    left: `${(i * 16.67) % 100}%`,
                    top: `${(i * 16.67 + 50) % 100}%`,
                    animation: `particle-burst 1s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`,
                    '--tx': `${(i - 4) * 12.5}px`,
                    '--ty': `${(i - 4) * 12.5}px`
                  } as React.CSSProperties}
                />
              ))}
            </div>

            <div className="relative z-10 p-10 sm:p-14 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur mb-6 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                <SparklesIcon className="h-8 w-8 text-white animate-pulse relative z-10" />

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />

                {/* Particle burst on hover */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(8)].map((_, j) => (
                    <div
                      key={`icon-particle-${j}`}
                      className="absolute w-0.5 h-0.5 bg-white/60 rounded-full"
                      style={{
                        left: `${25 + j * 12}%`,
                        top: `${25 + (j % 2) * 50}%`,
                        animation: `particle-burst 0.8s ease-out forwards`,
                        animationDelay: `${j * 0.1}s`,
                        '--tx': `${(j - 4) * 2.5}px`,
                        '--ty': `${(j - 4) * 2.5}px`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 group">
                {t("cta.title")}
                {/* Underline animation */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </h2>

              <p className="text-white/80 mb-8 max-w-md mx-auto">
                {t("cta.desc")}
              </p>

              <Link
                href="/signup"
                className="group/btn relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-violet-600 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden isolate"
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Particle burst on hover */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={`btn-particle-${j}`}
                      className="absolute w-0.5 h-0.5 bg-violet-600/60 rounded-full"
                      style={{
                        left: `${10 + j * 15}%`,
                        top: `${20 + (j % 3) * 20}%`,
                        animation: `particle-burst 0.6s ease-out forwards`,
                        animationDelay: `${j * 0.1}s`,
                        '--tx': `${(j - 4) * 3.75}px`,
                        '--ty': `${(j - 4) * 3.75}px`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>

                {t("cta.button")}
                <ArrowRightIcon className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform relative z-10" />

                {/* Corner accents */}
                <div className="absolute top-1 right-1 w-1 h-1 bg-gradient-to-r from-emerald-400/60 to-cyan-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-gradient-to-r from-cyan-400/60 to-blue-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
              </Link>
            </div>
          </div>
        </section>

        {/* Premium Testimonials Section */}
        <section className="max-w-6xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 relative inline-block">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Thousands</span> of Users
              {/* Decorative underline */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30" />
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              See what our users say about their experience with TaskFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "TaskFlow transformed how I manage my daily tasks. The AI chat assistant is incredibly helpful!",
                author: "Sarah K.",
                role: "Product Manager",
                avatar: "SK"
              },
              {
                quote: "The seamless integration between chat and task management saves me hours every week.",
                author: "Michael T.",
                role: "Software Engineer",
                avatar: "MT"
              },
              {
                quote: "Finally, a task manager that understands natural language. Game changer for productivity!",
                author: "Emma L.",
                role: "Marketing Director",
                avatar: "EL"
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50" />

                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {testimonial.avatar}
                    </div>
                    {/* Hover effect on avatar */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                  </div>
                  <div className="relative z-10">
                    <div className="font-medium text-white group-hover:text-violet-200 transition-colors">{testimonial.author}</div>
                    <div className="text-sm text-white/50">{testimonial.role}</div>
                  </div>
                </div>

                <p className="text-white/80 italic relative z-10">&quot;{testimonial.quote}&quot;</p>

                <div className="flex mt-4 relative z-10">
                  {[...Array(5)].map((_, star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-violet-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-fuchsia-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Premium FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 relative inline-block">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Questions</span>
              {/* Decorative underline */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30" />
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Everything you need to know about TaskFlow
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does the AI chat assistant work?",
                answer: "Our AI assistant understands natural language commands to help you manage tasks. Simply tell it what you need to do, and it will create, update, or complete tasks for you."
              },
              {
                question: "Is my data secure?",
                answer: "Yes, all your data is encrypted and securely stored. We use industry-standard security practices to protect your information."
              },
              {
                question: "Can I use TaskFlow offline?",
                answer: "Currently, TaskFlow requires an internet connection for the AI features, but basic task management can work with limited functionality."
              },
              {
                question: "How many tasks can I create?",
                answer: "There's no limit to the number of tasks you can create. Our system scales with your needs."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/2 to-fuchsia-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <button
                  className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.02] transition-colors text-left relative z-10"
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                >
                  <h3 className="font-semibold text-white group-hover:text-violet-200 transition-colors">{faq.question}</h3>
                  <svg
                    className={`h-5 w-5 text-white/50 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-violet-400' : 'group-hover:text-violet-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-6 text-white/70 border-t border-white/5 relative z-10 bg-white/[0.01] transition-all duration-300 animate-fade-in-up">
                    {faq.answer}
                  </div>
                )}

                {/* Corner accents */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-violet-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-fuchsia-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/20">
                    <CheckCircleSolid className="h-5 w-5 text-white" />
                  </div>
                  {/* Pulsing glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="font-display font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all duration-300">TaskFlow</span>
              </div>
              <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                Modern Task Management Platform
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
