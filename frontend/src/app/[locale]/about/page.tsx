'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  BuildingOfficeIcon,
  LightBulbIcon,
  UserGroupIcon,
  HeartIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  SparklesIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  BoltIcon,
  CommandLineIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function AboutPage() {
  const t = useTranslations('HomePage');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { value: t('about.stats.users'), label: t('about.stats.usersLabel'), description: t('about.stats.usersDesc') },
    { value: t('about.stats.tasks'), label: t('about.stats.tasksLabel'), description: t('about.stats.tasksDesc') },
    { value: t('about.stats.uptime'), label: t('about.stats.uptimeLabel'), description: t('about.stats.uptimeDesc') },
    { value: t('about.stats.rating'), label: t('about.stats.ratingLabel'), description: t('about.stats.ratingDesc'), isRating: true },
  ];

  const features = [
    {
      icon: BoltIcon,
      title: t('about.features.lightning.title'),
      description: t('about.features.lightning.description'),
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: ShieldCheckIcon,
      title: t('about.features.security.title'),
      description: t('about.features.security.description'),
      bgColor: 'bg-emerald-500/10',
    },
    {
      icon: CpuChipIcon,
      title: t('about.features.ai.title'),
      description: t('about.features.ai.description'),
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: CloudArrowUpIcon,
      title: t('about.features.cloud.title'),
      description: t('about.features.cloud.description'),
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: CommandLineIcon,
      title: t('about.features.developer.title'),
      description: t('about.features.developer.description'),
      bgColor: 'bg-slate-500/10',
    },
    {
      icon: GlobeAltIcon,
      title: t('about.features.global.title'),
      description: t('about.features.global.description'),
      bgColor: 'bg-pink-500/10',
    },
  ];

  const testimonials = [
    {
      quote: t('about.testimonials.quote1.text'),
      author: t('about.testimonials.quote1.author'),
      role: t('about.testimonials.quote1.role'),
      company: t('about.testimonials.quote1.company'),
      rating: 5,
    },
    {
      quote: t('about.testimonials.quote2.text'),
      author: t('about.testimonials.quote2.author'),
      role: t('about.testimonials.quote2.role'),
      company: t('about.testimonials.quote2.company'),
      rating: 5,
    },
    {
      quote: t('about.testimonials.quote3.text'),
      author: t('about.testimonials.quote3.author'),
      role: t('about.testimonials.quote3.role'),
      company: t('about.testimonials.quote3.company'),
      rating: 5,
    },
  ];

  const companyValues = [
    {
      icon: LightBulbIcon,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: HeartIcon,
      title: t('about.values.passion.title'),
      description: t('about.values.passion.description'),
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: UserGroupIcon,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: BuildingOfficeIcon,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description'),
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  const timeline = [
    {
      year: t('about.timeline.2023.year'),
      title: t('about.timeline.2023.title'),
      description: t('about.timeline.2023.description'),
      icon: RocketLaunchIcon,
    },
    {
      year: t('about.timeline.2024.year'),
      title: t('about.timeline.2024.title'),
      description: t('about.timeline.2024.description'),
      icon: CpuChipIcon,
    },
    {
      year: t('about.timeline.2025.year'),
      title: t('about.timeline.2025.title'),
      description: t('about.timeline.2025.description'),
      icon: GlobeAltIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-[#030303] to-[#030303]" />
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-violet-600/10 via-fuchsia-600/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-600/10 via-purple-600/5 to-transparent blur-3xl" />
      </div>

      {/* Subtle noise texture */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-[#030303]/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow">
                <CheckCircleSolid className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{t('brand.name')}</span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
              >
                {t('getStarted')}
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-20 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2 mb-8">
                <div className="flex items-center gap-1">
                  <StarSolid className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">{t('about.hero.rating')}</span>
                </div>
                <div className="w-px h-3 bg-white/10"></div>
                <span className="text-sm text-white/50">{t('about.hero.badge')}</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span className="text-white">{t('about.title')}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400">
                  {t('about.subtitle')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                {t('about.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
                >
                  {t('about.hero.startTrial')}
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white/80 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white transition-all">
                  <PlayIcon className="h-4 w-4" />
                  {t('about.hero.watchDemo')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {stat.isRating && (
                      <div className="flex items-center gap-0.5 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <StarSolid key={i} className="h-4 w-4 text-amber-400" />
                        ))}
                      </div>
                    )}
                    <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-white/70 font-medium mb-1">{stat.label}</div>
                  <div className="text-white/40 text-sm">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider mb-3 block">{t('about.features.sectionLabel')}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('about.features.title')}
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                {t('about.features.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="py-24 bg-white/[0.01]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Mission */}
              <div className="lg:col-span-2">
                <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider mb-3 block">{t('about.mission.sectionLabel')}</span>
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('about.mission.title')}
                </h2>
                <p className="text-white/60 leading-relaxed mb-6">
                  {t('about.mission.description')}
                </p>
                <p className="text-white/40 leading-relaxed text-sm">
                  {t('about.mission.vision')}
                </p>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/[0.06]">
                  <div>
                    <div className="text-2xl font-bold text-white">{t('about.mission.countries')}</div>
                    <div className="text-white/50 text-sm">{t('about.mission.countriesLabel')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{t('about.mission.support')}</div>
                    <div className="text-white/50 text-sm">{t('about.mission.supportLabel')}</div>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
                {companyValues.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:border-white/[0.1] transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4`}>
                      <value.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider mb-3 block">{t('about.testimonials.sectionLabel')}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('about.testimonials.title')}
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                {t('about.testimonials.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-6"
                >
                  {/* Rating */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarSolid key={i} className="h-4 w-4 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-white/70 leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{testimonial.author}</div>
                      <div className="text-white/40 text-xs">{testimonial.role} - {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-white/[0.01]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider mb-3 block">{t('about.timeline.sectionLabel')}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('about.timeline.title')}
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500/50 via-fuchsia-500/30 to-transparent"></div>

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 lg:left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 ring-4 ring-[#030303] z-10"></div>

                    {/* Content */}
                    <div className={`ml-12 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                      <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
                        <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <item.icon className="h-4 w-4 text-violet-400" />
                          </div>
                          <span className="text-violet-400 font-mono text-sm font-bold">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-white/50 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 rounded-3xl p-10 lg:p-14 text-center">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-6 shadow-lg shadow-violet-500/25">
                  <RocketLaunchIcon className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {t('about.cta.title')}
                </h2>

                <p className="text-white/60 max-w-lg mx-auto mb-8">
                  {t('about.cta.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
                  >
                    {t('about.cta.button')}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {t('about.cta.backHome')}
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-10 pt-8 border-t border-white/10 flex-wrap">
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircleSolid className="h-4 w-4 text-emerald-400" />
                    {t('about.cta.trial')}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircleSolid className="h-4 w-4 text-emerald-400" />
                    {t('about.cta.noCard')}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircleSolid className="h-4 w-4 text-emerald-400" />
                    {t('about.cta.cancel')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Same as Landing Page */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        {/* Animated mesh gradient background for footer */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-[#030303] to-fuchsia-950/20" />
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
