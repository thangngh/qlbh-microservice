const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  output: 'standalone',
  experimental: {
    serverActions: {
      enabled: true
    },
    instrumentationHook: true
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
});

module.exports = nextConfig;
