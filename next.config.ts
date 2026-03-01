import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';
import { spawnSync } from 'node:child_process';

const result = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' });
const revision = result.stdout.trim() || crypto.randomUUID();

const withSerwist = withSerwistInit({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
});

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

const nextConfig: NextConfig = {
  turbopack: {},
  headers() {
    return Promise.resolve([
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]);
  },
};

export default withSerwist(nextConfig);
