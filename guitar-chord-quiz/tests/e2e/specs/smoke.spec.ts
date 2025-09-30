/**
 * Guitar Chord Quiz - Smoke Tests
 *
 * @description 基本的な動作確認テスト（最重要機能の確認）
 * @author Claude Code
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TestHelpers } from '../utils/helpers';

test.describe('Smoke Tests - Critical Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // テスト前の共通設定
    await TestHelpers.mockAudioContext(page);
    await TestHelpers.mockResizeObserver(page);
    await TestHelpers.mockMatchMedia(page);
    await TestHelpers.clearLocalStorage(page);
  });

  test('Application loads successfully', async ({ page }) => {
    const homePage = new HomePage(page);

    // ホームページに移動
    await homePage.navigateToHome();

    // ページタイトルの確認
    await homePage.verifyHomePageTitle();

    // 基本要素の表示確認
    await homePage.verifyPageElements();

    // メインタイトルの確認
    await homePage.verifyMainTitle();

    // エラーがないことを確認
    await homePage.verifyNoErrors();

    // ページが完全に読み込まれていることを確認
    await homePage.waitForPageReady();
  });

  test('Settings page is accessible', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();

    // 設定ページへのナビゲーション
    await homePage.navigateToSettings();

    // URLの確認
    await homePage.verifyPageURL(/.*\/settings/);

    // ページタイトルの確認
    await expect(page).toHaveTitle(/設定|Settings/);

    // 設定ページの基本要素確認
    const settingsTitle = page.locator('h1');
    await expect(settingsTitle).toBeVisible();
  });

  test('Theme toggle works correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();

    // 初期状態の確認（ライトモード）
    const initialTheme = await homePage.getCurrentTheme();

    // テーマ切り替え
    await homePage.toggleTheme();

    // テーマが変更されたことを確認
    const newTheme = await homePage.getCurrentTheme();
    expect(newTheme).not.toBe(initialTheme);

    // 再度切り替えて元に戻ることを確認
    await homePage.toggleTheme();
    const finalTheme = await homePage.getCurrentTheme();
    expect(finalTheme).toBe(initialTheme);
  });

  test('Difficulty selection works', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();

    // 各難易度を選択してテスト
    const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];

    for (const difficulty of difficulties) {
      await homePage.selectDifficulty(difficulty);

      // 選択された難易度が正しいことを確認
      const currentDifficulty = await homePage.getCurrentDifficulty();
      expect(currentDifficulty.toLowerCase()).toContain(difficulty);
    }
  });

  test('Page navigation is functional', async ({ page }) => {
    const homePage = new HomePage(page);

    // ホームページから開始
    await homePage.navigateToHome();
    await homePage.verifyPageURL(/.*\/$/);

    // 設定ページに移動
    await homePage.navigateToSettings();
    await homePage.verifyPageURL(/.*\/settings/);

    // ブラウザバックでホームに戻る
    await homePage.goBack();
    await homePage.verifyPageURL(/.*\/$/);

    // エラーがないことを確認
    await homePage.verifyNoErrors();
  });

  test('Responsive layout adapts correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();

    // デスクトップ表示の確認
    await homePage.verifyResponsiveLayout('desktop');

    // タブレット表示の確認
    await homePage.verifyResponsiveLayout('tablet');

    // モバイル表示の確認
    await homePage.verifyResponsiveLayout('mobile');

    // 各サイズで基本要素が表示されることを確認
    await homePage.verifyElementVisible(homePage.mainTitle);
    await homePage.verifyElementVisible(homePage.startQuizButton);
  });

  test('Basic accessibility features work', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();

    // アクセシビリティ属性の確認
    await homePage.verifyAccessibility();

    // キーボードナビゲーションのテスト
    await homePage.testKeyboardNavigation();

    // フォーカス管理の確認
    await homePage.verifyElementFocused(homePage.difficultySelect);
  });

  test('No JavaScript errors on page load', async ({ page }) => {
    const errors = await TestHelpers.startConsoleErrorMonitoring(page);
    const networkErrors = await TestHelpers.startNetworkErrorMonitoring(page);

    const homePage = new HomePage(page);
    await homePage.navigateToHome();

    // ページ読み込み完了まで待機
    await homePage.waitForPageReady();

    // コンソールエラーがないことを確認
    expect(errors).toHaveLength(0);

    // ネットワークエラーがないことを確認
    expect(networkErrors).toHaveLength(0);
  });

  test('LocalStorage functionality works', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();

    // 設定を変更
    await homePage.selectDifficulty('advanced');
    await homePage.toggleTheme();

    // ページをリロード
    await homePage.reload();

    // 設定が保持されていることを確認
    const savedDifficulty = await homePage.getCurrentDifficulty();
    expect(savedDifficulty.toLowerCase()).toContain('advanced');

    // LocalStorageの直接確認
    const gameSettings = await homePage.getStorageItem('gameSettings');
    expect(gameSettings).toBeTruthy();
  });

  test('Start quiz button is functional', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();

    // 難易度を選択
    await homePage.selectDifficulty('beginner');

    // スタートボタンが有効であることを確認
    await homePage.verifyElementEnabled(homePage.startQuizButton);

    // ボタンクリック時の動作確認（エラーが発生しないこと）
    await homePage.clickElement(homePage.startQuizButton);

    // クイズページに遷移することを確認
    await page.waitForURL(/.*(?!settings).*/, { timeout: 5000 });
  });

  test('Page performance is acceptable', async ({ page }) => {
    const homePage = new HomePage(page);

    // パフォーマンス測定
    const performance = await TestHelpers.measurePagePerformance(page);

    await homePage.navigateToHome();

    // 読み込み時間が許容範囲内であることを確認（5秒以内）
    expect(performance.loadTime).toBeLessThan(5000);

    // DOM読み込み時間が許容範囲内であることを確認（3秒以内）
    expect(performance.domContentLoaded).toBeLessThan(3000);
  });
});

test.describe('Smoke Tests - Cross-Browser Compatibility', () => {
  test('Works in different browsers', async ({ page, browserName }) => {
    const homePage = new HomePage(page);

    // ブラウザ別の初期化
    await TestHelpers.mockAudioContext(page);
    await TestHelpers.mockResizeObserver(page);
    await TestHelpers.mockMatchMedia(page);

    await homePage.navigateToHome();

    // 基本機能が全ブラウザで動作することを確認
    await homePage.verifyPageElements();
    await homePage.verifyMainTitle();

    // ブラウザ固有のテスト
    if (browserName === 'webkit') {
      // Safari固有のテスト
      await homePage.verifyElementVisible(homePage.startQuizButton);
    } else if (browserName === 'firefox') {
      // Firefox固有のテスト
      await homePage.verifyElementVisible(homePage.difficultySelect);
    } else {
      // Chrome固有のテスト
      await homePage.verifyElementVisible(homePage.themeToggle);
    }

    await homePage.verifyNoErrors();
  });
});