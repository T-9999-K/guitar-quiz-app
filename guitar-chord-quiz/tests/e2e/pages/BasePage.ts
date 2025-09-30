/**
 * Guitar Chord Quiz - Base Page Object Model
 *
 * @description 全ページ共通の基底クラス
 * @author Claude Code
 */

import { Page, Locator, expect } from '@playwright/test';
import { TestHelpers } from '../utils/helpers';

export abstract class BasePage {
  readonly page: Page;

  // 共通要素
  readonly header: Locator;
  readonly footer: Locator;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // 共通要素の定義
    this.header = page.locator('header');
    this.footer = page.locator('footer');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  /**
   * ページに移動
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * ページ読み込み完了待機
   */
  async waitForPageLoad(): Promise<void> {
    await TestHelpers.waitForPageLoad(this.page);
  }

  /**
   * ローディング完了待機
   */
  async waitForLoadingComplete(): Promise<void> {
    // ローディングスピナーが表示されていたら消えるまで待機
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // ローディングスピナーが存在しない場合は無視
    }
  }

  /**
   * エラーメッセージの確認
   */
  async checkForErrors(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /**
   * ページタイトルの確認
   */
  async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * ページURLの確認
   */
  async verifyPageURL(expectedURL: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  /**
   * スクリーンショット撮影
   */
  async takeScreenshot(name: string): Promise<void> {
    await TestHelpers.takeScreenshot(this.page, name);
  }

  /**
   * 要素の表示確認
   */
  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * 要素の非表示確認
   */
  async verifyElementHidden(locator: Locator): Promise<void> {
    await expect(locator).not.toBeVisible();
  }

  /**
   * テキスト内容の確認
   */
  async verifyTextContent(locator: Locator, expectedText: string | RegExp): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  /**
   * 属性値の確認
   */
  async verifyAttribute(locator: Locator, attribute: string, expectedValue: string | RegExp): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, expectedValue);
  }

  /**
   * 要素のクリック
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
    await this.page.waitForTimeout(100); // 短い待機時間
  }

  /**
   * フォーム入力
   */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * セレクトボックス選択
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * キーボード入力
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * ホバー操作
   */
  async hoverElement(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * スクロール操作
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * ページリロード
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * ブラウザバック
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * ブラウザ進む
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * LocalStorage操作
   */
  async clearStorage(): Promise<void> {
    await TestHelpers.clearLocalStorage(this.page);
  }

  async setStorageItem(key: string, value: any): Promise<void> {
    await TestHelpers.setLocalStorage(this.page, key, value);
  }

  async getStorageItem(key: string): Promise<any> {
    return await TestHelpers.getLocalStorage(this.page, key);
  }

  /**
   * レスポンシブ表示切り替え
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * デバイス別表示切り替え
   */
  async setDevice(device: 'mobile' | 'tablet' | 'desktop'): Promise<void> {
    await TestHelpers.setViewport(this.page, device);
  }

  /**
   * 待機処理
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * アクセシビリティ属性確認
   */
  async verifyAriaLabel(locator: Locator, expectedLabel: string): Promise<void> {
    await expect(locator).toHaveAttribute('aria-label', expectedLabel);
  }

  /**
   * フォーカス確認
   */
  async verifyElementFocused(locator: Locator): Promise<void> {
    await expect(locator).toBeFocused();
  }

  /**
   * 無効状態確認
   */
  async verifyElementDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  /**
   * 有効状態確認
   */
  async verifyElementEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }
}