'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
  CalendarIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function RoadmapPage() {
  const t = useTranslations('HomePage');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Roadmap items organized by timeline
  const roadmapItems = [
    {
      id: 1,
      title: t('roadmap.q1.title'),
      description: t('roadmap.q1.description'),
      date: t('roadmap.q1.date'),
      status: 'completed',
      icon: RocketLaunchIcon,
      gradient: 'from-emerald-500 to-teal-500',
      features: [
        t('roadmap.q1.features.1'),
        t('roadmap.q1.features.2'),
        t('roadmap.q1.features.3'),
      ],
    },
    {
      id: 2,
      title: t('roadmap.q2.title'),
      description: t('roadmap.q2.description'),
      date: t('roadmap.q2.date'),
      status: 'completed',
      icon: WrenchScrewdriverIcon,
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        t('roadmap.q2.features.1'),
        t('roadmap.q2.features.2'),
        t('roadmap.q2.features.3'),
      ],
    },
    {
      id: 3,
      title: t('roadmap.q3.title'),
      description: t('roadmap.q3.description'),
      date: t('roadmap.q3.date'),
      status: 'in-progress',
      icon: ChartBarIcon,
      gradient: 'from-violet-500 to-purple-500',
      features: [
        t('roadmap.q3.features.1'),
        t('roadmap.q3.features.2'),
        t('roadmap.q3.features.3'),
      ],
    },
    {
      id: 4,
      title: t('roadmap.q4.title'),
      description: t('roadmap.q4.description'),
      date: t('roadmap.q4.date'),
      status: 'planned',
      icon: CalendarIcon,
      gradient: 'from-fuchsia-500 to-pink-500',
      features: [
        t('roadmap.q4.features.1'),
        t('roadmap.q4.features.2'),
        t('roadmap.q4.features.3'),
      ],
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

      {/* Header */}
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

            {/* Nav Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('getStarted')}
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-xl animate-pulse"></div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 relative z-10">
              {t('roadmap.title')}
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto relative z-10">
              {t('roadmap.subtitle')}
            </p>
          </div>

          {/* Roadmap Timeline */}
          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl p-8 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-700 group ${
                  index !== roadmapItems.length - 1 ? 'pb-12' : ''
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  animation: 'fade-in-up 0.8s ease-out forwards'
                }}
              >
                {/* Status indicator */}
                <div className="absolute -top-4 -right-4 flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {t(`roadmap.status.${item.status}`)}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left side - Timeline info */}
                  <div className="lg:w-1/3">
                    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-8 w-8 text-white" />
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-white/70 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-violet-400 font-medium">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Right side - Features */}
                  <div className="lg:w-2/3">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-violet-400" />
                      {t('roadmap.featuresTitle')}
                    </h4>

                    <ul className="space-y-3">
                      {item.features.map((feature, featIndex) => (
                        <li key={featIndex} className="flex items-start gap-3">
                          <div className={`h-6 w-6 rounded-full ${item.gradient.split(' ')[1]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <CheckCircleSolid className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline connector for all items except the last */}
                {index !== roadmapItems.length - 1 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0.5 h-12 bg-gradient-to-b from-white/20 to-transparent"></div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="mt-20 bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-bold text-white mb-6 text-center">
              {t('roadmap.progress.title')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-emerald-400 mb-2">
                  {roadmapItems.filter(item => item.status === 'completed').length}
                </div>
                <div className="text-white/70 text-sm">
                  {t('roadmap.progress.completed')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-display font-bold text-yellow-400 mb-2">
                  {roadmapItems.filter(item => item.status === 'in-progress').length}
                </div>
                <div className="text-white/70 text-sm">
                  {t('roadmap.progress.inProgress')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-display font-bold text-fuchsia-400 mb-2">
                  {roadmapItems.filter(item => item.status === 'planned').length}
                </div>
                <div className="text-white/70 text-sm">
                  {t('roadmap.progress.planned')}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
              {t('roadmap.cta.title')}
            </h2>
            <p className="text-white/70 max-w-lg mx-auto mb-8">
              {t('roadmap.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group/btn inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative z-10 flex items-center gap-2">
                  <RocketLaunchIcon className="h-5 w-5" />
                  {t('roadmap.cta.joinEarly')}
                </span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white/90 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300"
              >
                <ArrowRightIcon className="h-4 w-4" />
                {t('roadmap.cta.backHome')}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
                <li><Link href="/changelog" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.product.changelog')}</Link></li>
                <li><Link href="/roadmap" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.product.roadmap')}</Link></li>
                <li><Link href="/integrations" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.product.integrations')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-base">{t('footer.sections.support')}</h4>
              <ul className="space-y-3">
                <li><Link href="/docs" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.support.docs')}</Link></li>
                <li><Link href="/contact" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.support.contact')}</Link></li>
                <li><Link href="/status" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.support.status')}</Link></li>
                <li><Link href="/community" className="inline-block text-white/60 hover:text-white text-sm transition-colors hover:translate-x-1 duration-300">{t('footer.links.support.community')}</Link></li>
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