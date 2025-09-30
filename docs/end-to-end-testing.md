# End-to-End Testing Strategy for Guitar Chord Quiz

## 🎯 **概要**

Guitar Chord Quizプロジェクトにおける包括的なEnd-to-Endテスト戦略とPlaywrightを用いた実装計画。ユーザー体験の品質保証とリグレッション防止を目的とする。

## 📋 **テスト戦略**

### 推奨ソリューション: Playwright

#### 選定理由
- **技術適合性**: TypeScript完全サポート、Next.js Static Export対応
- **多ブラウザ対応**: Chrome、Firefox、Safari対応
- **レスポンシブテスト**: モバイル・デスクトップ両対応
- **アクセシビリティ**: 内蔵テスト機能
- **Web Audio API**: 音声機能テスト対応
- **CI/CD統合**: GitHub Actions等との連携

## 🎮 **テスト対象機能マトリックス**

| 機能カテゴリ | テストケース | 優先度 | デバイス | 実装状況 |
|-------------|-------------|--------|----------|----------|
| **クイズ進行** | ゲーム開始・回答・終了 | 🔴 高 | デスクトップ・モバイル | 未実装 |
| **フレットボード** | 表示・インタラクション | 🔴 高 | デスクトップ・モバイル | 未実装 |
| **設定管理** | テーマ・難易度・音声 | 🟡 中 | デスクトップ | 未実装 |
| **統計表示** | データ表示・履歴管理 | 🟡 中 | デスクトップ | 未実装 |
| **レスポンシブ** | 画面サイズ別レイアウト | 🔴 高 | 全デバイス | 未実装 |
| **アクセシビリティ** | キーボード・ARIA | 🟡 中 | デスクトップ | 未実装 |
| **PWA機能** | オフライン・インストール | 🟢 低 | モバイル | 未実装 |

## 🏗️ **実装計画**

### Phase 1: 基盤セットアップ

#### 1. Playwright導入
```bash
# 依存関係インストール
npm install --save-dev @playwright/test

# ブラウザインストール
npx playwright install

# 設定ファイル生成
npx playwright init
```

#### 2. プロジェクト構造
```
guitar-chord-quiz/
├── tests/
│   ├── e2e/
│   │   ├── fixtures/          # テストデータ・モック
│   │   ├── pages/             # Page Object Model
│   │   ├── specs/             # テストケース
│   │   └── utils/             # ヘルパー関数
│   └── playwright.config.ts   # Playwright設定
├── package.json               # テストスクリプト追加
└── .github/workflows/         # CI/CD設定
```

### ディレクトリ配置の設計判断

#### メインプロジェクト内配置を選択した理由

**1. 開発効率とメンテナンス性**
```bash
# 現在の構造（効率的）
guitar-chord-quiz/
├── src/              # ソースコード
├── tests/e2e/        # E2Eテスト
└── package.json      # 依存関係一元管理

# 避けた構造（非効率）
guitar-chord-quiz/           # メインアプリ
guitar-chord-quiz-e2e/       # 別プロジェクト
```

**2. 依存関係管理の統一**
- **TypeScript設定共有**：同じ`tsconfig.json`ベース
- **パッケージ管理統一**：`package.json`で一元管理
- **型定義共有**：`src/types/`の型をテストで直接利用

**3. コードの同期性**
```typescript
// src/types/index.ts の型定義を
// tests/e2e/ から直接import可能
import { ChordPattern, QuizState } from '../../src/types';
```

**4. CI/CDパイプラインの簡素化**
```yaml
# シンプルなCI設定
- name: Install dependencies
  run: npm install
- name: Run E2E tests
  run: npm run test:e2e
```

#### 別プロジェクト分離を避けた理由

**1. 複雑な依存関係管理**
```bash
# 避けた複雑な構造
guitar-chord-quiz-e2e/
├── package.json           # 重複した依存関係
├── tsconfig.json          # 設定の重複
└── node_modules/          # 重複したパッケージ
```

**2. 開発ワークフローの複雑化**
- コード変更時に**2つのプロジェクト**を更新する必要
- **バージョン同期**の管理が困難
- **デバッグ時**にプロジェクト間を移動

**3. 型安全性の低下**
```typescript
// 別プロジェクトの場合、型同期が困難
// メインアプリの型変更が即座に反映されない
```

#### 業界の実践例

| 企業/プロジェクト | E2Eテスト配置 | 理由 |
|------------------|---------------|------|
| **Vercel (Next.js)** | `tests/e2e/` | 開発効率 |
| **Meta (React)** | `packages/*/e2e/` | モノレポ内統合 |
| **Google (Angular)** | `e2e/` | CLI統合 |
| **Shopify** | `tests/e2e/` | 型共有・効率性 |

#### 選択したアプローチの利点

**1. シンプルな開発体験**
```bash
# 1つのコマンドですべて実行
npm run dev          # アプリ起動
npm run test:e2e     # E2Eテスト実行
npm run build        # 本番ビルド
```

**2. 即座の型チェック**
- メインアプリの型変更が**即座にE2Eテストに反映**
- **コンパイルエラー**で不整合を早期発見

**3. 統一された品質管理**
```json
{
  "scripts": {
    "lint": "eslint src/ tests/",      // 同時チェック
    "type-check": "tsc --noEmit",      // 統一型チェック
    "test:e2e": "playwright test"      // 統合テスト
  }
}
```

#### 結論

**メインプロジェクト内への配置**は：

✅ **開発効率向上**：単一プロジェクト管理
✅ **型安全性確保**：即座の型同期
✅ **メンテナンス簡素化**：統一されたワークフロー
✅ **業界標準準拠**：Next.js/React慣例に従う

**別プロジェクト分離は、大規模な組織でE2Eチームが独立している場合のみ有効**です。今回のプロジェクト規模では、統合アプローチが最適です。

#### 3. 設定ファイル例
```typescript
// tests/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Phase 2: Page Object Model設計

#### 1. ベースページクラス
```typescript
// tests/e2e/pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
```

#### 2. ホームページクラス
```typescript
// tests/e2e/pages/HomePage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly startQuizButton: Locator;
  readonly difficultySelect: Locator;
  readonly settingsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.startQuizButton = page.locator('[data-testid="start-quiz"]');
    this.difficultySelect = page.locator('[data-testid="difficulty-select"]');
    this.settingsLink = page.locator('[data-testid="settings-link"]');
  }

  async startQuiz(difficulty: 'beginner' | 'intermediate' | 'advanced') {
    await this.difficultySelect.selectOption(difficulty);
    await this.startQuizButton.click();
    await this.waitForPageLoad();
  }

  async navigateToSettings() {
    await this.settingsLink.click();
    await this.waitForPageLoad();
  }
}
```

#### 3. クイズページクラス
```typescript
// tests/e2e/pages/QuizPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class QuizPage extends BasePage {
  readonly fretboard: Locator;
  readonly answerInput: Locator;
  readonly submitButton: Locator;
  readonly scoreDisplay: Locator;
  readonly hintsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.fretboard = page.locator('[data-testid="fretboard"]');
    this.answerInput = page.locator('[data-testid="answer-input"]');
    this.submitButton = page.locator('[data-testid="submit-answer"]');
    this.scoreDisplay = page.locator('[data-testid="score"]');
    this.hintsButton = page.locator('[data-testid="hints-button"]');
  }

  async selectAnswer(chordName: string) {
    await this.answerInput.fill(chordName);
  }

  async submitAnswer() {
    await this.submitButton.click();
  }

  async useHint() {
    await this.hintsButton.click();
  }

  async getCurrentScore(): Promise<number> {
    const scoreText = await this.scoreDisplay.textContent();
    return parseInt(scoreText?.match(/\d+/)?.[0] || '0');
  }
}
```

### Phase 3: テストケース実装

#### 1. スモークテスト
```typescript
// tests/e2e/specs/smoke.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Smoke Tests', () => {
  test('Application loads successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ページタイトル確認
    await expect(page).toHaveTitle(/Guitar Chord Quiz/);

    // 主要要素の存在確認
    await expect(homePage.startQuizButton).toBeVisible();
    await expect(homePage.difficultySelect).toBeVisible();
  });

  test('Settings page is accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.navigateToSettings();

    await expect(page).toHaveURL(/.*\/settings/);
  });
});
```

#### 2. クイズフローテスト
```typescript
// tests/e2e/specs/quiz-flow.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { QuizPage } from '../pages/QuizPage';

test.describe('Quiz Flow Tests', () => {
  test('Complete quiz game flow', async ({ page }) => {
    const homePage = new HomePage(page);
    const quizPage = new QuizPage(page);

    // ホーム画面からクイズ開始
    await homePage.goto();
    await homePage.startQuiz('beginner');

    // フレットボード表示確認
    await expect(quizPage.fretboard).toBeVisible();

    // 回答入力・送信
    await quizPage.selectAnswer('C');
    await quizPage.submitAnswer();

    // スコア更新確認
    await expect(quizPage.scoreDisplay).toContainText(/[0-9]+/);
  });

  test('Hint functionality works', async ({ page }) => {
    const homePage = new HomePage(page);
    const quizPage = new QuizPage(page);

    await homePage.goto();
    await homePage.startQuiz('beginner');

    // ヒント使用
    await quizPage.useHint();

    // ヒント表示確認（実装依存）
    await expect(page.locator('[data-testid="hint-display"]')).toBeVisible();
  });
});
```

#### 3. レスポンシブテスト
```typescript
// tests/e2e/specs/responsive.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Responsive Tests', () => {
  test('Mobile layout works correctly', async ({ page }) => {
    // モバイルビューポート設定
    await page.setViewportSize({ width: 375, height: 667 });

    const homePage = new HomePage(page);
    await homePage.goto();

    // モバイル専用要素の確認
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('Desktop layout works correctly', async ({ page }) => {
    // デスクトップビューポート設定
    await page.setViewportSize({ width: 1280, height: 720 });

    const homePage = new HomePage(page);
    await homePage.goto();

    // デスクトップ専用要素の確認
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
  });
});
```

#### 4. アクセシビリティテスト
```typescript
// tests/e2e/specs/accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('Keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    // Tab キーでナビゲーション
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    // Enter キーでアクション実行
    await page.keyboard.press('Enter');
  });

  test('Screen reader attributes are present', async ({ page }) => {
    await page.goto('/');

    // ARIA ラベルの存在確認
    const fretboard = page.locator('[data-testid="fretboard"]');
    await expect(fretboard).toHaveAttribute('aria-label');
    await expect(fretboard).toHaveAttribute('role');
  });
});
```

### Phase 4: パフォーマンステスト

#### 1. Core Web Vitals測定
```typescript
// tests/e2e/specs/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const endTime = Date.now();

    // ページ読み込み時間チェック（3秒以内）
    expect(endTime - startTime).toBeLessThan(3000);
  });

  test('Core Web Vitals benchmarks', async ({ page }) => {
    await page.goto('/');

    // LCP (Largest Contentful Paint) 測定
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    expect(lcp).toBeLessThan(2500); // 2.5秒以内
  });
});
```

## 🔧 **実装ガイド**

### 1. テストデータ管理

#### フィクスチャファイル
```typescript
// tests/e2e/fixtures/chords.ts
export const testChords = {
  beginner: [
    { name: 'C', frets: [null, 3, 2, 0, 1, 0], difficulty: 'beginner' },
    { name: 'G', frets: [3, 2, 0, 0, 3, 3], difficulty: 'beginner' },
    { name: 'Am', frets: [null, 0, 2, 2, 1, 0], difficulty: 'beginner' }
  ],
  intermediate: [
    { name: 'F', frets: [1, 3, 3, 2, 1, 1], difficulty: 'intermediate' },
    { name: 'Bm', frets: [2, 2, 4, 4, 3, 2], difficulty: 'intermediate' }
  ],
  advanced: [
    { name: 'F#m7', frets: [2, 4, 2, 2, 2, 2], difficulty: 'advanced' }
  ]
};

export const testSettings = {
  default: {
    difficulty: 'beginner' as const,
    soundEnabled: true,
    theme: 'light' as const
  },
  darkMode: {
    difficulty: 'intermediate' as const,
    soundEnabled: false,
    theme: 'dark' as const
  }
};
```

### 2. ヘルパー関数

#### ユーティリティ
```typescript
// tests/e2e/utils/helpers.ts
import { Page } from '@playwright/test';

export class TestHelpers {
  static async clearLocalStorage(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
    });
  }

  static async setLocalStorage(page: Page, key: string, value: any) {
    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      { key, value }
    );
  }

  static async waitForAudioContext(page: Page) {
    await page.evaluate(async () => {
      return new Promise((resolve) => {
        const checkAudio = () => {
          if ((window as any).audioContext) {
            resolve(true);
          } else {
            setTimeout(checkAudio, 100);
          }
        };
        checkAudio();
      });
    });
  }

  static async mockAudioContext(page: Page) {
    await page.addInitScript(() => {
      (window as any).AudioContext = class MockAudioContext {
        createOscillator() {
          return {
            connect: () => {},
            start: () => {},
            stop: () => {},
            frequency: { value: 440 }
          };
        }
        createGain() {
          return {
            connect: () => {},
            gain: { value: 1 }
          };
        }
        get destination() { return {}; }
        get currentTime() { return 0; }
      };
    });
  }
}
```

### 3. CI/CD統合

#### GitHub Actions設定
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright Browsers
      run: npx playwright install --with-deps

    - name: Build application
      run: npm run build

    - name: Run Playwright tests
      run: npx playwright test

    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### 4. NPMスクリプト追加

#### package.json更新
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:install": "playwright install",
    "test:e2e:codegen": "playwright codegen localhost:3000"
  }
}
```

## 📊 **期待される効果**

### 1. 品質向上
- **リグレッション防止**: 新機能追加時の既存機能破損防止
- **ブラウザ間互換性**: 複数ブラウザでの一貫した動作保証
- **アクセシビリティ品質**: キーボード操作・スクリーンリーダー対応維持

### 2. 開発効率
- **自動テスト実行**: PR作成時の自動品質チェック
- **早期バグ発見**: 開発段階での問題検出
- **デプロイ前品質保証**: 本番環境リリース前の最終確認

### 3. ユーザー体験
- **安定した動作**: 主要機能の信頼性確保
- **パフォーマンス維持**: ページ読み込み・操作速度の品質保証
- **アクセシビリティ向上**: 障害者対応の継続的改善

## 🚀 **実装スケジュール**

### Week 1: 基盤構築
- [ ] Playwright環境セットアップ
- [ ] 基本的なPage Object Model作成
- [ ] スモークテスト実装

### Week 2: 主要機能テスト
- [ ] クイズフローテスト実装
- [ ] フレットボードインタラクションテスト
- [ ] 設定機能テスト

### Week 3: 高度なテスト
- [ ] レスポンシブテスト実装
- [ ] アクセシビリティテスト
- [ ] パフォーマンステスト

### Week 4: 統合・最適化
- [ ] CI/CD統合
- [ ] テストレポート自動化
- [ ] カバレッジ分析・改善

## 🛠️ **開発支援機能**

### 利用可能なコマンド

#### 基本テスト実行
```bash
# 通常のE2Eテスト実行（ヘッドレスモード）
npm run test:e2e

# 特定のテストファイルのみ実行
npm run test:e2e -- smoke.spec.ts

# 特定のブラウザでテスト実行
npm run test:e2e -- --project=chromium
```

#### デバッグ・開発モード
```bash
# ヘッド付きブラウザでテスト実行（画面表示あり）
npm run test:e2e:headed

# デバッグモード（ステップ実行・ブレークポイント）
npm run test:e2e:debug

# UIモード（対話型テスト実行・結果確認）
npm run test:e2e:ui

# 特定のテストをデバッグモードで実行
npm run test:e2e:debug -- quiz-flow.spec.ts
```

#### テスト作成支援
```bash
# Playwrightコードジェネレーター（操作録画）
npm run test:e2e:codegen

# 特定のページからコード生成開始
npm run test:e2e:codegen -- --url http://localhost:3000/settings

# モバイルデバイスでコード生成
npx playwright codegen --device="iPhone 12" localhost:3000
```

#### レポート・分析
```bash
# テストレポート表示（HTMLレポート）
npm run test:e2e:report

# 失敗したテストのトレース表示
npx playwright show-trace test-results/tests-quiz-flow-Complete-quiz-game-flow-chromium/trace.zip

# テスト実行時のスクリーンショット確認
# test-results/フォルダ内を確認
```

#### CI・統合テスト
```bash
# 全テスト実行（Unit + E2E）
npm run test:all

# CI環境用統合テスト（型チェック + リント + テスト）
npm run ci:test
```

### VSCode拡張機能連携

#### 推奨拡張機能
```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-playwright.playwright",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode"
  ]
}
```

#### VSCode設定
```json
// .vscode/settings.json
{
  "playwright.testDir": "./tests/e2e/specs",
  "playwright.showTrace": true,
  "playwright.reuseBrowser": true
}
```

### デバッグテクニック

#### 1. ステップ実行デバッグ
```typescript
// テストコード内でブレークポイント設定
test('debug example', async ({ page }) => {
  await page.goto('/');

  // デバッガーで一時停止
  await page.pause();

  // この後の操作をステップ実行可能
  await page.click('[data-testid="start-quiz"]');
});
```

#### 2. スクリーンショット・トレース
```typescript
test('screenshot example', async ({ page }) => {
  await page.goto('/');

  // スクリーンショット撮影
  await page.screenshot({ path: 'debug-screenshot.png' });

  // 特定要素のスクリーンショット
  await page.locator('[data-testid="fretboard"]').screenshot({
    path: 'fretboard-debug.png'
  });
});
```

#### 3. コンソールログ・ネットワーク監視
```typescript
test('monitoring example', async ({ page }) => {
  // コンソールログ監視
  page.on('console', msg => console.log('CONSOLE:', msg.text()));

  // ネットワークリクエスト監視
  page.on('request', request => console.log('REQUEST:', request.url()));

  // ページエラー監視
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('/');
});
```

### テストデータ管理

#### 動的テストデータ生成
```typescript
// tests/e2e/fixtures/generator.ts
export class TestDataGenerator {
  static generateRandomChord() {
    const chords = ['C', 'G', 'Am', 'F', 'D', 'Em'];
    return chords[Math.floor(Math.random() * chords.length)];
  }

  static generateGameSession(length: number = 5) {
    return Array.from({ length }, () => this.generateRandomChord());
  }
}
```

#### テスト環境リセット
```typescript
test.beforeEach(async ({ page }) => {
  // LocalStorage完全クリア
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Cookie削除
  await page.context().clearCookies();

  // キャッシュクリア
  await page.goto('about:blank');
});
```

### パフォーマンステスト

#### Web Vitals測定
```typescript
test('performance metrics', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    return new Promise(resolve => {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const metrics = {};

        entries.forEach(entry => {
          metrics[entry.name] = entry.startTime;
        });

        resolve(metrics);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    });
  });

  console.log('Performance metrics:', metrics);
});
```

#### ネットワーク速度シミュレーション
```typescript
test('slow network test', async ({ page }) => {
  // 3G接続をシミュレート
  await page.route('**/*', route => {
    setTimeout(() => route.continue(), 100);
  });

  await page.goto('/');
  // 遅い接続での動作確認
});
```

### カスタムアサーション

#### 独自マッチャー作成
```typescript
// tests/e2e/utils/custom-matchers.ts
export async function toBeAccessible(page: Page, selector: string) {
  const element = page.locator(selector);

  // ARIA属性確認
  const ariaLabel = await element.getAttribute('aria-label');
  const role = await element.getAttribute('role');

  return {
    pass: !!(ariaLabel || role),
    message: () => `Element ${selector} is not accessible`
  };
}
```

### 並列実行最適化

#### テスト分散設定
```typescript
// playwright.config.ts
export default defineConfig({
  // 並列実行数設定
  workers: process.env.CI ? 2 : 4,

  // テストファイル別並列実行
  fullyParallel: true,

  // 失敗時のリトライ
  retries: process.env.CI ? 2 : 0,

  // タイムアウト設定
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000
  }
});
```

## 🔍 **メンテナンス計画**

### 定期タスク
1. **毎週**: テスト結果レビュー・失敗ケース分析
2. **毎月**: テストケース更新・新機能対応
3. **四半期**: パフォーマンスベンチマーク見直し
4. **年次**: テスト戦略全体の再評価

### 品質指標
- **テスト実行成功率**: 95%以上維持
- **ページ読み込み時間**: 3秒以内
- **Core Web Vitals**: Good評価維持
- **アクセシビリティスコア**: WCAG 2.1 AA準拠

### トラブルシューティング

#### よくある問題と解決方法

1. **テストが不安定（Flaky）な場合**
```typescript
// 適切な待機処理を追加
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();

// 明示的な待機時間設定
await page.waitForTimeout(500);
```

2. **要素が見つからない場合**
```typescript
// より具体的なセレクター使用
await page.locator('[data-testid="specific-element"]').click();

// 複数の候補から選択
const element = page.locator('[data-testid="button"], button:has-text("Submit")');
```

3. **CI環境でのみ失敗する場合**
```typescript
// CI環境用の設定追加
const isCI = !!process.env.CI;
if (isCI) {
  await page.waitForTimeout(1000); // CI環境では少し長めに待機
}
```

---

この包括的なE2Eテスト環境により、Guitar Chord Quizの品質と信頼性を大幅に向上させ、継続的な改善サイクルを確立できます。開発支援機能を活用することで、効率的なテスト作成・デバッグ・保守が可能になります。