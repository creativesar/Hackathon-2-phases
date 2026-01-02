import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
};

export default createNextIntlPlugin(nextConfig, './src/i18n/request');
