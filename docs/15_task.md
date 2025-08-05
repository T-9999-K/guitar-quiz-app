# Task 15: テスト・最適化・デプロイ準備

## 概要
アプリケーションのテスト実装、パフォーマンス最適化、デプロイ準備

## 実行内容
1. 重要コンポーネントのテスト作成
2. パフォーマンス最適化
3. Static Export設定
4. PWA対応・マニフェスト作成

## 作成ファイル
1. `__tests__/components/Fretboard.test.tsx`
2. `__tests__/hooks/useQuizState.test.tsx`
3. `next.config.js`
4. `public/manifest.json`
5. `public/sw.js`

## コンポーネントテスト
`__tests__/components/Fretboard.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import { Fretboard } from '@/components/fretboard/Fretboard';
import { ChordPattern } from '@/types';

const mockChord: ChordPattern = {
  name: 'C',
  frets: [null, 3, 2, 0, 1, 0],
  fingers: [null, 3, 2, null, 1, null],
  difficulty: 'beginner',
  root: 'C',
  quality: 'major'
};

describe('Fretboard', () => {
  it('should render fretboard with correct chord pattern', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="horizontal"
        showFingers={true}
      />
    );
    
    // SVG要素が存在することを確認
    const fretboardSvg = screen.getByRole('img', { hidden: true });
    expect(fretboardSvg).toBeInTheDocument();
  });
  
  it('should show finger numbers when showFingers is true', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="horizontal"
        showFingers={true}
      />
    );
    
    // 指番号が表示されることを確認（具体的な実装に依存）
    const fingerElements = screen.getAllByText(/[1-4]/);
    expect(fingerElements).toHaveLength(3); // Cコードは3本指
  });
  
  it('should hide finger numbers when showFingers is false', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="horizontal"
        showFingers={false}
      />
    );
    
    // 指番号が表示されないことを確認
    const fingerElements = screen.queryAllByText(/[1-4]/);
    expect(fingerElements).toHaveLength(0);
  });
  
  it('should handle vertical orientation', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="vertical"
        showFingers={false}
      />
    );
    
    const fretboardSvg = screen.getByRole('img', { hidden: true });
    expect(fretboardSvg).toBeInTheDocument();
  });
});
```

## フックテスト
`__tests__/hooks/useQuizState.test.tsx`
```typescript
import { renderHook, act } from '@testing-library/react';
import { useQuizState } from '@/hooks/useQuizState';

// モックデータ
jest.mock('@/data/chord-patterns', () => ({
  getRandomChord: jest.fn(() => ({
    name: 'C',
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    difficulty: 'beginner',
    root: 'C',
    quality: 'major'
  }))
}));

describe('useQuizState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQuizState('beginner'));
    
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.streak).toBe(0);
    expect(result.current.state.currentChord).toBeNull();
    expect(result.current.gameActive).toBe(false);
  });
  
  it('should start quiz correctly', () => {
    const { result } = renderHook(() => useQuizState('beginner'));
    
    act(() => {
      result.current.startQuiz();
    });
    
    expect(result.current.gameActive).toBe(true);
    expect(result.current.state.currentChord).not.toBeNull();
    expect(result.current.state.currentChord?.name).toBe('C');
  });
  
  it('should handle correct answer', () => {
    const { result } = renderHook(() => useQuizState('beginner'));
    
    act(() => {
      result.current.startQuiz();
    });
    
    act(() => {
      result.current.submitAnswer('C');
    });
    
    expect(result.current.state.score).toBe(10);
    expect(result.current.state.streak).toBe(1);
  });
  
  it('should handle incorrect answer', () => {
    const { result } = renderHook(() => useQuizState('beginner'));
    
    act(() => {
      result.current.startQuiz();
    });
    
    act(() => {
      result.current.submitAnswer('G');
    });
    
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.streak).toBe(0);
  });
  
  it('should increment hints used', () => {
    const { result } = renderHook(() => useQuizState('beginner'));
    
    act(() => {
      result.current.startQuiz();
    });
    
    act(() => {
      result.current.useHint();
    });
    
    expect(result.current.state.hintsUsed).toBe(1);
  });
});
```

## Next.js設定ファイル
`next.config.js`
```javascript
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
```

## PWAマニフェスト
`public/manifest.json`
```json
{
  "name": "ギターコードクイズ",
  "short_name": "コードクイズ",
  "description": "フレットボード上の指板位置からコード名を当てるクイズゲーム",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "any",
  "categories": ["music", "education", "games"],
  "lang": "ja",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshot-desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

## Service Worker
`public/sw.js`
```javascript
const CACHE_NAME = 'guitar-chord-quiz-v1';
const urlsToCache = [
  '/',
  '/settings/',
  '/_next/static/css/',
  '/_next/static/js/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// インストール時のキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// アクティベーション時の古いキャッシュ削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあれば返す
        if (response) {
          return response;
        }
        
        // ネットワークから取得してキャッシュに保存
        return fetch(event.request).then((response) => {
          // 有効なレスポンスのみキャッシュ
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // オフライン時のフォールバック
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});
```

## パフォーマンス最適化
`src/lib/performance.ts`
```typescript
// 遅延ローディング
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// メモ化されたコンポーネント作成
export const createMemoComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual);
};

// 画像最適化
export const optimizedImageProps = (src: string, alt: string) => ({
  src,
  alt,
  loading: 'lazy' as const,
  decoding: 'async' as const,
});

// パフォーマンス監視
export const performanceObserver = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
  }
};
```

## ビルド・デプロイスクリプト
`package.json` に追加
```json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "build:static": "next build && next export",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lighthouse": "lhci autorun"
  },
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@lhci/cli": "^0.12.0"
  }
}
```

## Jest設定
`jest.config.js`
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
};

module.exports = createJestConfig(customJestConfig);
```

## デプロイ用README更新
`README.md` に追加
```markdown
## デプロイ

### 静的サイトとしてデプロイ
```bash
npm run build:static
```

### Vercel
```bash
vercel --prod
```

### Netlify
distフォルダをドラッグ&ドロップまたはGit連携

### GitHub Pages
distフォルダの内容をgh-pagesブランチにプッシュ

## パフォーマンス

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
```

## 確認項目
- [ ] テストが正常に実行される
- [ ] Static Exportが成功する
- [ ] PWAとして動作する（オフライン対応）
- [ ] パフォーマンススコアが良好
- [ ] 各主要ブラウザで動作確認
- [ ] モバイル・デスクトップ両方で確認
- [ ] アクセシビリティスコアが良好

## 成果物
- テストスイート
- Static Export設定
- PWA対応
- デプロイ準備完了

## 所要時間
90分