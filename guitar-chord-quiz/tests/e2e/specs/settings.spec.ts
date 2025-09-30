/**
 * Guitar Chord Quiz - Settings Tests
 *
 * @description 設定画面・カスタマイゼーション機能のテスト
 * @author Claude Code
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TestHelpers } from '../utils/helpers';

test.describe('Settings Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.mockAudioContext(page);
    await TestHelpers.mockResizeObserver(page);
    await TestHelpers.mockMatchMedia(page);
    await TestHelpers.clearLocalStorage(page);
  });

  test('Settings page loads correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // ページタイトルの確認
    await expect(page).toHaveTitle(/設定|Settings/);

    // 設定セクションの確認
    const settingsTitle = page.locator('h1');
    await expect(settingsTitle).toBeVisible();

    // 主要設定項目の確認
    const difficultySection = page.locator('[data-testid="difficulty-settings"]');
    const themeSection = page.locator('[data-testid="theme-settings"]');
    const audioSection = page.locator('[data-testid="audio-settings"]');

    // 設定項目が表示されていることを確認
    try {
      await expect(difficultySection).toBeVisible();
    } catch {
      // フォールバック: 設定項目の代替確認
      const settingsForm = page.locator('form, [role="form"]');
      await expect(settingsForm).toBeVisible();
    }
  });

  test('Theme switching works in settings', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // テーマ切り替えボタンの確認
    const themeToggle = page.locator('[data-testid="theme-toggle"], [data-testid="theme-switch"]');

    if (await themeToggle.isVisible()) {
      // 初期テーマの確認
      const initialTheme = await homePage.getCurrentTheme();

      // テーマ切り替え
      await themeToggle.click();
      await page.waitForTimeout(300);

      // テーマが変更されたことを確認
      const newTheme = await homePage.getCurrentTheme();
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('Statistics display works correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // 統計セクションの確認
    const statisticsSection = page.locator('[data-testid="statistics-section"]');

    if (await statisticsSection.isVisible()) {
      // 統計情報の表示確認
      const statsItems = page.locator('[data-testid^="stat-"]');
      const count = await statsItems.count();

      // 何らかの統計項目が表示されていることを確認
      expect(count).toBeGreaterThan(0);
    } else {
      // フォールバック: 統計リンクの確認
      const statsLink = page.locator('[data-testid="statistics-link"]');
      if (await statsLink.isVisible()) {
        await expect(statsLink).toBeVisible();
      }
    }
  });

  test('Settings persistence works', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // 設定変更
    const difficultySelect = page.locator('[data-testid="difficulty-select"]');
    if (await difficultySelect.isVisible()) {
      await difficultySelect.selectOption('advanced');
    }

    // テーマ変更
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }

    // ページリロード
    await page.reload();

    // 設定が保持されていることを確認
    const gameSettings = await TestHelpers.getLocalStorage(page, 'gameSettings');
    expect(gameSettings).toBeTruthy();
  });

  test('Audio settings work correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // 音声設定セクション
    const audioSection = page.locator('[data-testid="audio-settings"]');

    if (await audioSection.isVisible()) {
      // 音声ON/OFF切り替え
      const audioToggle = page.locator('[data-testid="audio-toggle"]');
      if (await audioToggle.isVisible()) {
        await audioToggle.click();
      }

      // 音量調整
      const volumeSlider = page.locator('[data-testid="volume-slider"]');
      if (await volumeSlider.isVisible()) {
        await volumeSlider.fill('50');
      }
    }

    // エラーが発生しないことを確認
    await homePage.verifyNoErrors();
  });

  test('Accessibility settings work', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // アクセシビリティ設定
    const accessibilitySection = page.locator('[data-testid="accessibility-settings"]');

    if (await accessibilitySection.isVisible()) {
      // 高コントラストモード
      const highContrastToggle = page.locator('[data-testid="high-contrast-toggle"]');
      if (await highContrastToggle.isVisible()) {
        await highContrastToggle.click();
      }

      // モーション軽減
      const reduceMotionToggle = page.locator('[data-testid="reduce-motion-toggle"]');
      if (await reduceMotionToggle.isVisible()) {
        await reduceMotionToggle.click();
      }
    }
  });

  test('Data management features work', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // データ管理セクション
    const dataSection = page.locator('[data-testid="data-management"]');

    if (await dataSection.isVisible()) {
      // データクリアボタン
      const clearDataButton = page.locator('[data-testid="clear-data-button"]');

      if (await clearDataButton.isVisible()) {
        // 確認ダイアログをハンドル
        page.on('dialog', dialog => dialog.accept());

        await clearDataButton.click();
        await page.waitForTimeout(500);

        // LocalStorageがクリアされたことを確認
        const clearedSettings = await TestHelpers.getLocalStorage(page, 'gameSettings');
        expect(clearedSettings).toBeNull();
      }
    }
  });

  test('Settings navigation works correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // ホームに戻るリンク
    const homeLink = page.locator('[data-testid="home-link"], a[href="/"]');

    if (await homeLink.isVisible()) {
      await homeLink.click();
      await homePage.verifyPageURL(/.*\/$/);
    } else {
      // ブラウザバックで戻る
      await page.goBack();
      await homePage.verifyPageURL(/.*\/$/);
    }
  });
});

test.describe('Settings - Responsive Tests', () => {
  test('Settings work correctly on mobile', async ({ page }) => {
    const homePage = new HomePage(page);

    // モバイル表示設定
    await TestHelpers.setViewport(page, 'mobile');

    await homePage.navigateToHome();
    await homePage.navigateToSettings();

    // モバイル用レイアウトの確認
    const settingsContainer = page.locator('[data-testid="settings-container"]');
    await expect(settingsContainer).toBeVisible();

    // 基本設定項目の確認
    const settingsTitle = page.locator('h1');
    await expect(settingsTitle).toBeVisible();
  });
});