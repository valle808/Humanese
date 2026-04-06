/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['puppeteer-core', '@playwright/test', 'puppeteer', 'playwright'],
  outputFileTracingExcludes: {
    '*': [
      'public/vendor/**/*',
      'node_modules/puppeteer/**/*',
      'node_modules/@playwright/**/*',
      'node_modules/puppeteer-core/**/*',
      'node_modules/playwright/**/*',
      'node_modules/playwright-core/**/*',
      '.knowledge/**/*'
    ]
  }
};

export default nextConfig;

