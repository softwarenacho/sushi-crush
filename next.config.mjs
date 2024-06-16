/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  purgeCSS: true,
};
const nextConfigFunction = async (phase) => {
  const withPWA = (await import('@ducanh2912/next-pwa')).default({
    dest: 'public',
    register: true,
    skipWaiting: true,
  });
  return withPWA(nextConfig);
};

export default nextConfigFunction;
