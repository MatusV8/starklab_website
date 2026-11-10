/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  // Lets another device on the local network open the dev server.
  allowedDevOrigins: ['192.168.228.64'],
  async headers() {
    return [
      {
        // The hero video is large and rarely changes; let browsers keep it for
        // a day instead of downloading it again on every visit.
        source: '/hero.mp4',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },
};

module.exports = nextConfig;
