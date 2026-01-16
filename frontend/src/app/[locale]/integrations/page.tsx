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
  CubeIcon,
  ArrowsRightLeftIcon,
  CloudIcon,
  CodeBracketIcon,
  ComputerDesktopIcon,
  CommandLineIcon,
  ServerStackIcon,
  GlobeAltIcon,
  Bars3BottomLeftIcon,
  ChartBarIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function IntegrationsPage() {
  const t = useTranslations('HomePage');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Integration categories and items
  const integrationCategories = [
    {
      id: 'productivity',
      name: t('integrations.categories.productivity'),
      description: t('integrations.categories.productivityDesc'),
      icon: CubeIcon,
      gradient: 'from-violet-500 to-purple-500',
      integrations: [
        {
          name: 'Slack',
          description: t('integrations.items.slack'),
          logo: 'S',
          connected: true,
        },
        {
          name: 'Microsoft Teams',
          description: t('integrations.items.teams'),
          logo: 'T',
          connected: false,
        },
        {
          name: 'Notion',
          description: t('integrations.items.notion'),
          logo: 'N',
          connected: true,
        },
        {
          name: 'Google Workspace',
          description: t('integrations.items.google'),
          logo: 'G',
          connected: false,
        },
      ],
    },
    {
      id: 'development',
      name: t('integrations.categories.development'),
      description: t('integrations.categories.developmentDesc'),
      icon: CodeBracketIcon,
      gradient: 'from-emerald-500 to-teal-500',
      integrations: [
        {
          name: 'GitHub',
          description: t('integrations.items.github'),
          logo: 'GH',
          connected: true,
        },
        {
          name: 'Jira',
          description: t('integrations.items.jira'),
          logo: 'J',
          connected: false,
        },
        {
          name: 'GitLab',
          description: t('integrations.items.gitlab'),
          logo: 'GL',
          connected: false,
        },
        {
          name: 'Bitbucket',
          description: t('integrations.items.bitbucket'),
          logo: 'BB',
          connected: true,
        },
      ],
    },
    {
      id: 'communication',
      name: t('integrations.categories.communication'),
      description: t('integrations.categories.communicationDesc'),
      icon: ChatBubbleLeftRightIcon,
      gradient: 'from-fuchsia-500 to-pink-500',
      integrations: [
        {
          name: 'Email',
          description: t('integrations.items.email'),
          logo: 'E',
          connected: true,
        },
        {
          name: 'SMS',
          description: t('integrations.items.sms'),
          logo: 'S',
          connected: false,
        },
        {
          name: 'Webhooks',
          description: t('integrations.items.webhooks'),
          logo: 'W',
          connected: true,
        },
        {
          name: 'Push Notifications',
          description: t('integrations.items.push'),
          logo: 'PN',
          connected: false,
        },
      ],
    },
    {
      id: 'analytics',
      name: t('integrations.categories.analytics'),
      description: t('integrations.categories.analyticsDesc'),
      icon: ChartBarIcon,
      gradient: 'from-amber-500 to-orange-500',
      integrations: [
        {
          name: 'Google Analytics',
          description: t('integrations.items.ga'),
          logo: 'GA',
          connected: true,
        },
        {
          name: 'Mixpanel',
          description: t('integrations.items.mixpanel'),
          logo: 'MP',
          connected: false,
        },
        {
          name: 'Segment',
          description: t('integrations.items.segment'),
          logo: 'SG',
          connected: true,
        },
        {
          name: 'Amplitude',
          description: t('integrations.items.amplitude'),
          logo: 'AM',
          connected: false,
        },
      ],
    },
  ];

  // Popular integrations
  const popularIntegrations = [
    {
      name: 'Slack',
      description: t('integrations.popular.slack'),
      logo: 'S',
      category: t('integrations.categories.productivity'),
      connections: '10K+',
    },
    {
      name: 'GitHub',
      description: t('integrations.popular.github'),
      logo: 'GH',
      category: t('integrations.categories.development'),
      connections: '5K+',
    },
    {
      name: 'Google Analytics',
      description: t('integrations.popular.ga'),
      logo: 'GA',
      category: t('integrations.categories.analytics'),
      connections: '8K+',
    },
    {
      name: 'Email',
      description: t('integrations.popular.email'),
      logo: 'E',
      category: t('integrations.categories.communication'),
      connections: '15K+',
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
              {t('integrations.title')}
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto relative z-10">
              {t('integrations.subtitle')}
            </p>
          </div>

          {/* Popular Integrations */}
          <div className="mb-20">
            <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">
              {t('integrations.popular.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularIntegrations.map((integration, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-700"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    animation: 'fade-in-up 0.8s ease-out forwards'
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                      {integration.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-violet-200 transition-colors">
                        {integration.name}
                      </h3>
                      <p className="text-xs text-white/60">{integration.category}</p>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {integration.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-violet-400 font-medium">
                      {integration.connections} {t('integrations.connected')}
                    </span>
                    <button className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.09] text-white text-xs font-medium transition-colors border border-white/10 hover:border-white/20">
                      {t('integrations.connect')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Categories */}
          <div className="space-y-16">
            {integrationCategories.map((category, categoryIndex) => (
              <div key={category.id} className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg shadow-violet-500/30`}>
                    <category.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {category.name}
                    </h2>
                    <p className="text-white/70">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.integrations.map((integration, integrationIndex) => (
                    <div
                      key={integrationIndex}
                      className="group bg-gradient-to-br from-white/[0.03] to-white/[0.02] backdrop-blur border border-white/10 rounded-xl p-5 hover:border-violet-500/30 transition-all duration-300"
                      style={{
                        transitionDelay: `${(categoryIndex * 4 + integrationIndex) * 50}ms`,
                        animation: 'fade-in-up 0.6s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {integration.logo}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-violet-200 transition-colors">
                              {integration.name}
                            </h3>
                            <p className="text-xs text-white/60">
                              {integration.description}
                            </p>
                          </div>
                        </div>

                        <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          integration.connected
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-white/[0.06] text-white hover:bg-white/[0.09] border border-white/10 hover:border-white/20'
                        }`}>
                          {integration.connected ? t('integrations.connected') : t('integrations.connect')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Integration Benefits */}
          <div className="mt-20 bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">
              {t('integrations.benefits.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 mb-4 shadow-lg shadow-violet-500/30">
                  <ArrowsRightLeftIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{t('integrations.benefits.seamless')}</h3>
                <p className="text-white/70 text-sm">
                  {t('integrations.benefits.seamlessDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 shadow-lg shadow-emerald-500/30">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{t('integrations.benefits.efficient')}</h3>
                <p className="text-white/70 text-sm">
                  {t('integrations.benefits.efficientDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 mb-4 shadow-lg shadow-fuchsia-500/30">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{t('integrations.benefits.secure')}</h3>
                <p className="text-white/70 text-sm">
                  {t('integrations.benefits.secureDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* API Section */}
          <div className="mt-20">
            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4 shadow-lg shadow-amber-500/30">
                  <CommandLineIcon className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  {t('integrations.api.title')}
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  {t('integrations.api.description')}
                </p>
              </div>

              <div className="bg-black/20 rounded-xl p-6 font-mono text-sm text-white/90 mb-6">
                <div className="text-violet-400">// {t('integrations.api.example')}</div>
                <div className="text-white">fetch('{t('integrations.api.endpoint')}')</div>
                <div className="text-amber-400">  .then(response {'=>'} response.json())</div>
                <div className="text-emerald-400">  .then(data {'=>'} console.log(data));</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/docs"
                  className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-300 text-sm relative overflow-hidden"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10 flex items-center gap-2">
                    <CommandLineIcon className="h-4 w-4" />
                    {t('integrations.api.documentation')}
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white/90 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300 text-sm"
                >
                  <CloudIcon className="h-4 w-4" />
                  {t('integrations.api.contact')}
                </Link>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
              {t('integrations.cta.title')}
            </h2>
            <p className="text-white/70 max-w-lg mx-auto mb-8">
              {t('integrations.cta.description')}
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
                  {t('integrations.cta.getStarted')}
                </span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white/90 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300"
              >
                <ArrowRightIcon className="h-4 w-4" />
                {t('integrations.cta.backHome')}
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