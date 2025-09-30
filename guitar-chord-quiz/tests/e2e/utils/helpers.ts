/**
 * Guitar Chord Quiz - E2E Test Helpers
 *
 * @description テスト用ユーティリティ関数とヘルパー
 * @author Claude Code
 */

import { Page, expect } from '@playwright/test';

export class TestHelpers {
  /**
   * LocalStorageをクリア
   */
  static async clearLocalStorage(page: Page): Promise<void> {
    try {
      await page.evaluate(() => {
        if (typeof Storage !== 'undefined' && localStorage) {
          localStorage.clear();
        }
      });
    } catch (error) {
      // LocalStorageアクセスできない場合は無視
      console.warn('LocalStorage access denied, skipping clear operation');
    }
  }

  /**
   * LocalStorageに値を設定
   */
  static async setLocalStorage(page: Page, key: string, value: any): Promise<void> {
    try {
      await page.evaluate(
        ({ key, value }) => {
          if (typeof Storage !== 'undefined' && localStorage) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        },
        { key, value }
      );
    } catch (error) {
      console.warn('LocalStorage access denied, skipping set operation');
    }
  }

  /**
   * LocalStorageから値を取得
   */
  static async getLocalStorage(page: Page, key: string): Promise<any> {
    try {
      return await page.evaluate(
        (key) => {
          if (typeof Storage !== 'undefined' && localStorage) {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
          }
          return null;
        },
        key
      );
    } catch (error) {
      console.warn('LocalStorage access denied, returning null');
      return null;
    }
  }

  /**
   * Web Audio APIのモック設定
   */
  static async mockAudioContext(page: Page): Promise<void> {
    await page.addInitScript(() => {
      (window as any).AudioContext = class MockAudioContext {
        constructor() {
          this.state = 'running';
          this.currentTime = 0;
          this.destination = {};
        }

        createOscillator() {
          return {
            connect: () => {},
            start: () => {},
            stop: () => {},
            frequency: { value: 440 },
            type: 'sine'
          };
        }

        createGain() {
          return {
            connect: () => {},
            gain: { value: 1 }
          };
        }

        close() {
          this.state = 'closed';
          return Promise.resolve();
        }

        resume() {
          this.state = 'running';
          return Promise.resolve();
        }
      };

      // WebKit Audio Context対応
      (window as any).webkitAudioContext = (window as any).AudioContext;
    });
  }

  /**
   * ResizeObserverのモック設定
   */
  static async mockResizeObserver(page: Page): Promise<void> {
    await page.addInitScript(() => {
      (window as any).ResizeObserver = class MockResizeObserver {
        constructor(callback: any) {
          this.callback = callback;
        }

        observe() {}
        unobserve() {}
        disconnect() {}
      };
    });
  }

  /**
   * matchMediaのモック設定
   */
  static async mockMatchMedia(page: Page): Promise<void> {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });
  }

  /**
   * ページ読み込み完了待機
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * 要素の表示待機
   */
  static async waitForElement(page: Page, selector: string, timeout = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * スクリーンショット撮影
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  /**
   * 現在のスコアを取得
   */
  static async getCurrentScore(page: Page): Promise<number> {
    const scoreElement = page.locator('[data-testid="current-score"]');
    const scoreText = await scoreElement.textContent();
    return parseInt(scoreText?.match(/\d+/)?.[0] || '0');
  }

  /**
   * 現在の連続正解数を取得
   */
  static async getCurrentStreak(page: Page): Promise<number> {
    const streakElement = page.locator('[data-testid="current-streak"]');
    const streakText = await streakElement.textContent();
    return parseInt(streakText?.match(/\d+/)?.[0] || '0');
  }

  /**
   * レスポンシブ表示切り替え
   */
  static async setViewport(page: Page, device: 'mobile' | 'tablet' | 'desktop'): Promise<void> {
    const viewports = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1280, height: 720 }
    };

    await page.setViewportSize(viewports[device]);
  }

  /**
   * ダークモード切り替え
   */
  static async toggleDarkMode(page: Page): Promise<void> {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();
    await page.waitForTimeout(300); // アニメーション待機
  }

  /**
   * 難易度切り替え
   */
  static async setDifficulty(page: Page, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<void> {
    const difficultySelect = page.locator('[data-testid="difficulty-select"]');
    await difficultySelect.selectOption(difficulty);
  }

  /**
   * コンソールエラーの監視開始
   */
  static async startConsoleErrorMonitoring(page: Page): Promise<string[]> {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    return errors;
  }

  /**
   * ネットワークエラーの監視開始
   */
  static async startNetworkErrorMonitoring(page: Page): Promise<string[]> {
    const networkErrors: string[] = [];

    page.on('requestfailed', request => {
      networkErrors.push(`Failed request: ${request.url()}`);
    });

    return networkErrors;
  }

  /**
   * パフォーマンス測定
   */
  static async measurePagePerformance(page: Page): Promise<{
    loadTime: number;
    domContentLoaded: number;
    networkIdle: number;
  }> {
    const startTime = Date.now();

    await page.waitForLoadState('domcontentloaded');
    const domContentLoaded = Date.now() - startTime;

    await page.waitForLoadState('networkidle');
    const networkIdle = Date.now() - startTime;

    const loadTime = await page.evaluate(() => {
      const [navigationEntry] = performance.getEntriesByType('navigation');
      return navigationEntry ? (navigationEntry as any).loadEventEnd - (navigationEntry as any).navigationStart : 0;
    });

    return {
      loadTime,
      domContentLoaded,
      networkIdle
    };
  }
}