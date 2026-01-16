"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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
  EnvelopeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export default function Home() {
  const t = useTranslations("HomePage");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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


  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        {/* Animated floating orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
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
              animationDuration: `${4 + i}s`
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-105">
                  <CheckCircleSolid className="h-6 w-6 text-white" />
                </div>
                {/* Pulse ring on logo */}
                <div className="absolute inset-0 rounded-xl bg-violet-500/20 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <span className="text-xl font-display font-bold text-white tracking-tight">{t('brand.name')}</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/tasks"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
              >
                <ClipboardDocumentListIcon className="h-4 w-4" />
                <span>{t('brand.tasks')}</span>
              </Link>
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
              >
                <CheckCircleSolid className="h-4 w-4" />
                <span>{t('brand.chat')}</span>
              </Link>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                {t("getStarted")}
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className={`max-w-5xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Animated background elements */}
          <div className="absolute -top-28 -left-28 w-80 h-80 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => {
              // Deterministic values to prevent hydration mismatch
              const leftPercent = ((i * 123) % 100);
              const topPercent = ((i * 234) % 100);
              const animDelay = ((i * 17) % 30) / 10; // 0.0 to 2.9
              const animDuration = 3 + ((i * 29) % 20) / 10; // 3.0 to 4.9

              return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  animationDelay: `${animDelay}s`,
                  animationDuration: `${animDuration}s`
                }}
              ></div>
            )})}
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white/[0.06] backdrop-blur-xl border border-white/15 rounded-full px-6 py-3 mb-8 hover:bg-white/[0.09] transition-all duration-300 relative z-10 shadow-xl">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </div>
            <span className="text-sm font-medium text-white/80">
              {t("techStack")}
            </span>
          </div>

          {/* Main Heading with staggered animation */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight mb-6 relative z-10">
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
          </h1>

          {/* Subheading */}
          <p
            className={`text-base sm:text-lg lg:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '600ms' }}
          >
            {t("tagline")}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '800ms' }}
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-4 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-2xl shadow-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/50 hover:-translate-y-2 transition-all duration-300 overflow-hidden text-base font-bold"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <SparklesIcon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{t("startFree")}</span>
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-white/90 bg-white/[0.06] border border-white/20 hover:bg-white/[0.09] hover:text-white hover:border-white/30 transition-all duration-300 relative z-10 text-base font-medium"
            >
              {t("signIn")}
            </Link>
          </div>

          {/* Stats with stunning hover effects */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-md sm:max-w-xl mx-auto transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: '1000ms' }}
          >
            {[
              { value: "5+", label: t('stats.features'), icon: "⚙️", gradient: "from-violet-400 via-purple-400 to-fuchsia-400" },
              { value: "100%", label: t('stats.secure'), icon: "🔒", gradient: "from-emerald-400 via-teal-400 to-cyan-400" },
              { value: "<50ms", label: t('stats.response'), icon: "⚡", gradient: "from-amber-400 via-orange-400 to-red-400" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/15 rounded-2xl p-4 hover:bg-gradient-to-br hover:from-violet-500/[0.06] hover:to-fuchsia-500/[0.06] hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/15 hover:-translate-y-2 transition-all duration-500 cursor-default z-10 overflow-hidden"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {/* Animated floating orb */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700 animate-pulse"></div>

                {/* Animated floating orb - opposite corner */}
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 rounded-full blur-md group-hover:scale-125 transition-transform duration-700 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                <div className="relative z-20 flex flex-col items-center space-y-2">
                  {/* Icon container with enhanced styling */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-xl blur-lg group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="relative text-2xl mb-1 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                      {stat.icon}
                    </div>
                  </div>

                  {/* Value with stunning gradient and animation */}
                  <div className={`text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-1 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>

                  {/* Label with enhanced styling */}
                  <div className="text-xs sm:text-sm font-semibold text-white/70 group-hover:text-white/90 transition-all duration-300 text-center uppercase tracking-tight">
                    {stat.label}
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-10 text-white/70 text-sm">
            <div className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="group-hover:text-emerald-400 transition-colors group-hover:scale-105 transition-transform">{t('landing.trust.security')}</span>
            </div>
            <div className="h-5 w-px bg-white/25"></div>
            <div className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors group-hover:scale-110 transition-transform">
                <BoltIcon className="h-5 w-5 text-amber-400" />
              </div>
              <span className="group-hover:text-amber-400 transition-colors group-hover:scale-105 transition-transform">{t('landing.trust.speed')}</span>
            </div>
            <div className="h-5 w-px bg-white/25"></div>
            <div className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors group-hover:scale-110 transition-transform">
                <DevicePhoneMobileIcon className="h-5 w-5 text-blue-400" />
              </div>
              <span className="group-hover:text-blue-400 transition-colors group-hover:scale-105 transition-transform">{t('landing.trust.mobile')}</span>
            </div>
          </div>
        </div>

        {/* Main Features Showcase - Tasks & Chat */}
        <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-10 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-xl animate-pulse"></div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 relative z-10">
              {t('landing.features.title')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> {t('features.subtitle')}</span>
            </h2>
            <p className="text-white/60 text-sm max-w-xl mx-auto relative z-10">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {/* Tasks Feature Card - Left */}
            <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 transition-all duration-700 overflow-hidden"
              style={{ animation: 'fade-in-up 0.8s ease-out forwards' }}>
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Decorative circles */}
              <div className="absolute -top-16 -right-16 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-1000" />
              <div className="absolute -bottom-16 -left-16 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-all duration-1000" />

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => {
                  // Deterministic values to prevent hydration mismatch
                  const leftPercent = ((i * 135) % 100);
                  const topPercent = ((i * 246) % 100);
                  const animDelay = ((i * 19) % 30) / 10; // 0.0 to 2.9
                  const animDuration = 3 + ((i * 31) % 20) / 10; // 3.0 to 4.9

                  return (
                  <div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-violet-400/30 rounded-full animate-float-particle"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      animationDelay: `${animDelay}s`,
                      animationDuration: `${animDuration}s`
                    }}
                  ></div>
                )})}
              </div>

              <div className="relative z-10">
                {/* Icon with enhanced styling */}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-600 mb-4 shadow-lg shadow-violet-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                </div>

                {/* Title with better typography */}
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-fuchsia-300 transition-all duration-300">
                  {t('landing.features.taskManagement')}
                </h3>

                {/* Description with better spacing */}
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {t('landing.features.taskManagementDesc')}
                </p>

                {/* Divider line */}
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-4" />

                {/* Features List with enhanced styling */}
                <ul className="space-y-2 mb-4">
                  {[
                    { text: t('landing.features.taskFeatures.create'), icon: CheckCircleSolid },
                    { text: t('landing.features.taskFeatures.complete'), icon: CheckCircleSolid },
                    { text: t('landing.features.taskFeatures.filter'), icon: CheckCircleSolid },
                    { text: t('landing.features.taskFeatures.sync'), icon: CheckCircleSolid }
                  ].map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-white/80 group/item hover:text-white transition-all duration-300 text-xs"
                      style={{ animationDelay: `${idx * 100}ms`, animation: 'fade-in-up 0.6s ease-out forwards' }}
                    >
                      <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300 group/item">
                        <feature.icon className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Enhanced CTA Button */}
                <Link
                  href="/tasks"
                  className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/40 hover:shadow-lg hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden text-xs"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10">{t('feature.explore')}</span>
                  <ArrowRightIcon className="h-3 w-3 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Chat Feature Card - Right */}
            <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 hover:border-fuchsia-500/40 hover:shadow-2xl hover:shadow-fuchsia-500/20 hover:-translate-y-2 transition-all duration-700 overflow-hidden"
              style={{ animation: 'fade-in-up 0.8s ease-out 0.2s forwards' }}>
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Decorative circles */}
              <div className="absolute -top-16 -right-16 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-all duration-1000" />
              <div className="absolute -bottom-16 -left-16 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-1000" />

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => {
                  // Deterministic values to prevent hydration mismatch
                  const leftPercent = ((i * 147) % 100);
                  const topPercent = ((i * 258) % 100);
                  const animDelay = ((i * 23) % 30) / 10; // 0.0 to 2.9
                  const animDuration = 3 + ((i * 37) % 20) / 10; // 3.0 to 4.9

                  return (
                  <div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-fuchsia-400/30 rounded-full animate-float-particle"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      animationDelay: `${animDelay}s`,
                      animationDuration: `${animDuration}s`
                    }}
                  ></div>
                )})}
              </div>

              <div className="relative z-10">
                {/* Icon with badge and enhanced styling */}
                <div className="relative inline-block mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 via-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-fuchsia-600/30 to-pink-600/30 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                  </div>
                  {/* Enhanced AI Badge */}
                  <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white text-[10px] font-black shadow-lg shadow-orange-500/50 animate-pulse">
                    AI
                  </div>
                </div>

                {/* Title with better typography */}
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-fuchsia-300 group-hover:to-pink-300 transition-all duration-300">
                  {t('landing.features.chat.title')}
                </h3>

                {/* Description with better spacing */}
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {t('landing.features.chat.subtitle')}
                </p>

                {/* Divider line */}
                <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent mb-4" />

                {/* Features List with enhanced styling */}
                <ul className="space-y-2 mb-4">
                  {[
                    { text: t('landing.features.chat.features.natural'), icon: SparklesIcon },
                    { text: t('landing.features.chat.features.updateById'), icon: SparklesIcon },
                    { text: t('landing.features.chat.features.realtime'), icon: SparklesIcon },
                    { text: t('landing.features.chat.features.ai'), icon: SparklesIcon }
                  ].map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-white/80 group/item hover:text-white transition-all duration-300 text-xs"
                      style={{ animationDelay: `${idx * 100}ms`, animation: 'fade-in-up 0.6s ease-out forwards' }}
                    >
                      <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-pink-600/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300 group/item">
                        <feature.icon className="h-3 w-3 text-fuchsia-400" />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Enhanced CTA Button */}
                <Link
                  href="/chat"
                  className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-fuchsia-600 via-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/40 hover:shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden text-xs"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10">{t('landing.features.chat.title')}</span>
                  <ArrowRightIcon className="h-3 w-3 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow/Process Section */}
        <section className="max-w-6xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-xl animate-pulse"></div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 relative z-10">
              {t('extras.workflow.title')}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto relative z-10 text-lg">
              {t('extras.workflow.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-violet-500/30 hidden lg:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: t('workflow.steps.signup.title'),
                  description: t('workflow.steps.signup.description'),
                  icon: UserGroupIcon,
                  gradient: "from-violet-500 to-purple-500"
                },
                {
                  step: "02",
                  title: t('workflow.steps.addTasks.title'),
                  description: t('workflow.steps.addTasks.description'),
                  icon: ClipboardDocumentListIcon,
                  gradient: "from-emerald-500 to-teal-500"
                },
                {
                  step: "03",
                  title: t('workflow.steps.organize.title'),
                  description: t('workflow.steps.organize.description'),
                  icon: CheckCircleIcon,
                  gradient: "from-fuchsia-500 to-pink-500"
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-3 transition-all duration-700 overflow-hidden"
                  style={{
                    transitionDelay: `${i * 150}ms`,
                    animation: 'fade-in-up 0.8s ease-out forwards'
                  }}
                >
                  {/* Background decorative elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-violet-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-fuchsia-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>

                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 relative`}>
                      <item.icon className="h-8 w-8 text-white" />
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    </div>

                    <div className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-3">
                      {item.step}
                    </div>

                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-fuchsia-300 transition-all duration-300">
                      {item.title}
                    </h3>

                    <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with staggered animations */}
        <section className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-xl animate-pulse"></div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 relative z-10">
              {t("features.title")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> {t("features.subtitle")}</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto relative z-10 text-base">
              {t("features.desc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-violet-500/[0.08] hover:to-fuchsia-500/[0.08] hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-3 transition-all duration-700 overflow-hidden"
                style={{
                  transitionDelay: `${i * 100}ms`,
                  animation: 'fade-in-up 0.8s ease-out forwards'
                }}
              >
                {/* Enhanced background decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-violet-500/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-fuchsia-500/15 rounded-full blur-lg group-hover:scale-150 transition-transform duration-1000 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-violet-500/40`}>
                  <f.icon className="h-6 w-6 text-white" />
                  {/* Enhanced glow effect on hover */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.gradient} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-violet-200 transition-colors group-hover:scale-105 transition-transform">{f.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed group-hover:text-white/90 transition-colors group-hover:opacity-100">{f.desc}</p>

                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics/Achievements Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-700 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-violet-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-fuchsia-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 text-center mb-10">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                {t('extras.testimonials.trustedBy')}
              </h3>
              <p className="text-white/60 max-w-xl mx-auto text-sm">
                {t('extras.testimonials.joinUsers')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { number: "50K+", label: t('stats.users'), icon: UserGroupIcon },
                { number: "99.9%", label: t('stats.uptime'), icon: ShieldCheckIcon },
                { number: "2M+", label: t('stats.tasks'), icon: CheckCircleIcon },
                { number: "24/7", label: t('stats.support'), icon: BoltIcon }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group text-center relative p-3"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animation: 'fade-in-up 0.8s ease-out forwards'
                  }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 mb-3 group-hover:scale-110 transition-transform duration-500">
                    <stat.icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all duration-500">
                    {stat.number}
                  </div>
                  <div className="text-white/60 group-hover:text-white/80 transition-colors text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Enhanced Testimonials Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              {t('extras.testimonials.trustedByAlt')}
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              {t('extras.testimonials.joinUsers')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: t('testimonials.roles.productManager'),
                content: t('testimonials.content.sarah'),
                avatar: "SJ",
                delay: "0ms"
              },
              {
                name: "Michael Chen",
                role: t('testimonials.roles.developer'),
                content: t('testimonials.content.michael'),
                avatar: "MC",
                delay: "200ms"
              },
              {
                name: "Emma Rodriguez",
                role: t('testimonials.roles.creativeDirector'),
                content: t('testimonials.content.emma'),
                avatar: "ER",
                delay: "400ms"
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl p-7 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                style={{
                  animationDelay: testimonial.delay,
                  animation: 'fade-in-up 0.8s ease-out forwards'
                }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-violet-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-base">{testimonial.name}</h4>
                    <p className="text-sm text-white/70">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <svg key={starIndex} className="h-4 w-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <blockquote className="text-white/90 leading-relaxed relative text-base">
                  <svg className="absolute -top-2 -left-2 h-6 w-6 text-violet-500/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="ml-6 text-sm">
                    "{testimonial.content}"
                  </p>
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* Compact FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              {t('faq.title')}
            </h2>
            <p className="text-white/60 max-w-md mx-auto text-sm">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                question: t('faq.questions.security'),
                answer: t('faq.answers.security')
              },
              {
                question: t('faq.questions.collaboration'),
                answer: t('faq.answers.collaboration')
              },
              {
                question: t('faq.questions.freeTrial'),
                answer: t('faq.answers.freeTrial')
              },
              {
                question: t('faq.questions.aiChat'),
                answer: t('faq.answers.aiChat')
              },
              {
                question: t('faq.questions.cancel'),
                answer: t('faq.answers.cancel')
              },
              {
                question: t('faq.questions.integrations'),
                answer: t('faq.answers.integrations')
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-white/[0.03] to-white/[0.02] backdrop-blur border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/30 transition-all duration-300"
              >
                <details className="group-details">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.03] transition-colors group-open:bg-white/[0.04] group-open:border-b border-white/10">
                    <h3 className="font-display font-medium text-white group-hover:text-violet-200 transition-colors text-sm flex-1 text-left pr-2">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.05] group-hover:bg-white/[0.10] transition-colors">
                      <svg
                        className="h-3 w-3 text-violet-400 group-open:rotate-180 transition-transform duration-300 ease-in-out"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-4 pb-3 pt-1 text-white/70 leading-snug text-xs bg-white/[0.01]">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>

        {/* Compact CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-10 text-center overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                {t('cta.title')}
              </h2>

              <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-6 leading-relaxed">
                {t('extras.testimonials.joinProfessionals')}
              </p>

              <Link
                href="/signup"
                className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300 text-base"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                {t('cta.getStartedFree')}
                <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>

              <p className="text-white/60 text-xs mt-3">
                {t('cta.freeTrial')}
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Section with Text and Form */}
        <section className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-12 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-violet-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-fuchsia-500/10 rounded-full blur-xl"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-6 lg:mb-8 mx-auto lg:mx-0">
                  <CheckCircleSolid className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                  {t('newsletter.sectionTitle')}
                </h3>

                <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-lg">
                  {t('newsletter.description')}
                </p>

                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                      <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{t('newsletter.weeklyTips')}</h4>
                      <p className="text-white/60 text-sm">{t('extras.newsletter.workflowAdvice')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center mt-0.5">
                      <SparklesIcon className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{t('features.preview.title')}</h4>
                      <p className="text-white/60 text-sm">{t('features.preview.description')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-500/20 flex items-center justify-center mt-0.5">
                      <ShieldCheckIcon className="h-4 w-4 text-fuchsia-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{t('newsletter.spamPolicy')}</h4>
                      <p className="text-white/60 text-sm">{t('newsletter.contentNote')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-lg border border-white/15 rounded-xl p-8">
                <h4 className="text-xl font-display font-bold text-white mb-2">{t('newsletter.title')}</h4>
                <p className="text-white/70 text-sm mb-6">{t('newsletter.summary')}</p>

                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder={t('newsletter.placeholder.name')}
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.06] border border-white/15 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500/50 transition-all duration-300 text-sm"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder={t('newsletter.placeholder.email')}
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.06] border border-white/15 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500/50 transition-all duration-300 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 text-sm shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30"
                  >
                    {t('newsletter.button')}
                  </button>
                </form>

                <p className="text-white/50 text-xs mt-4 text-center">
                  {t('newsletter.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        {/* Animated mesh gradient background for footer */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-[#0a0a0f] to-fuchsia-950/20" />
          {/* Animated floating orbs in footer */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-fuchsia-600/8 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
        </div>

        {/* Animated particles in footer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-violet-400/20 rounded-full animate-float"
              style={{
                left: `${20 + i * 20}%`,
                top: `${25 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${5 + i}s`
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay for footer */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 group mb-4">
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/25 group-hover:scale-110 transition-transform">
                    <CheckCircleSolid className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
                <div>
                  <span className="font-display font-bold text-xl text-white">{t('brand.name')}</span>
                  <p className="text-white/60 text-xs mt-1">{t('footer.tagline')}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-md mb-4">
                {t('footer.description')}
              </p>
              <div className="flex items-center gap-3">
                <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300 text-xs">
                  <span>{t('footer.cta.button')}</span>
                  <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-base">{t('footer.sections.product')}</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.product.features')}</Link></li>
                <li><Link href="/roadmap" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.product.roadmap')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-base">{t('footer.sections.company')}</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.company.about')}</Link></li>
                <li><Link href="/blog" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.company.blog')}</Link></li>
                <li><Link href="/careers" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.company.careers')}</Link></li>
                <li><Link href="/press" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.company.press')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-8 pt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-xs text-white/40">
                {t('footer.cta.copyright')}
              </p>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="text-white/40 hover:text-white text-xs transition-colors">{t('footer.links.legal.privacy')}</Link>
                <Link href="/terms" className="text-white/40 hover:text-white text-xs transition-colors">{t('footer.links.legal.terms')}</Link>
                <Link href="/security" className="text-white/40 hover:text-white text-xs transition-colors">{t('footer.links.legal.security')}</Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="#" className="text-white/40 hover:text-white transition-colors">
                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-[10px]">
                  f
                </div>
              </Link>
              <Link href="#" className="text-white/40 hover:text-white transition-colors">
                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-[10px]">
                  t
                </div>
              </Link>
              <Link href="#" className="text-white/40 hover:text-white transition-colors">
                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-[10px]">
                  in
                </div>
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
