/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint is handled via the separate ignoreDuringBuilds if needed, 
  // but in Next 15+ some keys moved. For now, let's simplify.
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

