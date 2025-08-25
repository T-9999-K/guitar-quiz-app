import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ギターコードクイズ',
  description: 'フレットボード上の指板位置からコード名を当てるクイズゲーム',
  keywords: 'ギター, コード, クイズ, 音楽, 練習, フレットボード',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
  openGraph: {
    title: 'ギターコードクイズ',
    description: 'フレットボード上の指板位置からコード名を当てるクイズゲーム',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ギターコードクイズ',
    description: 'フレットボード上の指板位置からコード名を当てるクイズゲーム',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen antialiased`}>
        <div className="flex flex-col min-h-screen">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🎸</div>
                  <h1 className="text-xl font-bold text-gray-900">
                    ギターコードクイズ
                  </h1>
                </div>
                <div className="flex items-center space-x-6">
                  <nav className="hidden md:flex items-center space-x-6">
                    <a 
                      href="/" 
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      ホーム
                    </a>
                    <a 
                      href="#about" 
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      使い方
                    </a>
                    <a 
                      href="#stats" 
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      統計
                    </a>
                  </nav>
                </div>
                
                {/* モバイルメニューボタン */}
                <button 
                  className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="メニューを開く"
                >
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          {/* フッター */}
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* アプリ情報 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ギターコードクイズ
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    フレットボード上の指板位置からコード名を当てるクイズゲーム。
                    初級から上級まで段階的に学習できます。
                  </p>
                  <div className="flex space-x-4">
                    <span className="text-2xl">🎸</span>
                    <span className="text-2xl">🎵</span>
                    <span className="text-2xl">📱</span>
                  </div>
                </div>

                {/* 機能紹介 */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    主な機能
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• 3つの難易度レベル</li>
                    <li>• リアルタイムスコア表示</li>
                    <li>• ヒント機能付き</li>
                    <li>• レスポンシブデザイン</li>
                    <li>• アクセシビリティ対応</li>
                    <li>• 統計情報表示</li>
                  </ul>
                </div>

                {/* 技術情報 */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    技術仕様
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Next.js 15 + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• PWA対応</li>
                    <li>• WCAG 2.1 AAA準拠</li>
                    <li>• Apple HIG準拠</li>
                    <li>• Web Audio API対応</li>
                  </ul>
                </div>
              </div>

              {/* コピーライト */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    © 2024 Guitar Chord Quiz. Created with Claude Code.
                  </p>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <span className="text-gray-400 text-xs">
                      🤖 Generated with Claude Code
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* 背景装飾 */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </body>
    </html>
  );
}
