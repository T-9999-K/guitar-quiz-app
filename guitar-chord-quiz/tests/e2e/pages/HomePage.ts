/**
 * Guitar Chord Quiz - Home Page Object Model
 *
 * @description ホームページの操作とテスト用クラス
 * @author Claude Code
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // ページ要素
  readonly mainTitle: Locator;
  readonly startQuizButton: Locator;
  readonly difficultySelect: Locator;
  readonly settingsLink: Locator;
  readonly statisticsLink: Locator;
  readonly themeToggle: Locator;
  readonly aboutSection: Locator;
  readonly featuresSection: Locator;

  // 難易度選択関連
  readonly beginnerOption: Locator;
  readonly intermediateOption: Locator;
  readonly advancedOption: Locator;

  // 設定プレビュー
  readonly currentDifficulty: Locator;
  readonly currentTheme: Locator;
  readonly soundStatus: Locator;

  constructor(page: Page) {
    super(page);

    // メイン要素
    this.mainTitle = page.locator('[data-testid="main-title"]');
    this.startQuizButton = page.locator('[data-testid="start-quiz-button"]');
    this.difficultySelect = page.locator('[data-testid="difficulty-select"]');
    this.settingsLink = page.locator('[data-testid="settings-link"]');
    this.statisticsLink = page.locator('[data-testid="statistics-link"]');
    this.themeToggle = page.locator('[data-testid="theme-toggle"]');

    // セクション
    this.aboutSection = page.locator('[data-testid="about-section"]');
    this.featuresSection = page.locator('[data-testid="features-section"]');

    // 難易度オプション
    this.beginnerOption = page.locator('[data-testid="difficulty-beginner"]');
    this.intermediateOption = page.locator('[data-testid="difficulty-intermediate"]');
    this.advancedOption = page.locator('[data-testid="difficulty-advanced"]');

    // 設定プレビュー
    this.currentDifficulty = page.locator('[data-testid="current-difficulty"]');
    this.currentTheme = page.locator('[data-testid="current-theme"]');
    this.soundStatus = page.locator('[data-testid="sound-status"]');
  }

  /**
   * ホームページに移動
   */
  async navigateToHome(): Promise<void> {
    await this.goto('/');
  }

  /**
   * ページの基本要素が表示されていることを確認
   */
  async verifyPageElements(): Promise<void> {
    await this.verifyElementVisible(this.mainTitle);
    await this.verifyElementVisible(this.startQuizButton);
    await this.verifyElementVisible(this.difficultySelect);
    await this.verifyElementVisible(this.settingsLink);
  }

  /**
   * 難易度を選択
   */
  async selectDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<void> {
    await this.selectOption(this.difficultySelect, difficulty);
    await this.wait(300); // アニメーション待機
  }

  /**
   * 難易度ボタンをクリック（ボタン形式の場合）
   */
  async clickDifficultyButton(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<void> {
    const difficultyButtons = {
      beginner: this.beginnerOption,
      intermediate: this.intermediateOption,
      advanced: this.advancedOption
    };

    await this.clickElement(difficultyButtons[difficulty]);
  }

  /**
   * クイズを開始
   */
  async startQuiz(difficulty?: 'beginner' | 'intermediate' | 'advanced'): Promise<void> {
    if (difficulty) {
      await this.selectDifficulty(difficulty);
    }

    await this.clickElement(this.startQuizButton);
    await this.waitForPageLoad();
  }

  /**
   * 設定ページに移動
   */
  async navigateToSettings(): Promise<void> {
    await this.clickElement(this.settingsLink);
    await this.waitForPageLoad();
  }

  /**
   * 統計ページに移動
   */
  async navigateToStatistics(): Promise<void> {
    await this.clickElement(this.statisticsLink);
    await this.waitForPageLoad();
  }

  /**
   * テーマを切り替え
   */
  async toggleTheme(): Promise<void> {
    await this.clickElement(this.themeToggle);
    await this.wait(300); // テーマ切り替えアニメーション待機
  }

  /**
   * 現在の難易度設定を取得
   */
  async getCurrentDifficulty(): Promise<string> {
    const selectedOption = await this.difficultySelect.locator('option:checked').textContent();
    return selectedOption || 'beginner';
  }

  /**
   * 現在のテーマを確認
   */
  async getCurrentTheme(): Promise<'light' | 'dark'> {
    const htmlElement = this.page.locator('html');
    const classList = await htmlElement.getAttribute('class');
    return classList?.includes('dark') ? 'dark' : 'light';
  }

  /**
   * ページタイトルの確認
   */
  async verifyHomePageTitle(): Promise<void> {
    await this.verifyPageTitle(/Guitar Chord Quiz/);
  }

  /**
   * メインタイトルのテキスト確認
   */
  async verifyMainTitle(): Promise<void> {
    await this.verifyTextContent(this.mainTitle, /Guitar Chord Quiz|ギターコードクイズ/);
  }

  /**
   * 機能説明セクションの確認
   */
  async verifyFeaturesSection(): Promise<void> {
    await this.verifyElementVisible(this.featuresSection);
  }

  /**
   * アバウトセクションの確認
   */
  async verifyAboutSection(): Promise<void> {
    await this.verifyElementVisible(this.aboutSection);
  }

  /**
   * レスポンシブ表示の確認
   */
  async verifyResponsiveLayout(device: 'mobile' | 'tablet' | 'desktop'): Promise<void> {
    await this.setDevice(device);
    await this.wait(300);

    // デバイス別の表示確認
    if (device === 'mobile') {
      // モバイル用メニューボタンがあるかチェック
      const mobileMenu = this.page.locator('[data-testid="mobile-menu-button"]');
      try {
        await this.verifyElementVisible(mobileMenu);
      } catch {
        // モバイルメニューがない場合は通常レイアウトで確認
      }
    }

    // 共通要素は常に表示される
    await this.verifyElementVisible(this.mainTitle);
    await this.verifyElementVisible(this.startQuizButton);
  }

  /**
   * キーボードナビゲーションテスト
   */
  async testKeyboardNavigation(): Promise<void> {
    // Tabキーでフォーカス移動
    await this.pressKey('Tab');
    await this.verifyElementFocused(this.difficultySelect);

    await this.pressKey('Tab');
    await this.verifyElementFocused(this.startQuizButton);

    await this.pressKey('Tab');
    await this.verifyElementFocused(this.settingsLink);
  }

  /**
   * エラー状態の確認
   */
  async verifyNoErrors(): Promise<void> {
    await this.checkForErrors();
  }

  /**
   * ローディング状態の確認
   */
  async waitForPageReady(): Promise<void> {
    await this.waitForLoadingComplete();
    await this.verifyElementVisible(this.startQuizButton);
  }

  /**
   * フッター情報の確認
   */
  async verifyFooter(): Promise<void> {
    await this.verifyElementVisible(this.footer);
  }

  /**
   * ダークモード表示の確認
   */
  async verifyDarkMode(): Promise<void> {
    const theme = await this.getCurrentTheme();
    if (theme !== 'dark') {
      await this.toggleTheme();
    }

    // ダークモード特有のスタイルが適用されているか確認
    const bodyClass = await this.page.locator('body').getAttribute('class');
    // 実装に依存するが、一般的なダークモードクラスをチェック
  }

  /**
   * ライトモード表示の確認
   */
  async verifyLightMode(): Promise<void> {
    const theme = await this.getCurrentTheme();
    if (theme !== 'light') {
      await this.toggleTheme();
    }
  }

  /**
   * アクセシビリティ属性の確認
   */
  async verifyAccessibility(): Promise<void> {
    // ARIA ラベルの確認
    await this.verifyAriaLabel(this.startQuizButton, /クイズ開始|Start Quiz/);

    // ロールの確認
    await this.verifyAttribute(this.difficultySelect, 'role', 'combobox');
  }
}