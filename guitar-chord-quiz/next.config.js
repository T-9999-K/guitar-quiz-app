/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポート設定
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,

  // 画像最適化無効（静的エクスポート用）
  images: {
    unoptimized: true
  },

  // パフォーマンス最適化
  experimental: {
    optimizeCss: true,
  },

  // PWA用設定
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },

  // 環境変数
  env: {
    CUSTOM_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || 'local-build',
  },
};

module.exports = nextConfig;