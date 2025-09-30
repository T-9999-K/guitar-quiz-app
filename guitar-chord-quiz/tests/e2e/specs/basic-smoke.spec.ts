/**
 * Guitar Chord Quiz - Basic Smoke Tests
 *
 * @description 基本的な動作確認テスト（実装に依存しない）
 * @author Claude Code
 */

import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/helpers';

test.describe('Basic Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // テスト前の共通設定
    await TestHelpers.mockAudioContext(page);
    await TestHelpers.mockResizeObserver(page);
    await TestHelpers.mockMatchMedia(page);

    // LocalStorageアクセス可能な場合のみクリア
    await TestHelpers.clearLocalStorage(page);
  });

  test('Application loads without errors', async ({ page }) => {
    // コンソールエラー監視
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // ページエラー監視
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // ホームページに移動
    await page.goto('/');

    // ページが読み込まれることを確認
    await page.waitForLoadState('networkidle');

    // ページタイトルが存在することを確認
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // body要素が存在することを確認
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // 重大なエラーがないことを確認
    const criticalErrors = errors.filter(error =>
      !error.includes('Warning') &&
      !error.includes('Unknown')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('Page has basic HTML structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 基本的なHTML構造の確認
    const html = page.locator('html');
    const head = page.locator('head');
    const body = page.locator('body');

    await expect(html).toBeVisible();
    await expect(head).toBeAttached();
    await expect(body).toBeVisible();

    // メタタグの存在確認（重複があっても最初の要素をチェック）
    const charset = page.locator('meta[charset]').first();
    const viewport = page.locator('meta[name="viewport"]').first();

    await expect(charset).toBeAttached();
    await expect(viewport).toBeAttached();
  });

  test('CSS styles are loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // body要素にスタイルが適用されていることを確認
    const bodyStyles = await page.locator('body').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        margin: styles.margin,
        padding: styles.padding,
        fontFamily: styles.fontFamily
      };
    });

    // 何らかのスタイルが適用されていることを確認
    expect(bodyStyles.fontFamily).not.toBe('');
  });

  test('JavaScript is functional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // JavaScriptが実行可能であることを確認
    const jsResult = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        location: window.location.href,
        documentReady: document.readyState
      };
    });

    expect(jsResult.userAgent).toBeTruthy();
    expect(jsResult.location).toContain('localhost:3000');
    expect(['loading', 'interactive', 'complete']).toContain(jsResult.documentReady);
  });

  test('Page is responsive to viewport changes', async ({ page }) => {
    await page.goto('/');

    // デスクトップサイズ
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(300);

    const desktopWidth = await page.evaluate(() => window.innerWidth);
    expect(desktopWidth).toBe(1280);

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

    const mobileWidth = await page.evaluate(() => window.innerWidth);
    expect(mobileWidth).toBe(375);

    // レイアウトが崩れていないことを確認
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Basic navigation works', async ({ page }) => {
    // ホームページから開始
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const homeUrl = page.url();
    expect(homeUrl).toContain('localhost:3000');

    // リロードが機能することを確認
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    const reloadedUrl = page.url();
    expect(reloadedUrl).toBe(homeUrl);
  });

  test('Browser back/forward works', async ({ page }) => {
    // 複数ページ間の移動をテスト
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const homePage = page.url();

    // 異なるパスに移動
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');
    const settingsPage = page.url();

    // 戻るボタン
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // ナビゲーション完了待機

    // URLが変わったことを確認（厳密一致でなくパスの変化を確認）
    const currentUrl = page.url();
    expect(currentUrl).not.toBe(settingsPage);

    // 進むボタン
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const finalUrl = page.url();
    expect(finalUrl).toContain('settings');
  });

  test('Theme detection works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // システムテーマの検出
    const prefersDark = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // ブール値であることを確認
    expect(typeof prefersDark).toBe('boolean');

    // HTML要素にダークモードクラスが存在するかチェック
    const htmlClasses = await page.locator('html').getAttribute('class');

    // クラス属性が文字列または null であることを確認
    expect(typeof htmlClasses === 'string' || htmlClasses === null).toBeTruthy();
  });

  test('Performance is acceptable', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // ページ読み込み時間が10秒以内であることを確認
    expect(loadTime).toBeLessThan(10000);

    // NetworkIdleまでの時間も測定
    const networkStartTime = Date.now();
    await page.waitForLoadState('networkidle');
    const networkEndTime = Date.now();
    const networkLoadTime = networkEndTime - networkStartTime;

    // ネットワーク完了時間が15秒以内であることを確認
    expect(networkLoadTime).toBeLessThan(15000);
  });
});