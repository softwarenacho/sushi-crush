/** @type {import('next').NextConfig} */
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/service-worker.ts',
  swDest: 'public/sw.js',
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};

const nextConfigFunction = async (phase) => {
  const isDev = phase === 'phase-development-server';
  if (isDev) {
    return nextConfig;
  }
  return withSerwist(nextConfig);
};

export default nextConfigFunction;
